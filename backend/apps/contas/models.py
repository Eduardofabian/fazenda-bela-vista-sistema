from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    class Papel(models.TextChoices):
        ADMINISTRADOR = "ADMINISTRADOR", "Administrador"  # Leonardo e Gerci, mesmo nível
        PEAO = "PEAO", "Peão"
        CONTADOR = "CONTADOR", "Contador"

    papel = models.CharField(max_length=15, choices=Papel.choices, default=Papel.PEAO)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_papel_display()})"
