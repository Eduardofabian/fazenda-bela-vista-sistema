from rest_framework.routers import DefaultRouter

from .views import ControleHorasViewSet, MaquinaViewSet, PecaViewSet

router = DefaultRouter()
router.register("maquinas", MaquinaViewSet)
router.register("controle-horas", ControleHorasViewSet)
router.register("pecas", PecaViewSet)

urlpatterns = router.urls
