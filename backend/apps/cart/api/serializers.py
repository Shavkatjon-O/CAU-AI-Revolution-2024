from rest_framework import serializers
from rest_framework.exceptions import NotFound

from apps.users.models import User
from ..models import (
    ShoppingListItem
)
from apps.ingredients.api.serializers import IngredientSerializer

class ShoppingItemListSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = ShoppingListItem
        fields = '__all__'
