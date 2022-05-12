from django.urls import path
from .views import CreateDummyData

urlpatterns = [
    path('create-dummy-data', CreateDummyData.as_view()),
]