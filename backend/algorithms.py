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
        "electric_power_co2":calc_electric_power_co2(data),
        "heat_consumption_co2":calc_heat_consumption_co2(data),
        "psm_co2":calc_psm_co2(data),
        "fertilizer_co2":calc_fertilizer_co2(data),
        }
    return calculation_data


def calc_electric_power_co2(data):
    
    return random.random()


def calc_heat_consumption_co2(data):
    
    return random.random()


def calc_psm_co2(data):
    
    return random.random()


def calc_fertilizer_co2(data):
    
    return random.random()