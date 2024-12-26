import pandas as pd
import openai
import json
from openai import OpenAI
from django.db import transaction

from django.conf import settings
from django.core.management.base import BaseCommand
from concurrent.futures import ThreadPoolExecutor, as_completed

from apps.meal.models import Recipe
from apps.users.models import DietType

import json
from concurrent.futures import ThreadPoolExecutor


class Command(BaseCommand):
    help = 'Fetch meal nutrition information using OpenAI API and save them'

    def handle(self, *args, **kwargs):
        
        openai.api_key = settings.OPENAI_API_KEY
        
        processor = DietTypeProcessor(openai)
        processor.create_diet_types()
        proccessed_recipes = processor.process_all_recipes()


class DietTypeProcessor:
    diet_types = [
            {
                "name": "Anything",
                "excludes": "Nothing"
            },
            {
                "name": "Keto",
                "excludes": "Grains, Legumes, Starchy Vegetables"
            },
            {
                "name": "Vegetarian",
                "excludes": "Red Meat, Poultry, Fish, Shellfish"
            },
            {
                "name": "Vegan",
                "excludes": "Red Meat, Poultry, Fish, Shellfish, Dairy, Eggs, Mayo, Honey"
            },
            {
                "name": "Paleo",
                "excludes": "Grains, Legumes, Dairy, Processed Foods, Sugar"
            },
            {
                "name": "Mediterranean",
                "excludes": "Red Meat, Processed Foods, Added Sugar, Refined Grains, Trans Fats"
            }
        ]
    
    def __init__(self, openai):
        self.openai = openai

    def get_prompt(self, recipe_name, diet_types):
        prompt = f"""
        You are a highly specialized assistant that provides **only** raw JSON data.

        Task: Analyze the following meal recipe and determine which diet types it belongs to based on the provided diet type information.

        **Rules:**
        - Do not add explanations, comments, or any text outside the JSON structure.
        - Do not include Markdown or additional formatting.
        - Strictly adhere to the JSON format below.

        **Meal Name:** {recipe_name}
        **Diet Types:** {diet_types}

        **Output Format:** 
        {{
            "meal": {{
                "name": "<meal name>",
                "diet_types": [
                    "DietType1",
                    "DietType2",
                    ...
                ]
            }}
        }}

        Your task is to fill in the `<meal name>` with the appropriate meal name and replace `DietType1`, `DietType2`, etc., with the appropriate diet types the meal belongs to. Return **only** the JSON object.
        """
        return prompt
    
    def create_diet_types(self):
        
        for diet_type in DietTypeProcessor.diet_types:
            DietType.objects.create(name=diet_type['name'], exclusions=diet_type['excludes'])
        print("Successfully created DietType objects")

    def insert_recipe_diet_type_in_db(self, recipe, diet_type):
        diet_names = diet_type['meal']['diet_types']
        diet_types = []
        for diet in diet_names:
            diet_types.append(DietType.objects.get(name=diet))
        
        try:
            with transaction.atomic():  # Ensures atomicity of the update operation
                recipe.diet_type.add(*diet_types)
        except Exception as e:
            print(f"Error updating recipe '{recipe.name}' in the database: {e}")
        
    def process_recipe(self, recipe):
        recipe_name = recipe.name
        prompt = self.get_prompt(recipe_name, DietTypeProcessor.diet_types)
        
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
            print(parsed_json)
            # Update the recipe in the database
            self.insert_recipe_diet_type_in_db(recipe, parsed_json)

            return parsed_json
        except Exception as e:
            print(f"Error processing recipe '{recipe_name}': {e}")
            return None
    
    def process_all_recipes(self):
        recipes = Recipe.objects.all()
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(self.process_recipe, recipes))
        
        i = 1
        for result in results:
            print(f"{i} --- {result}")
            i+=1