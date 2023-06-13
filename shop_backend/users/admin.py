from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

from users.forms import UserCreationForm, UserChangeForm


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'is_staff', 'is_superuser',)
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups',)
    fieldsets = (
        (None, {'fields': ('email', 'password',)}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions',),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2',),
        }),
    )
    search_fields = ('email',)
    ordering = ('email', 'date_joined',)
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(get_user_model(), UserAdmin)
