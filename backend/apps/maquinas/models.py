"""
Máquinas, horas de uso e "qual peça serve em qual máquina".

Decisões e PREMISSAS:
- `Peca` é documentação (espelha a aba Pecas_Maquinas da planilha), NÃO é
  estoque: sem quantidade, sem estoque mínimo — confirmado pelo Eduardo.
- Confirmado em 15/11 com o Gerci: `ControleHoras.horas` = horas trabalhadas
  naquele dia (não é leitura acumulada do horímetro). Além disso, pra veículos
  com hodômetro (camionetes/carros), o peão às vezes anota KM antes e depois
  do trabalho daquele dia — por isso `km_inicial`/`km_final` são opcionais e
  só preenchidos quando fizer sentido pro tipo de máquina.
- Tipos de máquina confirmados: Trator, Trator de esteira, Caminhonete, Carro
  de passeio, Caminhão, Moto, Outro. Camionete/carro tem `placa` pra
  diferenciar as várias unidades da fazenda; trator usa `modelo` pra isso
  (ex: MF 5285 vs. Komatsu D60).
"""

from django.db import models


class Maquina(models.Model):
    class Tipo(models.TextChoices):
        TRATOR = "TRATOR", "Trator"
        TRATOR_ESTEIRA = "TRATOR_ESTEIRA", "Trator de esteira"
        CARRO_PASSEIO = "CARRO_PASSEIO", "Carro de passeio"
        CAMINHONETE = "CAMINHONETE", "Caminhonete"
        CAMINHAO = "CAMINHAO", "Caminhão"
        MOTO = "MOTO", "Moto"
        OUTRO = "OUTRO", "Outro"

    nome = models.CharField(max_length=100, help_text="Identificação usada na fazenda (ex: 'MF 5285').")
    modelo = models.CharField(max_length=100, blank=True, help_text="Pra diferenciar tratores (ex: 'MF 5285', 'Komatsu D60').")
    placa = models.CharField(
        max_length=10,
        blank=True,
        help_text="Pra diferenciar camionetes/carros quando há mais de uma unidade do mesmo tipo.",
    )
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
    horas = models.DecimalField(max_digits=6, decimal_places=1, help_text="Horas trabalhadas naquele dia.")
    km_inicial = models.DecimalField(
        max_digits=9, decimal_places=1, null=True, blank=True,
        help_text="KM do hodômetro antes de começar — só pra veículos (camionete/carro), quando anotado.",
    )
    km_final = models.DecimalField(
        max_digits=9, decimal_places=1, null=True, blank=True,
        help_text="KM do hodômetro depois do trabalho — só pra veículos (camionete/carro), quando anotado.",
    )
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
