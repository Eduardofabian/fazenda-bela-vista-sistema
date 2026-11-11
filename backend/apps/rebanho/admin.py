from django.contrib import admin

from .models import Animal, CicloReprodutivo, EventoVida, RegistroSaude


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("numero_brinco", "sexo", "categoria", "status", "origem", "numero_brinco_duplicado")
    list_filter = ("categoria", "status", "origem", "sexo")
    search_fields = ("numero_brinco",)


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
    )
    list_filter = ("resultado_diagnostico", "tipo_cobertura")


@admin.register(RegistroSaude)
class RegistroSaudeAdmin(admin.ModelAdmin):
    list_display = ("animal", "tipo", "data", "descricao", "status_acompanhamento")
    list_filter = ("tipo", "status_acompanhamento")
