from rest_framework import viewsets

from .models import DiaTrabalhado, Funcionario
from .serializers import DiaTrabalhadoSerializer, FuncionarioSerializer


class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer


class DiaTrabalhadoViewSet(viewsets.ModelViewSet):
    queryset = DiaTrabalhado.objects.select_related("funcionario").all()
    serializer_class = DiaTrabalhadoSerializer

    def get_queryset(self):
        # Filtro por funcionário — a tela de dias trabalhados no painel usa
        # isso (?funcionario=<id>) pra não listar todo mundo junto.
        qs = super().get_queryset()
        funcionario = self.request.query_params.get("funcionario")
        if funcionario:
            qs = qs.filter(funcionario_id=funcionario)
        return qs
