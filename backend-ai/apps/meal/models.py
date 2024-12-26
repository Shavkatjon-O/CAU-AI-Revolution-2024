import os
from django.db import models

from apps.common.models import BaseModel
from apps.users.models import User
from apps.ingredients.models import Ingredient
from apps.common.enums import MealTimeChoices
from apps.common.utils import process_image, process_logo

from apps.users.models import DietType


class Recipe(BaseModel):
    name = models.CharField(max_length=250)
    description = models.TextField()
    instructions = models.TextField()
    ingredients_text = models.TextField(null=True)
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient')
    meal_categories = models.JSONField(default=dict, help_text="Dictionary of meal categories and their details", blank=True)
    diet_type = models.ManyToManyField(DietType, blank=True, related_name='recipes')
    allergies = models.CharField(max_length=255, blank=True)

    calories = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True) #main
    proteins = models.FloatField(null=True, blank=True) #main
    fats = models.FloatField(null=True, blank=True) #main

    class Meta:
        db_table = "recipe"
        verbose_name = ('Recipe')
        verbose_name_plural = ('Recipes')
    
    def save(self, *args, **kwargs):
        try:
            old_instance = Recipe.objects.get(pk=self.pk)
            old_image = old_instance.image
        except Recipe.DoesNotExist:
            old_image = None

        if self.image and self.image != old_image:
            new_filename, processed_image = process_image(self.image, new_width=800, new_height=800)
            # Save the BytesIO object to the ImageField with the new filename
            self.image.save(new_filename, processed_image, save=False)
        else:
            if old_image:
                self.image = old_image
        try:
            super().save(*args, **kwargs)
        except Exception as e:
            print(f"Error in super().save(): {e}") 

    def delete(self, *args, **kwargs):
        # Check if the image exists and delete it
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name


class RecipeIngredient(BaseModel):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()

    class Meta:
        db_table = 'recipe_ingredient'
        verbose_name = 'Recipe Ingredient'
        verbose_name_plural = 'Recipe Ingredients'
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return f"{self.recipe} <-> {self.ingredient}"


class Meal(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal')
    recipes = models.ManyToManyField(Recipe, blank=True)
    date = models.DateField()
    meal_time = models.CharField(max_length=50, choices=MealTimeChoices.choices(), default=MealTimeChoices.BREAKFAST.value) 
    
    class Meta:
        db_table = "meal"
        verbose_name = 'Meal'
        verbose_name_plural = 'Meals'   
    
    def __str__(self):
        return f"{self.meal_time} for {self.user.first_name}"



    