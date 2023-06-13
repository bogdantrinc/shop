from django.contrib import admin

from products.models import Product, ProductData


class ProductDataInline(admin.StackedInline):
    model = ProductData
    can_delete = False
    min_num = 1
    verbose_name = "Data"


class ProductAdmin(admin.ModelAdmin):
    class Meta:
        model = Product
    
    list_display = ("name", "created_by", "created_on", "updated_by", "updated_on",)
    ordering = ["-created_on"]
    list_filter = ("created_by", "updated_by", "created_on", "updated_on",)
    search_fields = ("id", "name", "created_by__email", "updated_by__email", "data__model")
    fields = ("id", "name", "image",)
    readonly_fields = ("id", "created_by", "created_on", "updated_by", "updated_on",)
    inlines = [ProductDataInline]


admin.site.register(Product, ProductAdmin)
