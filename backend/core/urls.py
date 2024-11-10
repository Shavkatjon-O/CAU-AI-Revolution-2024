from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from .schema import swagger_urlpatterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path('rosetta/', include('rosetta.urls')),
]

urlpatterns += [
    path("api/users/", include('apps.users.urls')),
    path("api/ingredients/", include('apps.ingredients.urls')),
]

urlpatterns += swagger_urlpatterns

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

