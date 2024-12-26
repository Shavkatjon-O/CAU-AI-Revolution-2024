import pandas as pd
import openai
import json
from openai import OpenAI
from django.db import transaction

from django.conf import settings
from django.core.management.base import BaseCommand
from concurrent.futures import ThreadPoolExecutor, as_completed

from apps.meal.models import Recipe

import json
from concurrent.futures import ThreadPoolExecutor


class Command(BaseCommand):
    help = 'Fetch meal nutrition information using OpenAI API and save them'

    def handle(self, *args, **kwargs):
        
        openai.api_key = settings.OPENAI_API_KEY
        
        processor = RecipeProcessor(openai)
        proccessed_recipes = processor.process_all_recipes()


class RecipeProcessor:
    def __init__(self, client):
        self.client = client

    def get_prompt(self, recipe_name):
        prompt = f"""
        You are a highly specialized assistant that provides **only** raw JSON data.

        Task: Analyze the following meal recipe and return the nutritional information for the meal along with its meal categories.

        **Rules:**
        - Do not add explanations, comments, or any text outside the JSON structure.
        - Do not include Markdown or additional formatting.
        - Strictly adhere to the JSON format below.

        **Meal Name:** {recipe_name}

        **Output Format:** 
        {{
            "meal": {{
                "name": "<meal name>",
                "calories": <total_calories>,
                "carbs": <total_carbs>,
                "proteins": <total_proteins>,
                "fats": <total_fats>,
                "meal_categories": {{
                    "Breakfast": <true/false>,
                    "Lunch": <true/false>,
                    "Dinner": <true/false>
                }}
            }}
        }}

        Your task is to fill in the `<placeholders>` with the appropriate values and return **only** the JSON object.
        """
        return prompt

    def process_recipe(self, recipe):
        recipe_name = recipe.name
        prompt = self.get_prompt(recipe_name)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt}
                ],
            )
            # Process the response text
            data = response.choices[0].message.content.strip().split('\n')
            cleaned_response = ''.join(data).replace('```json', '').replace('```', '').strip()
            parsed_json = json.loads(cleaned_response)
            print(parsed_json)
            # Update the recipe in the database
            self.update_recipe_in_db(recipe, parsed_json)

            return parsed_json
        except Exception as e:
            print(f"Error processing recipe '{recipe_name}': {e}")
            return None

    def update_recipe_in_db(self, recipe, nutrition_data):
        """
        Updates the Recipe model with nutritional information in a transactional way.
        """
        try:
            with transaction.atomic():  # Ensures atomicity of the update operation
                recipe.calories = float(nutrition_data['meal']['calories'])
                recipe.proteins = float(nutrition_data['meal']['proteins'])
                recipe.carbs = float(nutrition_data['meal']['carbs'])
                recipe.fats = float(nutrition_data['meal']['fats'])
                recipe.meal_categories = nutrition_data['meal']['meal_categories']
                recipe.save()
        except Exception as e:
            print(f"Error updating recipe '{recipe.name}' in the database: {e}")

    def process_all_recipes(self):
        recipes = Recipe.objects.all()
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(self.process_recipe, recipes))
        
        i = 1
        for result in results:
            print(f"{i} --- {result}")
            i+=1
