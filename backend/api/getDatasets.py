from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Options, Greenhouses


class GetDatasets(APIView):
    """API endpoint for retrieving the most recent dataset for every greenhouse a user owns
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """
        Args:
            request:

        Returns:
            response_data: most recent greenhouse data for every greenhouse in json format
        """
        user_id = self.request.user.id
        if user_id is None:
            return Response({'Bad Request': 'No valid user!'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Retrieve all measurement_ids and measurement_names
        all_measurements = Measurements.objects.all()
        measurement_ids = [all_measurements.values('id')[i]['id'] for i in range(len(all_measurements))]
        measurement_names = [all_measurements.values('measurement_name')[i]['measurement_name'] for i in
                             range(len(all_measurements))]

        # Retrieve all options
        all_options = Options.objects.all()

        # Retrieve all option groups
        all_optiongroups = OptionGroups.objects.all()

        # Retrieve all greenhouses of a specific user
        greenhouses = Greenhouses.objects.filter(user_id=user_id)

        response_data = []
        if greenhouses.exists():

            # Iterate through every greenhouse, retrieve all the data for it and save it in the correct json structure
            for greenhouse in greenhouses:

                # Retrieve all greenhouse_data for one greenhouse
                temp_greenhouse_dict = dict()
                temp_greenhouse_dict["greenhouse_specs"] = f"[{greenhouse.id},{greenhouse.greenhouse_name}]"
                greenhouse_datasets = GreenhouseData.objects.filter(greenhouse_id=greenhouse.id)
                temp_data_set_list = []
                if greenhouse_datasets.exists():
                    for greenhouse_dataset in greenhouse_datasets:

                        # Iterate through the greenhouse data, retrieve all measures and selections and save them
                        # in the correct json structure

                        # Create a dictionary to store all the data for one data_set of one greenhouse in it
                        temp_data_set_dict = dict()

                        # Add the greenhouse_name and date to the dict manually, because it isn't saved in measurements
                        temp_data_set_dict["greenhouse_data_id"] = f"[{greenhouse_dataset.id}]"
                        temp_data_set_dict["greenhouse_name"] = f"[{greenhouse.greenhouse_name}]"
                        temp_data_set_dict["date"] = f"[{greenhouse_dataset.date}]"

                        # Retrieve all measures for a specific dataset and save them into the temp_data_dict under the key
                        # 'measures'
                        for i, measurement_id in enumerate(measurement_ids):
                            # Retrieve the measure value for a specific measurement
                            measure = Measures.objects \
                                .filter(greenhouse_data_id=greenhouse_dataset.id,
                                        measurement_id=measurement_id)[0]
                            temp_data_set_dict[measurement_names[i]] = f"[{measure.measure_value},{measure.measure_unit.id}]"

                        # Retrieve all selections for a specific dataset and save them into the temp_data_dict
                        # under the key 'selections'
                        selections = Selections.objects.filter(greenhouse_data_id=greenhouse_dataset.id)
                        try:
                            # Iterate through every option group and save all selected options in temp_option_list
                            for option_group in all_optiongroups:
                                # Create a list to store all selected options for one option group of one data_set
                                option_group_tuple = "[["
                                options = all_options.filter(option_group_id=option_group.id)

                                # Iterate through every option of one option group and save the name and amount
                                # in temp_option_dict
                                for i, option in enumerate(options):

                                    # Retrieve the selection for the current option
                                    selection = selections.filter(option_id=option.id)

                                    # If the user has selected the option for the option group then it is saved into the
                                    # temp_option_dict
                                    if selection.exists():

                                        selection = selection[0]

                                        # Add a comma between every tuple in the list
                                        if option_group_tuple != "[[":
                                            option_group_tuple = option_group_tuple + ",["

                                        if selection.amount is not None and selection.selection_unit_id is not None:
                                            option_group_tuple = option_group_tuple + f"{selection.option_id},{selection.amount},{selection.selection_unit_id}"

                                            if selection.value2 is not None:
                                                option_group_tuple = option_group_tuple + "," + str(selection.value2)

                                        else:
                                            option_group_tuple = option_group_tuple + str(selection.option_id)

                                        option_group_tuple = option_group_tuple + "]"

                                if option_group_tuple == "[[":
                                    option_group_tuple = option_group_tuple + "null]"

                                option_group_tuple = option_group_tuple + "]"
                                temp_data_set_dict[option_group.option_group_name] = option_group_tuple

                        except IndexError:
                            return Response({'No Content': 'No data for given parameters found'},
                                            status=status.HTTP_204_NO_CONTENT)


                        # Add all greenhouse_data for one greenhouse to the temp_data_set_list
                        # and append it to the response data
                        temp_data_set_list.append(temp_data_set_dict)
                    temp_greenhouse_dict["greenhouse_datasets"] = temp_data_set_list
                    response_data.append(temp_greenhouse_dict)
                else:
                    return Response({'No Content': 'No dataset exists for a greenhouse of this user'},
                                        status=status.HTTP_204_NO_CONTENT)

            return Response(response_data, status=status.HTTP_200_OK)

        else:
            return Response({'No Content': 'No greenhouse exists for this user'},
                                status=status.HTTP_204_NO_CONTENT)