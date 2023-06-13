import uuid
import logging

from django.conf import settings
from django.db import models

from users.middleware import get_current_user


logger = logging.getLogger(__name__)

def get_product_image_path(instance, filename):
    return f"products/{instance.id}/image/{filename}"

def get_product_datasheet_path(instance, filename):
    return f"products/{instance.product.id}/datasheet/{filename}"


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, default=get_current_user, editable=False, on_delete=models.SET_NULL, blank=True, null=True, related_name="products_created")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, editable=False, on_delete=models.SET_NULL, blank=True, null=True, related_name="products_updated")
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=256)
    image = models.ImageField(upload_to=get_product_image_path)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.updated_by = get_current_user()
        super(Product, self).save(*args, **kwargs)


class ProductData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="data")
    datasheet = models.FileField(upload_to=get_product_datasheet_path, null=True, blank=True)
    model = models.CharField(max_length=256, blank=True, null=True)
    product_warranty = models.CharField(max_length=256, blank=True, null=True)
    maximum_power = models.CharField(max_length=256, blank=True, null=True)
    voltage_at_maximum_power = models.CharField(max_length=256, blank=True, null=True)
    current_at_maximum_power = models.CharField(max_length=256, blank=True, null=True)
    open_circuit_voltage = models.CharField(max_length=256, blank=True, null=True)
    short_circuit_current = models.CharField(max_length=256, blank=True, null=True)
    panel_efficiency = models.CharField(max_length=256, blank=True, null=True)
    maximum_system_voltage = models.CharField(max_length=256, blank=True, null=True)
    series_fuse_rating = models.CharField(max_length=256, blank=True, null=True)
    panel_dimensions = models.CharField(max_length=256, blank=True, null=True)
    weight = models.CharField(max_length=256, blank=True, null=True)
    cell_type = models.CharField(max_length=256, blank=True, null=True)
    cell_number = models.CharField(max_length=256, blank=True, null=True)
    frame_type = models.CharField(max_length=256, blank=True, null=True)
    junction_box_diodes = models.CharField(max_length=256, blank=True, null=True)
    junction_box_protection_class = models.CharField(max_length=256, blank=True, null=True)
    connector_type = models.CharField(max_length=256, blank=True, null=True)
    cable_crossection = models.CharField(max_length=256, blank=True, null=True)
    cable_length = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.product.name
