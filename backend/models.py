"""
    This module contains all models that define the structure of the database.

  Every class represents a table inside the database structure. It has to
  inherit from models.Model so the django framework can interpret and generate
  the table. Inside each class are the columns that will be added to the table.
  For detailed information about the databases structure have a look at the
  documentation.
  
  Models:
      Calculations
      Results
      Measurements
      Measures
      GreenhouseData
      Greenhouses
      OptionGroups
      Options
      Selections
"""


from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Calculations(models.Model):
    """This class defines a django model to store the names of all
    values that get calculated.

    It is part of the structure for direct user input.
    """
    calculation_name = models.CharField(max_length=50, unique=True, null=False)


class Results(models.Model):
    """This class defines a django model to store the values of all
    measurements linked with their respective names and the greenhouse-data
    they belong to.

    It is part of the structure for direct user input.
    """

    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=True,
                                        on_delete=models.CASCADE)
    calculation = models.ForeignKey("backend.Calculations", null=True,
                                    on_delete=models.SET_NULL)

    result_value = models.DecimalField(max_digits=10, decimal_places=3)


class Measurements(models.Model):
    """This class defines a django model to store the names of all 
    measurements.
    
    It is part of the structure for direct user input.
    """
    measurement_name = models.CharField(max_length=50, unique=True, null=False)


class Measures(models.Model):
    """This class defines a django model to store the values of all 
    measurements linked with their respective names and the greenhouse-data
    they belong to.
    
    It is part of the structure for direct user input.
    """
    
    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=True,
                                      on_delete=models.CASCADE)
    measurement = models.ForeignKey("backend.Measurements", null=True,
                                      on_delete=models.SET_NULL)
    
    measure_value = models.DecimalField(max_digits=10, decimal_places=3)


class GreenhouseData(models.Model):
    """This class defines a django model to store the link between all stored 
    input data and the user the data belongs to.
    
    It represents the actual data set.
    """
    
    greenhouse = models.ForeignKey("backend.Greenhouses", null=True,
                                      on_delete=models.SET_NULL)

    date = models.DateField()
    date_of_input = models.DateTimeField(auto_now_add=True)



class Greenhouses(models.Model):
    """This class defines a django model to store the link between all stored
    input data and the user the data belongs to.

    It represents the actual data set.
    """

    user = models.ForeignKey(User, null=True,
                             on_delete=models.SET_NULL)

    greenhouse_name = models.CharField(max_length=50, unique=False, null=False)


class OptionGroups(models.Model):
    """This class defines a django model to store groups for optional values.
    
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    option_group_name = models.CharField(max_length=50, unique=True,
                                         null=False)
    

class Options(models.Model):
    """This class defines a django model to store possible options for
    classified values connected with its option_group.
    
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    option_group = models.ForeignKey("backend.OptionGroups", null=True,
                                     on_delete=models.SET_NULL)
    
    option_value = models.CharField(max_length=50, null=False)


class Selections(models.Model):
    """This class defines a django model to store the connection between an
    option, the amount for this option and the data set it beongs to.
    
    It is part of the structure for predefined values (e.g. dropdowns)
    """
    
    greenhouse_data = models.ForeignKey("backend.GreenhouseData", null=True,
                                     on_delete=models.CASCADE)
    option = models.ForeignKey("backend.Options", null=True,
                                     on_delete=models.SET_NULL)
    
    amount = models.DecimalField(max_digits=10, decimal_places=3, null=True)

    value2 = models.DecimalField(max_digits=10, decimal_places=3, null=True)



