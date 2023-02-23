"""
    This file provides the URL-paths connected to their view for the website.
    Views are in their respective files in the api folder.
  The array urlpatterns contains all paths linked with their view.
"""


from django.urls import path
from .api.createGreenhouseData import CreateGreenhouseData
from .api.getCalculatedCO2Footprint import GetCalculatedCO2Footprint
from .api.getCalculatedH2OFootprint import GetCalculatedH2OFootprint
from .api.getProfileSummary import GetDatasetSummary
from .api.getDatasets import GetDatasets
from .api.getOptionGroupValues import GetOptionGroupValues
from .api.getUnitValues import GetUnitValues
from .api.updateGreenhouseData import UpdateGreenhouseData

urlpatterns = [
    path('get-co2-footprint', GetCalculatedCO2Footprint.as_view()),
    path('get-h2o-footprint', GetCalculatedH2OFootprint.as_view()),
    path('create-dataset', CreateGreenhouseData.as_view()),
    path('update-dataset', UpdateGreenhouseData.as_view()),
    path('get-lookup-values', GetOptionGroupValues.as_view()),
    path('get-unit-values', GetUnitValues.as_view()),
    path('get-datasets', GetDatasets.as_view()),
    path('get-dataset-summary', GetDatasetSummary.as_view())
]
