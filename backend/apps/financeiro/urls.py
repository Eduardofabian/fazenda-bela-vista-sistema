from rest_framework.routers import DefaultRouter

from .views import LancamentoViewSet

router = DefaultRouter()
router.register("lancamentos", LancamentoViewSet)

urlpatterns = router.urls
