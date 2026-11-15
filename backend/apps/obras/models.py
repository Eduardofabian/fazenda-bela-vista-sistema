"""
Obras (cercas, reformas) — aqui é só o cadastro/histórico da obra em si.

Decisão fechada em 15/11: o gasto de verdade NÃO entra aqui. Todo gasto de
obra é lançado em `financeiro.Lancamento` (categoria CERCAS_OBRAS) com a FK
`obra` preenchida — mesmo padrão que já existe pra `Maquina`. Isso faz o
fechamento financeiro somar obras automaticamente, sem risco de lançar o
mesmo gasto duas vezes em dois lugares.
"""

from django.db import models


class Obra(models.Model):
    descricao = models.CharField(max_length=255, help_text="Ex: 'Cerca de madeira', 'Reforma do curral'.")
    data_inicio = models.DateField()

    class Meta:
        verbose_name = "Obra"
        verbose_name_plural = "Obras"
        ordering = ["-data_inicio"]

    def __str__(self):
        return self.descricao
