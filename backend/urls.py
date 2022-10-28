"""
    This file provides the URL-paths connected to their view for the website.
    Views are specified in views.py, except GetWeatherData (specified in 
    getWeatherData.py, but unused in regular application usage).
    
  The array urlpatterns contains all paths linked with their view.
"""


from django.urls import path
from .api.createGreenhouseData import CreateGreenhouseData
from .api.getCalculatedGreenhouseData import GetCalculatedGreenhouseData
from .api.getDatasets import GetDatasets
from .api.getGreenhouseData import GetGreenhouseData
from .api.getOptionGroupValues import GetOptionGroupValues
from .api.getUnitValues import GetUnitValues
from backend.api.getWeatherData import GetWeatherData

urlpatterns = [
    path('get-calculated-data', GetCalculatedGreenhouseData.as_view()),
    path('get-data', GetGreenhouseData.as_view()),
    path('create-greenhouse-data', CreateGreenhouseData.as_view()),
    path('get-weather', GetWeatherData.as_view()),
    path('get-lookup-values', GetOptionGroupValues.as_view()),
    path('get-unit-values', GetUnitValues.as_view()),
    path('get-datasets', GetDatasets.as_view())
]
