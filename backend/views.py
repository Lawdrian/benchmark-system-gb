from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GreenhouseData
from .fillDatabase import fill_database
from .serializers import CO2Serializer


class GetGreenhouseData(APIView):
    """API for retrieving the calculated GreenhouseData
    """
    lookup_url_kwarg = 'userID'

    def get(self, request, format=None):
        """Get request that returns the calculated data which got requested.
            Either:
                - co2_footprint
                // Todo: Extend function doc

        Args:
            request : Request parameter

        Returns:
            json: The calculated data requested
        """

        # Read Url query parameters
        # user_id needs to match a user id in the GreenhouseData table, or anonymous user will be assumed
        user_id = request.GET.get('userId', None)
        # data_type is needed for selecting the correct data to return
        data_type = request.GET.get('dataType', None)

        # map the requested datatype to the correct column name in the GreenhouseData table
        map_data_type = {
           'co2FootprintData': 'co2_footprint',
           'waterUsageData': 'water_usage',
           'benchmarkData': 'benchmark'
        }
        column_name = map_data_type.get(data_type, None)

        if user_id != '1':
            dataset = GreenhouseData.objects.filter(greenhouse_operator_id=user_id).values(column_name)
        elif self.request.session.session_key is not None:
            dataset = GreenhouseData.objects.filter(SessionKey=self.request.session.session_key).values(column_name)
        else:
            return Response({'Bad Request': 'Unknown user'}, status=status.HTTP_400_BAD_REQUEST)

        if len(dataset) > 0:
            if(column_name == 'co2_footprint'):
                data = CO2Serializer(dataset,many=True).data
            elif(column_name == 'water_usage'):
                data = WaterSerializer(dataset, many=True).data
            elif (column_name == 'benchmark'):
                data = BenchmarkSerializer(dataset, many=True).data
            else:
                return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data, status=status.HTTP_200_OK)
        print(dataset)
        return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)


class CreateDummyData(APIView):
    serializer_class = None

    def get(self, request, format=None):
        fill_database("HSWT", "HSWT-Testhaus", "hydroph.-geschlossen", "Erdgas",
                      "Tropfschlauch", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                      110, 120)
        return Response({'Good Request': 'Dummy data filled in'},
                        status=status.HTTP_200_OK)
