"""
Permission class da API REST. Separado de `permissoes.py` (que monta os
GRUPOS/Permission do Django) porque são coisas diferentes: aquele define QUAIS
permissões cada papel tem; este decide COMO a API aplica isso nas requisições.

Por padrão, `DjangoModelPermissions` do DRF só exige permissão pra métodos de
escrita (POST/PUT/PATCH/DELETE) — GET fica liberado pra qualquer usuário
autenticado, independente de ele ter `view_*` ou não. Isso quebraria o
isolamento do Peão (que só tem `add_eventovida` e `view_animal`): ele
conseguiria listar/ler financeiro, máquinas, RH, etc. pela API mesmo sem
permissão de view nenhuma nesses models.

`DjangoModelPermissionsIncludingView` fecha essa brecha: adiciona `view_*` ao
mapa de permissões exigidas também pra GET/HEAD/OPTIONS.
"""

from rest_framework.permissions import DjangoModelPermissions


class DjangoModelPermissionsIncludingView(DjangoModelPermissions):
    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }
