"""
    This module provides algorithms for calculating footprints and benchmark.

  The main and only function right now is calc_co2_footprint(data) which 
  calculates the co2-footprint for a greenhouse-dataset. Specifications of the 
  structure for variable data can be found in views.py.
  Other functions of this module should not be called directly.
  
  The general structure of this modules functions contains a main calculation
  function that calls multiple other calculation functions which return their
  respective value after evaluating the given data.
  Then the main calculation function returns a dict of values.
  Right now there is only dummy-data returned.

  Typical usage example:

  co2_footprint = calc_co2_footprint(data)
"""

import random


def calc_co2_footprint(data):
    
    calculation_data = {
        "gwh_konstruktion": calc_greenhouse_construction_co2(data),
        "energietraeger": calc_energy_source_co2(data),
        "strom": calc_electric_power_co2(data),
        "co2_zudosierung": calc_co2_added(data),
        "verbrauchsmaterialien": calc_consumables_co2(data),
        "psm_insgesamt": calc_psm_co2(data),
        "duengemittel": calc_fertilizer_co2(data),
        "jungpflanzen": calc_young_plants_co2(data),
        "verpackung": calc_packaging_co2(data),
        "transport": calc_transport_co2(data),
        }
    return calculation_data


def calc_greenhouse_construction_co2(data):
    return random.random()


def calc_energy_source_co2(data):
    return random.random()


def calc_electric_power_co2(data):
    
    return random.random()


def calc_co2_added(data):
    return random.random()


def calc_consumables_co2(data):
    
    return random.random()


def calc_psm_co2(data):
    
    return random.random()


def calc_fertilizer_co2(data):
    
    return random.random()


def calc_young_plants_co2(data):
    return random.random()


def calc_packaging_co2(data):
    return random.random()


def calc_transport_co2(data):
    return random.random()