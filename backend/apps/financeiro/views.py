from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Lancamento
from .serializers import LancamentoSerializer


class LancamentoViewSet(viewsets.ModelViewSet):
    queryset = Lancamento.objects.select_related("maquina", "obra").all()
    serializer_class = LancamentoSerializer

    @action(detail=False, methods=["get"])
    def fechamento(self, request):
        """Requisito #2 da reunião ("fechamentos", alta relevância): soma por
        tipo/categoria num período. GET /api/financeiro/lancamentos/fechamento/?inicio=AAAA-MM-DD&fim=AAAA-MM-DD
        """
        inicio = request.query_params.get("inicio")
        fim = request.query_params.get("fim")
        if not inicio or not fim:
            return Response(
                {"detail": "Informe os parâmetros 'inicio' e 'fim' (AAAA-MM-DD)."},
                status=400,
            )
        dados = list(Lancamento.objects.fechamento(inicio, fim))
        return Response(dados)
