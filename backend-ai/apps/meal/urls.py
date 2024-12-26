from django.urls import path
from apps.ingredients.api.views import (
    RecipeIngredientListView,
)
from apps.meal.api.views import (
    MealListCreateView,
    MealDayGenerateView,
    MealWeekGenerateView,
    RecipeListView,
    RecipeDetailView,
    
)

urlpatterns = [
    path('', MealListCreateView.as_view(), name='meal-list-create'),
    path('plan/', MealDayGenerateView.as_view(), name='meal-plan'),
    path('meal-plan/new/day/', MealDayGenerateView.as_view(), name='meal-plan-day'),
    path('meal-plan/new/week/', MealWeekGenerateView.as_view(), name='meal-plan-week'),

    path('recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('recipes/<uuid:id>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipes/<uuid:recipe_id>/ingredients/', RecipeIngredientListView.as_view(), name='recipe-ingredients'),

]

