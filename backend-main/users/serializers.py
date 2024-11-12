from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            'email', 
            'password', 
            'first_name', 
            'last_name', 
            'age', 
            'gender', 
            'height', 
            'weight', 
            'activity_level', 
            'goal', 
            'dietary_preferences', 
            'allergies',
        )

    def validate_email(self, value):
        """Ensure that the email is unique."""
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Create the user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            age=validated_data['age'],
            gender=validated_data['gender'],
            height=validated_data['height'],
            weight=validated_data['weight'],
            activity_level=validated_data['activity_level'],
            goal=validated_data['goal'],
            dietary_preferences=validated_data['dietary_preferences'],
            allergies=validated_data['allergies'],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
        )


__all__ = (
    'UserRegisterSerializer',
    'UserProfileSerializer',
)