from django.contrib import admin

from .models import ControleHoras, Maquina, Peca


class PecaInline(admin.TabularInline):
    model = Peca
    extra = 0


@admin.register(Maquina)
class MaquinaAdmin(admin.ModelAdmin):
    list_display = ("nome", "modelo", "placa", "tipo")
    list_filter = ("tipo",)
    search_fields = ("nome", "modelo", "placa")
    inlines = [PecaInline]


@admin.register(ControleHoras)
class ControleHorasAdmin(admin.ModelAdmin):
    list_display = ("maquina", "data", "horas", "km_inicial", "km_final", "observacao")
    list_filter = ("maquina",)
    date_hierarchy = "data"


@admin.register(Peca)
class PecaAdmin(admin.ModelAdmin):
    list_display = ("maquina", "nome", "codigo")
    list_filter = ("maquina",)
    search_fields = ("nome", "codigo")
