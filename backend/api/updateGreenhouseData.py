from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .. import calcFootprints
from ..dataValidation import validate_mandatory_fields
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Greenhouses, Calculations, Results, MeasurementUnits
from ..serializers import InputDataSerializer
from ..standardizeUnits import standardize_units
from ..utils import generic_error_message, input_error_message


class UpdateGreenhouseData(APIView):
    """This API endpoint updates an existing greenhouse data set.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = InputDataSerializer

    def post(self, request, fromat=None):
        """Updates a data set in the database with the request data.

        Retrieves the to be changed data set from the database. The new values will be
        set and stored in the database.

        Args:
            request : contains the data that needs to be saved in the database and the user object

        Returns:
            json: the saved data
        """

        # trigger the serializer.py file in order to create the latest
        # serializer corresponding to the current content in the 'measurements'-
        # and 'optiongroups'-table:
        exec(open("./backend/serializers.py").read(), globals())
        UpdateGreenhouseData.serializer_class = InputDataSerializer
        update_current_dataset = False

        user_id = self.request.user.id
        if user_id is None:
            print("UpdateGreenhouseData: invalid user")
            return Response({'Error': 'No valid user!', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print("UpdateGreenhouseData: format error")
            print(serializer.errors)
            return Response({"Error": serializer.errors, "Message": input_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        print("UpdateGreenhouseData: format valid")
        # validate that every required field has been filled out with not a default value
        valid_mandatory_fields, mandatory_error_message = validate_mandatory_fields(data=serializer.data)
        if valid_mandatory_fields is False:
            print("UpdateGreenhouseData: mandatory error")
            return Response({'Error': 'Mandatory error!', 'Message': mandatory_error_message},
                            status=status.HTTP_400_BAD_REQUEST)
        print("UpdateGreenhouseData: mandatory valid")

        # standardize the units of the data for footprint calculation
        standardized_data = standardize_units(serializer.data)

        # retrieve the data set ID from the header
        dataset_id = request.headers.get("Datasetid")
        if dataset_id is None:
            print("UpdateGreenhouseData: data set ID missing")
            return Response({'Error': 'Datasetid is missing in header!', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        greenhouse_data = GreenhouseData.objects.filter(id=dataset_id)[0]
        greenhouse = Greenhouses.objects.filter(id=greenhouse_data.greenhouse_id)[0]
        if greenhouse.user_id != user_id:
            print("UpdateGreenhouseData: ID match error")
            return Response({'Error': 'DatasetId does not match to UserId!', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        greenhouse_data.date = serializer.data.get('date')
        greenhouse_data.save()
        # calculate footprints and save them in Results table in db
        try:
            calculation_result = calcFootprints.calc_footprints(standardized_data)
            calculation_variables = Calculations.objects.in_bulk(
                field_name='calculation_name')
            print(calculation_result.items())
            print("##########################")
            print(calculation_variables)
            for variable, value in calculation_result.items():
                result = Results.objects.get(
                    greenhouse_data=greenhouse_data, calculation_id=calculation_variables[variable].id)
                if result is not None:
                    # the old value can be simply overwritten, since the amount of result values per data set is always
                    # the same
                    print("update: result=" + str(variable) + " value=" + str(value))
                    result.result_value = round(value, 2)
                    result.save()
                else:
                    print("UpdateGreenhouseData: footprint calculations success")
                    return Response({'Error': 'Calculation error; No Result Value!',
                                     'Message': generic_error_message}, status=status.HTTP_400_BAD_REQUEST)
            print("UpdateGreenhouseData: footprint calculations success")
        except Exception as e:
            print("UpdateGreenhouseData: calculation error")
            print(type(e))
            return Response({'Error': 'Calculation error!', 'Message': generic_error_message},
                            status=status.HTTP_400_BAD_REQUEST)

        # save input data in Measures and Selection tables in db
        try:
            # retrieve 'Measurements' table as dict to map measurement_name to measurement_id
            measurements = Measurements.objects.in_bulk(
                field_name='measurement_name')  # transform table to a dict
            options = OptionGroups.objects.in_bulk(
                field_name='option_group_name')
            # retrieve the current selections of the data set, because they need to be deleted
            old_selections = Selections.objects.filter(greenhouse_data=greenhouse_data)
            new_selections = []
            for name, value in standardized_data.items():
                if name in measurements:
                    # metric (continuous) data (=> numbers)
                    measure = Measures.objects.get(greenhouse_data=greenhouse_data, measurement_id=measurements[name].id,)
                    measure.measure_value = value[0]
                    measure.measure_unit = MeasurementUnits.objects.get(id=value[1])
                    measure.save()
                elif name in options:
                    # categorical data (e.g. through dropdowns)
                    for elem in value:
                        # check if a value is declared
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
                        new_selections.append(
                            Selections(
                                greenhouse_data=greenhouse_data,
                                option_id=elem[0],
                                selection_value=selection_value,
                                selection_unit_id=selection_unit,
                                selection_value2=selection_value2
                            )
                        )
            # delete all old selections
            for old_selection in old_selections:
                old_selection.delete()
            # save the new selections
            for new_selection in new_selections:
                new_selection.save()
            print("UpdateGreenhouseData: save success")
            return Response(request.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("UpdateGreenhouseData: save error")
            print(type(e))
            print("Save error: Invalid input data")
            return Response({'Message': generic_error_message}, status=status.HTTP_400_BAD_REQUEST)
