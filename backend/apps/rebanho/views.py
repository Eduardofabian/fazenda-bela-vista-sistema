from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Animal, CicloReprodutivo, EventoVida, RegistroSaude
from .serializers import (
    AnimalSerializer,
    CicloReprodutivoSerializer,
    EventoVidaSerializer,
    RegistroSaudeSerializer,
)


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer


class EventoVidaViewSet(viewsets.ModelViewSet):
    """Endpoint que o app do peão usa pra lançar nascimento/morte/etc.

    Idempotência de sync: o celular manda `uuid_origem` gerado localmente no
    momento do lançamento (mesmo offline). Se o app reenviar o mesmo evento
    (ex: internet caiu antes de confirmar o envio), a API detecta pelo UUID
    e devolve o registro já existente em vez de duplicar.
    """

    queryset = EventoVida.objects.select_related("animal", "criado_por").all()
    serializer_class = EventoVidaSerializer

    def create(self, request, *args, **kwargs):
        uuid_origem = request.data.get("uuid_origem")
        if uuid_origem:
            existente = EventoVida.objects.filter(uuid_origem=uuid_origem).first()
            if existente is not None:
                serializer = self.get_serializer(existente)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user, sincronizado_em=timezone.now())


class CicloReprodutivoViewSet(viewsets.ModelViewSet):
    queryset = CicloReprodutivo.objects.select_related("vaca", "bezerro").all()
    serializer_class = CicloReprodutivoSerializer


class RegistroSaudeViewSet(viewsets.ModelViewSet):
    queryset = RegistroSaude.objects.select_related("animal").all()
    serializer_class = RegistroSaudeSerializer
