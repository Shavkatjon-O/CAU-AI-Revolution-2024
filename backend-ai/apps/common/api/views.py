import random

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.permissions import AllowAny

from apps.users.models import User
from apps.meal.models import Recipe
from apps.ingredients.models import Ingredient

from apps.common.utils import success_response, error_response

from .serializers import (
    RecipesIngredientsListSerializer,
)

class RecipesIngredientsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self, request):
        # Get all recipes and ingredients
        all_recipes = list(Recipe.objects.all())
        all_ingredients = list(Ingredient.objects.all())
        
         # Get the requested page number
        page_number = request.query_params.get('page', 1)

        # Paginate recipes
        recipes_paginator = Paginator(all_recipes, 50)
        recipes_page = recipes_paginator.get_page(page_number)

        # Paginate ingredients
        ingredients_paginator = Paginator(all_ingredients, 50)
        ingredients_page = ingredients_paginator.get_page(page_number)

        # Combine the paginated lists
        recipes = list(recipes_page)
        ingredients = list(ingredients_page)
        # Prepare the data dictionary
        data = {
            'recipes': recipes,
            'ingredients': ingredients,
            'recipes_page': recipes_page.number,
            'recipes_total_pages': recipes_paginator.num_pages,
            'recipes_total_items': recipes_paginator.count,
            'ingredients_page': ingredients_page.number,
            'ingredients_total_pages': ingredients_paginator.num_pages,
            'ingredients_total_items': ingredients_paginator.count,
        }


        return data


    def get(self, request, *args, **kwargs):
        data = self.get_queryset(request)
        serializer = RecipesIngredientsListSerializer(data)
        return success_response(
            data=serializer.data,
            message='List of Recipes and Ingredients',
        )