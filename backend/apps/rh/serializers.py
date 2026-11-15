from rest_framework import serializers

from .models import DiaTrabalhado, Funcionario


class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionario
        fields = "__all__"


class DiaTrabalhadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaTrabalhado
        fields = "__all__"
