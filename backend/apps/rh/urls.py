from rest_framework.routers import DefaultRouter

from .views import DiaTrabalhadoViewSet, FuncionarioViewSet

router = DefaultRouter()
router.register("funcionarios", FuncionarioViewSet)
router.register("dias-trabalhados", DiaTrabalhadoViewSet)

urlpatterns = router.urls
