from rest_framework import serializers
from rest_framework.exceptions import NotFound

from apps.users.models import User
from ..models import (
    Ingredient, 
    IngredientStock
)
from apps.meal.models import (
    RecipeIngredient
)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
    
    def validate_unit(self, value):
        pass


class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity']
    

class IngredientStockSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all(), source='ingredient')

    class Meta:
        model = IngredientStock
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity']

