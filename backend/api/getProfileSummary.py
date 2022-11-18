from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.models import GreenhouseData, Greenhouses, Calculations, Results


class GetProfileSummary(APIView):
    """API endpoint for retrieving a summary of all datasets a user has including label, co2-footprint, h2o-footprint.
        This endpoint is used by the profile page to display all datasets a user created.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Get request that returns a summary of all datasets of a user in the correct datastruct.

        Args:
            request : No query parameters needed

        Returns:
            json:
                [
                    {
                        greenhouse_name: <greenhouse_name>,
                        data: [
                            {
                                label: <label>,
                                co2-footprint: <co2_footprint>,
                                h2o-footrpint: <h2o-footprint>
                            },
                            {
                                label: <label>,
                                co2-footprint: <co2_footprint>,
                                h2o-footrpint: <h2o-footprint>
                            }
                        ]
                    }
                ]
        """

        user_id = self.request.user.id
        user_id = 1
        if user_id is None:
            return Response({'Bad Request': 'No valid user!'},
                            status=status.HTTP_400_BAD_REQUEST)
        co2_footprint_id = Calculations.objects.get(calculation_name="co2_footprint")

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
                    greenhouse_data = dict()
                    greenhouse_data["greenhouse_name"] = greenhouse.greenhouse_name
                    greenhouse_data_list = []
                    for dataset in greenhouse_datasets:
                        dataset_dict = dict()
                        dataset_dict["label"] = dataset.date
                        dataset_dict["co2_footprint"] = Results.objects.get(calculation_id=co2_footprint_id, greenhouse_data_id=dataset.id).result_value
                        dataset_dict["h2o_footprint"] = 0 #TODO implement real value
                        greenhouse_data_list.append(dataset_dict)
                    greenhouse_data["data"] = greenhouse_data_list
                else:
                    return Response({'No Content': 'No dataset exists for a greenhouse of this user'},
                                    status=status.HTTP_204_NO_CONTENT)
                response_data.append(greenhouse_data)
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'No Content': 'No greenhouse exists for this user'},
                            status=status.HTTP_204_NO_CONTENT)
