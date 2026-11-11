from django.contrib import admin

from .models import DiaTrabalhado, Funcionario


@admin.register(Funcionario)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = ("nome", "funcao", "data_admissao")
    list_filter = ("funcao",)
    search_fields = ("nome",)


@admin.register(DiaTrabalhado)
class DiaTrabalhadoAdmin(admin.ModelAdmin):
    list_display = ("funcionario", "data", "trabalhou")
    list_filter = ("trabalhou", "funcionario")
    date_hierarchy = "data"
