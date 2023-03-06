from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .helper.prepearePlotData import calc_total_and_normalized_data, \
    is_productiontype_biologic, calc_fruit_size_data, add_best_and_worst_performer
from ..models import GreenhouseData, Measurements, Greenhouses, Calculations


class GetCalculatedCO2Footprint(APIView):
    """API endpoint for retrieving the co2 footprint from the results table
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Returns the calculated co2 footprints for every data set of every greenhouse of a user.

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
                                        konstruktion_co2: <construction co2 value>,
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
                                        konstruktion_co2: <construction co2 value>,
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
                                        konstruktion_co2: <construction co2 value>,
                                        ...
                                    },
                                    ...
                                ]
                            },
                            ...
                        ],
                        fruitsizem2: [<same structure as fruitsizekg>],
                ]
        """

        total_response_data = []
        normalizedkg_response_data = []
        normalizedm2_response_data = []
        fruitsizekg_response_data = []
        fruitsizem2_response_data = []
        response_data = dict()

        user_id = self.request.user.id
        if user_id is None:
            print("GetCalculatedCO2Footprint: invalid user")
            return Response({'Error': 'No valid user', 'Message': ""},
                            status=status.HTTP_400_BAD_REQUEST)

        # the names of the fields in the Calculations table that are being send to the front end
        co2_calculation_names = [
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

        # retrieve all calculations and the specific calculation_ids for the requested co2_calculation_names
        calculations = Calculations.objects.in_bulk(
            field_name='calculation_name')
        calculation_ids = [calculations[name] for name in co2_calculation_names]

        all_measurements = Measurements.objects.all()

        greenhouses = Greenhouses.objects.filter(user_id=user_id)
        if not greenhouses.exists():
            print("GetCalculatedCO2Footprint: no greenhouse for user")
            return Response({'Error': 'Not found', 'Message': 'This user has no greenhouse'},
                        status=status.HTTP_400_BAD_REQUEST)

        # iterate through every greenhouse of the user, retrieve the calculation results
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

            greenhouse_data = GreenhouseData.objects.filter(
                greenhouse_id=greenhouse.id)

            if not greenhouse_data.exists():
                print("getCalculatedCO2Footprint: greenhouse without greenhouse data")
                return Response({'Error': 'Not found', 'Message': 'A greenhouse has no greenhouse data'},
                                status=status.HTTP_400_BAD_REQUEST)

            # retrieve the result_values for every data set of a greenhouse and store them in the total_data_set_list
            try:
                if len(greenhouse_data) != 0:
                    recent_dataset = greenhouse_data[len(greenhouse_data) - 1]
                    recent_dataset_is_biologic = is_productiontype_biologic(recent_dataset)

                    total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list = \
                        calc_total_and_normalized_data(
                            greenhouse_data, all_measurements, calculation_ids, co2_calculation_names)

                    calculation_name_kg = "co2_footprint_norm_kg"
                    calculation_name_m2 = "co2_footprint_norm_m2"

                    # retrieve the best and worst performer and add them to the greenhouse_dicts
                    normalizedkg_greenhouse_dict, normalizedm2_greenhouse_dict = add_best_and_worst_performer(
                        recent_dataset_is_biologic,
                        calculation_name_kg,
                        calculation_name_m2,
                        calculation_ids,
                        co2_calculation_names,
                        all_measurements,
                        normalizedkg_greenhouse_dict,
                        normalizedm2_greenhouse_dict,
                        normalizedkg_data_set_list,
                        normalizedm2_data_set_list,
                    )

                    total_greenhouse_dict['greenhouse_datasets'] = total_data_set_list
                    total_response_data.append(total_greenhouse_dict)

                    normalizedkg_response_data.append(normalizedkg_greenhouse_dict)
                    normalizedm2_response_data.append(normalizedm2_greenhouse_dict)

                    fruitsizekg_data_set_list, fruitsizem2_data_set_list = calc_fruit_size_data(recent_dataset,
                                                                                                all_measurements,
                                                                                                calculation_ids,
                                                                                                co2_calculation_names)
                    fruitsizekg_greenhouse_dict['greenhouse_datasets'] = fruitsizekg_data_set_list
                    fruitsizem2_greenhouse_dict['greenhouse_datasets'] = fruitsizem2_data_set_list
                    fruitsizekg_response_data.append(fruitsizekg_greenhouse_dict)
                    fruitsizem2_response_data.append(fruitsizem2_greenhouse_dict)

            except IndexError:
                print("getCalculatedCO2Footprint: greenhouse without greenhouse data")
                return Response({'Error': 'Not found', 'Message': 'No data for given parameters found'},
                                status=status.HTTP_400_BAD_REQUEST)

        response_data["total"] = total_response_data
        response_data["normalizedkg"] = normalizedkg_response_data
        response_data["normalizedm2"] = normalizedm2_response_data
        response_data["fruitsizekg"] = fruitsizekg_response_data
        response_data["fruitsizem2"] = fruitsizem2_response_data
        print("getCalculatedCO2Footprint: request success")
        return Response(response_data, status=status.HTTP_200_OK)
