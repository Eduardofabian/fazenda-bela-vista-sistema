from rest_framework import viewsets

from .models import DiaTrabalhado, Funcionario
from .serializers import DiaTrabalhadoSerializer, FuncionarioSerializer


class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer


class DiaTrabalhadoViewSet(viewsets.ModelViewSet):
    queryset = DiaTrabalhado.objects.select_related("funcionario").all()
    serializer_class = DiaTrabalhadoSerializer
