from rest_framework import serializers
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

    def create(self, validated_data):
        profile_data = {
            'age': validated_data.pop('age'),
            'gender': validated_data.pop('gender'),
            'height': validated_data.pop('height'),
            'weight': validated_data.pop('weight'),
            'activity_level': validated_data.pop('activity_level'),
            'goal': validated_data.pop('goal'),
            'dietary_preferences': validated_data.pop('dietary_preferences'),
            'allergies': validated_data.pop('allergies'),
        }
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        User.objects.create(user=user, **profile_data)
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