from rest_framework import serializers

from .models import Animal, CicloReprodutivo, EventoVida, RegistroSaude


class AnimalSerializer(serializers.ModelSerializer):
    dias_desde_ultimo_parto = serializers.ReadOnlyField()

    class Meta:
        model = Animal
        fields = "__all__"
        read_only_fields = ["numero_brinco_duplicado", "criado_em", "atualizado_em"]


class EventoVidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoVida
        fields = "__all__"
        read_only_fields = ["criado_por", "criado_em", "sincronizado_em"]


class CicloReprodutivoSerializer(serializers.ModelSerializer):
    atrasada = serializers.ReadOnlyField()
    dias_atraso = serializers.ReadOnlyField()

    class Meta:
        model = CicloReprodutivo
        fields = "__all__"


class RegistroSaudeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroSaude
        fields = "__all__"
