from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Papel", {"fields": ("papel",)}),)
    list_display = ("username", "get_full_name", "papel", "is_active")
    list_filter = ("papel", "is_active")
