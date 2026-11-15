from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Lancamento
from .serializers import LancamentoSerializer


class LancamentoViewSet(viewsets.ModelViewSet):
    queryset = Lancamento.objects.select_related("maquina", "obra").all()
    serializer_class = LancamentoSerializer

    def get_queryset(self):
        # Filtro simples por query string — o painel usa isso na tela de
        # lançamentos (?tipo=...&categoria=...). Sem django-filter de
        # propósito: são só 2 campos, não vale a dependência extra.
        qs = super().get_queryset()
        tipo = self.request.query_params.get("tipo")
        categoria = self.request.query_params.get("categoria")
        if tipo:
            qs = qs.filter(tipo=tipo)
        if categoria:
            qs = qs.filter(categoria=categoria)
        return qs

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
