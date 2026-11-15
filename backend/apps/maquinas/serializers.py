from rest_framework import serializers

from .models import ControleHoras, Maquina, Peca


class PecaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peca
        fields = "__all__"


class MaquinaSerializer(serializers.ModelSerializer):
    pecas = PecaSerializer(many=True, read_only=True)

    class Meta:
        model = Maquina
        fields = "__all__"


class ControleHorasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControleHoras
        fields = "__all__"
