import itertools
import random

from datetime import date
from typing import Optional
from django.db.models import F, Sum

from apps.meal.models import Recipe
from apps.meal.models import Meal as Mealdb
from apps.users.models import User

class MealService:
    def __init__(self, goal: str, calorie: int):
        self.goal = goal
        self.calorie = calorie
        self._carb: Optional[int] = None # Can be None initially
        self._protein: Optional[int] = None # Can be None initially
        self._fat: Optional[int] = None # Can be None initially

    @property
    def carb(self) -> int:
        """Get the total carbs"""
        return self._carb
    
    @carb.setter
    def carb(self, value: int) -> None:
        """Set the total carbs"""
        self._carb = value

    @property
    def protein(self) -> int:
        """Get the total protein"""
        return self._protein
    
    @protein.setter
    def protein(self, value: int) -> None:
        """Set the total protein"""
        self._protein = value
    
    @property
    def fat(self)-> int:
        """Get the total fats"""
        return self._fat
    
    @fat.setter
    def fat(self, value: int) -> None:
        """Set the total fat"""
        self._fat = value
    

    # def set_total_carb(self, carb):
    #     self.carb = carb
    
    # def set_total_protein(self, protein):
    #     self.protein = protein
    
    # def set_total_fat(self, fat):
    #     self.fat = fat
    

    @property
    def meal_type_distribution(self) -> dict:
        if self.goal == 'weight_loss':
            data = {
                "breakfast": 0.3,
                "lunch": 0.4,
                "dinner": 0.3
            }
        elif self.goal == 'maintain':
            data = {
                "breakfast": 0.3,
                "lunch": 0.4,
                "dinner": 0.3
            }
        elif self.goal == 'muscle_gain':
            data = {
                "breakfast": 0.3,
                "lunch": 0.4,
                "dinner": 0.3
            }
        return data
    
    @property
    def breakfast_calorie_nutrition_distribution(self) -> dict:
        """Get breakfast calorie nutrition distribution"""
        data = self.meal_type_distribution
        brekfast_distribution = data['breakfast']
        data = {
            "calories": round(self.calorie * brekfast_distribution),
            "proteins": round(self.protein * brekfast_distribution),
            "carbs": round(self.carb * brekfast_distribution),
            "fats": round(self.fat * brekfast_distribution),
        }
        return data

    @property
    def lunch_calorie_nutrition_distribution(self) -> dict:
        """Get lunch calorie nutrition distribution"""
        data:dict = self.meal_type_distribution
        lunch_distribution = data['lunch']
        data = {
            "calories": round(self.calorie * lunch_distribution),
            "proteins": round(self.protein * lunch_distribution),
            "carbs": round(self.carb * lunch_distribution),
            "fats": round(self.fat * lunch_distribution),
        }
        return data
    
    @property
    def dinner_calorie_nutrition_distribution(self) -> dict:
        """Get dinner calorie nutrition distribution"""
        data:dict = self.meal_type_distribution
        dinner_distribution:float = data['dinner']
        data = {
            "calories": round(self.calorie * dinner_distribution),
            "proteins": round(self.protein * dinner_distribution),
            "carbs": round(self.carb * dinner_distribution),
            "fats": round(self.fat * dinner_distribution),
        }
        return data
    
    @classmethod
    def get_weekdays(self) -> list:
        return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    @classmethod
    def weekdays_calorie_distribution(self, user) -> dict:
        """Get weekdays calorie distribution"""
        user_calorie =user.calories
        weekly_calorie_needed = user_calorie * 7
        data = {
            "Monday": int(1.2 * user_calorie),
            "Tuesday": int(0.85 * user_calorie),
            "Wednesday": int(1 * user_calorie),
            "Thursday": int(1.1 * user_calorie),
            "Friday": int(0.9 * user_calorie),
            "Saturday": int(1 * user_calorie),
            "Sunday": int(0.95 * user_calorie),
            "Total": int(weekly_calorie_needed),
        }
        return data

    @classmethod
    def get_weekday_calorie(self, weekday, user):
        distribution = MealService.weekdays_calorie_distribution(user)
        return distribution[weekday]

    def generate_breakfast(self, breakfast_nutrition, user_diet_type, user_allergies):
        """
        Retrieves two pair meals for breakfast
        """
        recipes = Recipe.objects.filter(
            meal_categories__has_key='Breakfast',
            meal_categories__Breakfast=True,
        ).filter(
            calories__lte=breakfast_nutrition['calories'],
            proteins__lte=breakfast_nutrition['proteins'],
            carbs__lte=breakfast_nutrition['carbs'],
            fats__lte=breakfast_nutrition['fats']
        ).exclude(diet_type=user_diet_type)
        
        # Exclude recipes that contain any allergens from the user's allergies list
        for allergen in user_allergies.split(','):
            allergen = allergen.strip()  # remove any extra spaces around allergen
            recipes = recipes.exclude(allergies__icontains=allergen)

        # print(f'Breakfast Recipes Found: {recipes.count()}')

        # Step 2: Randomly sample 4 recipes from the filtered ones (or any number you'd like to reduce the load)
        random_recipes = random.sample(list(recipes), min(50, len(recipes)))

        valid_combinations = []
        # Try every pair of valid recipes
        for recipe1, recipe2 in itertools.combinations(random_recipes, 2):
            total_calories = recipe1.calories + recipe2.calories
            total_protein = recipe1.proteins + recipe2.proteins
            total_carb = recipe1.carbs + recipe2.carbs
            total_fat = recipe1.fats + recipe2.fats

            # Check if the sum is within the target range
            if (total_calories <= breakfast_nutrition['calories'] and
                total_protein <= breakfast_nutrition['proteins'] and
                total_carb <= breakfast_nutrition['carbs'] and
                total_fat <= breakfast_nutrition['fats']):
                
                valid_combinations.append((recipe1, recipe2))

        # print(f'Valid combinations count: {len(valid_combinations)}')
        # Step 5: Select a random pair from valid combinations
        if valid_combinations:
            random_pair = random.choice(valid_combinations)
            # print(f"Random Valid Combination: {random_pair[0].name} + {random_pair[1].name}")
        else:
            print("No valid combinations found.")
        return random_pair

    def generate_lunch(self, lunch_nutrition, user_diet_type, user_allergies):
        """
        Retrieves two pair meals for lunch
        """
        recipes = Recipe.objects.filter(
            meal_categories__has_key='Lunch',
            meal_categories__Lunch=True,
        ).filter(
            calories__lte=lunch_nutrition['calories'],
            proteins__lte=lunch_nutrition['proteins'],
            carbs__lte=lunch_nutrition['carbs'],
            fats__lte=lunch_nutrition['fats']
        ).exclude(diet_type=user_diet_type)
        
        # Exclude recipes that contain any allergens from the user's allergies list
        for allergen in user_allergies.split(','):
            allergen = allergen.strip()  # remove any extra spaces around allergen
            recipes = recipes.exclude(allergies__icontains=allergen)

        
        # print(f'Lunch Recipes Found: {recipes.count()}')

        # Step 2: Randomly sample 4 recipes from the filtered ones (or any number you'd like to reduce the load)
        random_recipes = random.sample(list(recipes), min(50, len(recipes)))

        valid_combinations = []
        # Try every pair of valid recipes
        for recipe1, recipe2 in itertools.combinations(random_recipes, 2):
            total_calories = recipe1.calories + recipe2.calories
            total_protein = recipe1.proteins + recipe2.proteins
            total_carb = recipe1.carbs + recipe2.carbs
            total_fat = recipe1.fats + recipe2.fats

            # Check if the sum is within the target range
            if (total_calories <= lunch_nutrition['calories'] and
                total_protein <= lunch_nutrition['proteins'] and
                total_carb <= lunch_nutrition['carbs'] and
                total_fat <= lunch_nutrition['fats']):
                
                valid_combinations.append((recipe1, recipe2))

        # print(f'Valid combinations count: {len(valid_combinations)}')
        # Step 5: Select a random pair from valid combinations
        if valid_combinations:
            random_pair = random.choice(valid_combinations)
            # print(f"Random Valid Combination: {random_pair[0].name} + {random_pair[1].name}")
        else:
            print("No valid combinations found.")
        return random_pair


    def generate_dinner(self, dinner_nutrition, user_diet_type, user_allergies):
        """
        Retrieves two pair meals for dinner
        """
        recipes = Recipe.objects.filter(
            meal_categories__Dinner=True,
        ).filter(
            calories__lte=dinner_nutrition['calories'],
            proteins__lte=dinner_nutrition['proteins'],
            carbs__lte=dinner_nutrition['carbs'],
            fats__lte=dinner_nutrition['fats']
        ).exclude(diet_type=user_diet_type)

        # Exclude recipes that contain any allergens from the user's allergies list
        for allergen in user_allergies.split(','):
            allergen = allergen.strip()  # remove any extra spaces around allergen
            recipes = recipes.exclude(allergies__icontains=allergen)


        # print(f'Dinner Recipes Found: {recipes.count()}')

        # Step 2: Randomly sample 4 recipes from the filtered ones (or any number you'd like to reduce the load)
        random_recipes = random.sample(list(recipes), min(50, len(recipes)))

        valid_combinations = []
        # Try every pair of valid recipes
        for recipe1, recipe2 in itertools.combinations(random_recipes, 2):
            total_calories = recipe1.calories + recipe2.calories
            total_protein = recipe1.proteins + recipe2.proteins
            total_carb = recipe1.carbs + recipe2.carbs
            total_fat = recipe1.fats + recipe2.fats

            # Check if the sum is within the target range
            if (total_calories <= dinner_nutrition['calories'] and
                total_protein <= dinner_nutrition['proteins'] and
                total_carb <= dinner_nutrition['carbs'] and
                total_fat <= dinner_nutrition['fats']):
                
                valid_combinations.append((recipe1, recipe2))

        # print(f'Valid combinations count: {len(valid_combinations)}')
        # Step 5: Select a random pair from valid combinations
        if valid_combinations:
            random_pair = random.choice(valid_combinations)
            # print(f"Random Valid Combination: {random_pair[0].name} + {random_pair[1].name}")
        else:
            print("No valid combinations found.")
        return random_pair


    def select_days_to_generate(self, current_day, days):
        pass

    def plan_week(self, meals, user, current_weekday) -> dict:
        weekdays = self.get_weekdays
        


    def plan(self, meals, user) -> dict:
        user_diet_type = user.diet_types
        user_allergies = user.allergies

        breakfast_distribution = self.breakfast_calorie_nutrition_distribution
        lunch_distribution = self.lunch_calorie_nutrition_distribution
        dinner_distribution = self.dinner_calorie_nutrition_distribution
        
        breakfast_pair = self.generate_breakfast(breakfast_distribution, user_diet_type, user_allergies)
        lunch_pair = self.generate_lunch(lunch_distribution, user_diet_type, user_allergies)
        dinner_pair = self.generate_dinner(dinner_distribution, user_diet_type, user_allergies)

        ready_data = {
            'breakfast': breakfast_pair,
            'lunch': lunch_pair,
            'dinner': dinner_pair,
        }

        for meal in meals:
            meal_pair = ready_data[meal.meal_time]
            meal.recipes.clear()
            meal.recipes.add(*meal_pair)
        
        return meals
        # for i, meal_type in enumerate(['breakfast', 'lunch', 'dinner']):
        #     meal_pair = ready_data[i][meal_type]  # Get the meal pair for the current meal type
        #     meal, created = Mealdb.objects.get_or_create(
        #         user=self.user,
        #         date=date.today(),
        #         meal_time=meal_type,  # "Breakfast", "Lunch", "Dinner"
        #     )
        #     # Add recipes to the meal (ManyToManyField)
        #     meal.recipes.add(*meal_pair)  # Add the list of recipes to the ManyToManyField

        

