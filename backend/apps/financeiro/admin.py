from django.contrib import admin

from .models import Lancamento


@admin.register(Lancamento)
class LancamentoAdmin(admin.ModelAdmin):
    list_display = ("data", "tipo", "categoria", "descricao", "fornecedor", "valor", "forma_pagamento", "maquina", "obra")
    list_filter = ("tipo", "categoria", "forma_pagamento", "maquina", "obra")
    search_fields = ("descricao", "fornecedor")
    date_hierarchy = "data"
