from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, CompanyViewSet, PlacementStageViewSet,
    PlacementProgressViewSet, StageProgressViewSet, ImportantDateViewSet
)

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'stages', PlacementStageViewSet)
router.register(r'placement-progress', PlacementProgressViewSet)
router.register(r'stage-progress', StageProgressViewSet)
router.register(r'important-dates', ImportantDateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]