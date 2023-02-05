from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import GreenhouseData, Measurements, Measures, Selections, \
    OptionGroups, Options, Greenhouses


class GetDatasets(APIView):
    """API endpoint for retrieving all datasets of every greenhouse from a user.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Returns all data sets for every greenhouse from a user.

        This endpoint iterates through the Measures and Selections tables and retrieves all data.
        It maps the data into a suitable structure to be parsed into json format and sends it.

        Args:
            request: user object

        Returns:
            json: [
                {
                    greenhouse_specs: "[<greenhouse_id>,<greenhouse_name>]",
                    greenhouse_datasets: [
                        {
                            greenhouse_data_id: <dataset-id>,
                            <all measures and selections>
                        },
                        ...
                    ]
                },
                ...
            ]
        """

        user_id = self.request.user.id
        if user_id is None:
            print("GetDatasets: invalid user")
            return Response({'Error': 'No valid user'},
                            status=status.HTTP_400_BAD_REQUEST)

        # retrieve all measurement_ids and measurement_names
        all_measurements = Measurements.objects.all()
        measurement_ids = [all_measurements.values('id')[i]['id'] for i in range(len(all_measurements))]
        measurement_names = [all_measurements.values('measurement_name')[i]['measurement_name'] for i in
                             range(len(all_measurements))]

        all_options = Options.objects.all()
        all_optiongroups = OptionGroups.objects.all()
        greenhouses = Greenhouses.objects.filter(user_id=user_id)

        response_data = []
        if not greenhouses.exists():
            print("GetDatasets: no greenhouse for user")
            return Response({'Error': 'No greenhouse exists for this user'},
                            status=status.HTTP_204_NO_CONTENT)

        # iterate through every greenhouse, retrieve all the data for it and save it in the correct
        # dictionary/list structure
        for greenhouse in greenhouses:
            # retrieve all data sets for one greenhouse
            temp_greenhouse_dict = dict()
            temp_greenhouse_dict["greenhouse_specs"] = f"[{greenhouse.id},{greenhouse.greenhouse_name}]"
            greenhouse_datasets = GreenhouseData.objects.filter(greenhouse_id=greenhouse.id)
            temp_data_set_list = []
            if not greenhouse_datasets.exists():
                print("GetDatasets: no data set for greenhouse")
                return Response({'Error': 'No data set exists for a greenhouse of this user'},
                                status=status.HTTP_204_NO_CONTENT)

            for greenhouse_dataset in greenhouse_datasets:
                # iterate through the data set, retrieve all measures and selections and save them
                # in the correct json structure

                # create a dictionary to store all the data for one data set of one greenhouse in it
                temp_data_set_dict = dict()

                # add the greenhouse_name and date to the dict manually, because it isn't saved in measurements
                temp_data_set_dict["greenhouse_data_id"] = f"[{greenhouse_dataset.id}]"
                temp_data_set_dict["greenhouse_name"] = f"[{greenhouse.greenhouse_name}]"
                temp_data_set_dict["date"] = f"[{greenhouse_dataset.date}]"

                # retrieve all measures for a specific data set and save them into
                # the temp_data_dict under the key 'measures'
                for i, measurement_id in enumerate(measurement_ids):
                    # retrieve the measure value for a specific measurement
                    measure = Measures.objects \
                        .filter(greenhouse_data_id=greenhouse_dataset.id,
                                measurement_id=measurement_id)[0]
                    temp_data_set_dict[measurement_names[i]] = \
                        f"[{measure.measure_value},{measure.measure_unit.id}]"

                # retrieve all selections for a specific data set and save them into the temp_data_dict
                # under the key 'selections'
                selections = Selections.objects.filter(greenhouse_data_id=greenhouse_dataset.id)
                try:
                    # iterate through every option group and save all selected options in temp_option_list
                    for option_group in all_optiongroups:
                        # create a list to store all selected options for one option group of one data set
                        option_group_tuple = "[["
                        options = all_options.filter(option_group_id=option_group.id)

                        # iterate through every option of one option group and save the name and value
                        # in temp_option_dict
                        for i, option in enumerate(options):

                            # retrieve the selection for the current option
                            selection = selections.filter(option_id=option.id)

                            # if the user has selected the option for the option group then it is saved into the
                            # temp_option_dict
                            if selection.exists():

                                selection = selection[0]

                                # add a comma between every tuple in the list
                                if option_group_tuple != "[[":
                                    option_group_tuple = option_group_tuple + ",["

                                if selection.selection_value is not None and selection.selection_unit_id is not None:
                                    option_group_tuple = option_group_tuple + f"{selection.option_id},{selection.selection_value},{selection.selection_unit_id}"

                                    if selection.selection_value2 is not None:
                                        option_group_tuple = option_group_tuple + "," + str(selection.selection_value2)

                                else:
                                    option_group_tuple = option_group_tuple + str(selection.option_id)

                                option_group_tuple = option_group_tuple + "]"

                        if option_group_tuple == "[[":
                            option_group_tuple = option_group_tuple + "null]"

                        option_group_tuple = option_group_tuple + "]"
                        temp_data_set_dict[option_group.option_group_name] = option_group_tuple

                except IndexError:
                    print("GetDatasets: no data found")
                    return Response({'Error': 'No data for given parameters found'},
                                    status=status.HTTP_204_NO_CONTENT)

                # add all data sets for one greenhouse to the temp_data_set_list
                temp_data_set_list.append(temp_data_set_dict)
            temp_greenhouse_dict["greenhouse_datasets"] = temp_data_set_list
            response_data.append(temp_greenhouse_dict)

        print("GetDatasets: request success")
        return Response(response_data, status=status.HTTP_200_OK)
