from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from .fillDatabase import fill_database
from rest_framework.response import Response


class CreateDummyData(APIView):
    serializer_class = None

    def get(self, request, format=None):
        fill_database("HSWT", "HSWT-Testhaus", "hydroph.-geschlossen", "Erdgas",
                      "Tropfschlauch", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                      110, 120)
        return Response({'Good Request': 'Dummy data filled in'},
                        status=status.HTTP_200_OK)
