import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.core.files import File
from apps.meal.models import Recipe
from apps.users.models import User
from concurrent.futures import ThreadPoolExecutor, as_completed

class Command(BaseCommand):
    help = 'Import meals data from a CSV file'

    # def add_arguments(self, parser):
    #     parser.add_argument('csv_file', type=str, help='The CSV file to load data from')

    def handle(self, *args, **kwargs):
        csv_data = pd.read_csv('food_data_images.csv', nrows=500)
        clean_csv_data = csv_data.drop(columns=["Ingredients"])
        meal_names_dict = clean_csv_data.set_index('Image_Name').T.to_dict()
        
        # List all image files in the folder
        images_folder = 'food_images/'
        image_files = os.listdir(images_folder)

        # Searching for images based on their names
        def match_image_file(image_file):
            for meal_name in meal_names_dict.keys():
                if meal_name in image_file:
                    return image_file, meal_name
            return None
        
        # Using ThreadPoolExecutor for concurrent execution
        matches = []
        with ThreadPoolExecutor() as executor:
            futures = {executor.submit(match_image_file, image_file): image_file for image_file in image_files}
            for future in as_completed(futures):
                result = future.result()
                if result:
                    matches.append(result)
        
        # Process and save the matched files to the database
        for image_file, meal_name in matches:
            # Get the row data from the dictionary
            row = meal_names_dict[meal_name]
            user = User.objects.get(id='fa5ebc8f-c3c5-4228-a20b-05ec79d8c968')  # Give Admin ID IMPORTANT
            
            # Create the Recipe instance
            recipe = Recipe(
                name=row['Title'],
                description=meal_name,
                instructions=row['Instructions'],
                ingredients_text=row['Cleaned_Ingredients'],
                user=user
            )
            recipe.save()
            
            # Add the image to the Recipe instance
            image_path = os.path.join(images_folder, image_file)
            with open(image_path, 'rb') as image:
                recipe.image.save(image_file, File(image), save=True)
            
            print(f"Recipe '{recipe.name}' created successfully with image '{image_file}'.")
        
