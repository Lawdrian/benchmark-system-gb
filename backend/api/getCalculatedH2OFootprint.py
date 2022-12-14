from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper import co2Optimization
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    Options, Greenhouses, Calculations, Results


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
        scarcity_indexkg_response_data = []
        scarcity_indexm2_response_data = []
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
            "restwasser_h2o",
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
        print(all_measurements)

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
            benchmarkkg_greenhouse_dict = dict()
            benchmarkm2_greenhouse_dict = dict()
            optimization_greenhouse_dict = dict()
            total_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            normalizedkg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            normalizedm2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            fruitsizekg_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
            fruitsizem2_greenhouse_dict['greenhouse_name'] = greenhouse.greenhouse_name
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

                    total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list = calc_total_and_normalized_data(greenhouse_data, all_measurements, calculation_ids, h2o_footprint_names)
                    # Append only the most recent dataset to the benchmarkkg_data_set_list
                    benchmarkkg_data_set_list.append(normalizedkg_data_set_list[len(normalizedkg_data_set_list)-1])
                    benchmarkm2_data_set_list.append(normalizedm2_data_set_list[len(normalizedm2_data_set_list)-1])

                    calculation_name = "h2o_footprint_norm_kg"
                    best_performer_dataset, recent_dataset_is_biologic = find_performer_dataset(recent_dataset, calculation_name, True)

                    if best_performer_dataset.exists():
                        best_performer_normalizedkg_dict = dict()
                        best_performer_normalizedm2_dict = dict()
                        best_performer_normalizedkg_dict['label'] = "Best Performer"
                        best_performer_normalizedm2_dict['label'] = "Best Performer"
                        normalizedkg_greenhouse_dict['performer_date'] = best_performer_dataset[0].date
                        normalizedm2_greenhouse_dict['performer_date'] = best_performer_dataset[0].date
                        benchmarkkg_greenhouse_dict['performer_date'] = best_performer_dataset[0].date
                        benchmarkm2_greenhouse_dict['performer_date'] = best_performer_dataset[0].date
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

                        snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag = get_ertrag(best_performer_dataset[0].id,
                                                                                                  all_measurements)
                        total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                        gh_size = Measures.objects \
                            .get(greenhouse_data_id=best_performer_dataset[0].id,
                                 measurement_id=gh_size_id
                                 ).measure_value

                        for i, calculation_id in enumerate(calculation_ids):
                            value = Results.objects \
                                .filter(greenhouse_data_id=best_performer_dataset[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            best_performer_normalizedkg_dict[h2o_footprint_names[i]] = value / total_ertrag
                            best_performer_normalizedm2_dict[h2o_footprint_names[i]] = value / gh_size

                        normalizedkg_data_set_list.append(best_performer_normalizedkg_dict)
                        normalizedm2_data_set_list.append(best_performer_normalizedm2_dict)
                        benchmarkkg_data_set_list.append(best_performer_normalizedkg_dict)
                        benchmarkm2_data_set_list.append(best_performer_normalizedm2_dict)

                        # Benchmark Plot Data: Get worst performer
                        worst_performer_dataset, _ = find_performer_dataset(recent_dataset, calculation_name, False)

                        if worst_performer_dataset.exists():
                            worst_performer_benchmarkkg_dict = dict()
                            worst_performer_benchmarkm2_dict = dict()
                            worst_performer_benchmarkkg_dict['label'] = "Worst Performer"
                            worst_performer_benchmarkm2_dict['label'] = "Worst Performer"

                            snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag = get_ertrag(worst_performer_dataset[0].id, all_measurements)

                            total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                            gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                            gh_size = Measures.objects \
                                .get(greenhouse_data_id=best_performer_dataset[0].id,
                                     measurement_id=gh_size_id
                                     ).measure_value

                            for i, calculation_id in enumerate(calculation_ids):
                                value = Results.objects \
                                    .filter(greenhouse_data_id=worst_performer_dataset[0].id,
                                            calculation_id=calculation_id) \
                                    .values('result_value')[0]['result_value']

                                worst_performer_benchmarkkg_dict[h2o_footprint_names[i]] = value / total_ertrag
                                worst_performer_benchmarkm2_dict[h2o_footprint_names[i]] = value / gh_size

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

                    # Fruit Size Plot Data:
                    recent_dataset = greenhouse_data[len(greenhouse_data)-1]
                    fruitsizekg_data_set_list = []
                    fruitsizem2_data_set_list = []
                    fruitsizes = ["Snack", "Cocktail", "Rispen", "Fleisch"]
                    fruitunit = ["10-30Gramm", "30-100Gramm", "100-150Gramm", ">150Gramm"]

                    laenge_id = Measurements.objects.get(measurement_name="Laenge")
                    laenge = Measures.objects \
                        .get(greenhouse_data_id=recent_dataset.id,
                             measurement_id=laenge_id
                             ).measure_value

                    vorwegbreite_id = Measurements.objects.get(measurement_name="Vorwegbreite")
                    vorwegbreite = Measures.objects \
                        .get(greenhouse_data_id=recent_dataset.id,
                             measurement_id=vorwegbreite_id
                             ).measure_value

                    row_length = laenge - vorwegbreite

                    # Calculate the total amount of rows
                    total_reihenanzahl = 0
                    for fruit in fruitsizes:
                        fruit_reihenanzahl_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
                        total_reihenanzahl = total_reihenanzahl + Measures.objects \
                            .get(greenhouse_data_id=recent_dataset.id,
                                 measurement_id=fruit_reihenanzahl_id
                                 ).measure_value
                    reihenabstand_id = Measurements.objects.get(measurement_name="Reihenabstand(Rinnenabstand)").id
                    reihenabstand = Measures.objects.filter(greenhouse_data_id=recent_dataset.id, measurement_id=reihenabstand_id)[0].measure_value
                    for index, fruit in enumerate(fruitsizes):
                        fruitsizekg_data_dict = dict()
                        fruitsizem2_data_dict = dict()
                        fruitsizekg_data_dict['label'] = fruitunit[index]
                        fruitsizem2_data_dict['label'] = fruitunit[index]
                        fruit_reihenanzahl_id = Measurements.objects.get(measurement_name=fruit+"Reihenanzahl")
                        fruit_reihenanzahl = Measures.objects \
                            .get(greenhouse_data_id=recent_dataset.id,
                                 measurement_id=fruit_reihenanzahl_id
                                 ).measure_value
                        fruit_pflanzenabstand_id = Measurements.objects.get(measurement_name=fruit+"PflanzenabstandInDerReihe")

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
                                fruitsizekg_data_dict[h2o_footprint_names[i]] = value * (fruit_reihenanzahl/total_reihenanzahl) / fruit_ertrag
                                fruitsizem2_data_dict[h2o_footprint_names[i]] = value * (fruit_reihenanzahl/total_reihenanzahl) / (fruit_reihenanzahl*row_length*reihenabstand)
                            else:
                                fruitsizekg_data_dict[h2o_footprint_names[i]] = 0
                                fruitsizem2_data_dict[h2o_footprint_names[i]] = 0
                        fruitsizekg_data_set_list.append(fruitsizekg_data_dict)
                        fruitsizem2_data_set_list.append(fruitsizem2_data_dict)
                    fruitsizekg_greenhouse_dict['greenhouseDatasets'] = fruitsizekg_data_set_list
                    fruitsizem2_greenhouse_dict['greenhouseDatasets'] = fruitsizem2_data_set_list
                    fruitsizekg_response_data.append(fruitsizekg_greenhouse_dict)
                    fruitsizem2_response_data.append(fruitsizem2_greenhouse_dict)

                    # Add optimization data
                    # optimization_response_data.append(co2Optimization.create_co2optimization_data(recent_dataset))

            except IndexError:
                return Response({'No Content': 'No data for given parameters found'},
                                status=status.HTTP_204_NO_CONTENT)
        response_data["total"] = total_response_data
        response_data["normalizedkg"] = normalizedkg_response_data
        response_data["normalizedm2"] = normalizedm2_response_data
        response_data["fruitsizekg"] = fruitsizekg_response_data
        response_data["fruitsizem2"] = fruitsizem2_response_data
        response_data["benchmarkkg"] = benchmarkkg_response_data
        response_data["benchmarkm2"] = benchmarkm2_response_data
        return Response(response_data, status=status.HTTP_200_OK)


def get_ertrag(greenhouse_data_id, all_measurements):
    snack_ertrag_id = all_measurements.get(measurement_name="SnackErtragJahr")
    snack_ertrag = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=snack_ertrag_id
             ).measure_value
    cocktail_ertrag_id = all_measurements.get(measurement_name="CocktailErtragJahr")
    cocktail_ertrag = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=cocktail_ertrag_id
             ).measure_value
    rispen_ertrag_id = all_measurements.get(measurement_name="RispenErtragJahr")
    rispen_ertrag = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=rispen_ertrag_id
             ).measure_value
    fleisch_ertrag_id = all_measurements.get(measurement_name="FleischErtragJahr")
    fleisch_ertrag = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=fleisch_ertrag_id
             ).measure_value
    return snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag


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

        snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag = get_ertrag(
            data_set.id,
            all_measurements)
        total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

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
            normalizedkg_data_dict[calculation_names[i]] = value / total_ertrag
            normalizedm2_data_dict[calculation_names[i]] = value / gh_size

        total_data_set_list.append(total_data_dict)
        normalizedkg_data_set_list.append(normalizedkg_data_dict)
        normalizedm2_data_set_list.append(normalizedm2_data_dict)

    return total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list


