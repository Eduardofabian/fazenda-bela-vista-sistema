from rest_framework.routers import DefaultRouter

from .views import AnimalViewSet, CicloReprodutivoViewSet, EventoVidaViewSet, RegistroSaudeViewSet

router = DefaultRouter()
router.register("animais", AnimalViewSet)
router.register("eventos-vida", EventoVidaViewSet)
router.register("ciclos-reprodutivos", CicloReprodutivoViewSet)
router.register("registros-saude", RegistroSaudeViewSet)

urlpatterns = router.urls
