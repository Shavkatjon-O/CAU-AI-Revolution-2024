from apps.users.api.views import (
    CheckVerification,
    LoginView,
    LogoutView,
    PasswordResetView,
    RefreshTokenView,
    RegistrationView,
    SendVerification,
    UserProfileUpdateView,
    UserProfileView,
)
from django.urls import path

urlpatterns = [
    path("send_verification/", SendVerification.as_view(), name="send_verification"),
    path("check_verification/", CheckVerification.as_view(), name="check_verification"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("password-reset/", PasswordResetView.as_view(), name="password-reset"),
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view()),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("profile/", UserProfileUpdateView.as_view(), name="user_profile_update"),
]
