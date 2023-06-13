from rest_framework import serializers

from products.models import Product, ProductData


class ProductDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductData
        exclude = ("id", "product",)


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    data = ProductDataSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ("id", "url", "name", "image", "data", "created_on", "updated_on",)
        read_only_fields = ("name", "image",)
