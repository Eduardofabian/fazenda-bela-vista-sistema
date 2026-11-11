from django.contrib import admin

from .models import LancamentoObra, Obra


class LancamentoObraInline(admin.TabularInline):
    model = LancamentoObra
    extra = 0


@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display = ("descricao", "data_inicio")
    search_fields = ("descricao",)
    inlines = [LancamentoObraInline]


@admin.register(LancamentoObra)
class LancamentoObraAdmin(admin.ModelAdmin):
    list_display = ("obra", "data", "descricao", "valor")
    list_filter = ("obra",)
    date_hierarchy = "data"
