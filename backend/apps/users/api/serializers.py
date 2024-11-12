import datetime
from datetime import date

import jwt
from apps.common.redis_client import (
    delete_otp,
    delete_verify,
    get_otp,
    get_verify,
    set_otp,
    set_verify,
)
from django.conf import settings
from django.contrib.auth import authenticate
from django.core.cache import cache
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from ..models import BlacklistedToken, User
from .utils import (
    decrypt_access_token,
    decrypt_refresh_token,
    generate_jwt_token,
    generate_otp,
    is_otp_unique,
    send_otp_via_email,
)


class SendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):  # action forgot password
        action = self.context.get("action")
        if action == "register":
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already registered")
        elif action == "forgot_password":
            if not User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email not registered")
        return value

    def create(self, validated_data):
        email = validated_data.get("email", None)
        otp = generate_otp()

        while not is_otp_unique(email, otp):
            otp = generate_otp()

        set_otp(email, otp)
        send_otp_via_email(email, otp)
        return validated_data


class CheckVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    email_verify = serializers.BooleanField(
        read_only=True
    )  # Field to explicitly communicate the verification status

    def validate_otp(self, value):
        email = self.initial_data.get("email", None)
        cached_otp = get_otp(email)
        if not cached_otp:
            raise serializers.ValidationError("OTP expired or not found")
        if value != cached_otp:
            raise serializers.ValidationError("Invalid OTP")
        return value

    def create(self, validated_data):
        email = validated_data.get("email", None)
        self.email_verify = True
        delete_otp(email)
        set_verify(email, self.email_verify)
        return validated_data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def validate_password(self, password):
        if not password:
            raise serializers.ValidationError("Password is required")
        return password

    def validate(self, attrs):
        email = attrs.get("email", None)
        is_email_valid = get_verify(email)
        if is_email_valid is None:
            raise serializers.ValidationError("Email is not valid")
        delete_verify(email)
        return attrs

    def create(self, validated_data):
        email = validated_data.get("email", None)
        password = validated_data.get("password", None)
        first_name = validated_data.get("first_name", None)
        last_name = validated_data.get("last_name", None)
        dob = validated_data.get("date_of_birth", None)
        image = validated_data.get("image", None)

        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=dob,
            image=image,
        )

        user.set_password(password)
        user.save()

        payload = {
            "user_id": user.id,
            "iat": datetime.datetime.now(datetime.timezone.utc),
        }
        # Convert datetime to Unix timestamps
        payload["iat"] = int(payload["iat"].timestamp())
        access_token, refresh_token = generate_jwt_token(payload)
        return access_token, refresh_token


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        email = validated_data.get("email", None)
        user = User.objects.get(email=email)
        payload = {
            "user_id": user.id,
            "iat": datetime.datetime.now(datetime.timezone.utc),
        }
        # Convert datetime to Unix timestamps
        payload["iat"] = int(payload["iat"].timestamp())
        access_token, refresh_token = generate_jwt_token(payload)
        return access_token, refresh_token

    def validate(self, attrs):
        email = attrs.get("email", None)
        password = attrs.get("password", None)

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        return attrs


class LogoutSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    access_token = serializers.CharField(required=True)
    refresh_token = serializers.CharField(required=True)

    def validate_refresh_token(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token not found")
        return value

    def validate_access_token(self, value):
        if not value:
            raise serializers.ValidationError("Access token not found")
        return value

    def create(self, validated_data):
        access_token = validated_data.get("access_token")
        refresh_token = validated_data.get("refresh_token")
        user = validated_data.get("user")
        try:
            BlacklistedToken.blacklist_token(user, access_token, refresh_token)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        return validated_data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class RefreshTokenSerializer(serializers.Serializer):
    access_token = serializers.CharField(required=False)
    refresh_token = serializers.CharField(required=True)

    def validate_refresh_token(self, value):
        if BlacklistedToken.is_token_blacklisted(refresh=value, access=None):
            raise serializers.ValidationError("Refresh token has been blacklisted")
        try:
            payload = decrypt_refresh_token(value)
            user_id = payload["payload"]["user_id"]
            return user_id
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError("Refresh token has expired.")
        except jwt.InvalidTokenError:
            raise serializers.ValidationError("Invalid refresh token.")

    def create(self, validated_data):
        user_id = validated_data["refresh_token"]
        new_payload = {
            "user_id": user_id,
            "iat": datetime.datetime.now(datetime.timezone.utc),
        }
        # Convert datetime to Unix timestamps
        new_payload["iat"] = int(new_payload["iat"].timestamp())
        new_access_token, new_refresh_token = generate_jwt_token(new_payload)

        return new_access_token, new_refresh_token


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    password_verify = serializers.BooleanField(read_only=True)

    def validate_confirm_password(self, confirm_password):
        if not confirm_password:
            raise serializers.ValidationError("Confirm your new password")
        return confirm_password

    def validate_new_password(self, new_password):
        if not new_password:
            raise serializers.ValidationError("New Password is required")
        return new_password

    def validate(self, attrs):
        email = attrs.get("email", None)
        is_email_valid = get_verify(email)
        if is_email_valid is None:
            raise serializers.ValidationError("Email is not valid")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if new_password != confirm_password:
            self.password_verify = False
            raise serializers.ValidationError("Passwords do not match")

        self.password_verify = True
        return attrs

    def update(self, instance, validated_data):
        new_password = validated_data.get("new_password")
        print("entered")
        print(self.password_verify)
        if self.password_verify:
            instance.set_password(new_password)
            instance.save()
        return instance
