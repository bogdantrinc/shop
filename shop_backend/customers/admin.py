from django.contrib import admin

from customers.models import Profile


class ProfileAdmin(admin.ModelAdmin):
    class Meta:
        model = Profile
    
    autocomplete_fields = ("user",)
    list_display = ("user", "full_name", "created_on", "updated_on",)
    list_filter = ("created_on", "updated_on",)
    search_fields = ("id", "user__email", "full_name",)
    fields = ("user", "full_name", "avatar",)
    readonly_fields = ("id", "user", "created_on", "updated_on",)


admin.site.register(Profile, ProfileAdmin)
