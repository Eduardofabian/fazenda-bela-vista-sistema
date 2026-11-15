from rest_framework import viewsets

from .models import ControleHoras, Maquina, Peca
from .serializers import ControleHorasSerializer, MaquinaSerializer, PecaSerializer


class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.prefetch_related("pecas").all()
    serializer_class = MaquinaSerializer


class ControleHorasViewSet(viewsets.ModelViewSet):
    queryset = ControleHoras.objects.select_related("maquina").all()
    serializer_class = ControleHorasSerializer


class PecaViewSet(viewsets.ModelViewSet):
    queryset = Peca.objects.select_related("maquina").all()
    serializer_class = PecaSerializer
