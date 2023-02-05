from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper.prepearePlotData import calc_fruit_size_data, add_best_and_worst_performer, find_performer_dataset, \
    calc_total_and_normalized_data, is_productiontype_biologic, get_harvest
from ..models import GreenhouseData, Measurements, Measures, Selections, \
    Options, Greenhouses, Calculations, Results, OptionGroups


class GetCalculatedH2OFootprint(APIView):
    """API endpoint for retrieving calculated h2o-footprint out of the results table
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Returns the calculated h2o footprints for every data set of every greenhouse of a user.

            The data gets mapped to a dictionary/list structure so that it can be returned as json string
            Args:
                request: user object

            Returns:
                json: [
                        total: [
                            {
                                greenhouse_name: <name of greenhouse>,
                                greenhouse_datasets: [
                                    {
                                        label: <date>,
                                        konstruktion_h2o: <construction h2o value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        normalizedkg: [
                            {
                                greenhouse_name: <name of greenhouse>,
                                best_performer_date: <date of best performer>,
                                performer_productiontype: <productiontype of performer,
                                greenhouse_datasets: [
                                    {
                                        label: <date>,
                                        konstruktion_h2o: <construction h2o value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        normalizedm2: [<same structure as normalizedkg>],
                        fruitsizekg: [
                            {
                                greenhouse_name: <name of greenhouse>,
                                greenhouse_datasets: [
                                    {
                                        label: <fruit class>,
                                        konstruktion_h2o: <construction h2o value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        fruitsizem2: [<same structure as fruitsizekg>],
                        directkg: [
                            {
                                greenhouse_name: <name of greenhouse>,
                                best_performer_date: <date of best performer>,
                                performer_productiontype: <productiontype of performer,
                                greenhouse_datasets: [
                                    {
                                        label: <date>,
                                        brunnenwasser_h2o: <well h2o value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        directm2: [<same structure as directkg>],
                        benchmarkkg: [
                            {
                                greenhouse_name: <name of greenhouse>,
                                best_performer_date: <date of best performer>,
                                worst_performer_date: <date of worst performer>,
                                performer_productiontype: <productiontype of performer,
                                greenhouse_datasets: [
                                    {
                                        label: <date>,
                                        konstruktion_h2o: <construction h2o value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        benchmarkm2: [<same structure as benchmarkkg>],
                        optimization: [],
                ]
        """

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
            return Response({'Error': 'No valid user'},
                        status=status.HTTP_400_BAD_REQUEST)

        h2o_calculation_names = [
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

        # retrieve all calculations and the specific calculation_ids for the requested calculation_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in h2o_calculation_names]

        all_measurements = Measurements.objects.all()

        greenhouses = Greenhouses.objects.filter(user_id=user_id)
        if not greenhouses.exists():
            return Response({'Error': 'User has no greenhouse'},
                        status=status.HTTP_400_BAD_REQUEST)

        # iterate through every greenhouse of the user, retrieve the calculation results
        # and store them in a defined dictionary/list structure
        for greenhouse in greenhouses:

            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            if not greenhouse_data.exists():
                print("getCalculatedH2OFootprint: greenhouse without greenhouse data")
                return Response({'Error': 'A greenhouse has no greenhouse data'},
                                status=status.HTTP_400_BAD_REQUEST)
            # retrieve the result_values for every data set of a greenhouse and store them in the total_data_set_list
            try:
                if len(greenhouse_data) != 0:

                    recent_dataset = greenhouse_data[len(greenhouse_data) - 1]
                    recent_dataset_is_biologic = is_productiontype_biologic(recent_dataset)
                    # check if recent dataset doesn't have water footprint
                    water_data_optiongroup = OptionGroups.objects.filter(option_group_name="WasserVerbrauch")
                    if water_data_optiongroup.exists():
                        water_data_option = Options.objects.filter(option_group=water_data_optiongroup[0].id).filter(
                            option_value="ja")
                        if water_data_option.exists():
                            is_water_data = Selections.objects.filter(greenhouse_data=recent_dataset.id).filter(
                                option=water_data_option[0].id)
                            if not is_water_data.exists():
                                # should jump to the next iteration of the greenhouse for loop,
                                # so that the current greenhouse doesn't appear in the h2o footprint
                                print("getCalculatedH2OFootprint: recent data set has no h2o footprint")
                                continue

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

                    # calculate the plot data for the 3 plots total, normalizedkg and normalizedm2:
                    total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list = \
                        calc_total_and_normalized_data(
                            greenhouse_data, all_measurements, calculation_ids, h2o_calculation_names)
                    # append only the most recent data set to the benchmarkkg_data_set_list
                    benchmarkkg_data_set_list.append(normalizedkg_data_set_list[len(normalizedkg_data_set_list) - 1])
                    benchmarkm2_data_set_list.append(normalizedm2_data_set_list[len(normalizedm2_data_set_list) - 1])

                    # calculate the normalized plot data for the direct water usage
                    direct_h2o_calculation_names = [
                        "brunnenwasser_h2o",
                        "regenwasser_h2o",
                        "stadtwasser_h2o",
                        "oberflaechenwasser_h2o",
                    ]
                    direct_h2o_calculation_ids = [calculations[name] for name in direct_h2o_calculation_names]
                    _, direct_h2o_kg_data_set_list, direct_h2o_m2_data_set_list = calc_total_and_normalized_data(
                        greenhouse_data, all_measurements, direct_h2o_calculation_ids, direct_h2o_calculation_names)

                    # find the best performer for the direct water usage
                    direct_h2o_calculation_name_kg = "direct_h2o_footprint_norm_kg"
                    direct_h2o_calculation_name_m2 = "direct_h2o_footprint_norm_m2"
                    direct_h2o_best_performer_kg = find_performer_dataset(recent_dataset_is_biologic,
                                                                          direct_h2o_calculation_name_kg, True)
                    direct_h2o_best_performer_m2 = find_performer_dataset(recent_dataset_is_biologic,
                                                                          direct_h2o_calculation_name_m2, True)

                    if direct_h2o_best_performer_kg is not None and direct_h2o_best_performer_m2 is not None:
                        best_performer_directkg_dict = dict()
                        best_performer_directm2_dict = dict()
                        best_performer_directkg_dict['label'] = "Best Performer"
                        best_performer_directm2_dict['label'] = "Best Performer"
                        directkg_greenhouse_dict['best_performer_date'] = direct_h2o_best_performer_kg[0].date
                        directm2_greenhouse_dict['best_performer_date'] = direct_h2o_best_performer_m2[0].date
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
                        print("getCalculatedH2OFootprint: no best performer for direct water-usage found")

                    calculation_name_kg = "h2o_footprint_norm_kg"
                    calculation_name_m2 = "h2o_footprint_norm_m2"
                    # retrieve the best and worst performer and add them to the greenhouse_dicts
                    normalizedkg_greenhouse_dict, normalizedm2_greenhouse_dict, \
                    benchmarkkg_greenhouse_dict, benchmarkm2_greenhouse_dict = add_best_and_worst_performer(
                        recent_dataset_is_biologic,
                        calculation_name_kg,
                        calculation_name_m2,
                        calculation_ids,
                        h2o_calculation_names,
                        all_measurements,
                        normalizedkg_greenhouse_dict,
                        normalizedm2_greenhouse_dict,
                        benchmarkkg_greenhouse_dict,
                        benchmarkm2_greenhouse_dict,
                        normalizedkg_data_set_list,
                        normalizedm2_data_set_list,
                        benchmarkkg_data_set_list,
                        benchmarkm2_data_set_list
                    )

                    total_greenhouse_dict['greenhouse_datasets'] = total_data_set_list
                    total_response_data.append(total_greenhouse_dict)
                    normalizedkg_response_data.append(normalizedkg_greenhouse_dict)
                    normalizedm2_response_data.append(normalizedm2_greenhouse_dict)
                    benchmarkkg_response_data.append(benchmarkkg_greenhouse_dict)
                    benchmarkm2_response_data.append(benchmarkm2_greenhouse_dict)

                    directkg_greenhouse_dict['greenhouse_datasets'] = direct_h2o_kg_data_set_list
                    directm2_greenhouse_dict['greenhouse_datasets'] = direct_h2o_m2_data_set_list
                    directkg_response_data.append(directkg_greenhouse_dict)
                    directm2_response_data.append(directm2_greenhouse_dict)

                    fruitsizekg_data_set_list, fruitsizem2_data_set_list = calc_fruit_size_data(recent_dataset,
                                                                                                all_measurements,
                                                                                                calculation_ids,
                                                                                                h2o_calculation_names)
                    fruitsizekg_greenhouse_dict['greenhouse_datasets'] = fruitsizekg_data_set_list
                    fruitsizem2_greenhouse_dict['greenhouse_datasets'] = fruitsizem2_data_set_list
                    fruitsizekg_response_data.append(fruitsizekg_greenhouse_dict)
                    fruitsizem2_response_data.append(fruitsizem2_greenhouse_dict)

                    # add optimization data
                    # optimization_response_data.append(co2Optimization.create_co2optimization_data(recent_dataset))

            except IndexError:
                print("getCalculatedH2OFootprint: data couldn't be generated")
                return Response({'Error': 'Data could not be generated'},
                                status=status.HTTP_400_BAD_REQUEST)

        if total_response_data == []:
            print("GetCalculatedH2OFootprint: no greenhouse for user")
            return Response({'Error': 'Not found', 'Message': 'This user has no greenhouse'},
                        status=status.HTTP_204_NO_CONTENT)
        response_data["total"] = total_response_data
        response_data["normalizedkg"] = normalizedkg_response_data
        response_data["normalizedm2"] = normalizedm2_response_data
        response_data["fruitsizekg"] = fruitsizekg_response_data
        response_data["fruitsizem2"] = fruitsizem2_response_data
        response_data["directkg"] = directkg_response_data
        response_data["directm2"] = directm2_response_data
        response_data["benchmarkkg"] = benchmarkkg_response_data
        response_data["benchmarkm2"] = benchmarkm2_response_data
        print("getCalculatedH2OFootprint: request success")
        return Response(response_data, status=status.HTTP_200_OK)



