from django.shortcuts import get_object_or_404

from rest_framework import generics, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.exceptions import MethodNotAllowed

from .serializers import (
    CalorieCalculatorSerializer,
    UserRegisterSerializer, 
    UserProfileSerializer, 
    LoginSerializer,
    SendVerificationSerializer, 
    CheckVerificationSerializer, 
    RefreshTokenSerializer,
    PasswordResetSerializer,
    LogoutSerializer,
    DietTypeListSerializer
)

from ..models import User, BlacklistedToken, DietType
from apps.common.utils import success_response, error_response

class SendVerification(generics.CreateAPIView):
    serializer_class = SendVerificationSerializer

    def create(self, request):
        context = {
            'action': request.data.get('action', None)
        }
        serializer = self.serializer_class(data=request.data, context=context) # context
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(message='OTP sent to your email.')
        

class CheckVerification(generics.CreateAPIView):
    serializer_class = CheckVerificationSerializer
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(message='OTP verified successfully, email verified.')


class CalorieCalculatorView(generics.CreateAPIView):
    serializer_class = CalorieCalculatorSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        data = {
            'data': data
        }
        return success_response(data=data, message='Calory calculated successfully.')
    

class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        access, refresh = serializer.save()
        data = {
            'access': access,
            'refresh': refresh,
        }
        return success_response(
            data=data,
            message='User registration successful.' 
        )


class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return self.request.user

    def retrieve(self, request):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return success_response(
            data=serializer.data,
            message='User profile'
        )
    
    
class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(
            data=serializer.data,
            message="User profile updated"
        )


class LogoutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer
    
    def create(self, request):
        access = request.META.get('HTTP_AUTHORIZATION', None).split(' ')[1]
        refresh = self.request.data.get('refresh_token', None)
        user = str(self.request.user.id)
        serializer = self.get_serializer(data={
            'user': user, 
            'access': access, 
            'refresh': refresh
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(message='Logged out successfully')

class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access, refresh = serializer.save()
        data = {
            'access': access,
            'refresh': refresh,
        }
        return success_response(
            data=data,
            message='Login successful.'
        )
        
        
class RefreshTokenView(generics.CreateAPIView):
    serializer_class = RefreshTokenSerializer

    def create(self, request):
        refresh_token = self.request.data.get('refresh', None)
        if refresh_token is None:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)
        new_access, new_refresh = serializer.save()
        data = {
            'access': new_access,
            'refresh': new_refresh,
        }
        return success_response(
            data=data,
            message='Token refreshed successfully.'
        )


class PasswordResetView(generics.CreateAPIView):
    serializer_class = PasswordResetSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        email = self.request.data.get('email')
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return error_response(
                message='User with this email does not exist.',
                status=status.HTTP_404_NOT_FOUND,
            )
            
    def create(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(user, serializer.validated_data)
        return success_response(
            message="Password updated successfully."
        )
    

class DietTypeListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = DietTypeListSerializer

    def get_queryset(self):
        return DietType.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Diet Types'
        )
    