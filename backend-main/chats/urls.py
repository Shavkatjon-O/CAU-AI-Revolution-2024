# nutrition/urls.py
from django.urls import path
from .views import NutritionAssistantAPIView

urlpatterns = [
    path(
        "nutrition-assistant/",
        NutritionAssistantAPIView.as_view(),
        name="nutrition_assistant",
    ),
]
