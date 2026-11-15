from rest_framework.routers import DefaultRouter

from .views import ObraViewSet

router = DefaultRouter()
router.register("obras", ObraViewSet)

urlpatterns = router.urls
