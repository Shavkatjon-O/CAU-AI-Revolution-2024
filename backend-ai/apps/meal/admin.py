from django.contrib import admin

from unfold.admin import ModelAdmin

from .models import Recipe, RecipeIngredient, Meal, DietType

@admin.register(Recipe)
class RecipeAdmin(ModelAdmin):
    fieldsets = (
        ("Recipe", {"fields": ("user", )}),
        ("Recipe Info", {"fields": ("name", "description", "instructions", "ingredients_text", "meal_categories", "allergies")}),
        ("Recipe Nutritions", {"fields": ("calories", "proteins", "fats", "carbs")})
    )
    list_display = ("id", "name", "user", "description")
    search_fields = ("name", )
    ordering = ("-id",)

@admin.register(Meal)
class MealAdmin(ModelAdmin):
    fieldsets = (
        ("Meal", {"fields": ("user", "recipes", "date", "meal_time")}),
    )
    list_display = ("id", "user", "date", "meal_time")
    list_filter = ("meal_time", )
    search_fields = ("user", "meal_time")
    ordering = ("-id",)

@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(ModelAdmin):
    fieldsets = (
        ("Recipe Ingredients", {"fields": ("recipe", "ingredient", "quantity")}),
    )
    list_display = ("id", "recipe", "ingredient", "quantity")
    search_fields = ("recipe", "ingredient")
    ordering = ("-id",)

@admin.register(DietType)
class DietTypeAdmin(ModelAdmin):
    fieldsets = (
        ("Info", {"fields": ("name", "exclusions")}),
    )
    list_display = ("id", "name", "exclusions")
    search_fields = ("name",)
    ordering = ("-id",)
