from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper import co2Optimization
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    Options, Greenhouses, Calculations, Results


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
            request : Query parameter dataType

        Returns:
            json: The calculated data requested
        """
        total_response_data = []
        normalizedkg_response_data = []
        normalizedm2_response_data = []
        fruitsizekg_response_data = []
        fruitsizem2_response_data = []
        benchmarkkg_response_data = []
        benchmarkm2_response_data = []
        optimization_response_data = []
        response_data = dict()

        user_id = self.request.user.id
        if user_id is None:
            return Response({'Bad Request': 'No valid user!'},
                            status=status.HTTP_400_BAD_REQUEST)
        # data_type is needed for selecting the correct data to return
        data_type = request.GET.get('dataType', None)

        if data_type is None:
            return Response({'Bad Request': 'Query Parameter missing'},
                            status=status.HTTP_400_BAD_REQUEST)

        # map the requested datatype to the correct calculation_names in the calculations table
        co2_footprint = 'co2FootprintData'
        water_footprint = 'waterUsageData'
        map_data_type = {
            co2_footprint: (
                "konstruktion_co2",
                "energieschirm_co2",
                "bodenabdeckung_co2",
                "produktionssystem_co2",
                "heizsystem_co2",
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
                "zusaetzlicher_machineneinsatz_co2"
            ),
            water_footprint: 'water_usage'
        }
        calculation_names = map_data_type.get(data_type, None)
        if calculation_names is None:
            return Response({'Bad Request': 'Wrong dataType'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Retrieve all calculations and the specific calculation_ids for the requested calculation_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in calculation_names]

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
            total_data_set_list = []
            normalizedkg_data_set_list = []
            normalizedm2_data_set_list = []
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
                        total_ertrag = snack_ertrag+cocktail_ertrag+rispen_ertrag+fleisch_ertrag

                        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
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

                    # Append only the most recent dataset to the benchmarkkg_data_set_list
                    benchmarkkg_data_set_list.append(normalizedkg_data_set_list[len(normalizedkg_data_set_list)-1])
                    benchmarkm2_data_set_list.append(normalizedm2_data_set_list[len(normalizedm2_data_set_list)-1])
                    # Check what production type the most recent dataset uses
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
                        high_performer_normalizedkg_dict = dict()
                        high_performer_normalizedm2_dict = dict()
                        high_performer_normalizedkg_dict['label'] = "Best Performer"
                        high_performer_normalizedm2_dict['label'] = "Best Performer"
                        normalizedkg_greenhouse_dict['performer_date'] = high_performer_dataset[0].date
                        normalizedm2_greenhouse_dict['performer_date'] = high_performer_dataset[0].date
                        benchmarkkg_greenhouse_dict['performer_date'] = high_performer_dataset[0].date
                        benchmarkm2_greenhouse_dict['performer_date'] = high_performer_dataset[0].date
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

                        snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag = get_ertrag(high_performer_dataset[0].id,
                                                                                                  all_measurements)
                        total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                        gh_size = Measures.objects \
                            .get(greenhouse_data_id=high_performer_dataset[0].id,
                                 measurement_id=gh_size_id
                                 ).measure_value

                        for i, calculation_id in enumerate(calculation_ids):
                            value = Results.objects \
                                .filter(greenhouse_data_id=high_performer_dataset[0].id,
                                        calculation_id=calculation_id) \
                                .values('result_value')[0]['result_value']

                            high_performer_normalizedkg_dict[calculation_names[i]] = value / total_ertrag
                            high_performer_normalizedm2_dict[calculation_names[i]] = value / gh_size

                        normalizedkg_data_set_list.append(high_performer_normalizedkg_dict)
                        normalizedm2_data_set_list.append(high_performer_normalizedm2_dict)
                        benchmarkkg_data_set_list.append(high_performer_normalizedkg_dict)
                        benchmarkm2_data_set_list.append(high_performer_normalizedm2_dict)

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
                            low_performer_benchmarkkg_dict = dict()
                            low_performer_benchmarkm2_dict = dict()
                            low_performer_benchmarkkg_dict['label'] = "Worst Performer"
                            low_performer_benchmarkm2_dict['label'] = "Worst Performer"

                            snack_ertrag, cocktail_ertrag, rispen_ertrag, fleisch_ertrag = get_ertrag(low_performer_dataset[0].id, all_measurements)

                            total_ertrag = snack_ertrag + cocktail_ertrag + rispen_ertrag + fleisch_ertrag

                            gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
                            gh_size = Measures.objects \
                                .get(greenhouse_data_id=high_performer_dataset[0].id,
                                     measurement_id=gh_size_id
                                     ).measure_value

                            for i, calculation_id in enumerate(calculation_ids):
                                value = Results.objects \
                                    .filter(greenhouse_data_id=low_performer_dataset[0].id,
                                            calculation_id=calculation_id) \
                                    .values('result_value')[0]['result_value']

                                low_performer_benchmarkkg_dict[calculation_names[i]] = value / total_ertrag
                                low_performer_benchmarkm2_dict[calculation_names[i]] = value / gh_size

                            benchmarkkg_data_set_list.append(low_performer_benchmarkkg_dict)
                            benchmarkm2_data_set_list.append(low_performer_benchmarkm2_dict)

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
                                fruitsizekg_data_dict[calculation_names[i]] = value * (fruit_reihenanzahl/total_reihenanzahl) / fruit_ertrag
                                fruitsizem2_data_dict[calculation_names[i]] = value * (fruit_reihenanzahl/total_reihenanzahl) / (fruit_reihenanzahl*row_length*reihenabstand)
                            else:
                                fruitsizekg_data_dict[calculation_names[i]] = 0
                                fruitsizem2_data_dict[calculation_names[i]] = 0
                        fruitsizekg_data_set_list.append(fruitsizekg_data_dict)
                        fruitsizem2_data_set_list.append(fruitsizem2_data_dict)
                    fruitsizekg_greenhouse_dict['greenhouseDatasets'] = fruitsizekg_data_set_list
                    fruitsizem2_greenhouse_dict['greenhouseDatasets'] = fruitsizem2_data_set_list
                    fruitsizekg_response_data.append(fruitsizekg_greenhouse_dict)
                    fruitsizem2_response_data.append(fruitsizem2_greenhouse_dict)

                    # Add optimization data
                    if data_type == co2_footprint:
                        optimization_response_data.append(co2Optimization.create_co2optimization_data(recent_dataset))
                    elif data_type == water_footprint:
                        print("shui")
                    else:
                        return Response({'No Content': 'Wrong data_type!'},
                                        status=status.HTTP_204_NO_CONTENT)

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
