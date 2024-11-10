from django.db import models
from apps.common.models import BaseModel
from apps.users.models import User

class Ingredient(BaseModel):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50)  # e.g., grams, liters
    image = models.ImageField(upload_to='ingredients/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ingredients')

    class Meta:
        db_table = "ingredient"
        verbose_name = ('Ingredeint')
        verbose_name_plural = ('Ingredients')
    
    def __str__(self):
        return self.name
    

class IngredientStock(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()

    class Meta:
        db_table = "ingredient_stock"
        verbose_name = ('Ingredeint Stock')
        verbose_name_plural = ('Ingredient Stock')
        unique_together = ('user', 'ingredient')

    def __str__(self):
        return f"{self.user.username} - {self.ingredient.name} - {self.quantity} {self.ingredient.unit}"
    

