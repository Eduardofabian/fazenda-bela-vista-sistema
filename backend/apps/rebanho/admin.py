from django.contrib import admin

from .models import Animal, CicloReprodutivo, EventoVida, RegistroSaude


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = (
        "numero_brinco",
        "sexo",
        "categoria",
        "status",
        "origem",
        "numero_brinco_duplicado",
        "dias_desde_ultimo_parto_display",
    )
    list_filter = ("categoria", "status", "origem", "sexo")
    search_fields = ("numero_brinco",)

    @admin.display(description="Dias sem parir (método 1: eventos reais)")
    def dias_desde_ultimo_parto_display(self, obj):
        if obj.categoria != Animal.Categoria.VACA:
            return "—"
        dias = obj.dias_desde_ultimo_parto
        return dias if dias is not None else "sem parto registrado"


@admin.register(EventoVida)
class EventoVidaAdmin(admin.ModelAdmin):
    list_display = ("animal", "tipo", "data", "peso_kg", "valor", "sincronizado_em")
    list_filter = ("tipo",)
    date_hierarchy = "data"


@admin.register(CicloReprodutivo)
class CicloReprodutivoAdmin(admin.ModelAdmin):
    list_display = (
        "vaca",
        "tipo_cobertura",
        "data_cobertura",
        "resultado_diagnostico",
        "data_prevista_parto",
        "data_parto_real",
        "atrasada_display",
    )
    list_filter = ("resultado_diagnostico", "tipo_cobertura")

    @admin.display(description="Atrasada? (método 2: cobertura + previsão)", boolean=True)
    def atrasada_display(self, obj):
        return obj.atrasada


@admin.register(RegistroSaude)
class RegistroSaudeAdmin(admin.ModelAdmin):
    list_display = ("animal", "tipo", "data", "descricao", "status_acompanhamento")
    list_filter = ("tipo", "status_acompanhamento")
