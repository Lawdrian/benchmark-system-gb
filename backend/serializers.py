from django.db import OperationalError
from rest_framework import serializers
from .models import GreenhouseData, Measurements, OptionGroups
import re  # python standard library


class CO2Serializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('electric_power_co2',
                  'heat_consumption_co2',
                  'psm_co2',
                  'fertilizer_co2'
                  )


class CreateGreenhouseDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('greenhouse_operator',
                  'greenhouse_name',
                  'construction_type',
                  'production_type',
                  'cultivation_type',
                  'fruit_weight',
                  'energysource_type',
                  'roofing_material',
                  'energy_screen_brand',
                  'powerusage_lighting_type',
                  'powermix_type',
                  'fertilizer_type',
                  'pesticide_type',
                  'used_materials_substrate_type',
                  'used_materials_cord_type',
                  'used_materials_clip_type',
                  'post_harvest_packaging_type',
                  'datetime',
                  'session_key',
                  'location',
                  'greenhouse_age',
                  'standing_wall_height',
                  'total_area',
                  'closing_time_begin',
                  'closing_time_end',
                  'drop_per_bag',
                  'greenhouse_area',
                  'plantation_begin',
                  'plantation_duration',
                  'planting_density',
                  'harvest',
                  'energy_usage',
                  'lighting_power',
                  'lighting_runtime_per_day',
                  'powerusage_total_without_lighting',
                  'co2_consumption',
                  'fertilizer_amount',
                  'pesticide_amount',
                  'used_materials_substrate_plantsperbag',
                  'used_materials_substrate_bagpersqm',
                  'used_materials_gutter_count',
                  'used_materials_gutter_length',
                  'used_materials_foils_area',
                  'youngplants_travelling_distance',
                  'post_harvest_packaging_amount',
                  'post_harvest_transport_distance'
                  )

        def create(self, validated_data):
            return GreenhouseData.objects.create(**validated_data)


class ListOfTuples(serializers.Field):
    """ This class inherits from serializer.Field and defines a custom
    serializer field. The data structure of this field is a list of tuples
    whose first element is an integer and  whose second element, which is
    optional, contains a float. The first element is the option_id and the
    second element is the amount corresponding to this option. This field
    lets you realise a multiple selection with a float number for each
    selection. Therefore, this class is used for the categorical variables.
    """

    @staticmethod
    def _check_format(input_string):
        """This function checks via a regular expression whether the passed
        string matches a list of tuples whose first element is an integer and
        whose second element, which is optional, contains a float.

                Args:
                    input_string : The string which should be checked.

                Returns:
                    True: input_string matches the format.
                    False: input_string does not match the format.
        """
        tupel_regex = "\(\s*\d+(((\s*,\s*\d+(\.\d+)?)?)|(\s*,\s*))\s*\)"
        pattern = re.compile(
            "\s*\[\s*(" + tupel_regex + "\s*,\s*)*" + tupel_regex + "\s*\]\s*"
        )
        return bool(pattern.match(input_string))

    def to_representation(self, value):
        """This function turns a python object (here list of tuples) into a
        primitive (easy serializable) data type. Since a list is easy to
        serialize, no transformations should be done here. This function will be
        called when accessing serializer.data (always after
        serializer.is_valid() (and therefore after to_internal_value()) in
        order to serialize the saved python object from to_internal_value().
        This is necessary, because the serializer.data should contain easy
        serializable data types in order to be able to pass it directly to
        Response().

                Args:
                    value : The result of to_internal_value(), so a python
                    list of tuples containing the option_id and
                    eventually a corresponding amount.

                Returns:
                    Simply returns <value>, because <value> is already a
                    primitive (easy serializable) data type.
        """
        return value

    def to_internal_value(self, data):
        """This function turns a primitive data type (here: string) into a
        python object (here list of tuples). Simultaneously, the function
        validates the data and eventually raises a serializer.ValidationError.
        By the way: This function will be called in the is_valid() function of
        the serializer.

                Args:
                    data : Contains the data. In this case a list of tuples
                           in form of a single string. This list contains
                           the selections and maybe the amounts for these
                           selections for one categorical variable
                           (e.g. 'energy source').

                Returns:
                    A python list of tuples containing the option_id and
                    eventually a corresponding amount.
        """

        # Check the format [(),(),(),...] with a regex
        if not ListOfTuples._check_format(data):
            raise serializers.ValidationError({
                'Passed string does not match format ' +
                '[((<int>,<float>)|(<int>,)|(<int)), ...]'
            })
        # Transform data from single string to a list of tuples
        data = re.sub('\)\s*,\s*\(', ');(', data)
        data = data.strip().strip('][').split(';')  # list of tuples, tuple type: string
        data = list(map(str.strip, data))
        # convert list of string-tuples in a list of tuples
        for i, elem in enumerate(data):
            values = elem.strip('()').split(',')
            if len(values) > 2:
                raise serializers.ValidationError({
                    'The maximal tuple size is 2! option_id and perhaps amount'
                })
            try:
                values[0] = int(values[0])  # first element is option_id
                # check if an amount is declared for this option:
                if len(values) == 2:
                    # if the tuple has the form (int,), the second element in
                    # values is ''
                    if values[1].strip() == '':
                        del values[1]
                    else:
                        values[1] = float(values[1])  # second element is amount
            except (ValueError, TypeError):
                raise serializers.ValidationError({
                    'A list of tuples with the form (<int>,<float>)' +
                    'or (<int>,) or (<int>) is required!'
                })
            except IndexError:
                raise serializers.ValidationError({
                    'Index Error: Be aware that the separators in the list ' +
                    'and the tuple should be ","'
                })
            data[i] = tuple(values)
        return data  # returning a list of tuples


def _get_continuous_variables():
    """This function returns the names of all continuous variables which
    are stored in the database (in the table 'Measurements').

            Returns:
                A python list of the names of all continuous variables
                stored in the database.
    """
    return Measurements.objects.values_list('measurement_name', flat=True)


def _get_categorical_variables():
    """This function returns the names of all categorical variables which
    are stored in the database (in the table 'OptionGroups').

            Returns:
                A python list of the names of all categorical variables
                stored in the database.
    """
    return OptionGroups.objects.values_list('option_group_name', flat=True)


class InputDataSerializer(serializers.Serializer):
    """ This class inherits from serializer.Serializer and defines a serializer
    for the input data of the client which should be stored in the database.
    """
    greenhouse_name = serializers.CharField()
    date = serializers.DateField()

    try:
        # create a DecimalField for all continuous variables found in the database:
        for variable in _get_continuous_variables():
            vars()[variable] = serializers.DecimalField(max_digits=10,
                                                        decimal_places=3)
        # create a Field for all categorical variables found in the database (multi
        # selection with an optional float for each selection):
        for variable in _get_categorical_variables():
            vars()[variable] = ListOfTuples()
    except OperationalError:
        """
        This exception will be thrown when running "python manage.py makemigrations", 
        because the code will be already interpreted at this step in order to 
        create the classes, etc.. But the database will not be created until  
        "python manage.py migrate". Therefore, the database does not exist in 
        the "makemigrations" step, so the execution of 
        _get_categorical_variables() and _get_continuous_variables() will raise
        an error because the corresponding tables do not exist yet. So the class
        InputDataSerializer could not be created appropriately at this step. 
        However, the error will be ignored in "makemagrations", because once 
        "python manage.py migrate" is executed, the error do not appear anymore!
        """
        pass

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass

