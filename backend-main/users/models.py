from django.db import models
from django.contrib.auth.models import AbstractUser

from users.managers import UserManager
from common.models import BaseModel


class User(AbstractUser, BaseModel):
    username = None
    # first_name = None
    # last_name = None

    email = models.EmailField(unique=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return self.email
