from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper.stringValidation import contains_script_tag
from .. import calcFootprints
from ..dataValidation import validate_mandatory_fields
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Greenhouses, Calculations, Results, MeasurementUnits
from ..serializers import InputDataSerializer
from ..standardizeUnits import standardize_units
from ..utils import generic_error_message, input_error_message


class CreateGreenhouseData(APIView):
    """API endpoint for calculating the footprints and storing them with the greenhouse data into the database.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = InputDataSerializer

    def get(self, request, format=None):
        """This get request is only necessary for testing. It provides a
        form for submitting post requests.

        Args:
            request :

        Returns:
            html: a website with input fields for submitting a post-request
                  (form).
        """

        # reload the serializer to update the form
        exec(open("./backend/serializers.py").read(), globals())
        CreateGreenhouseData.serializer_class = InputDataSerializer
        return Response(None, status=status.HTTP_200_OK)

    def post(self, request, fromat=None):
        """Calculates footprints and saves greenhouse data in the database

        Args:
            request: contains the data that needs to be saved in the database

        Returns:
            json: the saved data
        """

        # trigger the serializer.py file in order to create the latest
        # serializer corresponding to the current content in the 'measurements'-
        # and 'optiongroups'-table:
        exec(open("./backend/serializers.py").read(), globals())
        CreateGreenhouseData.serializer_class = InputDataSerializer

        user_id = self.request.user.id
        if user_id is None:
            print("CreateGreenhouseData: invalid user")
            return Response({'Error': 'No valid user', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        # check if all data in the request body fits the format
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print("CreateGreenhouseData: format error")
            print(serializer.errors)
            return Response({"Error": serializer.errors, "Message": input_error_message},
                            status=status.HTTP_400_BAD_REQUEST)
        if contains_script_tag(serializer.data.get('greenhouse_name')):
            print("CreateGreenhouseData: illegal greenhouse_name")
            return Response({'Error': 'Input Validation Error',
                             'Message': 'Die Zeichen '<' und '>' sind nicht erlaubt!'},
                            status=status.HTTP_400_BAD_REQUEST)
        print("CreateGreenhouseData: format valid")

        # validate that every required field has been filled out with not a default value
        valid_mandatory_fields, mandatory_error_message = validate_mandatory_fields(data=serializer.data)
        if valid_mandatory_fields is False:
            print("CreateGreenhouseData: mandatory error!")
            return Response({'Error': 'Mandatory error', 'Message': mandatory_error_message},
                            status=status.HTTP_400_BAD_REQUEST)
        print("CreateGreenhouseData: mandatory valid")

        # standardize the units of the data for footprint calculation
        standardized_data = standardize_units(serializer.data)

        # check if this is a data set for an existing greenhouse or if a new greenhouse should be created
        greenhouse = Greenhouses.objects.filter(
            user_id=user_id,
            greenhouse_name=standardized_data.get('greenhouse_name')
        )
        new_greenhouse = len(greenhouse) == 0
        if new_greenhouse:
            # create a new greenhouse:
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
            # use existing greenhouse
            greenhouse = greenhouse[0]

            greenhouse_data = GreenhouseData(
                greenhouse_id=greenhouse.id,
                date=serializer.data.get('date')
            )
            greenhouse_data.save()

        # calculate footprints and save them in Results table in db
        try:
            calculation_result = calcFootprints.calc_footprints(standardized_data)
            calculation_variables = Calculations.objects.in_bulk(
                field_name='calculation_name')
            for variable, value in calculation_result.items():
                Results(
                    greenhouse_data=greenhouse_data,
                    result_value=value,
                    calculation_id=calculation_variables[variable].id,
                ).save()
            print("CreateGreenhouseData: footprint calculations success")
        except Exception as e:
            print(type(e))
            if new_greenhouse:
                Greenhouses.objects.filter(id=greenhouse.id).delete()
            else:
                GreenhouseData.objects.filter(id=greenhouse_data.id).delete()
            print("CreateGreenhouseData: footprint calculation error")
            return Response({'Error': 'Calculation error', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        # save input data in Measures and Selection tables in db
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
                        # check if a selection_value is declared
                        selection_value = None
                        selection_value2 = None
                        selection_unit = None
                        if len(elem) == 3:
                            selection_value = elem[1]
                            selection_unit = elem[2]
                        if len(elem) == 4:
                            selection_value = elem[1]
                            selection_unit = elem[2]
                            selection_value2 = elem[3]
                        Selections(
                            greenhouse_data=greenhouse_data,
                            option_id=elem[0],
                            selection_value=selection_value,
                            selection_unit_id=selection_unit,
                            selection_value2=selection_value2
                        ).save()
            print("CreateGreenhouseData: save greenhouse data success")
            return Response(request.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            if new_greenhouse:
                Greenhouses.objects.filter(id=greenhouse.id).delete()
            else:
                GreenhouseData.objects.filter(id=greenhouse_data.id).delete()
            print("CreateGreenhouseData: save greenhouse data error")
            print(e)
            return Response({'Message': generic_error_message}, status=status.HTTP_400_BAD_REQUEST)
