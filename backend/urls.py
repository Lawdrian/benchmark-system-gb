from django.urls import path
from .views import CreateGreenhouseData
from .views import GetGreenhouseData

urlpatterns = [
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view())
]
