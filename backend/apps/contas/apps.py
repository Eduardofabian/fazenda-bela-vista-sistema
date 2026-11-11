from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ContasConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.contas"

    def ready(self):
        from .permissoes import sincronizar_grupos

        post_migrate.connect(sincronizar_grupos, dispatch_uid="contas_sincronizar_grupos")
