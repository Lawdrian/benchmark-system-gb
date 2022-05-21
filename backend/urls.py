from django.urls import path
from .views import CreateDummyData, CreateGreenhouseData
from .views import GetGreenhouseData

urlpatterns = [
    path('create-dummy-data', CreateDummyData.as_view()),
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view())
]
