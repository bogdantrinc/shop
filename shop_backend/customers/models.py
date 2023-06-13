import uuid
import logging

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models

logger = logging.getLogger(__name__)

def get_profile_avatar_path(instance, filename):
    return f"profiles/{instance.id}/{uuid.uuid4()}-{filename}"


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profiles")
    full_name = models.CharField(max_length=256, null=True, blank=True)
    avatar = models.ImageField(upload_to=get_profile_avatar_path, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.full_name is None:
            return self.user.email
        return self.full_name

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile_for_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
