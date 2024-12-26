import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Q
from django.conf import settings

from apps.users.managers import UserManager
from apps.common.models import BaseModel
from apps.common.utils import process_image, process_document
from apps.common.enums import GoalChoices, GenderChoices, ActivityLevelChoices


class DietType(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    exclusions = models.TextField(help_text="Comma-separated list of exclusions", blank=True, null=True)
    
    def __str__(self):
        return self.name


class User(AbstractUser, BaseModel):
    email = models.EmailField(unique=True, blank=False)
    
    # Personal Information
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    age = models.PositiveIntegerField(null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gender = models.CharField(max_length=50, choices=GenderChoices.choices(), default=GenderChoices.MALE.value)

    # Health Information
    goal = models.CharField(max_length=50, choices=GoalChoices.choices(), default=GoalChoices.MAINTAIN.value)
    allergies = models.CharField(max_length=255, null=True, blank=True) # need to be updated for choices
    activity_level = models.CharField(max_length=50, choices=ActivityLevelChoices.choices(), default=ActivityLevelChoices.MODERATE_ACTIVE.value)
    diet_types = models.ForeignKey(DietType, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Nutrition
    calories = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True) #main
    proteins = models.FloatField(null=True, blank=True) #main
    fats = models.FloatField(null=True, blank=True) #main

    username = None

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f'{self.id} - {self.email}'

    class Meta:
        db_table = "user"
        verbose_name = ('User')
        verbose_name_plural = ('Users')

    def save(self, *args, **kwargs):
        if not self.pk:
            self.set_password(self.password)
        super().save(*args, **kwargs)

    
class BlacklistedToken(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blacklisted_tokens')
    access_token = models.CharField(max_length=1024, unique=True)
    refresh_token = models.CharField(max_length=1024, unique=True)


    def __str__(self):
        return f"{self.user.first_name}'s blacklisted token"

    @classmethod
    def blacklist_token(cls, user, access, refresh):
        """Blacklists a refresh token."""
        if not cls.is_token_blacklisted(access, refresh):
            cls.objects.get_or_create(user=user, access_token=access, refresh_token=refresh)

    @classmethod
    def is_token_blacklisted(cls, access, refresh):
        """Checks if a refresh token is blacklisted."""
        # Initialize an empty Q object
        query = Q()
        # Conditionally add access token to the query
        if access:
            query |= Q(access_token=access)
        # Conditionally add refresh token to the query
        if refresh:
            query |= Q(refresh_token=refresh)
        # If neither token is provided, return False
        if not query:
            return False
        # Return whether any records match the constructed query
        return cls.objects.filter(query).exists()

    class Meta:
        db_table = "blacklisted_token"
        verbose_name = ('Blacklisted Token')
        verbose_name_plural = ('Blacklisted Tokens')