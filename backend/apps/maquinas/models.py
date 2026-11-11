"""
Máquinas, horas de uso e "qual peça serve em qual máquina".

Decisões e PREMISSAS (TODO-CONFIRMAR com o Gerci):
- `Peca` é documentação (espelha a aba Pecas_Maquinas da planilha), NÃO é
  estoque: sem quantidade, sem estoque mínimo — confirmado pelo Eduardo.
- `ControleHoras.horas` = horas trabalhadas naquele dia, não leitura do
  horímetro. TODO-CONFIRMAR: a planilha anota horas do dia ou o horímetro?
- Lista de tipos de máquina assumida a partir das máquinas citadas na planilha
  (MF 5285 = trator, Komatsu D60 = trator de esteira, Hilux = caminhonete).
  TODO-CONFIRMAR se falta algum tipo.
"""

from django.db import models


class Maquina(models.Model):
    class Tipo(models.TextChoices):
        TRATOR = "TRATOR", "Trator"
        TRATOR_ESTEIRA = "TRATOR_ESTEIRA", "Trator de esteira"
        CAMINHONETE = "CAMINHONETE", "Caminhonete"
        CAMINHAO = "CAMINHAO", "Caminhão"
        MOTO = "MOTO", "Moto"
        OUTRO = "OUTRO", "Outro"

    nome = models.CharField(max_length=100, help_text="Identificação usada na fazenda (ex: 'MF 5285').")
    modelo = models.CharField(max_length=100, blank=True)
    tipo = models.CharField(max_length=15, choices=Tipo.choices)
    observacoes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Máquina"
        verbose_name_plural = "Máquinas"
        ordering = ["nome"]

    def __str__(self):
        return self.nome


class ControleHoras(models.Model):
    maquina = models.ForeignKey(Maquina, on_delete=models.CASCADE, related_name="controles_horas")
    data = models.DateField()
    horas = models.DecimalField(max_digits=6, decimal_places=1)  # TODO-CONFIRMAR (ver docstring)
    observacao = models.TextField(blank=True)

    class Meta:
        verbose_name = "Controle de Horas"
        verbose_name_plural = "Controle de Horas"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.maquina} — {self.horas}h em {self.data}"


class Peca(models.Model):
    maquina = models.ForeignKey(Maquina, on_delete=models.CASCADE, related_name="pecas")
    nome = models.CharField(max_length=150, help_text="Ex: 'Motor', 'Eixo Scania'.")
    codigo = models.CharField(max_length=100, blank=True, help_text="Código/modelo da peça (ex: '5670').")
    observacoes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Peça"
        verbose_name_plural = "Peças"
        ordering = ["maquina__nome", "nome"]

    def __str__(self):
        return f"{self.maquina} → {self.nome} {self.codigo}".strip()
