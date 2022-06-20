from django.urls import path
from .views import CreateGreenhouseData, GetOptionGroupValues, GetGreenhouseData
from .views import GetCalculatedGreenhouseData
from .weather import GetWeatherData

urlpatterns = [
    path('get-calculated-data', GetCalculatedGreenhouseData.as_view()),
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view()),
    path('get-weather', GetWeatherData.as_view()),
    path('get-lookup-values', GetOptionGroupValues.as_view())
]
