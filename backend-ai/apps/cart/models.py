from django.db import models

from apps.common.models import BaseModel
from apps.ingredients.models import Ingredient

class ShoppingListItem(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField()  # Quantity to purchase
    purchased = models.BooleanField(default=False)  # Track if it's bought
    notes = models.TextField(blank=True, null=True)  # Optional notes (e.g., preferred brand, price, etc.)

    class Meta:
        db_table = "shoppinglistitem"
        verbose_name = ('ShoppingListItem')
        verbose_name_plural = ('ShoppingListItems')

    def __str__(self):
        return f"{self.quantity} of {self.ingredient.name}"


