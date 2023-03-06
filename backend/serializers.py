"""
    This module provides serializers for structuring and validating input data 
    in a specified dictionary.
    
  Exported classes: 
      InputDataSerializer: defines structure for input data received from
                           frontend
"""


import re  # python standard library
from django.db import DatabaseError
from rest_framework import serializers
from backend.models import Measurements, OptionGroups


class ListOfTuples(serializers.Field):
    """ This class inherits from serializer.Field and defines a custom
    serializer field. The data structure of this field is a list of tuples
    whose first element is an integer and  whose second element, which is
    optional, contains a float. The first element is the option_id and the
    second element is the value corresponding to this option. This field
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
        tupel_regex = "\(\s*\d+((((\s*,\s*\d+(\.\d+)?){2,3})?)|(\s*,\s*))\s*\)"
        tuple1_regex = "\(\s*\d+(|(\s*,\s*))\s*\)"
        tuple2_regex = "\(\s*\d+((\s*,\s*\d+(\.\d+)?){2}){1}\s*\)"
        tuple3_regex = "\(\s*\d+((\s*,\s*\d+(\.\d+)?){3}){1}\s*\)"
        pattern = re.compile(
            "(" + "\s*\[\s*(" + tuple1_regex + "\s*,\s*)*" + tuple1_regex + "\s*\]\s*" + ")" "|" +
            "(" + "\s*\[\s*(" + tuple2_regex + "\s*,\s*)*" + tuple2_regex + "\s*\]\s*" + ")" "|" +
            "(" + "\s*\[\s*(" + tuple3_regex + "\s*,\s*)*" + tuple3_regex + "\s*\]\s*" + ")"
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
            eventually a corresponding value.

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
                   the selections and maybe the values for these
                   selections for one categorical variable
                   (e.g. 'energy source').

        Returns:
            A python list of tuples containing the option_id and
            eventually a corresponding value.
        """

        # Check the format [(),(),(),...] with a regex
        if not ListOfTuples._check_format(data):
            raise serializers.ValidationError({
                'Passed string does not match format ' +
                '[((<int>,<float>,<int>)|(<int>,<float><int><float>)|(<int>,)|(<int)), ...]'
            })
        # Transform data from single string to a list of tuples
        data = re.sub('\)\s*,\s*\(', ');(', data)
        data = data.strip().strip('][').split(';')  # list of tuples, tuple type: string
        data = list(map(str.strip, data))
        # convert list of string-tuples in a list of tuples
        for i, elem in enumerate(data):
            values = elem.strip('()').split(',')
            if len(values) > 4:
                raise serializers.ValidationError({
                    'The maximal tuple size is 3! option_id, perhaps value and perhaps value2'
                })
            try:
                values[0] = int(values[0])  # first element is option_id
                # check if a value is declared for this option:
                # if the tuple has the form (int,), the second element in
                # values is ''
                if len(values) >= 2:
                    if values[1].strip() == '':
                        del values[1]
                    elif len(values) >= 3:
                        values[1] = float(values[1])  # second element is value
                        values[2] = int(values[2])    # third element is unit
                        # if the tuple has the form (int,float,int,float)
                        if len(values) == 4:
                            values[3] = float(values[3])  # the fourth element is value2
            except (ValueError, TypeError):
                raise serializers.ValidationError({
                    'A list of tuples with the form ((<int>,<float>,<int>) or (<int>,<float>,<int>,<float>)' +
                    'or (<int>,) or (<int>) is required!'
                })
            except IndexError:
                raise serializers.ValidationError({
                    'Index Error: Be aware that the separators in the list ' +
                    'and the tuple should be ","'
                })
            data[i] = tuple(values)
        return data  # returning a list of tuples


class Tuple(serializers.Field):

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
        tupel_regex = "\(\s*\d+(\.\d*)?\s*,\s*\d+\s*\)"
        return bool(re.compile(tupel_regex).match(input_string))

    def to_representation(self, value):
        """Look function description for ListOfTuples()
        """
        return value

    def to_internal_value(self, data):
        """This function turns a primitive data type (here: string) into a
        python object (here tuple). Simultaneously, the function
        validates the data and eventually raises a serializer.ValidationError.
        By the way: This function will be called in the is_valid() function of
        the serializer.

        Args:
            data : Contains the data. In this case a tuple
                   in form of a single string. This contains
                   the value and unit_id of a measurement.

        Returns:
            A python tuple containing the value and unit_id.
        """

        # Check the format [(),(),(),...] with a regex
        if not Tuple._check_format(data):
            raise serializers.ValidationError({
                'Passed string does not match format ' +
                '(<float>,<int>)'
            })
        # convert list of string-tuples in a list of tuples
        values = data.strip('()').split(',')
        if len(values) != 2:
            raise serializers.ValidationError({
                'The tuple size is 2! value and unit_id'
            })
        try:
            values[0] = float(values[0])  # first element is value:
            values[1] = int(values[1])  # second element is the unit id_
        except (ValueError, TypeError):
            raise serializers.ValidationError({
                'A tuple with the form (<float>,<int>) is required!'
            })
        except IndexError:
            raise serializers.ValidationError({
                'Index Error: Be aware that the separators in the tuple should be ","'
            })
        data = tuple(values)
        return data  # returning a tuple


def _get_continuous_variables():
    """This function returns the names of all continuous variables which
    are stored in the database (in the table 'Measurements').

    Returns:
        A python list of the names of all continuous variables
        stored in the database.
    """
    return Measurements.objects.all()


def _get_categorical_variables():
    """This function returns the names of all categorical variables which
    are stored in the database (in the table 'OptionGroups').

    Returns:
        A python list of the names of all categorical variables
        stored in the database.
    """
    return OptionGroups.objects.all()


class InputDataSerializer(serializers.Serializer):
    """ This class inherits from serializer.Serializer and defines a serializer
    for the input data of the client which should be stored in the database.
    """

    greenhouse_name = serializers.CharField()
    date = serializers.DateField()

    try:
        # create a DecimalField for all continuous variables found in the database:
        for variable in _get_continuous_variables():
            vars()[variable.measurement_name] = Tuple()
        # create a Field for all categorical variables found in the database (multi
        # selection with an optional float for each selection):
        for variable in _get_categorical_variables():
            vars()[variable.option_group_name] = ListOfTuples()
    except DatabaseError:
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

