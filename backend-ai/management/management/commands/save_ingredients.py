import pandas as pd
import openai
import json
from openai import OpenAI
from django.db import transaction
from fractions import Fraction

from django.conf import settings
from django.core.management.base import BaseCommand
from concurrent.futures import ThreadPoolExecutor, as_completed

from apps.meal.models import Ingredient, RecipeIngredient
from apps.meal.models import Recipe
from apps.users.models import User

import json
from concurrent.futures import ThreadPoolExecutor


class Command(BaseCommand):
    help = 'Fetch ingredients and ingredient information using OpenAI API and save them'

    def handle(self, *args, **kwargs):
        
        openai.api_key = settings.OPENAI_API_KEY
        
        processor = IngredientProcessor(openai)
        processed_ingredients = processor.process_all_ingredients()


class IngredientProcessor:
    def __init__(self, openai):
        self.openai = openai
    
    def convert_to_float(self, value):
        try:
            # Handle fraction strings like '1/2', '3/4', etc.
            if isinstance(value, str) and '/' in value:
                return float(Fraction(value))
            else:
                return float(value)  # Convert to float normally
        except (ValueError, ZeroDivisionError, TypeError) as e:
            print(f"Error converting '{value}' to float: {e}")
            return 0.0  # Or some default value if conversion fails

    def get_prompt(self, instruction):
        prompt = f"""
        Here is a list of cooking instructions containing embedded ingredients. Extract the distinct ingredients along with their units, quantities, and then provide the nutritional information (calories, carbs, proteins, and fats) for each extracted ingredient.

        **Instructions:** {instruction}

        **Output Format:** 
        {{
            "ingredients": [
                {{
                    "name": "<ingredient name>",
                    "quantity": "<amount>",
                    "unit": "<unit>",
                    "calories": "<calories>",
                    "carbs": "<carbs>",
                    "proteins": "<proteins>",
                    "fats": "<fats>"
                }},
                ...
            ]
        }}
        Your task is to fill in the `<placeholders>` with the appropriate numeric values(not with g, lb...) and return **only** the JSON object.
        """
        return prompt
    
    def process_ingredient(self, recipe):
        instruction = recipe.description
    
        prompt = self.get_prompt(instruction)
        
        try:
            response = self.openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )
            # Process the response text
            data = response.choices[0].message.content.strip().split('\n')
            cleaned_response = ''.join(data).replace('```json', '').replace('```', '').strip()
            parsed_json = json.loads(cleaned_response)
            # Update the recipe in the database
            self.create_ingredient_in_db(recipe, parsed_json)
            return parsed_json
        except Exception as e:
            print(f"Error processing ingredient : {e}")
            return None
    
    def create_ingredient_in_db(self, recipe, data):
        """
        Creates the Ingredient model with nutritional information in a transactional way.
        """
        
        try:
            with transaction.atomic():  # Ensures atomicity of the update operation
                for ingredient in data['ingredients']:
                    ingredient_name = ingredient['name']
                    quantity = ingredient['quantity']
                    unit = ingredient['unit']
                    calories = ingredient['calories']
                    carbs = float(ingredient['carbs'].replace('g', '').strip())
                    proteins = float(ingredient['proteins'].replace('g', '').strip())
                    fats = float(ingredient['fats'].replace('g', '').strip())
                    user = User.objects.get(id='fa5ebc8f-c3c5-4228-a20b-05ec79d8c968')
                    # Create or get the ingredient (to avoid duplicates)
                    ingredient, created = Ingredient.objects.get_or_create(
                        name=ingredient_name,
                        user=user,
                        defaults={
                            'unit': unit,
                            'calories': calories,
                            'carbs': carbs,
                            'proteins': proteins,
                            'fats': fats,
                        }
                    )

                    quantity_in_float = self.convert_to_float(quantity)
                    print(quantity_in_float)
                    # Create the RecipeIngredient instance
                    recipe_ingredient = RecipeIngredient(
                        recipe=recipe,
                        ingredient=ingredient,
                        quantity=quantity_in_float  # assuming the unit is in the ingredient data
                    )
                    recipe_ingredient.save()
                print(f"Successfully updated recipe '{recipe.name}' with ingredients.")

        except Exception as e:
            print(f"Error updating recipe '{recipe.name}' in the database: {e}")


    def process_all_ingredients(self):
        recipes = Recipe.objects.all()
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(self.process_ingredient, recipes))
        
        # result = self.process_ingredient(instruction=instruction)

        i = 1
        for result in results:
            print(f"{i} --- {result}")
            i+=1