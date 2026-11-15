"""
Modelos do rebanho. Espelha a estrutura que já existia na planilha
(Rebanho_Cadastro + Rebanho_Movimentacoes), mas normalizado em tabelas
relacionais de verdade em vez de duas abas genéricas.

Decisões e PREMISSAS que precisam de confirmação do Gerci antes de ir
pra produção (marcadas com TODO-CONFIRMAR):
- Duração da gestação bovina assumida em 283 dias pra calcular a previsão
  de parto automaticamente. É uma média de referência zootécnica, não é
  dado da fazenda — pode variar por raça/manejo. TODO-CONFIRMAR com o Gerci.
- Número de brinco é texto (não inteiro) porque a planilha tem casos "S/N"
  (sem número) e números duplicados entre animais diferentes (37 casos
  encontrados no censo original) — por isso NÃO é unique aqui ainda.
  Confirmado em 15/11: vai ter renumeração correta na fazenda (correção
  física dos brincos duplicados). Quando isso acontecer, dá pra reavaliar
  se `numero_brinco` passa a ser `unique=True` daqui pra frente — o campo
  `numero_brinco_duplicado` continua marcando os registros históricos.
"""

from datetime import date

from django.db import models


class Animal(models.Model):
    class Sexo(models.TextChoices):
        FEMEA = "FEMEA", "Fêmea"
        MACHO = "MACHO", "Macho"

    class Categoria(models.TextChoices):
        VACA = "VACA", "Vaca"
        NOVILHA = "NOVILHA", "Novilha"
        NOVILHO = "NOVILHO", "Novilho"
        BOI = "BOI", "Boi"
        TOURO = "TOURO", "Touro"
        BEZERRO = "BEZERRO", "Bezerro(a)"

    class Origem(models.TextChoices):
        NASCIMENTO = "NASCIMENTO", "Nascimento"
        COMPRA = "COMPRA", "Compra"
        INVENTARIO_INICIAL = "INVENTARIO_INICIAL", "Inventário Inicial"

    class Status(models.TextChoices):
        ATIVO = "ATIVO", "Ativo"
        MORTO = "MORTO", "Morto"
        VENDIDO = "VENDIDO", "Vendido"

    numero_brinco = models.CharField(
        max_length=20,
        blank=True,
        help_text="'S/N' quando o animal não tem número de brinco na fonte original.",
    )
    sexo = models.CharField(max_length=10, choices=Sexo.choices)
    categoria = models.CharField(max_length=10, choices=Categoria.choices)
    data_nascimento_ou_entrada = models.DateField(null=True, blank=True)
    origem = models.CharField(max_length=20, choices=Origem.choices)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ATIVO)
    data_saida = models.DateField(null=True, blank=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    mae = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="filhos"
    )
    observacoes = models.TextField(blank=True)
    numero_brinco_duplicado = models.BooleanField(
        default=False,
        help_text="Flag herdada da migração: número de brinco repetido na fonte original.",
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Animal"
        verbose_name_plural = "Animais"
        ordering = ["numero_brinco"]

    def __str__(self):
        return f"{self.numero_brinco or 'S/N'} ({self.get_categoria_display()})"

    @property
    def data_ultimo_parto(self):
        """Data do nascimento mais recente em que este animal aparece como mãe.
        Método 1 de detectar vaca atrasada: não depende de ter lançado cobertura/
        IATF nenhuma, só dos partos reais já registrados (EventoVida tipo Nascimento)."""
        ultimo = self.filhos_events_mais_recente()
        return ultimo.data if ultimo else None

    def filhos_events_mais_recente(self):
        return (
            EventoVida.objects.filter(
                tipo=EventoVida.Tipo.NASCIMENTO, animal__mae_id=self.id
            )
            .order_by("-data")
            .first()
        )

    @property
    def dias_desde_ultimo_parto(self):
        ultima_data = self.data_ultimo_parto
        if ultima_data is None:
            return None
        return (date.today() - ultima_data).days


class EventoVida(models.Model):
    """Nascimento, morte, compra, venda, desmame — o que hoje é lançado
    em Rebanho_Movimentacoes. É o que o app do peão vai criar em campo."""

    class Tipo(models.TextChoices):
        NASCIMENTO = "NASCIMENTO", "Nascimento"
        MORTE = "MORTE", "Morte"
        COMPRA = "COMPRA", "Compra"
        VENDA = "VENDA", "Venda"
        DESMAME = "DESMAME", "Desmame"

    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="eventos")
    tipo = models.CharField(max_length=12, choices=Tipo.choices)
    data = models.DateField()
    peso_kg = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    foto = models.ImageField(upload_to="rebanho/eventos/%Y/%m/", null=True, blank=True)
    observacoes = models.TextField(blank=True)

    # Campos de suporte à sincronização offline (preenchidos pelo app do peão)
    uuid_origem = models.UUIDField(
        null=True,
        blank=True,
        unique=True,
        help_text="UUID gerado no celular no momento do lançamento offline — evita duplicar se o app reenviar.",
    )
    criado_por = models.ForeignKey(
        "contas.Usuario", null=True, blank=True, on_delete=models.SET_NULL
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    sincronizado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Evento de Vida"
        verbose_name_plural = "Eventos de Vida"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.get_tipo_display()} — {self.animal} em {self.data}"


