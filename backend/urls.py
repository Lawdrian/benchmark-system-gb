from django.urls import path
from .views import CreateGreenhouseData
from .views import GetGreenhouseData
from .weather import GetWeatherData

urlpatterns = [
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view()),
    path('get-weather', GetWeatherData.as_view())
]
