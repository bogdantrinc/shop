from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin

from users.managers import UserManager


class User(AbstractUser, PermissionsMixin):
    objects = UserManager()
    username = None
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
