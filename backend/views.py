from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GreenhouseData
from .serializers import CreateGreenhouseDataSerializer


class GetGreenhouseData(APIView):
    """API endpoint for retrieving the calculated GreenhouseData
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

        # map the requested datatype to the correct column names in the GreenhouseData table
        map_data_type = {
            'co2FootprintData': (
                'electric_power_co2', 'heat_consumption_co2', 'psm_co2',
                'fertilizer_co2'),
            'waterUsageData': 'water_usage',
            'benchmarkData': 'benchmark'
        }
        column_name = map_data_type.get(data_type, None)

        print(column_name)

        if user_id != '1':
            dataset = GreenhouseData.objects.filter(
                greenhouse_operator_id=user_id).values('electric_power_co2',
                                                       'heat_consumption_co2',
                                                       'psm_co2',
                                                       'fertilizer_co2')
        elif self.request.session.session_key is not None:
            dataset = GreenhouseData.objects.filter(
                SessionKey=self.request.session.session_key,
                greenhouse_operator_id='1').values(column_name)
        else:
            return Response({'Bad Request': 'Unknown user'},
                            status=status.HTTP_400_BAD_REQUEST)

        if len(dataset) > 0:
            return Response(dataset, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Data corrupted'},
                        status=status.HTTP_400_BAD_REQUEST)


class GetLoopUpTableNames(APIView):
    """API endpoint for retrieving the fixed attribute values that a user can select when entering his greenhoues data.
       For example Bedachungsmaterial: ED | DG
    """

    def get(self, request, format=None):
        """Get request that returns the fixed attribute values for the dropdown selection inputs.

        Args:
            request : Request parameter

        Returns:
            json: The names for the attributes
        """


class CreateGreenhouseData(APIView):
    """API endpoint for storing greenhouse data into the database
    """
    serializer_class = CreateGreenhouseDataSerializer

    def post(self, request, fromat=None):
        """Post request that stores the given greenhouse data into the database
            Either for:
                - user
                - anonymous user (user_id=1)

        Args:
            request : Contains the data that needs to be saved in the database

        Returns:
            json: The saved data
        """
        # Read Url query parameters
        # user_id needs to match a user id in the GreenhouseData table, or anonymous user will be assumed
        user_id = request.GET.get('userId', None)
        # Map anonymous user to user_id=1
        if user_id is None or user_id == '':
            user_id = '1'

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if user_id == '1':
                session_key = self.request.session.session_key
            else:
                session_key = None

            serializer.save(electric_power_co2=2, heat_consumption_co2=1,
                            psm_co2=2, fertilizer_co2=2)

            return Response(request.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response({'Bad Request': 'Invalid data...'},
                        status=status.HTTP_400_BAD_REQUEST)
