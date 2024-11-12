from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import UserProfileView, UserRegisterView, UserSignUpView, UserUpdateView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("register/", UserRegisterView.as_view(), name="register"),
    path("sign-up/", UserSignUpView.as_view(), name="signup"),
    path("update/", UserUpdateView.as_view(), name="update"),
]