def find_performer_dataset(dataset, calculation_name, is_best_performer):
    """This function finds the dataset in the database with the lowest or highest normalized footprint using the same production
        type as the provided dataset:

        Args:
            dataset: One dataset
            calculation_name: The calculation field that will be used to determine the best performer
            is_best_performer: Boolean, if true then the best_performer will be searched, if false the worst_performer will be searched.

        Returns:
            Dataset of the best performer in the database, Boolean (true if the production type is biologic)

    """
    # Check what production type the most recent dataset uses
    biologic_id = Options.objects.filter(option_value="Biologisch")[0]
    conventional_id = Options.objects.filter(option_value="Konventionell")[0]

    biologic = Selections.objects.filter(greenhouse_data_id=dataset).filter(option_id=biologic_id)
    if biologic.exists():
        recent_dataset_is_biologic = True
    else:
        recent_dataset_is_biologic = False

    # Retrieve the result_values of the high performer and append them to total_response_data (Using normalized data)
    footprint_id = Calculations.objects.get(calculation_name=calculation_name).id
    found_correct_performer = False
    if is_best_performer:
        result_value = 'result_value'  # Sort from min to max
    else:
        result_value = '-result_value'  # Sort from max to min

    performers = Results.objects.filter(calculation_id=footprint_id).order_by(result_value)  # Sort from min to max
    index = 0
    performer_id = 1
    while found_correct_performer is False and index < len(performers):
        performer_id = performers[index].greenhouse_data_id
        performer_biologic = Selections.objects.filter(
            greenhouse_data_id=performer_id).filter(option_id=biologic_id)
        performer_conventional = Selections.objects.filter(
            greenhouse_data_id=performer_id).filter(option_id=conventional_id)
        if recent_dataset_is_biologic and performer_biologic.exists():
            found_correct_performer = True
            print("Performer ist Biologisch")
        elif recent_dataset_is_biologic is False and performer_conventional.exists():
            found_correct_performer = True
            print("High Performer ist Konventionell")

        index = index + 1

    return GreenhouseData.objects.filter(id=performer_id), recent_dataset_is_biologic
