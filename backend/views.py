from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GreenhouseData, GreenhouseOperator, GreenhouseName, ConstructionType, EnergySource
from .fillDatabase import fill_database
from .serializers import CO2Serializer
from datetime import datetime

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
            dataset = GreenhouseData.objects.filter(SessionKey=self.request.session.session_key,greenhouse_operator_id='1').values(column_name)
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


class CreateGreenhouseData(APIView):
    """API endpoint for storing greenhouse data into the database
    """
    serializer_class = GreenhouseDataSerializer

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

        # Get the primary keys from the lookup tables
        greenhouse_operator_id = GreenhouseOperator.objects.get(id=user_id)
        greenhouse_name_id = GreenhouseName.objects.filter(greenhouse_name=request.data.get('greenhouse_name')).values('id')
        construction_type_id = ConstructionType.objects.filter(construction_type=request.data.get('construction_type')).values('id')
        production_type_id = ProductionType.objects.filter(production_type=request.data.get('production_type')).values('id')
        cultivation_type_id = CultivationType.objects.filter(cultivation_type=request.data.get('cultivation_type')).values('id')
        fruit_weight_id = FruitWeight.objects.filter(fruit_weight=request.data.get('fruit_weight')).values('id')
        roofing_material_id = RoofingMaterial.objects.filter(roofing_material=request.data.get('roofing_material')).values('id')
        energy_screen_brand_id = EnergyScreenBrand.objects.filter(
            energy_screen_brand=request.data.get('energy_screen_brand')).values('id')
        energy_source_id = EnergySource.objects.filter(energy_source=request.data.get('energy_source')).values('id')
        irrigation_system_id = IrrigationSystem.objects.filter(irrigation_system=request.data.get('irrigation_system')).values('id')

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if user_id == '1':
                session_key = self.request.session.session_key
            else:
                session_key = None

            greenhouse_operator = serializer.data.get('greenhouse_operator_id')
            location = serializer.data.get('location')
            greenhouse_age = serializer.data.get('greenhouse_age')
            standing_wall_height = serializer.data.get('standing_wall_height')
            total_area = serializer.data.get('total_area')
            closing_time_begin = serializer.data.get('closing_time_begin')
            closing_time_end = serializer.data.get('closing_time_end')
            drop_per_bag = serializer.data.get('drop_per_bag')
            greenhouse_area = serializer.data.get('greenhouse_area')
            plantation_begin = serializer.data.get('plantation_begin')
            plantation_duration = serializer.data.get('plantation_duration')
            plantation_density = serializer.data.get('plantation_density')
            harvest = serializer.data.get('harvest')

            greenhouse_data = GreenhouseData(
                # Foreign Keys
                greenhouse_operator=greenhouse_operator_id,
                greenhouse_name=greenhouse_name_id,
                construction_type=construction_type_id,
                production_type=production_type_id,
                cultivation_type=cultivation_type_id,
                fruit_weight=fruit_weight_id,
                energy_source=energy_source_id,
                irrigation_system=irrigation_system_id,
                roofing_material=roofing_material_id,
                energy_screen_brand=energy_screen_brand_id,

                # general data
                datetime=datetime.now(),
                session_key=session_key,

                # greenhouse-specific data
                location=location,
                greenhouse_age=greenhouse_age,
                standing_wall_height=standing_wall_height,
                total_area=total_area,
                energy_screen=energy_screen,
                closing_time_begin=closing_time_begin,
                closing_time_end=closing_time_end,
                drop_per_bag=drop_per_bag,
                greenhouse_area=greenhouse_area,
                plantation_begin=plantation_begin,
                plantation_duration=plantation_duration,
                planting_density=plantation_density,
                harvest=harvest
            )
            greenhouse_data.save()
            return Response(GreenhouseSerializer(greenhouse_data).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class CreateDummyData(APIView):
    serializer_class = None

    def get(self, request, format=None):
        fill_database("HSWT", "HSWT-Testhaus", "hydroph.-geschlossen", "Erdgas",
                      "Tropfschlauch", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                      110, 120)
        return Response({'Good Request': 'Dummy data filled in'},
                        status=status.HTTP_200_OK)
