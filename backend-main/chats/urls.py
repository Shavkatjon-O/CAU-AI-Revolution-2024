# nutrition/urls.py
from django.urls import path

from .views import AIQuestionAPIView, NutritionAssistantAPIView

urlpatterns = [
    path(
        "nutrition-assistant/",
        NutritionAssistantAPIView.as_view(),
        name="nutrition_assistant",
    ),
]

urlpatterns += [
    path("ai-question/", AIQuestionAPIView.as_view(), name="ai_question"),
]
