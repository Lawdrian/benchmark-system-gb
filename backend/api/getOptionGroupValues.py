from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import OptionGroups, Options


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
