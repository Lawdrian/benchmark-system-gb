"""
    This file provides the URL-paths connected to their view for the website.
    Views are specified in views.py, except GetWeatherData (specified in 
    weather.py, but unused in regular application usage).
    
  The array urlpatterns contains all paths linked with their view.
"""


from django.urls import path
from .views import CreateGreenhouseData, GetOptionGroupValues, GetGreenhouseData, GetUnitValues, GetDatasets
from .views import GetCalculatedGreenhouseData
from .weather import GetWeatherData

urlpatterns = [
    path('get-calculated-data', GetCalculatedGreenhouseData.as_view()),
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view()),
    path('get-weather', GetWeatherData.as_view()),
    path('get-lookup-values', GetOptionGroupValues.as_view()),
    path('get-unit-values', GetUnitValues.as_view()),
    path('get-datasets', GetDatasets.as_view())
]
