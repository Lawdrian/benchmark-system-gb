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
import math
import random

from backend.models import Options


def calc_co2_footprint(data):

    helping_values = calc_helping_values(data)



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

def calc_helping_values(data):
    """This function calculates various helping values needed for calculating the co2-footprint
            Args:
                data : greenhousedata

            Returns:
                helping_values: A dictionary containing the calculated variables
    """

    culture_length = round(data["KulturBeginn"][0]-data["KulturEnde"][0], 0)
    side_culture_length = round(data["NebenkulturBeginn"][0]-data["NebenkulturEnde"][0], 0)
    culture_length_usage = culture_length/(culture_length+side_culture_length)
    energyconsumption_lighting = calc_energyconsumption_lighting(data)
    energyconsumption_total = data["GWHStromverbrauch"][0]+energyconsumption_lighting
    #
    #
    gh_size = calc_gh_size(data)
    culture_size = calc_culture_size(data, gh_size)
    hull_size = calc_hull_size(data)
    row_count = data["SnackReihenanzahl"][0]+data["CocktailReihenanzahl"][0]+data["RispenReihenanzahl"][0]+data["FleischReihenanzahl"][0]
    row_length = data["Laenge"][0]-data["Vorwegbreite"][0]
    row_length_total = row_length*row_count
    walk_length_total = row_count-1*row_length
    snack_count = data["SnackReihenanzahl"][0]*row_length/data["SnackPflanzenabstandInDerReihe"][0]
    cocktail_count = data["CocktailReihenanzahl"][0]*row_length/data["CocktailPflanzenabstandInDerReihe"][0]
    rispen_count = data["RispenReihenanzahl"][0]*row_length/data["RispenPflanzenabstandInDerReihe"][0]
    fleisch_count = data["FleischReihenanzahl"][0]*row_length/data["FleischPflanzenabstandInDerReihe"][0]
    plant_count_total = snack_count+cocktail_count+rispen_count+fleisch_count
    #
    snack_shoots_count = snack_count*data["SnackTriebzahl"][0]
    cocktail_shoots_count = cocktail_count*data["CocktailTriebzahl"][0]
    rispen_shoots_count = rispen_count*data["RispenTriebzahl"][0]
    fleisch_shoots_count = fleisch_count*data["FleischTriebzahl"][0]
    shoots_count_total = snack_shoots_count+cocktail_shoots_count+rispen_shoots_count+fleisch_shoots_count
    cord_length_total = data["SchnuereRankhilfen:Laenge"][0]*shoots_count_total
    panicle_hanger_count_total = shoots_count_total*data["Rispenbuegel:AnzahlProTrieb"][0]

    return {
        "culture_length": culture_length,
        "side_culture_length": side_culture_length,
        "culture_length_usage": culture_length_usage,
        "energyconsumption_lighting": energyconsumption_lighting,
        "energyconsumption_total": energyconsumption_total,
        "gh_size": gh_size,
        "culture_size": culture_size,
        "hull_size": hull_size,
        "row_count": row_count,
        "row_length": row_length,
        "row_length_total": row_length_total,
        "walk_length_total": walk_length_total,
        "snack_count": snack_count,
        "cocktail_count": cocktail_count,
        "rispen_count": rispen_count,
        "fleisch_count": fleisch_count,
        "plant_count_total": plant_count_total,
        "snack_shoots_count": snack_shoots_count,
        "cocktail_shoots_count": cocktail_shoots_count,
        "rispen_shoots_count": rispen_shoots_count,
        "fleisch_shoots_count": fleisch_shoots_count,
        "shoots_count_total": shoots_count_total,
        "cord_length_total": cord_length_total,
        "panicle_hanger_count_total": panicle_hanger_count_total
    }

def calc_energyconsumption_lighting(data):
    """Calculates the energyconsumption that belongs to lightning.
    Will be 0, if lighting is already included in GWHStromverbrauch.
    """
    if(data["Belichtung:Stromverbrauch"][0]> 0): return data["Belichtung:Stromverbrauch"][0]
    else:
        return data["Belichtung:AnzahlLampen"][0]*data["Belichtung:AnschlussleistungProLampe"][0]*data["Belichtung:LaufzeitProJahr"][0]/1000


def calc_gh_size(data):
    """Calculates the size of the greenhouse
        """
    if (data["GWHFlaeche"][0] > 0): return data["GWHFlaeche"][0]
    else:
        return data["Laenge"][0]*data["Breite"][0]

def calc_culture_size(data, gh_size):
    """Calculates the size of the culture
        """
    if (data["Kulturflaeche"][0] > 0): return data["Kulturflaeche"][0]
    else:
        return gh_size-(data["Vorwegbreite"][0]*data["Breite"][0])

def calc_hull_size(data):
    """Calculates the size of the greenhouse hull depending on which norm used
        """
    norm_id = data["GWHArt"][0][0]
    norm_name = Options.objects.get(id=norm_id).option_value
    hull_size_wall = 0
    hull_size_roof = 0
    hull_size_total = 0
    print(norm_id)
    print(norm_name)
    if(norm_name=="Venlo"):
        hull_size_wall = data["Laenge"][0]+data["Breite"][0]*2*data["Stehwandhoehe"][0]+((((data["Scheibenlaenge"]^2-(data["Kappenbreite"][0]/2)^2)*data["Kappenbreite"][0])/2)*(data["Breite"][0]/data["Kappenbreite"][0]))
        hull_size_roof = data["Scheibenlaenge"][0]*data["Laenge"][0]*(data["Breite"][0]/data["Kappenbreite"][0]*2)
        hull_size_total = hull_size_wall+hull_size_roof
    elif(norm_name=="Deutsche Norm"):
        hull_size_wall = data["Laenge"][0]*data["Breite"][0]*data["Stehwandhoehe"][0]
        hull_size_roof = data["Scheibenlaenge"][0]*data["Laenge"][0]*2
        hull_size_total = hull_size_wall + hull_size_roof
    elif(norm_name=="Folientunnel"):
        hull_size_total = data["Breite"][0]*math.pi/2*data["Laenge"][0]
    else:
        raise ValueError('No valid option for gwhArt has been selected')

    hull_size = {
        "wall": hull_size_wall,
        "roof": hull_size_roof,
        "total": hull_size_total
    }
    return hull_size



































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