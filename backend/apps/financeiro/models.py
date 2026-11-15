"""
Lançamentos financeiros. Substitui as abas de despesas/receitas da planilha.

Decisões e PREMISSAS (TODO-CONFIRMAR com o Gerci):
- Categoria é TextChoices fixo (padrão do `rebanho`), não tabela editável.
  A hierarquia da planilha (ex: Diesel > Tratores / Camionetes) está achatada
  no próprio valor (DIESEL_TRATORES, DIESEL_CAMIONETES...). Se o Gerci precisar
  criar categoria nova sem deploy, isso vira model `Categoria` com FK `pai`.
  TODO-CONFIRMAR: a lista abaixo cobre tudo? Não há categoria de receita
  definida nas anotações (ex: venda de gado) — por enquanto cai em OUTROS.
- Forma de pagamento: lista assumida pelo que é comum em fazenda.
  TODO-CONFIRMAR quais formas o Gerci usa de verdade.
- Fornecedor é texto livre (não há cadastro de fornecedores nos requisitos).
- "Fechamento" NÃO é um model: é o relatório `Lancamento.objects.fechamento()`,
  soma por categoria/tipo num período. Não trava lançamento.
- Decisão fechada em 15/11: gasto de obra (cerca, reforma) é lançado AQUI
  (categoria CERCAS_OBRAS), com a FK `obra` preenchida — `obras.Obra` é só
  cadastro/histórico, não tem mais lançamento próprio (`LancamentoObra` foi
  removido). Mesmo padrão já usado com `maquina`.
"""

from django.db import models
from django.db.models import Sum


class LancamentoQuerySet(models.QuerySet):
    def fechamento(self, inicio, fim):
        """Soma por tipo e categoria entre `inicio` e `fim` (inclusive)."""
        return (
            self.filter(data__range=(inicio, fim))
            .values("tipo", "categoria")
            .annotate(total=Sum("valor"))
            .order_by("tipo", "categoria")
        )


class Lancamento(models.Model):
    class Tipo(models.TextChoices):
        RECEITA = "RECEITA", "Receita"
        DESPESA = "DESPESA", "Despesa"

    class Categoria(models.TextChoices):
        DIESEL_TRATORES = "DIESEL_TRATORES", "Diesel — Tratores"
        DIESEL_CAMIONETES = "DIESEL_CAMIONETES", "Diesel — Camionetes"
        INSUMO_SAL = "INSUMO_SAL", "Insumos do gado — Sal"
        INSUMO_VACINAS = "INSUMO_VACINAS", "Insumos do gado — Vacinas"
        CERCAS_OBRAS = "CERCAS_OBRAS", "Cercas / Obras"
        NOTAS_FISCAIS = "NOTAS_FISCAIS", "Notas fiscais"
        OUTROS = "OUTROS", "Outros"  # TODO-CONFIRMAR (ver docstring do módulo)

    class FormaPagamento(models.TextChoices):  # TODO-CONFIRMAR (ver docstring)
        DINHEIRO = "DINHEIRO", "Dinheiro"
        PIX = "PIX", "Pix"
        TRANSFERENCIA = "TRANSFERENCIA", "Transferência"
        BOLETO = "BOLETO", "Boleto"
        CARTAO = "CARTAO", "Cartão"
        CHEQUE = "CHEQUE", "Cheque"

    data = models.DateField()
    categoria = models.CharField(max_length=20, choices=Categoria.choices)
    tipo = models.CharField(max_length=10, choices=Tipo.choices, default=Tipo.DESPESA)
    descricao = models.CharField(max_length=255)
    fornecedor = models.CharField(max_length=150, blank=True)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    forma_pagamento = models.CharField(max_length=15, choices=FormaPagamento.choices, blank=True)
    maquina = models.ForeignKey(
        "maquinas.Maquina",
        null=True,
        blank=True,
        on_delete=models.PROTECT,  # não apagar máquina com gasto lançado — perderia o histórico
        related_name="lancamentos",
        help_text="Opcional — pra saber gasto por máquina (ex: diesel do MF 5285).",
    )
    obra = models.ForeignKey(
        "obras.Obra",
        null=True,
        blank=True,
        on_delete=models.PROTECT,  # não apagar obra com gasto lançado — perderia o histórico
        related_name="lancamentos",
        help_text="Opcional — preencher quando categoria for Cercas/Obras.",
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    objects = LancamentoQuerySet.as_manager()

    class Meta:
        verbose_name = "Lançamento"
        verbose_name_plural = "Lançamentos"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.data} — {self.get_categoria_display()} — R$ {self.valor}"
