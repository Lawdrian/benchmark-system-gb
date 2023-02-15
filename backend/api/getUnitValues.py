from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Measurements, OptionGroups, Options, MeasurementUnits, OptionUnits


class GetUnitValues(APIView):
    """API endpoint for retrieving the unit values.

    The user can select these, when entering his data into a field. This counts for both measures and selections
    For example: "alterGWH": kwh | kg | ...
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, format=None):
        """Returns the unit values for all input fields.

        Args:
            request : no query parameters needed

        Returns:
            json: {
                measures: {
                    <Measurement>: [
                        {
                            id: <id>
                            value: <value>
                        },
                        ...
                    ]
                },
                selections: {
                    <OptionGroup>: {
                        <Option>: [
                            {
                                id: <id>
                                value: <value>
                            },
                            ...
                        ],
                        ...
                    }
                }
            }
        """
        response_data = dict()
        all_measurement_units = MeasurementUnits.objects.all()
        measurements = Measurements.objects.all()
        all_options = Options.objects.all()
        all_option_units = OptionUnits.objects.all()
        all_option_groups = OptionGroups.objects.all()

        # add all measurement units to the json object
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
            response_data["measures"] = measures
        else:
            return Response({"Bad Request": "No data in database"},
                            status=status.HTTP_204_NO_CONTENT)

        # add all option units to the response_data object
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
            response_data["selections"] = selections
        else:
            print("GetUnitValues: couldn't retrieve units")
            return Response({"Bad Request,l": "No data in database"},
                            status=status.HTTP_204_NO_CONTENT)

        return Response(response_data, status=status.HTTP_200_OK)
