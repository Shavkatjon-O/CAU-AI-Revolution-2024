# Generated by Django 4.2.11 on 2024-11-21 21:52

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ingredients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('date', models.DateField()),
                ('meal_time', models.CharField(choices=[('breakfast', 'BREAKFAST'), ('lunch', 'LUNCH'), ('dinner', 'DINNER')], default='breakfast', max_length=50)),
            ],
            options={
                'verbose_name': 'Meal',
                'verbose_name_plural': 'Meals',
                'db_table': 'meal',
            },
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=250)),
                ('description', models.TextField()),
                ('instructions', models.TextField()),
                ('ingredients_text', models.TextField(null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='recipes/')),
                ('meal_categories', models.JSONField(blank=True, default=dict, help_text='Dictionary of meal categories and their details')),
                ('calories', models.FloatField(blank=True, null=True)),
                ('carbs', models.FloatField(blank=True, null=True)),
                ('proteins', models.FloatField(blank=True, null=True)),
                ('fats', models.FloatField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Recipe',
                'verbose_name_plural': 'Recipes',
                'db_table': 'recipe',
            },
        ),
        migrations.CreateModel(
            name='RecipeIngredient',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('quantity', models.FloatField()),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ingredients.ingredient')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meal.recipe')),
            ],
            options={
                'verbose_name': 'Recipe Ingredient',
                'verbose_name_plural': 'Recipe Ingredients',
                'db_table': 'recipe_ingredient',
            },
        ),
        migrations.AddField(
            model_name='recipe',
            name='ingredients',
            field=models.ManyToManyField(through='meal.RecipeIngredient', to='ingredients.ingredient'),
        ),
    ]