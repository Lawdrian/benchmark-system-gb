from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Options, Greenhouses


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
        measurement_names = [measurements.values('measurement_name')[i]['measurement_name'] for i in
                             range(len(measurements))]

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
                            selection = Selections.objects \
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
