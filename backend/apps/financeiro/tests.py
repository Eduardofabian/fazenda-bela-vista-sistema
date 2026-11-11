from datetime import date
from decimal import Decimal

from django.contrib.auth.models import Group
from django.test import TestCase

from .models import Lancamento


class FechamentoTest(TestCase):
    def test_soma_por_tipo_e_categoria_no_periodo(self):
        L, C = Lancamento, Lancamento.Categoria
        L.objects.create(data=date(2026, 11, 1), categoria=C.DIESEL_TRATORES, descricao="a", valor=Decimal("100.50"))
        L.objects.create(data=date(2026, 11, 30), categoria=C.DIESEL_TRATORES, descricao="b", valor=Decimal("50"))
        L.objects.create(data=date(2026, 11, 15), categoria=C.INSUMO_SAL, descricao="c", valor=Decimal("20"))
        L.objects.create(data=date(2026, 12, 1), categoria=C.INSUMO_SAL, descricao="fora", valor=Decimal("999"))

        resultado = {
            r["categoria"]: r["total"]
            for r in L.objects.fechamento(date(2026, 11, 1), date(2026, 11, 30))
        }
        self.assertEqual(resultado, {C.DIESEL_TRATORES: Decimal("150.50"), C.INSUMO_SAL: Decimal("20")})


class GruposTest(TestCase):
    def test_grupos_criados_com_permissoes(self):
        peao = set(Group.objects.get(name="Peao").permissions.values_list("codename", flat=True))
        self.assertEqual(peao, {"add_eventovida", "view_animal"})
        contador = Group.objects.get(name="Contador").permissions.values_list("codename", flat=True)
        self.assertIn("view_lancamento", contador)
        self.assertNotIn("add_lancamento", contador)
        admin = Group.objects.get(name="Administradores").permissions
        self.assertTrue(admin.filter(codename="delete_lancamento").exists())
        self.assertTrue(admin.filter(codename="add_peca").exists())
