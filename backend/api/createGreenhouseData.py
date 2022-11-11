from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .. import algorithms
from ..dataValidation import validate_greenhouse_data
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Greenhouses, Calculations, Results, MeasurementUnits
from ..serializers import InputDataSerializer
from ..standardizeUnits import standardize_units


class CreateGreenhouseData(APIView):
    """This API endpoint stores the greenhouse data into the database.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = InputDataSerializer

    def get(self, request, format=None):
        """This get request is only necessary for testing. It provides a
        form for to submitting post requests.

        Args:
            request :

        Returns:
            html: A website with input fields for submitting a post-request
                  (form).
        """

        # reload the serializer to update the form
        exec(open("./backend/serializers.py").read(), globals())
        CreateGreenhouseData.serializer_class = InputDataSerializer
        return Response(None, status=status.HTTP_200_OK)

    def post(self, request, fromat=None):
        """Post request that stores the given greenhouse data into the database

        Args:
            request : Contains the data that needs to be saved in the database

        Returns:
            json: The saved data
        """

        # trigger the serializer.py file in order to create the latest
        # serializer corresponding to the current content in the 'measurements'-
        # and 'optiongroups'-table:
        exec(open("./backend/serializers.py").read(), globals())
        CreateGreenhouseData.serializer_class = InputDataSerializer

        # Read Url query parameters
        user_id = request.GET.get('userId', None)
        # Map anonymous user to user_id=1
        if user_id is None or user_id == '':
            user_id = '1'

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print("Post Begin!!!")

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("IsVALID!!!")
            # Validate that every required field has been filled out with not a default value
            if validate_greenhouse_data(data=serializer.data) is False:
                return Response({'Bad Request': 'Not all mandatory fields have been filled out!'},
                                status=status.HTTP_400_BAD_REQUEST)

            standardized_data = standardize_units(serializer.data)
            # Does the given greenhouse already exist?
            greenhouse = Greenhouses.objects.filter(
                user_id=user_id,
                greenhouse_name=standardized_data.get('greenhouse_name')
            )
            new_greenhouse = len(greenhouse) == 0
            if new_greenhouse:
                # Generate a new greenhouse:
                greenhouse = Greenhouses(
                    user_id=user_id,
                    greenhouse_name=standardized_data.get('greenhouse_name')
                )
                greenhouse.save()

                greenhouse_data = GreenhouseData(
                    greenhouse_id=greenhouse.id,
                    date=serializer.data.get('date')
                )
                greenhouse_data.save()
            else:
                # if a greenhouse exist, take the object out of the query set:
                greenhouse = greenhouse[0]

                greenhouse_data = GreenhouseData(
                    greenhouse_id=greenhouse.id,
                    date=serializer.data.get('date')
                )
                greenhouse_data.save()

            # Calculate co2 footprint and save it in Results table in db
            try:
                # calculate co2 footprint
                calculation_result = algorithms.calc_co2_footprint(standardized_data)
                calculation_variables = Calculations.objects.in_bulk(
                    field_name='calculation_name')
                for variable, value in calculation_result.items():
                    Results(
                        greenhouse_data=greenhouse_data,
                        result_value=value,
                        calculation_id=calculation_variables[variable].id,
                    ).save()
            except ValueError:
                if new_greenhouse:
                    Greenhouses.objects.filter(id=greenhouse.id).delete()
                return Response({'Calculation Error': 'Invalid input data!'},
                                status=status.HTTP_400_BAD_REQUEST)
            except IndexError:
                if new_greenhouse:
                    Greenhouses.objects.filter(id=greenhouse.id).delete()
                return Response({'Calculation Error': 'Invalid input data!'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Save input data in Measures and Selection tables in db
            try:
                # retrieve 'Measurements' table as dict to map measurement_name to
                # measurement_id
                measurements = Measurements.objects.in_bulk(
                    field_name='measurement_name')  # transform table to a dict
                options = OptionGroups.objects.in_bulk(
                    field_name='option_group_name')

                for name, value in standardized_data.items():
                    if name in measurements:
                        # metric (continuous) data (=> numbers)
                        Measures(
                            greenhouse_data=greenhouse_data,
                            measurement_id=measurements[name].id,
                            measure_value=value[0],
                            measure_unit=MeasurementUnits.objects.get(id=value[1])
                        ).save()
                    elif name in options:
                        # categorical data (e.g. through dropdowns)
                        for elem in value:
                            # check if an amount is declared
                            amount = None
                            value2 = None
                            selection_unit = None
                            if len(elem) == 3:
                                amount = elem[1]
                                selection_unit = elem[2]
                            if len(elem) == 4:
                                amount = elem[1]
                                selection_unit = elem[2]
                                value2 = elem[3]
                            Selections(
                                greenhouse_data=greenhouse_data,
                                option_id=elem[0],
                                amount=amount,
                                selection_unit_id=selection_unit,
                                value2=value2
                            ).save()

                return Response(request.data, status=status.HTTP_201_CREATED)
            except ValueError:
                if new_greenhouse:
                    Greenhouses.objects.filter(id=greenhouse.id).delete()
                return Response({'Save Error': 'Invalid input data!'},
                                status=status.HTTP_400_BAD_REQUEST)
            except IndexError:
                if new_greenhouse:
                    Greenhouses.objects.filter(id=greenhouse.id).delete()
                return Response({'Save Error': 'Invalid input data!'},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
