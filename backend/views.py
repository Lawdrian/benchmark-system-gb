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
    OptionGroups, Options, Greenhouses, Calculations, Results, MeasurementUnits, OptionUnits
from .serializers import InputDataSerializer
from .standardizeUnits import standardize_units


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
        total_response_data = []
        normalized_response_data = []
        fruitsize_response_data = []
        benchmark_response_data = []
        response_data = dict()

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
                "konstruktion_co2",
                "energieschirm_co2",
                "bodenabdeckung_co2",
                "kultursystem_co2",
                "transportsystem_co2",
                "zusaetzliches_heizsystem_co2",
                "energietraeger_co2",
                "strom_co2",
                "co2_zudosierung_co2",
                "duengemittel_co2",
                "psm_co2",
                "nuetzlinge_co2",
                "pflanzenbehaelter_co2",
                "substrat_co2",
                "jungpflanzen_substrat_co2",
                "jungpflanzen_transport_co2",
                "schnuere_co2",
                "klipse_co2",
                "rispenbuegel_co2",
                "bewaesserung_co2",
                "verpackung_co2",
                "sonstige_verbrauchsmaterialien_co2",
                "transport_co2",
                "zusaetzlicher_machineneinsatz_co2"),
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

            total_greenhouse_dict = dict()
            normalized_greenhouse_dict = dict()
            fruitsize_greenhouse_dict = dict()
            benchmark_greenhouse_dict = dict()
            total_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            normalized_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            fruitsize_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            benchmark_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            total_data_set_list = []
            normalized_data_set_list = []
            benchmark_data_set_list = []

            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            if not greenhouse_data.exists():
                return Response({'Bad Request': 'A greenhouse has no greenhouse data'},
                                status=status.HTTP_400_BAD_REQUEST)
            # Retrieve the result_values for every data_set of a greenhouse and store them in the total_data_set_list
            try:
                for data_set in greenhouse_data:
                    total_data_dict = dict()
                    normalized_data_dict = dict()
                    total_data_dict['label'] = data_set.date
                    normalized_data_dict['label'] = data_set.date

                    # Ertrag
                    snack_ertrag_id = Measurements.objects.get(measurement_name="SnackErtragJahr")
                    snack_ertrag = Measures.objects \
                        .get(greenhouse_data_id=data_set.id,
                             measurement_id=snack_ertrag_id
                             ).measure_value
                    cocktail_ertrag_id = Measurements.objects.get(measurement_name="CocktailErtragJahr")
                    cocktail_ertrag = Measures.objects \
                        .get(greenhouse_data_id=data_set.id,
                             measurement_id=cocktail_ertrag_id
                             ).measure_value
                    rispen_ertrag_id = Measurements.objects.get(measurement_name="RispenErtragJahr")
                    rispen_ertrag = Measures.objects \
                        .get(greenhouse_data_id=data_set.id,
                             measurement_id=rispen_ertrag_id
                             ).measure_value
                    fleisch_ertrag_id = Measurements.objects.get(measurement_name="FleischErtragJahr")
                    fleisch_ertrag = Measures.objects \
                        .get(greenhouse_data_id=data_set.id,
                             measurement_id=fleisch_ertrag_id
                             ).measure_value

                    total_ertrag = snack_ertrag+cocktail_ertrag+rispen_ertrag+fleisch_ertrag

                    for i, calculation_id in enumerate(calculation_ids):
                        value = Results.objects \
                            .filter(greenhouse_data_id=data_set.id,
                                    calculation_id=calculation_id) \
                            .values('result_value')[0]['result_value']

                        total_data_dict[calculation_names[i]] = value
                        normalized_data_dict[calculation_names[i]] = value / total_ertrag

                    total_data_set_list.append(total_data_dict)
                    normalized_data_set_list.append(normalized_data_dict)

                # Append only the most recent dataset to the benchmark_data_set_list
                benchmark_data_set_list.append(normalized_data_set_list[len(normalized_data_set_list)-1])
                # Check what production type the most recent dataset uses
                if len(greenhouse_data) != 0:
                    recent_dataset = greenhouse_data[len(greenhouse_data)-1]
                    biologic_id = Options.objects.filter(option_value="Biologisch")[0]
                    conventional_id = Options.objects.filter(option_value="Konventionell")[0]

                    biologic = Selections.objects.filter(greenhouse_data_id=recent_dataset).filter(option_id=biologic_id)
                    if biologic.exists():
                        recent_dataset_is_biologic = True
                        print("Aktuellster Datensatz ist Biologisch")
                    else:
                        recent_dataset_is_biologic = False
                        print("Aktuellster Datensatz ist Konventionell")

                    # Retrieve the result_values of the high performer and append them to total_response_data (Using normalized data)
                    co2_footprint_id = Calculations.objects.get(calculation_name="co2_footprint_norm").id
                    found_correct_high_performer = False
                    high_performers = Results.objects.filter(calculation_id=co2_footprint_id).order_by('result_value') # Sort from min to max
                    index = 0
                    high_performer_id = 1
                    while found_correct_high_performer is False and index < len(high_performers):
                        print(high_performers[index].greenhouse_data_id)
                        high_performer_id = high_performers[index].greenhouse_data_id
                        high_performer_biologic = Selections.objects.filter(
                            greenhouse_data_id=high_performer_id).filter(option_id=biologic_id)
                        high_performer_conventional = Selections.objects.filter(
                            greenhouse_data_id=high_performer_id).filter(option_id=conventional_id)
                        if recent_dataset_is_biologic and high_performer_biologic.exists():
                            found_correct_high_performer = True
                            print("High Performer ist Biologisch")
                        elif recent_dataset_is_biologic is False and high_performer_conventional.exists():
                            found_correct_high_performer = True
                            print("High Performer ist Konventionell")

                        index = index + 1

                    high_performer_dataset = GreenhouseData.objects.filter(id=high_performer_id)

                    if high_performer_dataset.exists():
                        high_performer_normalized_dict = dict()
                        if recent_dataset_is_biologic:
                            high_performer_normalized_dict['label'] = "Best Performer Biologisch"
                        else:
                            high_performer_normalized_dict['label'] = "Best Performer Konventionell"

                        # Ertrag
                        snack_ertrag_id = Measurements.objects.get(measurement_name="SnackErtragJahr")
                        snack_ertrag = Measures.objects \
                            .get(greenhouse_data_id=high_performer_dataset[0].id,
                                 measurement_id=snack_ertrag_id
                                 ).measure_value
                        cocktail_ertrag_id = Measurements.objects.get(measurement_name="CocktailErtragJahr")
                        cocktail_ertrag = Measures.objects \
                            .get(greenhouse_data_id=high_performer_dataset[0].id,
                                 measurement_id=cocktail_ertrag_id
                                 ).measure_value
                        rispen_ertrag_id = Measurements.objects.get(measurement_name="RispenErtragJahr")
                        rispen_ertrag = Measures.objects \
                            .get(greenhouse_data_id=high_performer_dataset[0].id,
                                 measurement_id=rispen_ertrag_id
                                 ).measure_value
                        fleisch_ertrag_id = Measurements.objects.get(measurement_name="FleischErtragJahr")
                        fleisch_ertrag = Measures.objects \
                            .get(greenhouse_data_id=high_performer_dataset[0].id,
                                 measurement_id=fleisch_ertrag_id
                                 ).measure_value

                        total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                        for i, calculation_id in enumerate(calculation_ids):
                            value = Results.objects \
                                .filter(greenhouse_data_id=high_performer_dataset[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            high_performer_normalized_dict[calculation_names[i]] = value / total_ertrag

                        normalized_data_set_list.append(high_performer_normalized_dict)
                        benchmark_data_set_list.append(high_performer_normalized_dict)

                    # Benchmark Plot Data: Get low performer
                    index = len(high_performers)-1
                    low_performer_id = 1
                    found_correct_low_performer = False
                    while found_correct_low_performer is False and index >= 0:
                        low_performer_id = high_performers[index].greenhouse_data_id
                        low_performer_biologic = Selections.objects.filter(
                            greenhouse_data_id=low_performer_id).filter(option_id=biologic_id)
                        low_performer_conventional = Selections.objects.filter(
                            greenhouse_data_id=low_performer_id).filter(option_id=conventional_id)
                        if recent_dataset_is_biologic and low_performer_biologic.exists():
                            found_correct_low_performer = True
                            print("Low Performer ist Biologisch")
                        elif recent_dataset_is_biologic is False and low_performer_conventional.exists():
                            found_correct_low_performer = True
                            print("Low Performer ist Konventionell")

                        index = index - 1

                    low_performer_dataset = GreenhouseData.objects.filter(id=low_performer_id)

                    if low_performer_dataset.exists():
                        low_performer_benchmark_dict = dict()
                        if recent_dataset_is_biologic:
                            low_performer_benchmark_dict['label'] = "Worst Performer Biologisch"
                        else:
                            low_performer_benchmark_dict['label'] = "Worst Performer Konventionell"

                        # Ertrag
                        snack_ertrag_id = Measurements.objects.get(measurement_name="SnackErtragJahr")
                        snack_ertrag = Measures.objects \
                            .get(greenhouse_data_id=low_performer_dataset[0].id,
                                 measurement_id=snack_ertrag_id
                                 ).measure_value
                        cocktail_ertrag_id = Measurements.objects.get(measurement_name="CocktailErtragJahr")
                        cocktail_ertrag = Measures.objects \
                            .get(greenhouse_data_id=low_performer_dataset[0].id,
                                 measurement_id=cocktail_ertrag_id
                                 ).measure_value
                        rispen_ertrag_id = Measurements.objects.get(measurement_name="RispenErtragJahr")
                        rispen_ertrag = Measures.objects \
                            .get(greenhouse_data_id=low_performer_dataset[0].id,
                                 measurement_id=rispen_ertrag_id
                                 ).measure_value
                        fleisch_ertrag_id = Measurements.objects.get(measurement_name="FleischErtragJahr")
                        fleisch_ertrag = Measures.objects \
                            .get(greenhouse_data_id=low_performer_dataset[0].id,
                                 measurement_id=fleisch_ertrag_id
                                 ).measure_value

                        total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                        for i, calculation_id in enumerate(calculation_ids):
                            value = Results.objects \
                                .filter(greenhouse_data_id=low_performer_dataset[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            low_performer_benchmark_dict[calculation_names[i]] = value / total_ertrag

                        benchmark_data_set_list.append(low_performer_benchmark_dict)

                total_greenhouse_dict['greenhouseDatasets'] = total_data_set_list
                normalized_greenhouse_dict['greenhouseDatasets'] = normalized_data_set_list
                benchmark_greenhouse_dict['greenhouseDatasets'] = benchmark_data_set_list
                total_response_data.append(total_greenhouse_dict)
                normalized_response_data.append(normalized_greenhouse_dict)
                benchmark_response_data.append(benchmark_greenhouse_dict)

                # Fruit Size Plot Data:
                recent_dataset = greenhouse_data[len(greenhouse_data)-1]
                fruitsize_data_set_list = []
                fruitsizes = ["Snack", "Cocktail", "Rispen", "Fleisch"]
                fruitunit = ["10-30Gramm", "30-100Gramm", "100-150Gramm", ">150Gramm"]

                # Calculate the total amount of rows
                total_reihenanzahl = 0
                for fruit in fruitsizes:
                    fruit_reihenanzahl_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
                    total_reihenanzahl = total_reihenanzahl + Measures.objects \
                        .get(greenhouse_data_id=recent_dataset.id,
                             measurement_id=fruit_reihenanzahl_id
                             ).measure_value

                for index, fruit in enumerate(fruitsizes):
                    fruitsize_data_dict = dict()
                    fruitsize_data_dict['label'] = fruitunit[index]
                    fruit_reihenanzahl_id = Measurements.objects.get(measurement_name=fruit+"Reihenanzahl")
                    fruit_reihenanzahl = Measures.objects \
                        .get(greenhouse_data_id=recent_dataset.id,
                             measurement_id=fruit_reihenanzahl_id
                             ).measure_value

                    fruit_ertrag_id = Measurements.objects.get(measurement_name=fruit + "ErtragJahr")
                    fruit_ertrag = Measures.objects \
                        .get(greenhouse_data_id=recent_dataset.id,
                             measurement_id=fruit_ertrag_id
                             ).measure_value

                    for i, calculation_id in enumerate(calculation_ids):
                        value = Results.objects \
                            .filter(greenhouse_data_id=recent_dataset.id,
                                    calculation_id=calculation_id) \
                            .values('result_value')[0]['result_value']
                        if fruit_ertrag != 0.000:
                            fruitsize_data_dict[calculation_names[i]] = value * (fruit_reihenanzahl/total_reihenanzahl) / fruit_ertrag
                        else:
                            fruitsize_data_dict[calculation_names[i]] = 0
                    fruitsize_data_set_list.append(fruitsize_data_dict)
                fruitsize_greenhouse_dict['greenhouseDatasets'] = fruitsize_data_set_list
                fruitsize_response_data.append(fruitsize_greenhouse_dict)

            except IndexError:
                return Response({'No Content': 'No data for given parameters found'},
                                status=status.HTTP_204_NO_CONTENT)
        response_data["total"] = total_response_data
        response_data["normalized"] = normalized_response_data
        response_data["fruitsize"] = fruitsize_response_data
        response_data["benchmark"] = benchmark_response_data
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


class GetUnitValues(APIView):
    """API endpoint for retrieving the unit values that a user can select
    when entering his data for into a field. This counts for both measures and selections
    For example: "alterGWH": kwh | kg | ...
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns the unit values for all input fields.

        Args:
            request : No query parameters needed

        Returns:
            json: unit values (id and name)
        """
        data = dict()
        all_measurement_units = MeasurementUnits.objects.all()
        measurements = Measurements.objects.all()
        all_options = Options.objects.all()
        all_option_units = OptionUnits.objects.all()
        all_option_groups = OptionGroups.objects.all()

        # Add all measurement units to the json object
        if len(measurements) > 0:
            measures = dict()
            for measurement in measurements:

                measurement_units = all_measurement_units.filter(measurement_id=measurement.id)
                units = list()  # storing all units for one measurement
                for measurent_unit in measurement_units:
                    unit = dict()
                    unit["id"] = measurent_unit.id
                    unit["values"] = measurent_unit.unit_name
                    units.append(unit)
                measures[measurement.measurement_name.replace(" ", "")] = units
            data["measures"] = measures
        else:
            return Response({"Bad Request": "No data in database"},
                            status=status.HTTP_204_NO_CONTENT)

        # Add all option units to the json object
        if len(all_option_groups) > 0:
            selections = dict()
            for option_group in all_option_groups:
                option_group_dict = dict()
                options = all_options.filter(option_group_id=option_group.id)
                if len(options) > 0:
                    for option in options:
                        option_list = list()
                        option_units = all_option_units.filter(option_id=option.id)
                        for option_unit in option_units:
                            option_unit_dict = dict()
                            option_unit_dict["id"] = option_unit.id
                            option_unit_dict["values"] = option_unit.unit_name
                            option_list.append(option_unit_dict)
                        option_group_dict[option.option_value.replace(" ", "")] = option_list
                        selections[option_group.option_group_name.replace(" ", "")] = option_group_dict
            data["selections"] = selections
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

        print("Post Begin!!!")

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("IsVALID!!!")
            # Validate that every required field has been filled out with not a default value
            if validate_greenhouse_data(data=serializer.data) is False:
                return Response({'Bad Request': 'Not all fields have been filled out!'},
                                status=status.HTTP_400_BAD_REQUEST)

            print("Data")
            print(serializer.data["GWHFlaeche"][0])
            print(serializer.data["Energietraeger"])
            processed_data = standardize_units(serializer.data)
            print(processed_data["Energietraeger"])
            # Does the given greenhouse already exist?
            greenhouse = Greenhouses.objects.filter(
                user_id=user_id,
                greenhouse_name=processed_data.get('greenhouse_name')
            )
            if len(greenhouse) == 0:
                # Generate a new greenhouse:
                greenhouse = Greenhouses(
                    user_id=user_id,
                    greenhouse_name=processed_data.get('greenhouse_name')
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

            # calculate co2 footprint
            calculation_result = algorithms.calc_co2_footprint(processed_data)
            calculation_variables = Calculations.objects.in_bulk(
                field_name='calculation_name')
            for variable, value in calculation_result.items():
                Results(
                    greenhouse_data=greenhouse_data,
                    result_value=value,
                    calculation_id=calculation_variables[variable].id,
                ).save()

            # retrieve 'Measurements' table as dict to map measurement_name to
            # measurement_id
            measurements = Measurements.objects.in_bulk(
                field_name='measurement_name')  # transform table to a dict
            options = OptionGroups.objects.in_bulk(
                field_name='option_group_name')

            for name, value in processed_data.items():
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
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class GetDatasets(APIView):
    """API endpoint for retrieving the most recent dataset for every greenhouse a user owns
    """


    def get(self, request, format=None):
        """
        Args:
            request: user id as query parameter

        Returns:
            response_data: most recent greenhouse data for every greenhouse in json format
        """
        # Read Url query parameters
        user_id = request.GET.get('userId', None)

        if user_id is None:
            return Response({'Bad Request': 'Query Parameter missing'}, status=status.HTTP_400_BAD_REQUEST)

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
                greenhouse_datasets = GreenhouseData.objects.filter(
                    greenhouse_id=greenhouse.id)
                if greenhouse_datasets.exists():
                    greenhouse_data = greenhouse_datasets[len(greenhouse_datasets)-1]
                    # Iterate through the greenhouse data, retrieve all measures and selections and save them
                    # in the correct json structure

                    # Create a dictionary to store all the data for one data_set of one greenhouse in it
                    temp_data_dict = dict()

                    # Add the greenhouse_name and date to the dict manually, because it isn't saved in measurements
                    temp_data_dict["greenhouse_name"] = "[" + str(greenhouse.id) + "," + greenhouse.greenhouse_name + "]"
                    temp_data_dict["date"] = "[" + str(greenhouse_data.date) + "]"

                    # Retrieve all measures for a specific dataset and save them into the temp_data_dict under the key
                    # 'measures'
                    for i, measurement_id in enumerate(measurement_ids):
                        # Retrieve the measure value for a specific measurement
                        measure = Measures.objects \
                            .filter(greenhouse_data_id=greenhouse_data.id,
                                    measurement_id=measurement_id)[0]

                        temp_data_dict[measurement_names[i]] = "[" + str(measure.measure_value) + "," + str(measure.measure_unit.id) + "]"

                    # Retrieve all selections for a specific dataset and save them into the temp_data_dict
                    # under the key 'selections'
                    selections = Selections.objects.filter(greenhouse_data_id=greenhouse_data.id)
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
                                        option_group_tuple = option_group_tuple + str(selection.option_id) + "," + str(selection.amount) + "," + str(selection.selection_unit_id)

                                        if selection.value2 is not None:
                                            option_group_tuple = option_group_tuple + "," + str(selection.value2)

                                    else:
                                        option_group_tuple = option_group_tuple + str(selection.option_id)

                                    option_group_tuple = option_group_tuple + "]"

                            if option_group_tuple == "[[":
                                option_group_tuple = option_group_tuple + "null]"

                            option_group_tuple = option_group_tuple + "]"
                            temp_data_dict[option_group.option_group_name] = option_group_tuple

                    except IndexError:
                        return Response({'No Content': 'No data for given parameters found'},
                                        status=status.HTTP_204_NO_CONTENT)

                    # Add all greenhouse_data for one greenhouse to the temp_data_set_list
                    # and append it to the response data
                    response_data.append(temp_data_dict)
                else:
                    return Response({'No Content': 'No dataset exists for a greenhouse of this user'},
                                        status=status.HTTP_204_NO_CONTENT)

            return Response(response_data, status=status.HTTP_200_OK)

        else:
            return Response({'No Content': 'No greenhouse exists for this user'},
                                status=status.HTTP_204_NO_CONTENT)

