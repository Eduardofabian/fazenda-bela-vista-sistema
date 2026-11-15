"""
Grupos do Django por papel (`Usuario.papel`). Recriados a cada `migrate`
(sinal post_migrate em ContasConfig.ready) — idempotente.

- Administradores (Leonardo e Gerci): tudo, mesmo nível, sem hierarquia.
- Peao: só criar EventoVida. `view_animal` porque pra lançar o evento precisa
  escolher o animal. TODO-CONFIRMAR quando a API do app existir.
- Contador: confirmado em 15/11 — só visualização do financeiro, sem
  permissão de lançamento. Ele recebe o que o Gerci manda, não lança nada.

Obs: o grupo dá as permissões; acessar o Django Admin ainda exige `is_staff`.
O vínculo papel → grupo é manual no admin por enquanto.
"""

from django.contrib.auth.models import Group, Permission

APPS_DO_PROJETO = ["contas", "rebanho", "financeiro", "maquinas", "rh", "obras"]

GRUPOS = {
    "Administradores": Permission.objects.filter(content_type__app_label__in=APPS_DO_PROJETO),
    "Peao": Permission.objects.filter(
        content_type__app_label="rebanho", codename__in=["add_eventovida", "view_animal"]
    ),
    "Contador": Permission.objects.filter(
        content_type__app_label="financeiro", codename__startswith="view_"
    ),
}


def sincronizar_grupos(**kwargs):
    # ponytail: roda a cada post_migrate de cada app (~15x por migrate); barato e
    # garante que as permissions do último app já existem na última chamada.
    for nome, permissoes in GRUPOS.items():
        grupo, _ = Group.objects.get_or_create(name=nome)
        grupo.permissions.set(permissoes.all())