class CicloReprodutivo(models.Model):
    """'Qual vaca não pariu' começa aqui: cobertura -> diagnóstico -> parto."""

    class TipoCobertura(models.TextChoices):
        IATF = "IATF", "IATF (inseminação artificial)"
        MONTA_NATURAL = "MONTA_NATURAL", "Monta natural"

    class ResultadoDiagnostico(models.TextChoices):
        PENDENTE = "PENDENTE", "Pendente"
        PRENHA = "PRENHA", "Prenha"
        VAZIA = "VAZIA", "Vazia"

    DIAS_GESTACAO_PADRAO = 283  # TODO-CONFIRMAR com o Gerci (ver docstring do módulo)

    vaca = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="ciclos_reprodutivos")
    tipo_cobertura = models.CharField(max_length=15, choices=TipoCobertura.choices)
    data_cobertura = models.DateField()
    data_diagnostico = models.DateField(null=True, blank=True)
    resultado_diagnostico = models.CharField(
        max_length=10, choices=ResultadoDiagnostico.choices, default=ResultadoDiagnostico.PENDENTE
    )
    data_prevista_parto = models.DateField(
        null=True,
        blank=True,
        help_text="Calculada automaticamente (data_cobertura + DIAS_GESTACAO_PADRAO) quando resultado = Prenha.",
    )
    data_parto_real = models.DateField(null=True, blank=True)
    bezerro = models.ForeignKey(
        Animal, null=True, blank=True, on_delete=models.SET_NULL, related_name="ciclo_de_origem"
    )
    observacoes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Ciclo Reprodutivo"
        verbose_name_plural = "Ciclos Reprodutivos"
        ordering = ["-data_cobertura"]

    def save(self, *args, **kwargs):
        if (
            self.resultado_diagnostico == self.ResultadoDiagnostico.PRENHA
            and self.data_cobertura
            and not self.data_prevista_parto
        ):
            from datetime import timedelta

            self.data_prevista_parto = self.data_cobertura + timedelta(
                days=self.DIAS_GESTACAO_PADRAO
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vaca} — cobertura em {self.data_cobertura}"

    @property
    def atrasada(self):
        """Método 2 de detectar vaca atrasada: baseado na previsão de parto
        calculada a partir da cobertura/IATF registrada. Funciona como
        double-check do método 1 (Animal.dias_desde_ultimo_parto) — se os dois
        apontarem atraso, o alerta é mais confiável; se só um apontar, pode ser
        que a cobertura não tenha sido lançada corretamente, ou vice-versa."""
        if self.resultado_diagnostico != self.ResultadoDiagnostico.PRENHA:
            return False
        if self.data_parto_real is not None:
            return False
        if self.data_prevista_parto is None:
            return False
        return date.today() > self.data_prevista_parto

    @property
    def dias_atraso(self):
        if not self.atrasada:
            return 0
        return (date.today() - self.data_prevista_parto).days


class RegistroSaude(models.Model):
    """Vacinas e acompanhamento de doença/tratamento. O peão avisa o Gerci
    verbalmente e o Gerci lança — por isso não há campo de 'lançado pelo app'
    aqui como regra, embora o modelo não impeça isso no futuro."""

    class Tipo(models.TextChoices):
        VACINA = "VACINA", "Vacina"
        ACOMPANHAMENTO = "ACOMPANHAMENTO", "Acompanhamento de doença/tratamento"

    class StatusAcompanhamento(models.TextChoices):
        EM_TRATAMENTO = "EM_TRATAMENTO", "Em tratamento"
        MELHOROU = "MELHOROU", "Melhorou"
        MORREU = "MORREU", "Morreu"

    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="registros_saude")
    tipo = models.CharField(max_length=15, choices=Tipo.choices)
    data = models.DateField()
    descricao = models.CharField(
        max_length=255, help_text="Nome da vacina OU descrição do problema de saúde."
    )
    status_acompanhamento = models.CharField(
        max_length=15, choices=StatusAcompanhamento.choices, blank=True
    )
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro de Saúde"
        verbose_name_plural = "Registros de Saúde"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.get_tipo_display()} — {self.animal} em {self.data}"
