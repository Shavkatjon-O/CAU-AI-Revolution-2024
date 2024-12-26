from django.urls import re_path, path
from drf_spectacular import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import permissions

from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.generators import BaseSchemaGenerator
from core.authentication import CustomJWTAuthentication


swagger_urlpatterns = [
    # YOUR PATTERNS
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('swagger/', SpectacularSwaggerView.as_view(
        url_name='schema',
        # authentication_classes=[BasicAuthentication],  # Basic Auth required for Swagger UI
        # permission_classes=[permissions.IsAdminUser],
        ), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]


class CustomJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = CustomJWTAuthentication
    name = 'CustomJWT'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'header',
            'name': 'JWT Authorization',
            'description': 'Enter your bearer token in the format: `Bearer <token>`',
        }
    

class BothHttpAndHttpsSchemaGenerator(BaseSchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.schemes = ["http", "https"]
        return schema
