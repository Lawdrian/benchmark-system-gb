"""This module contains all models that define the structure of the database.

Every class represents a table inside the database structure. It has to
inherit from models.Model so the django framework can interpret and generate
the table. Inside each class are the columns that will be added to the table.
For detailed information about the databases structure have a look at the
documentation.

Models:
  Calculations
  Results
  Measurements
  MeasurementUnits
  Measures
  GreenhouseData
  Greenhouses
  OptionGroups
  Options
  OptionUnits
  Selections
"""


from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Greenhouses(models.Model):
    """This class defines a django model to store the link between all stored
    input data and the user the data belongs to.

    It represents the actual data set.
    """

    user = models.ForeignKey(User, null=True,
                             on_delete=models.SET_NULL)

    greenhouse_name = models.CharField(max_length=100, unique=False, null=False)


class GreenhouseData(models.Model):
    """This class defines a django model to store the link between all stored
    input data and the user the data belongs to.

    It represents the actual data set.
    """

    greenhouse = models.ForeignKey("backend.Greenhouses", null=False,
                                   on_delete=models.CASCADE)

    date = models.DateField()

    date_of_input = models.DateTimeField(auto_now_add=True)


class Calculations(models.Model):
    """This class defines a django model to store the names of all
    values that get calculated.

    It is part of the structure for direct user input.
    """
    calculation_name = models.CharField(max_length=100, unique=True, null=False)
    unit_name = models.CharField(max_length=100, unique=False, null=False)


class Results(models.Model):
    """This class defines a django model to store the values of all
    measurements linked with their respective names and the greenhouse-data
    they belong to.

    It is part of the structure for direct user input.
    """

    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=False,
                                        on_delete=models.CASCADE)
    calculation = models.ForeignKey("backend.Calculations", null=True,
                                    on_delete=models.SET_NULL)

    result_value = models.DecimalField(max_digits=20, decimal_places=3)


class Measurements(models.Model):
    """This class defines a django model to store the names of all 
    measurements.
    
    It is part of the structure for direct user input.
    """
    measurement_name = models.CharField(max_length=100, unique=True, null=False)


class MeasurementUnits(models.Model):
    """This class defines a django model to store all possible units for a measurement field.

    It is part of the structure for direct user input.
    """
    measurement = models.ForeignKey("backend.Measurements", null=True,
                                    on_delete=models.CASCADE)
    unit_name = models.CharField(max_length=100, unique=False, null=False)


class Measures(models.Model):
    """This class defines a django model to store the values of all 
    measurements linked with their respective names and the greenhouse-data
    they belong to.
    
    It is part of the structure for direct user input.
    """
    
    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=False,
                                      on_delete=models.CASCADE)
    measurement = models.ForeignKey("backend.Measurements", null=False,
                                      on_delete=models.CASCADE)
    measure_unit = models.ForeignKey("backend.MeasurementUnits", null=True, on_delete=models.SET_NULL)

    measure_value = models.DecimalField(max_digits=20, decimal_places=3)


class OptionGroups(models.Model):
    """This class defines a django model to store groups for optional values.
    
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    option_group_name = models.CharField(max_length=100, unique=True,
                                         null=False)
    

class Options(models.Model):
    """This class defines a django model to store possible options for
    classified values connected with its option_group.
    
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    option_group = models.ForeignKey("backend.OptionGroups", null=True,
                                     on_delete=models.CASCADE)
    
    option_value = models.CharField(max_length=100, null=False)


class OptionUnits(models.Model):
    """This class defines a django model to store all possible units for an option.

    It is part of the structure for predefined values (e.g. dropdowns)
    """

    option = models.ForeignKey("backend.Options", null=True, on_delete=models.SET_NULL)

    unit_name = models.CharField(max_length=100, unique=False, null=False)


class Selections(models.Model):
    """This class defines a django model to store the connection between an
    option, the value for this option and the data set it beongs to. Furthermore another value
    can be saved in this model.
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=False,
                                     on_delete=models.CASCADE)
    option = models.ForeignKey("backend.Options", null=False,
                                     on_delete=models.CASCADE)
    
    selection_value = models.DecimalField(max_digits=20, decimal_places=3, null=True)

    selection_unit = models.ForeignKey("backend.OptionUnits", null=True, on_delete=models.SET_NULL)

    selection_value2 = models.DecimalField(max_digits=20, decimal_places=3, null=True)



