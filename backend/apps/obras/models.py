"""
Obras (cercas, reformas) e os gastos de cada uma.

TODO-CONFIRMAR com o Gerci: `LancamentoObra` é separado de
`financeiro.Lancamento` (que também tem a categoria CERCAS_OBRAS), como pedido
nos requisitos. Se o mesmo gasto for lançado nos dois lugares, o fechamento
financeiro não soma obras automaticamente — decidir se um vira o outro.
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


class LancamentoObra(models.Model):
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name="lancamentos")
    data = models.DateField()
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "Lançamento de Obra"
        verbose_name_plural = "Lançamentos de Obra"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.obra} — {self.descricao} — R$ {self.valor}"
