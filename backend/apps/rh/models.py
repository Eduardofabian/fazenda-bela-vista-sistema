"""
Funcionários e dias trabalhados. Sem cartão ponto: o peão avisa o Gerci
verbalmente e o Gerci lança. Sem cálculo de folha (fora do escopo).
"""

from django.db import models


class Funcionario(models.Model):
    nome = models.CharField(max_length=150)
    funcao = models.CharField(max_length=100)
    data_admissao = models.DateField()

    class Meta:
        verbose_name = "Funcionário"
        verbose_name_plural = "Funcionários"
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.funcao})"


class DiaTrabalhado(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name="dias_trabalhados")
    data = models.DateField()
    trabalhou = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Dia Trabalhado"
        verbose_name_plural = "Dias Trabalhados"
        ordering = ["-data"]
        # um lançamento por funcionário por dia — evita contar o mesmo dia duas vezes
        constraints = [
            models.UniqueConstraint(fields=["funcionario", "data"], name="dia_trabalhado_unico")
        ]

    def __str__(self):
        return f"{self.funcionario.nome} — {self.data} — {'trabalhou' if self.trabalhou else 'faltou'}"
