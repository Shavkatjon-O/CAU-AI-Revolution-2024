from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserProfileSerializer, UserRegisterSerializer


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


from .serializers import UserSignUpSerializer, UserUpdateSerializer


class UserSignUpView(generics.CreateAPIView):
    serializer_class = UserSignUpSerializer


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user


__all__ = (
    "UserProfileView",
    "UserRegisterView",
    "UserSignUpView",
)
