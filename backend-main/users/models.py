from django.db import models
from django.contrib.auth.models import AbstractUser
from users.managers import UserManager
from common.models import BaseModel


class User(AbstractUser, BaseModel):
    username = None
    email = models.EmailField(unique=True)

    class Gender(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"
        OTHER = "Other"

    class ActivityLevel(models.TextChoices):
        SEDENTARY = "Sedentary"
        LIGHT = "Light"
        MODERATE = "Moderate"
        ACTIVE = "Active"
        VERY_ACTIVE = "Very Active"

    class Goal(models.TextChoices):
        WEIGHT_LOSS = "Weight Loss"
        MUSCLE_GAIN = "Muscle Gain"
        MAINTAIN = "Maintain"

    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=10, choices=Gender.choices, null=True, blank=True
    )
    height = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )  # in cm
    weight = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )  # in kg
    activity_level = models.CharField(
        max_length=20, choices=ActivityLevel.choices, null=True, blank=True
    )

    dietary_preferences = models.CharField(
        max_length=255, null=True, blank=True
    )  # e.g., vegetarian, vegan, keto, etc.
    allergies = models.CharField(
        max_length=255, null=True, blank=True
    )  # e.g., dairy, nuts, gluten, etc.

    goal = models.CharField(max_length=50, choices=Goal.choices, null=True, blank=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_bmi(self):
        if self.height and self.weight:
            height_m = self.height / 100
            bmi = self.weight / (height_m**2)
            return round(bmi, 1)
        return None

    def suggested_calories(self):
        if (
            self.age
            and self.gender
            and self.height
            and self.weight
            and self.activity_level
        ):
            if self.gender == self.Gender.MALE:
                bmr = 10 * self.weight + 6.25 * self.height - 5 * self.age + 5
            else:
                bmr = 10 * self.weight + 6.25 * self.height - 5 * self.age - 161
            activity_multipliers = {
                self.ActivityLevel.SEDENTARY: 1.2,
                self.ActivityLevel.LIGHT: 1.375,
                self.ActivityLevel.MODERATE: 1.55,
                self.ActivityLevel.ACTIVE: 1.725,
                self.ActivityLevel.VERY_ACTIVE: 1.9,
            }
            tdee = bmr * activity_multipliers.get(self.activity_level, 1.2)
            if self.goal == self.Goal.WEIGHT_LOSS:
                return round(tdee - 500, 0)
            elif self.goal == self.Goal.MUSCLE_GAIN:
                return round(tdee + 500, 0)
            return round(tdee, 0)
        return None

    def meal_plan_info(self):
        return {
            "Dietary Preferences": self.dietary_preferences,
            "Allergies": self.allergies,
            "Goal": self.goal,
            "Suggested Calories": self.suggested_calories(),
        }
