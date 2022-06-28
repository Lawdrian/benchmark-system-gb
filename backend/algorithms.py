"""This module provides algorithms for calculating footprints and benchmark.

Leave one blank line.  The rest of this docstring should contain an
overall description of the module or program.  Optionally, it may also
contain a brief description of exported classes and functions and/or usage
examples.

  Typical usage example:

  co2_footprint = calc_co2_footprint()
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