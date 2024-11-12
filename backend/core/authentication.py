import jwt

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from apps.users.models import User, BlacklistedToken
from apps.users.api.utils import decrypt_access_token


class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        try:
            encrypted_jwt_token = CustomJWTAuthentication.get_the_token_from_header(
                auth_header
            )
            if BlacklistedToken.is_token_blacklisted(
                access=encrypted_jwt_token, refresh=None
            ):
                raise AuthenticationFailed("Token is blacklisted")
            payload = decrypt_access_token(encrypted_jwt_token)["payload"]

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            raise AuthenticationFailed("Token is invalid or expired")

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, payload)

    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace("Bearer", "").replace(" ", "")  # clean the token
        return token
