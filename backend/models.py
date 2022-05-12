from django.db import models
from django.utils import timezone

anonym_user_id = 1


class  GreenhouseOperator(models.Model):
    """This class defines a django model to store a greenhouse operator.
    """
    name = models.CharField(max_length=50)
    mail = models.CharField(max_length=100)


class GreenhouseName(models.Model):
    """This class defines a django model to store the name of different
    greenhouse instances belonging to one greenhouse operator.

    This model is intended to be used as a lookup-table.
    """
    greenhouse_name = models.CharField(max_length=100, unique=True)


class ConstructionType(models.Model):
    """This class defines a django model to store the possible construction
    types of a greenhouse.

    This model is intended to be used as a lookup-table.
    """
    construction_type = models.CharField(max_length=100, unique=True)


class EnergySource(models.Model):
    """This class defines a django model to store the possible energy sources
    of a greenhouse.

    This model is intended to be used as a lookup-table.
    """
    energy_source = models.CharField(max_length=100, unique=True)


class IrrigationSystem(models.Model):
    """This class defines a django model to store the possible irrigation
    systems of a greenhouse.

    This model is intended to be used as a lookup-table.
    """
    irrigation_system = models.CharField(max_length=100, unique=True)


class GreenhouseData(models.Model):
    """This class defines a django model to store the data needed for
    calculation of the co2-footprint, water-footprint and benchmark-score.
    """
    greenhouse_operator = models.ForeignKey("backend.GreenhouseOperator",
                                            default=anonym_user_id,
                                            on_delete=models.SET_DEFAULT)
    greenhouse_name = models.ForeignKey("backend.GreenhouseName", null=True,
                                        on_delete=models.SET_NULL)
    construction_type = models.ForeignKey("backend.ConstructionType", null=True,
                                          on_delete=models.SET_NULL)
    energy_source = models.ForeignKey("backend.EnergySource", null=True,
                                      on_delete=models.SET_NULL)
    irrigation_system = models.ForeignKey("backend.IrrigationSystem", null=True,
                                          on_delete=models.SET_NULL)

    datetime = models.DateTimeField(default=timezone.now())
    # c02 data:
    heat_consumption = models.DecimalField(max_digits=10,
                                           decimal_places=3)  # kWh
    fertilizer = models.DecimalField(max_digits=10, decimal_places=3)  # kg
    working_hours = models.DecimalField(max_digits=10, decimal_places=2)  # h
    psm = models.DecimalField(max_digits=10, decimal_places=3)  # kg
    co2 = models.DecimalField(max_digits=10, decimal_places=3)  # kg
    current = models.DecimalField(max_digits=10, decimal_places=3)  # kWh
    co2_equivalent = models.DecimalField(max_digits=10, decimal_places=3)
    co2_footprint = models.DecimalField(max_digits=10, decimal_places=3)

    # harvest data used for calculating co2- and water-footprint
    area = models.DecimalField(max_digits=10, decimal_places=3)  # m**2
    harvest = models.DecimalField(max_digits=10, decimal_places=3)  # kg

    # data from the climate-computer, which could be used to calculate the
    # heat consumption if it is not known:
    global_radiation = models.DecimalField(max_digits=10, decimal_places=3,
                                           null=True)  # W/m**2
    wind_movement = models.DecimalField(max_digits=10, decimal_places=3,
                                        null=True)  # m/s

    # store session key for handling anonymous users
    session_key = models.CharField(max_length=50, unique=True, null=True)
