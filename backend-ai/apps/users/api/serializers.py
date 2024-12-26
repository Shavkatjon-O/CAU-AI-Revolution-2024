import datetime
import jwt
from datetime import date

from rest_framework import serializers
from rest_framework.exceptions import NotFound

from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import authenticate

from ..models import User, BlacklistedToken, DietType
from ..services.calorie_calculator_service import CalorieCalculatorService
from .utils import generate_otp, is_otp_unique, send_otp_via_email, decrypt_access_token, decrypt_refresh_token, generate_jwt_token
from apps.common.redis_client import (
    set_otp, 
    get_otp, 
    delete_otp,
    set_verify, 
    get_verify,
    delete_verify,
)

class SendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value): # action forgot password
        action = self.context.get('action')
        if action == 'register':
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already registered")
        elif action == 'forgot_password':
            if not User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email not registered")
        return value
    
    def create(self, validated_data):
        email = validated_data.get('email', None)
        otp = generate_otp()

        while not is_otp_unique(email, otp):
            otp = generate_otp()
        
        set_otp(email, otp)
        send_otp_via_email(email, otp)
        return validated_data


class CheckVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    email_verify = serializers.BooleanField(read_only=True)  # Field to explicitly communicate the verification status
    
    def validate_otp(self, value):
        email = self.initial_data.get('email', None)
        cached_otp = get_otp(email)
        if not cached_otp:
            raise serializers.ValidationError('OTP expired or not found')
        if value != cached_otp:
            raise serializers.ValidationError('Invalid OTP')
        return value
    
    def create(self, validated_data):
        email =  validated_data.get('email', None)
        self.email_verify = True
        delete_otp(email)
        set_verify(email, self.email_verify)
        return validated_data


class CalorieCalculatorSerializer(serializers.ModelSerializer):
    height = serializers.DecimalField(max_digits=5, decimal_places=2, coerce_to_string=False)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = User
        fields = (
            "age", 
            "gender",
            "height",
            "weight",
            "activity_level",
            "goal",
        )

    def create(self, validated_data):
        age = validated_data.get("age", None)
        gender = validated_data.get("gender", None)
        height = validated_data.get("height", None)
        weight = validated_data.get("weight", None)
        activity_level = validated_data.get("activity_level", None)
        goal = validated_data.get("goal", None)
        calculator = CalorieCalculatorService(
            height, 
            weight, 
            age, 
            activity_level, 
            gender, 
            goal
        )
        data = calculator.calculate()
        return data


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    diet_types = serializers.PrimaryKeyRelatedField(queryset=DietType.objects.all())
    height = serializers.DecimalField(max_digits=5, decimal_places=2, coerce_to_string=False)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, coerce_to_string=False)


    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
            "age",
            "gender",
            "height",
            "weight",
            "activity_level",
            "goal",
            "diet_types",
            "allergies",
            "calories",
            "carbs",
            "proteins",
            "fats",
        )

    def validate_password(self, password):
        if not password:
            raise serializers.ValidationError('Password is required')
        return password
    
    def validate(self, attrs):
        email = attrs.get('email', None)
        is_email_valid = get_verify(email)
        if is_email_valid is None:
            raise serializers.ValidationError('Email is not valid')
        delete_verify(email)
        return attrs
    
    def create(self, validated_data):
        password = validated_data.get('password', None)
        
        user = User(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            age=validated_data["age"],
            gender=validated_data["gender"],
            height=validated_data["height"],
            weight=validated_data["weight"],
            activity_level=validated_data["activity_level"],
            goal=validated_data["goal"],
            diet_types=validated_data["diet_types"],
            allergies=validated_data["allergies"],
            calories=validated_data["calories"],
            proteins=validated_data["proteins"],
            carbs=validated_data["carbs"],
            fats=validated_data["fats"],
        )

        user.set_password(password)
        user.save()
        
        payload = {
            'user_id': user.id,
            'iat': datetime.datetime.now(datetime.timezone.utc)
        }
        # Convert datetime to Unix timestamps
        payload['iat'] = int(payload['iat'].timestamp())
        access, refresh = generate_jwt_token(payload)
        return access, refresh


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', None)
        password = attrs.get('password', None)
        user = authenticate(username=email, password=password)
        print(user)
        if user is None:
            raise serializers.ValidationError('Invalid email or password.')

        return attrs
    
    def create(self, validated_data):
        email = validated_data.get('email', None)
        user = User.objects.get(email=email)
        payload = {
            'user_id': user.id,
            'iat': datetime.datetime.now(datetime.timezone.utc)
        }
        # Convert datetime to Unix timestamps
        payload['iat'] = int(payload['iat'].timestamp())
        access, refresh = generate_jwt_token(payload)
        return access, refresh
    

class LogoutSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    access = serializers.CharField(required=True)
    refresh = serializers.CharField(required=True)

    def validate_refresh(self, value):
        if not value:
            raise serializers.ValidationError('Refresh token not found')
        return value

    def validate_access(self, value):
        if not value:
            raise serializers.ValidationError('Access token not found')
        return value

    def create(self, validated_data):
        access = validated_data.get('access')
        refresh = validated_data.get('refresh')
        user = validated_data.get('user')
        try:
            BlacklistedToken.blacklist_token(user, access, refresh)
        except Exception as e:
            raise serializers.ValidationError({'error': str(e)})
        return validated_data
    

class UserProfileSerializer(serializers.ModelSerializer):
    diet_types = serializers.PrimaryKeyRelatedField(queryset=DietType.objects.all())

    class Meta:
        model = User
        fields = '__all__'


class RefreshTokenSerializer(serializers.Serializer):
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(required=True)

    def validate_refresh(self, value):
        if BlacklistedToken.is_token_blacklisted(refresh=value, access=None):
            raise serializers.ValidationError('Refresh token has been blacklisted')
        try:
            payload = decrypt_refresh_token(value)
            user_id = payload['payload']['user_id']
            return user_id
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError('Refresh token has expired.')
        except jwt.InvalidTokenError:
            raise serializers.ValidationError('Invalid refresh token.')

    def create(self, validated_data):
        user_id = validated_data['refresh']
        new_payload = {
            'user_id': user_id,
            'iat': datetime.datetime.now(datetime.timezone.utc)
        }
         # Convert datetime to Unix timestamps
        new_payload['iat'] = int(new_payload['iat'].timestamp())
        new_access, new_refresh = generate_jwt_token(new_payload)

        return new_access, new_refresh

    
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    password_verify = serializers.BooleanField(read_only=True)

    def validate_confirm_password(self, confirm_password):
        if not confirm_password:
            raise serializers.ValidationError('Confirm your new password')
        return confirm_password

    def validate_new_password(self, new_password):
        if not new_password:
            raise serializers.ValidationError('New Password is required')
        return new_password

    def validate(self, attrs):
        email = attrs.get('email', None)
        is_email_valid = get_verify(email)
        if is_email_valid is None:
            raise serializers.ValidationError('Email is not valid')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            self.password_verify = False
            raise serializers.ValidationError('Passwords do not match')

        self.password_verify = True
        return attrs
    
    def update(self, instance, validated_data):
        new_password = validated_data.get('new_password')
        print('entered')
        print(self.password_verify)
        if self.password_verify:
            instance.set_password(new_password)
            instance.save()
        return instance
    

class DietTypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietType
        fields = '__all__'