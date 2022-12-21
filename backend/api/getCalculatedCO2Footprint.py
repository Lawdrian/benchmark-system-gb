
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .getCalculatedH2OFootprint import calc_total_and_normalized_data, find_performer_dataset, get_harvest, \
    is_productiontype_biologic, calc_fruit_size_data
from ..models import GreenhouseData, Measurements, Measures, Greenhouses, Calculations, Results


class GetCalculatedCO2Footprint(APIView):
    """API endpoint for retrieving the co2-footprint out of the results table
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns the calculated co2-footprint which got requested.

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

        co2_footprint_names = [
            "konstruktion_co2",
            "energieschirm_co2",
            "bodenabdeckung_co2",
            "produktionssystem_co2",
            "heizsystem_co2",
            "zusaetzliches_heizsystem_co2",
            "energietraeger_co2",
            "strom_co2",
            "brunnenwasser_co2",
            "regenwasser_co2",
            "stadtwasser_co2",
            "oberflaechenwasser_co2",
            "co2_zudosierung_co2",
            "duengemittel_co2",
            "psm_co2",
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
        ]

    
        # Retrieve all calculations and the specific calculation_ids for the requested co2_footprint_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in co2_footprint_names]

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
                    total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list = calc_total_and_normalized_data(
                        greenhouse_data, all_measurements, calculation_ids, co2_footprint_names)

                    # Append only the most recent dataset to the benchmarkkg_data_set_list
                    benchmarkkg_data_set_list.append(normalizedkg_data_set_list[len(normalizedkg_data_set_list)-1])
                    benchmarkm2_data_set_list.append(normalizedm2_data_set_list[len(normalizedm2_data_set_list)-1])

                    calculation_name_kg = "co2_footprint_norm_kg"
                    calculation_name_m2 = "co2_footprint_norm_m2"
                    recent_dataset_is_biologic = is_productiontype_biologic(recent_dataset)
                    best_performer_dataset_kg = find_performer_dataset(recent_dataset_is_biologic, calculation_name_kg,
                                                                       True)
                    best_performer_dataset_m2 = find_performer_dataset(recent_dataset_is_biologic, calculation_name_m2,
                                                                       True)

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

                        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
                            best_performer_dataset_kg[0].id,
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

                            best_performer_normalizedkg_dict[co2_footprint_names[i]] = value_kg / total_harvest
                            best_performer_normalizedm2_dict[co2_footprint_names[i]] = value_m2 / gh_size

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

                            snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
                                worst_performer_dataset_kg[0].id, all_measurements)

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

                                worst_performer_benchmarkkg_dict[co2_footprint_names[i]] = value_kg / total_harvest
                                worst_performer_benchmarkm2_dict[co2_footprint_names[i]] = value_m2 / gh_size

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

                    fruitsizekg_data_set_list, fruitsizem2_data_set_list = calc_fruit_size_data(recent_dataset,
                                                                                                all_measurements,
                                                                                                calculation_ids,
                                                                                                co2_footprint_names)
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