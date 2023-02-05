from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.models import GreenhouseData, Greenhouses, Calculations, Results


class GetProfileSummary(APIView):
    """API endpoint for retrieving a summary of all data sets a user owns.

     This includes label, co2 footprint, h2o footprint. This endpoint is used by the profile page
     to display all data sets a user has created.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Returns a summary of all data sets of a user in the correct json format.

        Args:
            request : user object

        Returns:
            json:
                [
                    {
                        greenhouse_name: <greenhouse_name>,
                        data: [
                            {
                                datasetId: <dataset-id>
                                label: <label>,
                                co2Footprint: <co2 footprint>,
                                h2oFootrpint: <h2o footprint>
                            },
                            {
                                datasetId: <dataset-id>,
                                label: <label>,
                                co2Footprint: <co2 footprint>,
                                h2oFootrpint: <h2o footprint>
                            }
                        ]
                    }
                ]
        """
        user_id = self.request.user.id
        if user_id is None:
            print("GetProfileSummary: invalid user")
            return Response({'Bad Request': 'No valid user!'},
                            status=status.HTTP_400_BAD_REQUEST)
        co2_footprint_id = Calculations.objects.get(calculation_name="co2_footprint")
        h2o_footprint_id = Calculations.objects.get(calculation_name="h2o_footprint")

        # retrieve all greenhouses of a specific user
        greenhouses = Greenhouses.objects.filter(user_id=user_id)
        response_data = []
        if greenhouses.exists():

            # iterate through every greenhouse, retrieve all the metadata for it
            # and save it in the correct json structure
            for greenhouse in greenhouses:

                greenhouse_datasets = GreenhouseData.objects.filter(
                    greenhouse_id=greenhouse.id)
                if greenhouse_datasets.exists():
                    greenhouse_data = dict()
                    greenhouse_data["greenhouse_name"] = greenhouse.greenhouse_name
                    greenhouse_data_list = []
                    for dataset in greenhouse_datasets:
                        dataset_dict = dict()
                        dataset_dict["greenhouseId"] = greenhouse.id
                        dataset_dict["datasetId"] = dataset.id
                        dataset_dict["label"] = dataset.date
                        dataset_dict["co2Footprint"] = round(Results.objects.get(
                            calculation_id=co2_footprint_id, greenhouse_data_id=dataset.id).result_value, 0)
                        dataset_dict["h2oFootprint"] = round(Results.objects.get(
                            calculation_id=h2o_footprint_id, greenhouse_data_id=dataset.id).result_value, 0)
                        greenhouse_data_list.append(dataset_dict)
                    greenhouse_data["data"] = greenhouse_data_list
                else:
                    print("GetProfileSummary: no data set for greenhouse")
                    return Response({'No Content': 'No data set exists for a greenhouse of this user'},
                                    status=status.HTTP_204_NO_CONTENT)
                response_data.append(greenhouse_data)
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            print("GetProfileSummary: no greenhouse for user")
            return Response({'No Content': 'No greenhouse exists for this user'},
                            status=status.HTTP_204_NO_CONTENT)
