"""This module provides algorithms for calculating footprints and benchmark.

Leave one blank line.  The rest of this docstring should contain an
overall description of the module or program.  Optionally, it may also
contain a brief description of exported classes and functions and/or usage
examples.

  Typical usage example:

  co2_footprint = calc_co2_footprint()
"""

# Change here the parameters for the calculation algorithms.
calc_params = {
    "electric_equivalent": 2.0,
    "heat_equivalent": 2.0,
    "pesticide_equivalent": 1.0,
    "fertilizer_equivalent": 1.0
}


def calc_co2_footprint(lighting_power, lighting_runtime_per_day,
                       powerusage_total_without_lighting, energy_usage,
                       pesticide_amount, fertilizer_amount):
    electric_power = powerusage_total_without_lighting + \
                     lighting_power * lighting_runtime_per_day
    electric_power_co2 = electric_power * calc_params["electric_equivalent"]

    heat_consumption_co2 = energy_usage * calc_params["heat_equivalent"]
    psm_co2 = pesticide_amount * calc_params["pesticide_equivalent"]
    fertilizer_co2 = fertilizer_amount * calc_params["fertilizer_equivalent"]

    return [electric_power_co2, heat_consumption_co2, psm_co2, fertilizer_co2]


def calc_water_footprint():
    pass


def calc_benchmark_score():
    pass
