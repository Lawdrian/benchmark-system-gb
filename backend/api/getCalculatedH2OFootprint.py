from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper import co2Optimization
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    Options, Greenhouses, Calculations, Results, OptionGroups


class GetCalculatedH2OFootprint(APIView):
    """API endpoint for retrieving calculated h2o-footprint out of the results table
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns the calculated h2o-footprint which got requested.

        Args:
            request :

        Returns:
            json: [
                    total_response_data: [],
                    normalizedkg_response_data: [],
                    normalizedm2_response_data: [],
                    fruitsizekg_response_data: [],
                    fruitsizem2_response_data: [],
                    scarcity_indexkg_response_data: [],
                    scarcity_indexm2_response_data: [],
                    benchmarkkg_response_data: [],
                    benchmarkm2_response_data: [],
                    optimization_response_data: [],
            ]
        """
        print("Get calculated h2o-footprint start")
        total_response_data = []
        normalizedkg_response_data = []
        normalizedm2_response_data = []
        fruitsizekg_response_data = []
        fruitsizem2_response_data = []
        directkg_response_data = []
        directm2_response_data = []
        benchmarkkg_response_data = []
        benchmarkm2_response_data = []
        optimization_response_data = []
        response_data = dict()

        user_id = self.request.user.id
        if user_id is None:
            return Response({'Bad Request': 'No valid user!'},
                            status=status.HTTP_400_BAD_REQUEST)

        h2o_footprint_names = [
            "konstruktion_h2o",
            "energieschirm_h2o",
            "bodenabdeckung_h2o",
            "produktionssystem_h2o",
            "bewaesserung_h2o",
            "heizsystem_h2o",
            "zusaetzliches_heizsystem_h2o",
            "energietraeger_h2o",
            "strom_h2o",
            "brunnenwasser_h2o",
            "regenwasser_h2o",
            "stadtwasser_h2o",
            "oberflaechenwasser_h2o",
            "co2_zudosierung_h2o",
            "duengemittel_h2o",
            "psm_h2o",
            "pflanzenbehaelter_h2o",
            "substrat_h2o",
            "jungpflanzen_substrat_h2o",
            "jungpflanzen_transport_h2o",
            "schnuere_h2o",
            "klipse_h2o",
            "rispenbuegel_h2o",
            "verpackung_h2o",
            "sonstige_verbrauchsmaterialien_h2o",
        ]


        # Retrieve all calculations and the specific calculation_ids for the requested calculation_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in h2o_footprint_names]

        all_measurements = Measurements.objects.all()

        greenhouses = Greenhouses.objects.filter(user_id=user_id)
        if not greenhouses.exists():
            return Response({'Bad Request': 'This user has no greenhouse'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Iterate through every greenhouse of the user, retrieve the calculation results
        # and store them in a defined dictionary/list structure
        for greenhouse in greenhouses:

            total_greenhouse_dict = dict()
            normalizedkg_greenhouse_dict = dict()
            normalizedm2_greenhouse_dict = dict()
            fruitsizekg_greenhouse_dict = dict()
            fruitsizem2_greenhouse_dict = dict()
            directkg_greenhouse_dict = dict()
            directm2_greenhouse_dict = dict()
            benchmarkkg_greenhouse_dict = dict()
            benchmarkm2_greenhouse_dict = dict()
            optimization_greenhouse_dict = dict()
            total_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            normalizedkg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            normalizedm2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            fruitsizekg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            fruitsizem2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            directkg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            directm2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            benchmarkkg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            benchmarkm2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            optimization_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name

            benchmarkkg_data_set_list = []
            benchmarkm2_data_set_list = []

            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            if not greenhouse_data.exists():
                return Response({'Bad Request': 'A greenhouse has no greenhouse data'},
                                status=status.HTTP_400_BAD_REQUEST)
            # Retrieve the result_values for every data_set of a greenhouse and store them in the total_data_set_list
            try:
                if len(greenhouse_data) != 0:

                    recent_dataset = greenhouse_data[len(greenhouse_data)-1]
                    recent_dataset_is_biologic = is_productiontype_biologic(recent_dataset)
                    # check if recent dataset doesn't have water footprint
                    water_data_optiongroup = OptionGroups.objects.filter(option_group_name="WasserVerbrauch")
                    if water_data_optiongroup.exists():
                        water_data_option = Options.objects.filter(option_group=water_data_optiongroup[0].id).filter(option_value="ja")
                        if water_data_option.exists():
                            is_water_data = Selections.objects.filter(greenhouse_data=recent_dataset.id).filter(option=water_data_option[0].id)
                            if not is_water_data.exists():
                                print("No water data for recent dataset.")
                                return Response({'Message': 'Keine Wasserdaten angegeben'},
                                                status=status.HTTP_204_NO_CONTENT)
                            print("Water data for recent dataset exists.")

                    # Calculate the plot data for the 3 plots total, normalizedkg and normalizedm2:
                    total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list = calc_total_and_normalized_data(greenhouse_data, all_measurements, calculation_ids, h2o_footprint_names)
                    # Append only the most recent dataset to the benchmarkkg_data_set_list
                    benchmarkkg_data_set_list.append(normalizedkg_data_set_list[len(normalizedkg_data_set_list)-1])
                    benchmarkm2_data_set_list.append(normalizedm2_data_set_list[len(normalizedm2_data_set_list)-1])

                    # ~~ Calculate the normalized plot data for the direct water usage ~~ #
                    direct_h2o_calculation_names = [
                        "brunnenwasser_h2o",
                        "regenwasser_h2o",
                        "stadtwasser_h2o",
                        "oberflaechenwasser_h2o",
                    ]
                    direct_h2o_calculation_ids = [calculations[name] for name in direct_h2o_calculation_names]
                    _, direct_h2o_kg_data_set_list, direct_h2o_m2_data_set_list = calc_total_and_normalized_data(greenhouse_data, all_measurements, direct_h2o_calculation_ids, direct_h2o_calculation_names)

                    # ~ Find the best performer for the direct water usage ~ #
                    direct_h2o_calculation_name_kg = "direct_h2o_footprint_norm_kg"
                    direct_h2o_calculation_name_m2 = "direct_h2o_footprint_norm_m2"
                    direct_h2o_best_performer_kg = find_performer_dataset(recent_dataset_is_biologic, direct_h2o_calculation_name_kg, True)
                    direct_h2o_best_performer_m2 = find_performer_dataset(recent_dataset_is_biologic, direct_h2o_calculation_name_m2, True)

                    if direct_h2o_best_performer_kg is not None and direct_h2o_best_performer_m2 is not None:
                        best_performer_directkg_dict = dict()
                        best_performer_directm2_dict = dict()
                        best_performer_directkg_dict['label'] = "Best Performer"
                        best_performer_directm2_dict['label'] = "Best Performer"
                        directkg_greenhouse_dict['performer_date'] = direct_h2o_best_performer_kg[0].date
                        directm2_greenhouse_dict['performer_date'] = direct_h2o_best_performer_m2[0].date
                        if recent_dataset_is_biologic:
                            directkg_greenhouse_dict['performer_productiontype'] = "Biologisch"
                            directm2_greenhouse_dict['performer_productiontype'] = "Biologisch"
                        else:
                            directkg_greenhouse_dict['performer_productiontype'] = "Konventionell"
                            directm2_greenhouse_dict['performer_productiontype'] = "Konventionell"

                        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
                            direct_h2o_best_performer_kg[0].id,
                            all_measurements)
                        total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

                        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                        gh_size = Measures.objects \
                            .get(greenhouse_data_id=direct_h2o_best_performer_m2[0].id,
                                 measurement_id=gh_size_id
                                 ).measure_value

                        for i, calculation_id in enumerate(direct_h2o_calculation_ids):
                            value_kg = Results.objects \
                                .filter(greenhouse_data_id=direct_h2o_best_performer_kg[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            value_m2 = Results.objects \
                                .filter(greenhouse_data_id=direct_h2o_best_performer_m2[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            best_performer_directkg_dict[direct_h2o_calculation_names[i]] = value_kg / total_harvest
                            best_performer_directm2_dict[direct_h2o_calculation_names[i]] = value_m2 / gh_size

                        direct_h2o_kg_data_set_list.append(best_performer_directkg_dict)
                        direct_h2o_m2_data_set_list.append(best_performer_directm2_dict)
                    else:
                        print("Did not find best performer for direct waterusage")

                    # ~~ Find the best performer for the normalized plot data ~~ #
                    calculation_name_kg = "h2o_footprint_norm_kg"
                    calculation_name_m2 = "h2o_footprint_norm_m2"
                    best_performer_dataset_kg = find_performer_dataset(recent_dataset_is_biologic, calculation_name_kg, True)
                    best_performer_dataset_m2 = find_performer_dataset(recent_dataset_is_biologic, calculation_name_m2, True)

                    if best_performer_dataset_kg is not None and best_performer_dataset_m2 is not None:
                        best_performer_normalizedkg_dict = dict()
                        best_performer_normalizedm2_dict = dict()
                        best_performer_normalizedkg_dict['label'] = "Best Performer"
                        best_performer_normalizedm2_dict['label'] = "Best Performer"
                        normalizedkg_greenhouse_dict['performer_date'] = best_performer_dataset_kg[0].date
                        normalizedm2_greenhouse_dict['performer_date'] = best_performer_dataset_m2[0].date
                        benchmarkkg_greenhouse_dict['performer_date'] = best_performer_dataset_kg[0].date
                        benchmarkm2_greenhouse_dict['performer_date'] = best_performer_dataset_m2[0].date
                        if recent_dataset_is_biologic:
                            normalizedkg_greenhouse_dict['performer_productiontype'] = "Biologisch"
                            normalizedm2_greenhouse_dict['performer_productiontype'] = "Biologisch"
                            benchmarkkg_greenhouse_dict['performer_productiontype'] = "Biologisch"
                            benchmarkm2_greenhouse_dict['performer_productiontype'] = "Biologisch"
                        else:
                            normalizedkg_greenhouse_dict['performer_productiontype'] = "Konventionell"
                            normalizedm2_greenhouse_dict['performer_productiontype'] = "Konventionell"
                            benchmarkkg_greenhouse_dict['performer_productiontype'] = "Konventionell"
                            benchmarkm2_greenhouse_dict['performer_productiontype'] = "Konventionell"

                        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(best_performer_dataset_kg[0].id,
                                                                                                       all_measurements)
                        total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

                        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                        gh_size = Measures.objects \
                            .get(greenhouse_data_id=best_performer_dataset_m2[0].id,
                                 measurement_id=gh_size_id
                                 ).measure_value

                        for i, calculation_id in enumerate(calculation_ids):
                            value_kg = Results.objects \
                                .filter(greenhouse_data_id=best_performer_dataset_kg[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            value_m2 = Results.objects \
                                .filter(greenhouse_data_id=best_performer_dataset_m2[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            best_performer_normalizedkg_dict[h2o_footprint_names[i]] = value_kg / total_harvest
                            best_performer_normalizedm2_dict[h2o_footprint_names[i]] = value_m2 / gh_size

                        normalizedkg_data_set_list.append(best_performer_normalizedkg_dict)
                        normalizedm2_data_set_list.append(best_performer_normalizedm2_dict)
                        benchmarkkg_data_set_list.append(best_performer_normalizedkg_dict)
                        benchmarkm2_data_set_list.append(best_performer_normalizedm2_dict)

                        # Benchmark Plot Data: Get worst performer
                        worst_performer_dataset_kg = find_performer_dataset(recent_dataset_is_biologic, calculation_name_kg, False)
                        worst_performer_dataset_m2 = find_performer_dataset(recent_dataset_is_biologic, calculation_name_m2, False)

                        if worst_performer_dataset_kg is not None and worst_performer_dataset_m2 is not None:
                            worst_performer_benchmarkkg_dict = dict()
                            worst_performer_benchmarkm2_dict = dict()
                            worst_performer_benchmarkkg_dict['label'] = "Worst Performer"
                            worst_performer_benchmarkm2_dict['label'] = "Worst Performer"

                            snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(worst_performer_dataset_kg[0].id, all_measurements)

                            total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

                            gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                            gh_size = Measures.objects \
                                .get(greenhouse_data_id=best_performer_dataset_m2[0].id,
                                     measurement_id=gh_size_id
                                     ).measure_value

                            for i, calculation_id in enumerate(calculation_ids):
                                value_kg = Results.objects \
                                    .filter(greenhouse_data_id=worst_performer_dataset_kg[0].id,
                                            calculation_id=calculation_id) \
                                    .values('result_value')[0]['result_value']
                                value_m2 = Results.objects \
                                    .filter(greenhouse_data_id=worst_performer_dataset_m2[0].id,
                                            calculation_id=calculation_id) \
                                    .values('result_value')[0]['result_value']

                                worst_performer_benchmarkkg_dict[h2o_footprint_names[i]] = value_kg / total_harvest
                                worst_performer_benchmarkm2_dict[h2o_footprint_names[i]] = value_m2 / gh_size

                            benchmarkkg_data_set_list.append(worst_performer_benchmarkkg_dict)
                            benchmarkm2_data_set_list.append(worst_performer_benchmarkm2_dict)
                    total_greenhouse_dict['greenhouseDatasets'] = total_data_set_list
                    normalizedkg_greenhouse_dict['greenhouseDatasets'] = normalizedkg_data_set_list
                    normalizedm2_greenhouse_dict['greenhouseDatasets'] = normalizedm2_data_set_list
                    benchmarkkg_greenhouse_dict['greenhouseDatasets'] = benchmarkkg_data_set_list
                    benchmarkm2_greenhouse_dict['greenhouseDatasets'] = benchmarkm2_data_set_list
                    total_response_data.append(total_greenhouse_dict)
                    normalizedkg_response_data.append(normalizedkg_greenhouse_dict)
                    normalizedm2_response_data.append(normalizedm2_greenhouse_dict)
                    benchmarkkg_response_data.append(benchmarkkg_greenhouse_dict)
                    benchmarkm2_response_data.append(benchmarkm2_greenhouse_dict)

                    directkg_greenhouse_dict['greenhouseDatasets'] = direct_h2o_kg_data_set_list
                    directm2_greenhouse_dict['greenhouseDatasets'] = direct_h2o_m2_data_set_list
                    directkg_response_data.append(directkg_greenhouse_dict)
                    directm2_response_data.append(directm2_greenhouse_dict)

                    fruitsizekg_data_set_list, fruitsizem2_data_set_list = calc_fruit_size_data(recent_dataset, all_measurements, calculation_ids, h2o_footprint_names)
                    fruitsizekg_greenhouse_dict['greenhouseDatasets'] = fruitsizekg_data_set_list
                    fruitsizem2_greenhouse_dict['greenhouseDatasets'] = fruitsizem2_data_set_list
                    fruitsizekg_response_data.append(fruitsizekg_greenhouse_dict)
                    fruitsizem2_response_data.append(fruitsizem2_greenhouse_dict)

                    # Add optimization data
                    # optimization_response_data.append(co2Optimization.create_co2optimization_data(recent_dataset))

            except IndexError:
                return Response({'Error': 'Data could not be generated'},
                                status=status.HTTP_400_BAD_REQUEST)
        response_data["total"] = total_response_data
        response_data["normalizedkg"] = normalizedkg_response_data
        response_data["normalizedm2"] = normalizedm2_response_data
        response_data["fruitsizekg"] = fruitsizekg_response_data
        response_data["fruitsizem2"] = fruitsizem2_response_data
        response_data["directkg"] = directkg_response_data
        response_data["directm2"] = directm2_response_data
        response_data["benchmarkkg"] = benchmarkkg_response_data
        response_data["benchmarkm2"] = benchmarkm2_response_data
        return Response(response_data, status=status.HTTP_200_OK)


def get_harvest(greenhouse_data_id, all_measurements):
    snack_harvest_id = all_measurements.get(measurement_name="SnackErtragJahr")
    snack_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=snack_harvest_id
             ).measure_value
    cocktail_harvest_id = all_measurements.get(measurement_name="CocktailErtragJahr")
    cocktail_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=cocktail_harvest_id
             ).measure_value
    rispen_harvest_id = all_measurements.get(measurement_name="RispenErtragJahr")
    rispen_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=rispen_harvest_id
             ).measure_value
    fleisch_harvest_id = all_measurements.get(measurement_name="FleischErtragJahr")
    fleisch_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=fleisch_harvest_id
             ).measure_value
    return snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest


def calc_total_and_normalized_data(greenhouse_data, all_measurements, calculation_ids, calculation_names):
    """This function uses the footprint data, normalizes it and transforms it into dictionaries so that it can be processed
        by the frontend. In total 3 lists of dictionaries are created:

        Args:
            greenhouse_data: All datasets of one greenhouse
            all_measurements: All measurements saved in the database
            calculation_ids: The ids of all calculation fields used
            calculation_names: The names of all calculation fields used

        Returns:
             total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list

    """
    total_data_set_list = []
    normalizedkg_data_set_list = []
    normalizedm2_data_set_list = []
    for data_set in greenhouse_data:

        total_data_dict = dict()
        normalizedkg_data_dict = dict()
        normalizedm2_data_dict = dict()
        total_data_dict['label'] = data_set.date
        normalizedkg_data_dict['label'] = data_set.date
        normalizedm2_data_dict['label'] = data_set.date

        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
            data_set.id,
            all_measurements)
        total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

        gh_size_id = all_measurements.get(measurement_name="GWHFlaeche")
        gh_size = Measures.objects \
            .get(greenhouse_data_id=data_set.id,
                 measurement_id=gh_size_id
                 ).measure_value

        for i, calculation_id in enumerate(calculation_ids):
            value = Results.objects \
                .filter(greenhouse_data_id=data_set.id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']

            total_data_dict[calculation_names[i]] = value
            normalizedkg_data_dict[calculation_names[i]] = value / total_harvest
            normalizedm2_data_dict[calculation_names[i]] = value / gh_size

        total_data_set_list.append(total_data_dict)
        normalizedkg_data_set_list.append(normalizedkg_data_dict)
        normalizedm2_data_set_list.append(normalizedm2_data_dict)

    return total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list


def calc_fruit_size_data(dataset, all_measurements, calculation_ids, calculation_names):
    # Fruit Size Plot Data:
    fruitsizekg_data_set_list = []
    fruitsizem2_data_set_list = []
    fruitsizes = ["Snack", "Cocktail", "Rispen", "Fleisch"]
    fruitunit = ["10-30Gramm", "30-100Gramm", "100-150Gramm", ">150Gramm"]

    length_id = Measurements.objects.get(measurement_name="Laenge")
    length = Measures.objects \
        .get(greenhouse_data_id=dataset.id,
             measurement_id=length_id
             ).measure_value

    lead_width_id = Measurements.objects.get(measurement_name="Vorwegbreite")
    lead_width = Measures.objects \
        .get(greenhouse_data_id=dataset.id,
             measurement_id=lead_width_id
             ).measure_value

    row_length = length - lead_width

    # Calculate the total amount of rows
    total_row_count = 0
    for fruit in fruitsizes:
        fruit_row_count_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
        total_row_count = total_row_count + Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_row_count_id
                 ).measure_value
    row_distance_id = Measurements.objects.get(measurement_name="Reihenabstand(Rinnenabstand)").id
    row_distance = Measures.objects.filter(greenhouse_data_id=dataset.id, measurement_id=row_distance_id)[
        0].measure_value
    #gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
    #gh_size = Measures.objects \
    #    .get(greenhouse_data_id=dataset.id,
    #         measurement_id=gh_size_id
    #         ).measure_value
    #print("gh_size: ", gh_size)
    #print("fruit_size: ", (total_row_count * row_length * row_distance))
    snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(dataset, all_measurements)
    total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest
    for index, fruit in enumerate(fruitsizes):
        fruitsizekg_data_dict = dict()
        fruitsizem2_data_dict = dict()
        fruitsizekg_data_dict['label'] = fruitunit[index]
        fruitsizem2_data_dict['label'] = fruitunit[index]
        fruit_row_count_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
        fruit_row_count = Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_row_count_id
                 ).measure_value

        fruit_harvest_id = Measurements.objects.get(measurement_name=fruit + "ErtragJahr")
        fruit_harvest = Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_harvest_id
                 ).measure_value

        for i, calculation_id in enumerate(calculation_ids):
            value = Results.objects \
                .filter(greenhouse_data_id=dataset.id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']
            if fruit_harvest != 0.000:
                fruitsizekg_data_dict[calculation_names[i]] = value * (
                            fruit_row_count / total_row_count) / fruit_harvest
                fruitsizem2_data_dict[calculation_names[i]] = value * (fruit_harvest / total_harvest) / (
                            fruit_row_count * row_length * row_distance)
            else:
                fruitsizekg_data_dict[calculation_names[i]] = 0
                fruitsizem2_data_dict[calculation_names[i]] = 0
        fruitsizekg_data_set_list.append(fruitsizekg_data_dict)
        fruitsizem2_data_set_list.append(fruitsizem2_data_dict)
    return fruitsizekg_data_set_list, fruitsizem2_data_set_list

def is_productiontype_biologic(dataset):
    # Check what production type the most recent dataset uses
    biologic_id = Options.objects.filter(option_value="Biologisch")[0]
    biologic = Selections.objects.filter(greenhouse_data_id=dataset).filter(option_id=biologic_id)
    if biologic.exists():
        return True
    else:
        return False


def find_performer_dataset(recent_dataset_is_biologic, calculation_name, is_best_performer):
    """This function finds the dataset in the database with the lowest or highest normalized footprint using the same production
        type as the provided dataset:

        Args:
            recent_dataset_is_biologic: Boolean, if true then the productiontype searched for is biologic, else conventional
            calculation_name: The calculation field that will be used to determine the best performer
            is_best_performer: Boolean, if true then the best_performer will be searched, if false the worst_performer will be searched.

        Returns:
            Dataset of the best performer in the database, Boolean (true if the production type is biologic)

    """
    # Check what production type the most recent dataset uses
    if recent_dataset_is_biologic:
        productiontype_id = Options.objects.filter(option_value="Biologisch")[0]
    else:
        productiontype_id = Options.objects.filter(option_value="Konventionell")[0]

    # Retrieve the result_values of the high performer and append them to total_response_data (Using normalized data)
    footprint_id = Calculations.objects.get(calculation_name=calculation_name).id

    if is_best_performer:
        result_value = 'result_value'  # Sort from min to max
    else:
        result_value = '-result_value'  # Sort from max to min

    performers = Results.objects.filter(calculation_id=footprint_id).filter(result_value__gt=0).order_by(result_value)
    index = 0
    while index < len(performers):
        performer_id = performers[index].greenhouse_data_id
        performer = Selections.objects.filter(
            greenhouse_data_id=performer_id).filter(option_id=productiontype_id)
        if performer.exists():
            return GreenhouseData.objects.filter(id=performer_id)

        index = index + 1
    return None
