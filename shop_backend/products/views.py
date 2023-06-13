from rest_framework import viewsets

from products.models import Product
from products.serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_on")
    serializer_class = ProductSerializer
    search_fields = [
        "name", "data__model", "data__product_warranty", "data__maximum_power", "data__voltage_at_maximum_power",
        "data__current_at_maximum_power", "data__open_circuit_voltage", "data__short_circuit_current",
        "data__panel_efficiency", "data__maximum_system_voltage", "data__series_fuse_rating", "data__panel_dimensions",
        "data__weight", "data__cell_type", "data__cell_number", "data__frame_type", "data__junction_box_diodes",
        "data__junction_box_protection_class", "data__connector_type", "data__cable_crossection", "data__cable_length",
        ]
