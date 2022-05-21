from django.db import models
from django.utils import timezone

anonym_user_id = 1


class GreenhouseOperator(models.Model):
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
    types of a greenhouse. A construction type could be "venlo" or "foil".

    This model is intended to be used as a lookup-table.
    """
    construction_type = models.CharField(max_length=100, unique=True)


class ProductionType(models.Model):
    """This class defines a django model to store the possible production
    types. A production type could be "hydroponic closed" or "open".

    This model is intended to be used as a lookup-table.
    """
    production_type = models.CharField(max_length=100, unique=True)


class CultivationType(models.Model):
    """This class defines a django model to store the possible cultivation
    types. A production type could be "bio" or "conventional".

    This model is intended to be used as a lookup-table.
    """
    cultivation_type = models.CharField(max_length=100, unique=True)


class FruitWeight(models.Model):
    """This class defines a django model to store the possible fruit weight
    classes. A class is represented by a variety, e.g. "cocktail tomato" is the
    first class.

    This model is intended to be used as a lookup-table.
    """
    fruit_weight = models.CharField(max_length=100, unique=True)


class RoofingMaterial(models.Model):
    """This class defines a django model to store the possible roofing
    materials. A roofing material could be "single-strength glass" or
    "double glazing".

    This model is intended to be used as a lookup-table.
    """
    roofing_material = models.CharField(max_length=100, unique=True)


class EnergySourceType(models.Model):
    """This class defines a django model to store the possible energy source
    types. An energy source type could be "oil" or "coal".

    This model is intended to be used as a lookup-table.
    """
    energysource_type = models.CharField(max_length=100, unique=True)


class LightingType(models.Model):
    """This class defines a django model to store the possible lighting
    types. A lighting type could be "HPS" or "LED".

    This model is intended to be used as a lookup-table.
    """
    lighting_type = models.CharField(max_length=100, unique=True)


class PowerMixType(models.Model):
    """This class defines a django model to store the possible power mix
    types.

    This model is intended to be used as a lookup-table.
    """
    powermix_type = models.CharField(max_length=100, unique=True)


class FertilizerType(models.Model):
    """This class defines a django model to store the possible fertilizer
    types. A fertilizer type could be "Vinasse".

    This model is intended to be used as a lookup-table.
    """
    fertilizer_type = models.CharField(max_length=100, unique=True)


class PesticideType(models.Model):
    """This class defines a django model to store the possible pesticide
    types. A pesticide type could be "insecticide" or "fungicide".

    This model is intended to be used as a lookup-table.
    """
    pesticide_type = models.CharField(max_length=100, unique=True)


class SubstrateType(models.Model):
    """This class defines a django model to store the possible substrate
    types. A substrate type could be "coconut"or "compost".

    This model is intended to be used as a lookup-table.
    """
    substrate_type = models.CharField(max_length=100, unique=True)


class CordType(models.Model):
    """This class defines a django model to store the possible cord
    types.

    This model is intended to be used as a lookup-table.
    """
    cord_type = models.CharField(max_length=100, unique=True)


class ClipType(models.Model):
    """This class defines a django model to store the possible clip
    types.

    This model is intended to be used as a lookup-table.
    """
    clip_type = models.CharField(max_length=100, unique=True)


class PackagingType(models.Model):
    """This class defines a django model to store the possible packaging
    types.

    This model is intended to be used as a lookup-table.
    """
    packaging_type = models.CharField(max_length=100, unique=True)


class EnergyScreenBrand(models.Model):
    """This class defines a django model to store the known energy screen
    brands.

    This model is intended to be used as a lookup-table.
    """
    energy_screen_brand = models.CharField(max_length=100, unique=True)


class GreenhouseData(models.Model):
    """This class defines a django model to store the data needed for
    calculation of the co2-footprint, water-footprint and benchmark-score.
    """

    # foreign keys
    greenhouse_operator = models.ForeignKey("backend.GreenhouseOperator",
                                            default=anonym_user_id,
                                            on_delete=models.SET_DEFAULT)
    greenhouse_name = models.ForeignKey("backend.GreenhouseName", null=True,
                                        on_delete=models.SET_NULL)
    construction_type = models.ForeignKey("backend.ConstructionType", null=True,
                                          on_delete=models.SET_NULL)
    production_type = models.ForeignKey("backend.ProductionType", null=True,
                                        on_delete=models.SET_NULL)
    cultivation_type = models.ForeignKey("backend.CultivationType", null=True,
                                         on_delete=models.SET_NULL)
    fruit_weight = models.ForeignKey("backend.FruitWeight", null=True,
                                     on_delete=models.SET_NULL)
    energysource_type = models.ForeignKey("backend.EnergySourceType", null=True,
                                          on_delete=models.SET_NULL)
    roofing_material = models.ForeignKey("backend.RoofingMaterial", null=True,
                                         on_delete=models.SET_NULL)
    energy_screen_brand = models.ForeignKey("backend.EnergyScreenBrand",
                                            null=True,  # null if no screen
                                            on_delete=models.SET_NULL)
    powerusage_lighting_type = models.ForeignKey("backend.LightingType",
                                                 null=True,
                                                 on_delete=models.SET_NULL)
    powermix_type = models.ForeignKey("backend.PowerMixType", null=True,
                                      on_delete=models.SET_NULL)
    fertilizer_type = models.ForeignKey("backend.FertilizerType", null=True,
                                        on_delete=models.SET_NULL)
    pesticide_type = models.ForeignKey("backend.PesticideType", null=True,
                                       on_delete=models.SET_NULL)
    used_materials_substrate_type = models.ForeignKey("backend.SubstrateType",
                                                      null=True,
                                                      on_delete=models.SET_NULL)
    used_materials_cord_type = models.ForeignKey("backend.CordType", null=True,
                                                 on_delete=models.SET_NULL)
    used_materials_clip_type = models.ForeignKey("backend.ClipType", null=True,
                                                 on_delete=models.SET_NULL)
    post_harvest_packaging_type = models.ForeignKey("backend.PackagingType",
                                                    null=True,
                                                    on_delete=models.SET_NULL)

    # general data
    datetime = models.DateTimeField(default=timezone.now())  # '2006-10-25 14:30:59'
    # store session key for handling anonymous users
    session_key = models.CharField(max_length=50, unique=True, null=True)

    # greenhouse-specific data
    location = models.IntegerField()  # postcode
    greenhouse_age = models.SmallIntegerField()
    standing_wall_height = models.DecimalField(max_digits=6,
                                               decimal_places=3)  # m
    total_area = models.DecimalField(max_digits=8, decimal_places=3)  # m**2
    # closing time of energy screen from closing_time_begin to closing_time_end
    closing_time_begin = models.TimeField(null=True)  # '14:30:59'
    closing_time_end = models.TimeField(null=True)
    # if production is hydroponic closed, then the following attribute is
    # relevant:
    drop_per_bag = models.DecimalField(max_digits=10, decimal_places=3)

    greenhouse_area = models.DecimalField(max_digits=8,
                                          decimal_places=3)  # m**2
    plantation_begin = models.DateField()  # '2006-10-25'
    plantation_duration = models.DecimalField(max_digits=6,  # calendar week
                                              decimal_places=2)
    planting_density = models.DecimalField(max_digits=10,
                                           decimal_places=3)  # plants/m**2
    harvest = models.DecimalField(max_digits=10, decimal_places=3)  # kg/day
    # energy-related data
    energy_usage = models.DecimalField(max_digits=10,
                                       decimal_places=3)  # per day

    lighting_power = models.DecimalField(max_digits=10, decimal_places=3)  # kWh
    lighting_runtime_per_day = models.DecimalField(max_digits=5,
                                                     decimal_places=3)  # h per day
    powerusage_total_without_lighting = models.DecimalField(max_digits=10,
                                                            decimal_places=3)  # kWh

    co2_consumption = models.DecimalField(max_digits=10, decimal_places=3)  # kg
    fertilizer_amount = models.DecimalField(max_digits=10,
                                            decimal_places=3)  # kg
    pesticide_amount = models.DecimalField(max_digits=10,
                                           decimal_places=3)  # kg
    used_materials_substrate_plantsperbag = models.DecimalField(max_digits=10,
                                                               decimal_places=3)  # number plants per bag
    used_materials_substrate_bagpersqm = models.DecimalField(max_digits=10,
                                                                decimal_places=3)  # number of bags per m**2
    used_materials_gutter_count = models.DecimalField(max_digits=10,
                                                      decimal_places=3)  # number
    used_materials_gutter_length = models.DecimalField(max_digits=10,
                                                       decimal_places=3)  # m
    used_materials_foils_area = models.DecimalField(max_digits=10,
                                                    decimal_places=3)  # m**2

    youngplants_travelling_distance = models.DecimalField(max_digits=10,
                                                          decimal_places=3)  # km

    post_harvest_packaging_amount = models.DecimalField(max_digits=10,
                                                        decimal_places=3)  # kg
    post_harvest_transport_distance = models.DecimalField(max_digits=10,
                                                          decimal_places=3)  # km

    # post_harvest_leftovers # still open for discussion

    # calculated values needed for the co2-footprint
    electric_power_co2 = models.DecimalField(max_digits=10, decimal_places=3)
    heat_consumption_co2 = models.DecimalField(max_digits=10, decimal_places=3)
    psm_co2 = models.DecimalField(max_digits=10, decimal_places=3)
    fertilizer_co2 = models.DecimalField(max_digits=10, decimal_places=3)

