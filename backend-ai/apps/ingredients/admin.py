from django.contrib import admin

from unfold.admin import ModelAdmin

from .models import Ingredient


@admin.register(Ingredient)
class IngredientAdmin(ModelAdmin):
    fieldsets = (
        ("Ingredient", {"fields": ("user", )}),
        ("Ingredient Info", {"fields": ("name", "unit", "image")}),
        ("Ingredient Nutritions", {"fields": ("calories", "proteins", "fats", "carbs")})
    )
    list_display = ("id", "name", "user", "unit")
    search_fields = ("name", )
    ordering = ("-id",)
