"""
    This file provides the URL-paths connected to their view for the website.
    Views are specified in views.py, except GetWeatherData (specified in 
    getWeatherData.py, but unused in regular application usage).
    
  The array urlpatterns contains all paths linked with their view.
"""


from django.urls import path
from .api.createGreenhouseData import CreateGreenhouseData
from .api.getCalculatedCO2Footprint import GetCalculatedCO2Footprint
from .api.getCalculatedH2OFootprint import GetCalculatedH2OFootprint
from .api.getProfileSummary import GetProfileSummary
from .api.getDatasets import GetDatasets
from .api.getOptionGroupValues import GetOptionGroupValues
from .api.getUnitValues import GetUnitValues
from .api.updateGreenhouseData import UpdateGreenhouseData
from backend.api.getWeatherData import GetWeatherData

urlpatterns = [
    path('get-co2-footprint', GetCalculatedCO2Footprint.as_view()),
    path('get-h2o-footprint', GetCalculatedH2OFootprint.as_view()),
    path('create-dataset', CreateGreenhouseData.as_view()),
    path('update-dataset', UpdateGreenhouseData.as_view()),
    path('get-weather', GetWeatherData.as_view()),
    path('get-lookup-values', GetOptionGroupValues.as_view()),
    path('get-unit-values', GetUnitValues.as_view()),
    path('get-datasets', GetDatasets.as_view()),
    path('get-profile-summary', GetProfileSummary.as_view())
]
