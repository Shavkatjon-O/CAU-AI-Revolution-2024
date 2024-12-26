from datetime import date

from django.shortcuts import get_object_or_404

from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.permissions import AllowAny

from apps.users.models import User
from ..models import (
    Recipe, 
    RecipeIngredient,
    Meal
)

from ..services.meal_service import MealService
from apps.users.services.calorie_calculator_service import CalorieCalculatorService


from apps.common.utils import success_response, error_response
from .serializers import (
    MealSerializer, 
    MealGenerateSerializer,
    RecipeListSerializer,
    WeekMealPlanSerializer
)

class MealListCreateView(generics.ListCreateAPIView):
    """
    Meal types -> Breakfast, Dinner, Lunch
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealSerializer

    def get_queryset(self):
        return Meal.objects.all()
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)   
        serializer.save()
        return success_response(
            data=serializer.data,
            message='Successfully created Meal'
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Meals'
        )


class MealWeekGenerateView(generics.RetrieveAPIView):
    """
    Generate meal for a week
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WeekMealPlanSerializer

    def get_queryset(self):
        user = self.request.user
        today = date.today()
        meal_times = ['breakfast', 'lunch', 'dinner']
        meals = Meal.objects.filter(user=user, date=today)
        
        if not meals.exists():
            result = []
            for meal_time in meal_times:
                meal = Meal.objects.create(
                    user=user,
                    date=today,
                    meal_time=meal_time
                )
                result.append(meal)
            return result
        return meals
    
    def create_meal_object(self, user, calories, proteins, carb, fat):
        """Create and Get meal object"""
        meal = MealService(user.goal, calories)
        meal.protein = proteins
        meal.carb = carb
        meal.fat = fat
        return meal
    
    def create_meal_plan(self, user, meals, weekday):
        current_weekday = weekday
        weekdays = MealService.get_weekdays()
        # GETTING CURRENT DAY NUMBER
        current_day_number = 0
        for j in range(0, len(weekdays)):
            if weekdays[j] == current_weekday:
                current_day_number = j
                break
        # GENERATING WEEKLY MEAL PLAN
        weekly_meal_plan = {}
        for i in range(current_day_number, len(weekdays)):
            w_day = weekdays[i]
            calorie_needed = MealService.get_weekday_calorie(w_day, user) # DAILY CALORIE 
            calculator = CalorieCalculatorService(user.height, user.weight, user.age, user.activity_level, user.gender, user.goal)
            macros = calculator.calculate_macros(calorie_needed) # NUTRITIONS CALCULATED
            meal = self.create_meal_object(user, calorie_needed, macros['protein'], macros['carb'], macros['fat']) # MEAL OBJECT IS CREATED
            meal_plan = meal.plan(meals, user) # MEAL PLAN IS GENERATED
            weekly_meal_plan[w_day] = [calorie_needed, macros, meal_plan]
        return weekly_meal_plan
    
    def retrieve(self, request, *args, **kwargs):
        user = self.request.user
        current_weekday = date.today().strftime('%A')
        meals = self.get_queryset()
        weekly_meal_plan = self.create_meal_plan(user, meals, current_weekday)
        
        serializer = self.get_serializer(instance=weekly_meal_plan)
        # serializer.is_valid(raise_exception=True)
        return success_response(
            data=serializer.data,
            message='Meal Plan Generated successfully'
        )

class MealDayGenerateView(generics.RetrieveAPIView):
    """
    Generate meal
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealGenerateSerializer

    def get_queryset(self):
        user = self.request.user
        today = date.today()
        meal_times = ['breakfast', 'lunch', 'dinner']
        meals = Meal.objects.filter(user=user, date=today)
        
        if not meals.exists():
            result = []
            for meal_time in meal_times:
                meal = Meal.objects.create(
                    user=user,
                    date=today,
                    meal_time=meal_time
                )
                result.append(meal)
            return result
        return meals

    def create_meal_object(self, user, calories, proteins, carb, fat):
        """Create and Get meal object"""
        meal = MealService(user.goal, calories)
        meal.protein = proteins
        meal.carb = carb
        meal.fat = fat
        return meal

    def create_meal_plan(self, user, meals):       
        meal_obj = self.create_meal_object(user, user.calories, user.proteins, user.carbs, user.fats)
        meal_plan = meal_obj.plan(meals, user)
        return meal_plan          
        

    def retrieve(self, request, *args, **kwargs):
        user = self.request.user
        meals = self.get_queryset()
        meal_plan = self.create_meal_plan(user, meals)
    
        serializer = self.get_serializer(meal_plan, many=True, context={'user': user})
    
        return success_response(
            data=serializer.data,
            message='Meal Plan Generated successfully'
        )
        


class RecipeListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RecipeListSerializer

    def get_queryset(self):
        return  Recipe.objects.all()[:50]
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Recipes'
        )


class RecipeDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeListSerializer

    def get_object(self):
        recipe_uuid = self.kwargs.get("id")
        return get_object_or_404(Recipe, id=recipe_uuid)

    def retrieve(self, request, *args, **kwargs):
        car = self.get_object()
        serializer = self.get_serializer(car)
        return success_response(
            data=serializer.data,
            message='Recipe Details',
        )



            

