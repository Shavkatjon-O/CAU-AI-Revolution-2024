import datetime
from datetime import date
from django.db.models import QuerySet
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from ..models import Recipe, Meal
from apps.users.models import User

from ..services.meal_service import MealService

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'


class MealGenerateSerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True)
    
    call_count = 0

    class Meta:
        model = Meal
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        result = {
            representation['meal_time']: representation
        }
        return result
    

class WeekMealPlanSerializer(serializers.Serializer):
    # meal_plan = serializers.DictField()  # Serialize the dictionary with days as keys

    def to_representation(self, instance):
        serialized_plan = {}
        
        for day, day_data in instance.items():
            # Unpack the data: calories, macros, and meals
            calories_needed = day_data[0]  # First element: calories
            macros_needed = day_data[1]   # Second element: macronutrient breakdown
            meals = day_data[2]           # Third element: QuerySet of Meal objects
            
            # Validate meals data type
            if not isinstance(meals, (list, QuerySet)):
                raise ValueError(f"Invalid meals data for day {day}. Expected a list or QuerySet.")

            # Serialize meals using MealGenerateSerializer
            serialized_meals = MealGenerateSerializer(meals, many=True).data

            # Add all components to the serialized response
            serialized_plan[day] = {
                "calories_needed": calories_needed,
                "macros_needed": macros_needed,
                "meals": serialized_meals,
            }
        
        return serialized_plan


class RecipeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'
