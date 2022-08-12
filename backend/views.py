"""
    This module defines all the backends' API-endpoints (views) that can be 
    called from the website.
    
    A view receives requests from the frontend, handles the overall processing
    like requesting more data or storing data in the database and sends 
    responses towards the frontend which can contain requested data.
    
  API-Views:
      GetGreenhouseData
      GetCalculatedGreenhouseData
      GetOptionGroupValues
      CreateGreenhouseData
"""


from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from . import algorithms
from .dataValidation import validate_greenhouse_data
from .models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Options, Greenhouses, Calculations, Results
from .serializers import InputDataSerializer


class GetGreenhouseData(APIView):
    """API endpoint for retrieving all greenhouse data for every greenhouse of a user.
    """
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """
        Args:
            request: user id as query parameter

        Returns:
            response_data: greenhouse data for every greenhouse in json format
        """
        # Read Url query parameters
        user_id = request.GET.get('userId', None)

        if user_id is None:
            return Response({'Bad Request': 'Query Parameter missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve all measurement_ids and measurement_names
        measurements = Measurements.objects.all()
        measurement_ids = [measurements.values('id')[i]['id'] for i in range(len(measurements))]
        measurement_names = [measurements.values('measurement_name')[i]['measurement_name'] for i in range(len(measurements))]

        # Retrieve all option groups
        option_groups = OptionGroups.objects.all()

        # Retrieve all greenhouses of a specific user
        greenhouses = Greenhouses.objects.filter(user_id=user_id)

        response_data = []

        # Iterate through every greenhouse, retrieve all the data for it and save it in the correct json structure
        for greenhouse in greenhouses:

            # Create a dictionary to store all the data for one greenhouse in it
            temp_greenhouse_dict = dict()

            temp_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name

            # Create a list to store all data_sets for one greenhouse in it
            temp_data_set_list = []

            # Retrieve all greenhouse_data for one greenhouse
            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            # Iterate through the greenhouse data, retrieve all measures and selections and save them in the correct
            # json structure
            for data_set in greenhouse_data:

                # Create a dictionary to store all the data for one data_set of one greenhouse in it
                temp_data_dict = dict()
                # Sub dictionary of temp_data_dict that holds all the measures
                temp_measures_data_dict = dict()
                # Sub dictionary of temp_data_dict that holds all the selections
                temp_selections_data_dict = dict()

                temp_data_dict['label'] = data_set.date_of_input

                # Retrieve all measures for a specific dataset and save them into the temp_data_dict under the key
                # 'measures'
                for i, measurement_id in enumerate(measurement_ids):

                    # Retrieve the measure value for a specific measurement
                    value = Measures.objects \
                        .filter(greenhouse_data_id=data_set.id,
                                measurement_id=measurement_id) \
                        .values('measure_value')[0]['measure_value']
                    temp_measures_data_dict[measurement_names[i]] = value

                temp_data_dict['measures'] = temp_measures_data_dict

                # Retrieve all selections for a specific dataset and save them into the temp_data_dict under the key
                # 'selections'
                selections = Selections.objects.filter(greenhouse_data_id=data_set.id)
                try:
                    # Iterate through every option group and save all selected options in temp_option_list
                    for option_group in option_groups:
                        # Create a list to store all selected options for one option group of one data_set
                        temp_option_list = []
                        options = Options.objects.filter(option_group_id=option_group.id)

                        # Iterate through every option of one option group and save the name and amount
                        # in temp_option_dict
                        for i, option in enumerate(options):
                            temp_option_dict = dict()

                            # Retrieve the selection for the current option
                            selection = Selections.objects\
                                .filter(greenhouse_data_id=data_set.id,
                                        option_id=option.id)

                            # If the user has selected the option for the option group then it is saved into the
                            # temp_option_dict
                            if selection.exists():
                                temp_option_dict['name'] = option.option_value
                                selection_amount = selection.values('amount')[0]['amount']
                                if selection_amount is not None:
                                    temp_option_dict['amount'] = selection_amount

                                # Append the current selected option to the temp_option_list
                                temp_option_list.append(temp_option_dict)

                        if temp_option_list is not []:
                            # Add one entry in the temp_selections_data_dict containing all selected options
                            # for one option group
                            temp_selections_data_dict[option_group.option_group_name] = temp_option_list

                    temp_data_dict['selections'] = temp_selections_data_dict
                    temp_data_set_list.append(temp_data_dict)

                except IndexError:
                    return Response({'No Content': 'No data for given parameters found'},
                                    status=status.HTTP_204_NO_CONTENT)

            # Add all greenhouse_data for one greenhouse to the temp_data_set_list
            temp_greenhouse_dict['greenhouseDatasets'] = temp_data_set_list
            response_data.append(temp_greenhouse_dict)

        return Response(response_data, status=status.HTTP_200_OK)


class GetCalculatedGreenhouseData(APIView):
    """API endpoint for retrieving calculated GreenhouseData out of the results table
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns the calculated data which got requested.
            Either
                - co2FootprintData
                - waterUsageData
                - benchmarkData

        Args:
            request : Query parameter userId and dataType

        Returns:
            json: The calculated data requested
        """
        response_data = []

        # read url query parameters
        user_id = request.GET.get('userId', None)
        # data_type is needed for selecting the correct data to return
        data_type = request.GET.get('dataType', None)

        if user_id is None or data_type is None:
            return Response({'Bad Request': 'Query Parameter missing'},
                            status=status.HTTP_400_BAD_REQUEST)

        # map the requested datatype to the correct calculation_names in the calculations table
        map_data_type = {
            'co2FootprintData': (
                'gwh_konstruktion', 'energietraeger', 'strom', 'co2_zudosierung', 'duengemittel', 'psm_insgesamt', 'verbrauchsmaterialien', 'jungpflanzen', 'verpackung', 'transport'),
            'waterUsageData': 'water_usage',
            'benchmarkData': 'benchmark'
        }
        calculation_names = map_data_type.get(data_type, None)
        if calculation_names is None:
            return Response({'Bad Request': 'Wrong dataType'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Retrieve all calculations and the specific calculation_ids for the requested calculation_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in calculation_names]

        greenhouses = Greenhouses.objects.filter(user_id=user_id)
        if not greenhouses.exists():
            return Response({'Bad Request': 'This user has no greenhouse'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Iterate through every greenhouse of the user, retrieve the calculation results
        # and store them in a defined dictionary/list structure
        for greenhouse in greenhouses:

            temp_greenhouse_dict = dict()
            temp_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            temp_data_set_list = []

            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            if not greenhouse_data.exists():
                return Response({'Bad Request': 'A greenhouse has no greenhouse data'},
                                status=status.HTTP_400_BAD_REQUEST)
            # Retrieve the result_values for every data_set of a greenhouse and store them in the temp_data_set_list
            try:
                for data_set in greenhouse_data:
                    temp_data_dict = dict()
                    temp_data_dict['label'] = data_set.date

                    for i, calculation_id in enumerate(calculation_ids):
                        value = Results.objects \
                            .filter(greenhouse_data_id=data_set.id,
                                    calculation_id=calculation_id) \
                            .values('result_value')[0]['result_value']

                        temp_data_dict[calculation_names[i]] = value

                    temp_data_set_list.append(temp_data_dict)
                temp_greenhouse_dict['greenhouseDatasets'] = temp_data_set_list
                response_data.append(temp_greenhouse_dict)
            except IndexError:
                return Response({'No Content': 'No data for given parameters found'},
                                status=status.HTTP_204_NO_CONTENT)
        return Response(response_data, status=status.HTTP_200_OK)


class GetOptionGroupValues(APIView):
    """API endpoint for retrieving the dropdown values that a user can select
    when entering his data for all categorical measurement variables.
    For example: "Energietraeger": Erdgas | Heizoel | ...
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns the dropdown values for all categorical
        measurement variables.

        Args:
            request : No query parameters needed

        Returns:
            json: dropdown values for all categorical measurement variables
        """
        data = dict()
        option_groups = OptionGroups.objects.all()
        if len(option_groups) > 0:
            for option_group in option_groups:
                option_group_values = Options.objects.filter(
                    option_group_id=option_group.id
                )
                options = list()  # storing all options for one option_group
                for option_group_value in option_group_values:
                    option = dict()
                    option["id"] = option_group_value.id
                    option["values"] = option_group_value.option_value
                    options.append(option)
                data[option_group.option_group_name.replace(" ", "")] = options
        else:
            return Response({"Bad Request": "No data in database"},
                            status=status.HTTP_204_NO_CONTENT)

        return Response(data, status=status.HTTP_200_OK)


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

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            # Validate that every required field has been filled out with not a default value
            if validate_greenhouse_data(data=serializer.data) is False:
                return Response({'Bad Request': 'Not all fields have been filled out!'},
                                status=status.HTTP_400_BAD_REQUEST)



            # Does the given greenhouse already exist?
            greenhouse = Greenhouses.objects.filter(
                user_id=user_id,
                greenhouse_name=serializer.data.get('greenhouse_name')
            )
            if len(greenhouse) == 0:
                # Generate a new greenhouse:
                greenhouse = Greenhouses(
                    user_id=user_id,
                    greenhouse_name=serializer.data.get('greenhouse_name')
                )
                greenhouse.save()
            else:
                # if a greenhouse exist, take the object out of the query set:
                greenhouse = greenhouse[0]

            greenhouse_data = GreenhouseData(
                greenhouse_id=greenhouse.id,
                date=serializer.data.get('date')
            )
            greenhouse_data.save()

            # retrieve 'Measurements' table as dict to map measurement_name to
            # measurement_id
            measurements = Measurements.objects.in_bulk(
                field_name='measurement_name')  # transform table to a dict
            options = OptionGroups.objects.in_bulk(
                field_name='option_group_name')

            for name, value in serializer.data.items():
                if name in measurements:
                    # metric (continuous) data (=> numbers)
                    Measures(
                        greenhouse_data=greenhouse_data,
                        measurement_id=measurements[name].id,
                        measure_value=value
                    ).save()
                elif name in options:
                    # categorical data (e.g. through dropdowns)
                    for elem in value:
                        # check if an amount is declared
                        amount = None
                        value2 = None
                        if len(elem) == 2:
                            amount = elem[1]
                        if len(elem) == 3:
                            amount = elem[1]
                            value2 = elem[2]
                        Selections(
                            greenhouse_data=greenhouse_data,
                            option_id=elem[0],
                            amount=amount,
                            value2=value2
                        ).save()

            calculation_result = algorithms.calc_co2_footprint(serializer.data)
            calculation_variables = Calculations.objects.in_bulk(
                field_name='calculation_name')
            for variable, value in calculation_result.items():
                Results(
                    greenhouse_data=greenhouse_data,
                    result_value=value,
                    calculation_id=calculation_variables[variable].id
                ).save()
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
