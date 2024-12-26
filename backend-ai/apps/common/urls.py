from django.urls import path
from apps.common.api.views import (
    RecipesIngredientsListView,
)

urlpatterns = [
    path('recipes_ingredients/', RecipesIngredientsListView.as_view(), name='recipes-ingredients-list'),
]

