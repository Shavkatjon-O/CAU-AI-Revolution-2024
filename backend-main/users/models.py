from django.contrib.auth.models import AbstractUser
from django.db import models
from users.managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    class Gender(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"

    class Goal(models.TextChoices):
        WEIGHT_LOSS = "Weight Loss"
        MUSCLE_GAIN = "Muscle Gain"
        MAINTAIN = "Maintain"

    class ActivityLevel(models.TextChoices):
        SEDENTARY = "Sedentary"
        LIGHT = "Light"
        MODERATE = "Moderate"
        ACTIVE = "Active"
        VERY_ACTIVE = "Very Active"

    # Step 1: Personal Information
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=10, choices=Gender.choices, null=True, blank=True
    )
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Step 2: Health Information
    goal = models.CharField(max_length=50, choices=Goal.choices, null=True, blank=True)
    allergies = models.CharField(max_length=255, null=True, blank=True)

    # Step 3: Lifestyle Preferences
    activity_level = models.CharField(
        max_length=20, choices=ActivityLevel.choices, null=True, blank=True
    )
    dietary_preferences = models.CharField(max_length=255, null=True, blank=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return self.email
