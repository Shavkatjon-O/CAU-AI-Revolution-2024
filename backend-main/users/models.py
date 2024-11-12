from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from users.managers import UserManager
from common.models import BaseModel


class User(AbstractUser, BaseModel):
    email = None
    first_name = None
    last_name = None

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "username"

    objects = UserManager()

    def __str__(self):
        return self.username