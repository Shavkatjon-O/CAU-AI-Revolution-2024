from rest_framework import serializers
from rest_framework.exceptions import NotFound

from apps.meal.models import Recipe
from apps.ingredients.models import Ingredient

from apps.meal.api.serializers import RecipeListSerializer
from apps.ingredients.api.serializers import IngredientSerializer

class RecipesIngredientsListSerializer(serializers.Serializer):
    recipes = RecipeListSerializer(many=True)
    ingredients = IngredientSerializer(many=True)
    recipes_page = serializers.IntegerField()
    recipes_total_pages = serializers.IntegerField()
    recipes_total_items = serializers.IntegerField()
    ingredients_page = serializers.IntegerField()
    ingredients_total_pages = serializers.IntegerField()
    ingredients_total_items = serializers.IntegerField()

