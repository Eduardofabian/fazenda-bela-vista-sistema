from rest_framework import serializers

from .models import Lancamento


class LancamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lancamento
        fields = "__all__"
        read_only_fields = ["criado_em", "atualizado_em"]
