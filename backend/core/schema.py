from django.urls import re_path, path
from drf_spectacular import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import permissions

from drf_spectacular.generators import BaseSchemaGenerator
from drf_spectacular.contrib.rest_framework_simplejwt import SimpleJWTScheme
from core.authentication import CustomJWTAuthentication


swagger_urlpatterns = [
    # YOUR PATTERNS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    re_path(r'^swagger/$', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


class CustomJWTAuthenticationExtension(SimpleJWTScheme):
    target_class = CustomJWTAuthentication
    name = 'CustomJWT'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'schema': 'bearer',
            'bearerFormat': 'JWT',
        }
    

class BothHttpAndHttpsSchemaGenerator(BaseSchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.schemes = ["http", "https"]
        return schema
