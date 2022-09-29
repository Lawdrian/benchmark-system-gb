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

from backend.models import Options, OptionUnits
from backend.models import MeasurementUnits


def calc_co2_footprint(data):
    all_options = Options.objects.all()
    helping_values = calc_helping_values(data, all_options)

    calculation_results = {
        "gwh_konstruktion_co2": calc_greenhouse_construction_co2(data, helping_values, all_options),
        "energietraeger_co2": calc_energy_source_co2(data, helping_values, all_options),
        "strom_co2": calc_electric_power_co2(data, helping_values, all_options),
        "co2_zudosierung_co2": calc_co2_added(data, helping_values, all_options),
        "duengemittel_co2": calc_fertilizer_co2(data, helping_values, all_options),
        "psm_co2": calc_psm_co2(data),
        "nuetzlinge_co2": calc_nuetzlinge_co2(data, helping_values, all_options),
        "pflanzenbehaelter_co2": calc_pflanzenbehaelter_co2(data, helping_values, all_options),
        "substrat_co2": calc_substrate_co2(data, helping_values, all_options),
        "jungpflanzen_substrat_co2": calc_young_plants_substrate_co2(data, helping_values, all_options),
        "jungpflanzen_transport_co2": calc_young_plants_transport_co2(data, helping_values, all_options),
        "schnuere_co2": calc_cords_co2(data, helping_values, all_options),
        "klipse_co2": calc_clips_co2(data, helping_values, all_options),
        "rispenbuegel_co2": calc_panicle_hanger_co2(data, helping_values, all_options),
        "bewaesserung_co2": calc_irrigation_co2(data, helping_values, all_options),
        "verpackung_co2": calc_packaging_co2(data, helping_values, all_options),
        "sonstige_verbrauchsmaterialien_co2": calc_other_consumables_co2(data, helping_values, all_options),
        "transport_co2": calc_transport_co2(data, helping_values, all_options),
        "zusaetzlicher_machineneinsatz_co2": calc_additional_machineusage_co2(data, helping_values, all_options)
    }
    co2_footprint = sum(calculation_results.values())
    print("co2_footprint: " + str(co2_footprint))

    calculation_results["co2_footprint"] = co2_footprint

    return calculation_results

def calc_helping_values(data, all_options):
    """This function calculates various helping values needed for calculating the co2-footprint
            Args:
                data : greenhousedata

            Returns:
                helping_values: A dictionary containing the calculated variables
    """

    if data["KulturEnde"][0] > data["KulturBeginn"][0]:
        culture_length = round(data["KulturEnde"][0]-data["KulturBeginn"][0], 0)
    else:
        culture_length = (52 - round(data["KulturBeginn"][0]), 0) + round(data["KulturEnde"][0], 0)
    if data["NebenkulturEnde"][0] > data["NebenkulturBeginn"][0]:
        side_culture_length = round(data["NebenkulturBeginn"][0]-data["NebenkulturEnde"][0], 0)
    elif data["NebenkulturBeginn"][0] != 0:
        side_culture_length = (52 - round(data["NebenkulturBeginn"][0], 0)) + round(data["NebenkulturEnde"][0], 0)
    else:
        side_culture_length = 0
    culture_length_usage = culture_length/(culture_length+side_culture_length)
    energyconsumption_lighting = calc_energyconsumption_lighting(data, all_options)
    energyconsumption_company = 0
    for option in data["Stromherkunft"]:
        energyconsumption_company = energyconsumption_company + option[1]


    energyconsumption_total = energyconsumption_company+energyconsumption_lighting
    #
    #
    gh_size = calc_gh_size(data)
    culture_size = calc_culture_size(data, gh_size)
    hull_size = calc_hull_size(data)
    row_count = data["SnackReihenanzahl"][0]+data["CocktailReihenanzahl"][0]+data["RispenReihenanzahl"][0]+data["FleischReihenanzahl"][0]
    row_length = data["Laenge"][0]-data["Vorwegbreite"][0]
    row_length_total = row_length*row_count
    walk_length_total = (row_count-1)*row_length

    # Calculate the amount of fruits
    snack_count = 0
    cocktail_count = 0
    rispen_count = 0
    fleisch_count = 0

    if all_options.get(id=data["10-30Gramm(Snack)"][0][0]).option_value == "ja":
        snack_count = data["SnackReihenanzahl"][0] * row_length / data["SnackPflanzenabstandInDerReihe"][0]
    if all_options.get(id=data["30-100Gramm(Cocktail)"][0][0]).option_value == "ja":
        cocktail_count = data["CocktailReihenanzahl"][0] * row_length / data["CocktailPflanzenabstandInDerReihe"][0]
    if all_options.get(id=data["100-150Gramm(Rispen)"][0][0]).option_value == "ja":
        rispen_count = data["RispenReihenanzahl"][0] * row_length / data["RispenPflanzenabstandInDerReihe"][0]
    if all_options.get(id=data[">150Gramm(Fleisch)"][0][0]).option_value == "ja":
        fleisch_count = data["FleischReihenanzahl"][0]*row_length/data["FleischPflanzenabstandInDerReihe"][0]

    plant_count_total = snack_count+cocktail_count+rispen_count+fleisch_count
    #
    snack_shoots_count = snack_count*data["SnackTriebzahl"][0]
    cocktail_shoots_count = cocktail_count*data["CocktailTriebzahl"][0]
    rispen_shoots_count = rispen_count*data["RispenTriebzahl"][0]
    fleisch_shoots_count = fleisch_count*data["FleischTriebzahl"][0]
    shoots_count_total = snack_shoots_count+cocktail_shoots_count+rispen_shoots_count+fleisch_shoots_count
    cord_length_total = data["SchnuereRankhilfen:Laenge"][0]*shoots_count_total
    clips_count_total = data["Klipse:AnzahlProTrieb"][0]*shoots_count_total
    panicle_hanger_count_total = rispen_shoots_count*data["Rispenbuegel:AnzahlProTrieb"][0] + fleisch_shoots_count * data["Rispenbuegel:AnzahlProTrieb"][0]

    print("Helping Values:")
    print("culture_length: " + str(culture_length))
    print("side_culutre_length: " + str(side_culture_length))
    print("culture_length_usage: " + str(culture_length_usage))
    print("energyconsumption_lighting: " + str(energyconsumption_lighting))
    print("energyconsumption_company: " + str(energyconsumption_company))
    print("energyconsumption_total: " + str(energyconsumption_total))
    print("gh_size: " + str(gh_size))
    print("culture_size: " + str(culture_size))
    print("hull_size: " + str(hull_size))
    print("row_count: " + str(row_count))
    print("row_length: " + str(row_length))
    print("row_length_total: " + str(row_length_total))
    print("walk_length_total: " + str(walk_length_total))
    print("snack_count: " + str(snack_count))
    print("cocktail_count: " + str(cocktail_count))
    print("rispen_count: " + str(rispen_count))
    print("fleisch_count: " + str(fleisch_count))
    print("plant_count_total: " + str(plant_count_total))
    print("snack_shoots_count: " + str(snack_shoots_count))
    print("cocktail_shoots_count: " + str(cocktail_shoots_count))
    print("rispen_shoots_count: " + str(rispen_shoots_count))
    print("fleisch_shoots_count: " + str(fleisch_shoots_count))
    print("shoots_count_total: " + str(shoots_count_total))
    print("cord_length_total: " + str(cord_length_total))
    print("clips_count_total: " + str(clips_count_total))
    print("panicle_hanger_count_total: " + str(panicle_hanger_count_total))

    return {
        "culture_length": culture_length,
        "side_culture_length": side_culture_length,
        "culture_length_usage": culture_length_usage,
        "energyconsumption_lighting": energyconsumption_lighting,
        "energyconsumption_company": energyconsumption_company,
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
        "clips_count_total": clips_count_total,
        "panicle_hanger_count_total": panicle_hanger_count_total
    }


def calc_energyconsumption_lighting(data, all_options):
    """Calculates the energyconsumption that belongs to lightning.
    Will be 0, if lighting is already included in GWHStromverbrauch.
    """
    if all_options.filter(id=data["Zusatzbelichtung"][0][0])[0].option_value == "ja" and all_options.filter(id=data["Belichtungsstrom"][0][0])[0].option_value == "nein":
        if(data["Belichtung:Stromverbrauch"][0]> 0): return data["Belichtung:Stromverbrauch"][0]
        else:
            return data["Belichtung:AnzahlLampen"][0]*data["Belichtung:AnschlussleistungProLampe"][0]*data["Belichtung:LaufzeitProJahr"][0]/1000
    else:
        return 0


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
    if(norm_name=="Venlo"):
        hull_size_wall = (data["Laenge"][0]+data["Breite"][0])*2*data["Stehwandhoehe"][0]+((((math.sqrt((data["Scheibenlaenge"][0]**2) - (data["Kappenbreite"][0]/2)**2))*data["Kappenbreite"][0])/2)*(data["Breite"][0]/data["Kappenbreite"][0]))
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


def calc_greenhouse_construction_co2(data, helping_values, all_options):
    # First check which kind of greenhouse is used
    norm_id = data["GWHArt"][0][0]
    norm_name = all_options.get(id=norm_id).option_value
    stehwandmaterial= all_options.get(id=data["Stehwandmaterial"][0][0]).option_value
    bedachungsmaterial = all_options.get(id=data["Bedachungsmaterial"][0][0]).option_value

    beton = 0
    stahl = 0
    aluminium = 0
    lpde = 0
    stehwand = 0
    bedachung = 0

    # GWHart
    if norm_name == "Venlo" or norm_name == "Deutsche Norm":
        # Materials
        if data["GWHAlter"][0] <= 20:
            if norm_name == "Venlo":
                beton = helping_values["gh_size"] * 2.52032 * 0.1707 * (helping_values["culture_length_usage"])
                stahl = helping_values["gh_size"] * 0.55 * 1.5641297 * (helping_values["culture_length_usage"])
                aluminium = helping_values["gh_size"] * 0.125 * 14.365981 * (helping_values["culture_length_usage"])
            elif norm_name == "Deutsche Norm":
                beton = helping_values["gh_size"] * 2.52 * 0.1707 * (helping_values["culture_length_usage"])
                stahl = helping_values["gh_size"] * 0.55 * 1.5641297 * (helping_values["culture_length_usage"])
                aluminium = helping_values["gh_size"] * 0.015 * 14.365981 * (helping_values["culture_length_usage"])

        # Stehwand
        if stehwandmaterial == "Einfachglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"]*0.664*1.1*(helping_values["culture_length_usage"])
        elif stehwandmaterial == "Doppelglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"]*1.328*1.1*(helping_values["culture_length_usage"])
        elif stehwandmaterial == "Doppelstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"]*0.17*1*(helping_values["culture_length_usage"])
        elif stehwandmaterial == "Dreifachstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"]*0.27*1*(helping_values["culture_length_usage"])
        elif stehwandmaterial == "Einfachfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"]*0.0374*2.78897*(helping_values["culture_length_usage"])
        elif stehwandmaterial == "Doppelfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"]*0.0748*2.78897*(helping_values["culture_length_usage"])
        else:
            raise ValueError('No valid option for Stehwandmaterial has been selected')

        # Bedachung
        if bedachungsmaterial == "Einfachglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 0.664 * 1.1 * (helping_values["culture_length_usage"])
        elif bedachungsmaterial == "Doppelglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 1.328 * 1.1 * (helping_values["culture_length_usage"])
        elif bedachungsmaterial == "Doppelstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.17 * 1 * (helping_values["culture_length_usage"])
        elif bedachungsmaterial == "Dreifachstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.27 * 1 * (helping_values["culture_length_usage"])
        elif bedachungsmaterial == "Einfachfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0374 * 2.78897 * (
                helping_values["culture_length_usage"])
        elif bedachungsmaterial == "Doppelfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0748 * 2.78897 * (
                helping_values["culture_length_usage"])
        else:
            raise ValueError('No valid option for Bedachungsmaterial has been selected')

    elif norm_name == "Folientunnel":
        if(bedachungsmaterial == "Einfachfolie"):
            if data["AlterBedachungsmaterial"][0] <= 5:
                ldpe = helping_values["hull_size"]["total"] * 0.06 * 2.78897 * (helping_values["culture_length_usage"])
            if data["GWHAlter"][0] <= 20:
                stahl = helping_values["gh_size"] * 0.13 * 1.5641297 * (helping_values["culture_length_usage"])
        else: # Assume Doppelfolie has been selected. If something else has been selected this will be assumed to not cause unneccessary errors.
            if data["AlterBedachungsmaterial"][0] <= 5:
                ldpe = helping_values["hull_size"]["total"] * 0.14 * 2.78897 * (helping_values["culture_length_usage"])
            if data["AlterBedachungsmaterial"][0] <= 5:
                stahl = helping_values["gh_size"] * 0.195 * 1.5641297 * (helping_values["culture_length_usage"])
    else:
        raise ValueError('No valid option for GWHArt has been selected')


    # Energieschirm
    energieschirmmaterial = all_options.get(id=data["Energieschirm"][0][0]).option_value
    energieschirm = 0

    if data["AlterEnergieschirm"][0] <= 10:
        if energieschirmmaterial == "kein":
            energieschirm = 0  # nothing
        elif energieschirmmaterial == "einfach":
            energieschirm = helping_values["gh_size"] * 0.05 * 2.67 * (helping_values["culture_length_usage"])
        elif energieschirmmaterial == "doppelt":
            energieschirm = helping_values["gh_size"] * 0.1 * 2.67 * (helping_values["culture_length_usage"])
        elif energieschirmmaterial == "einfach, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.05 * 4.5168 * (helping_values["culture_length_usage"])
        elif energieschirmmaterial == "doppelt, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.1 * 4.5168 * (helping_values["culture_length_usage"])
        else:
            raise ValueError('No valid option for Energieschirm has been selected')

    # Bodenabdeckung
    bodenabdeckung = 0
    for option in data["Bodenabdeckung"]:
        bodenabdeckungmaterial = all_options.get(id=option[0]).option_value
        nutzdauer = option[1]
        if bodenabdeckungmaterial == "Bodenfolie":
            if nutzdauer <= 10:
                bodenabdeckung = bodenabdeckung + helping_values["culture_size"] * 0.01 * 2.67
        elif bodenabdeckungmaterial == "Bodengewebe":
            if nutzdauer <= 10:
                bodenabdeckung = bodenabdeckung + helping_values["culture_size"] * 0.02 * 2.67
        elif bodenabdeckungmaterial == "Beton":
            if nutzdauer <= 20:
                bodenabdeckung = bodenabdeckung + helping_values["culture_size"] * 2.52 * 0.1707
        else:
            raise ValueError('No valid option for Bodenabdeckung has been selected')


    # Kultursystem
    kultursystemtyp = all_options.get(id=data["Kultursystem"][0][0]).option_value
    produktionstyp = all_options.get(id=data["Produktionstyp"][0][0]).option_value
    kultursystem = 0
    if data["AlterKultursystem"][0] <= 15:
        if kultursystemtyp == "Boden" or produktionstyp == "Biologisch":  # Biologisch doesn't have Kultursystem
            kultursystem = 0  # nothing
        elif kultursystemtyp == "Hydroponik offen":
            kultursystem = helping_values["row_length_total"] * 0.133333333 * 1.73
        elif kultursystemtyp == "Hydroponik geschlossen":
            kultursystem = helping_values["row_length_total"] * 0.133333333 * 1.73
        else:
            raise ValueError('No valid option for Kultursystem has been selected')

    # Transportsystem
    transportsystemverwendung = all_options.get(id=data["Transportsystem"][0][0]).option_value
    transportsystem = 0

    if data["AlterTransportsystem"][0] <= 20:
        if transportsystemverwendung == "nein":
            transportsystem = 0  # nothing
        elif transportsystemverwendung == "ja":
            transportsystem = helping_values["walk_length_total"] * 0.135 * 1.5641297
        else:
            raise ValueError('No valid option for Transportsystem has been selected')

    # Zusaetzliches Heizsystem
    zusaetzliches_heizsystemmaterial = all_options.get(id=data["ZusaetzlichesHeizsystem"][0][0]).option_value
    zusaetzliches_heizsystem = 0

    if data["AlterZusaetzlichesHeizsystem"][0] <= 15:
        if zusaetzliches_heizsystemmaterial == "keines":
            zusaetzliches_heizsystem = 0  # nothing
        elif zusaetzliches_heizsystemmaterial == "Vegetationsheizung":
            zusaetzliches_heizsystem = helping_values["row_length_total"] * 2 * 0.133333333 * 1.5641297 * (helping_values["culture_length_usage"])
        elif zusaetzliches_heizsystemmaterial == "Konvektionsheizung":
            zusaetzliches_heizsystem = data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * 1.5641297 * (helping_values["culture_length_usage"])
        elif zusaetzliches_heizsystemmaterial == "beides":
            zusaetzliches_heizsystem = (helping_values["row_length_total"] * 2 * 0.133333333 * 1.5641297 * (helping_values["culture_length_usage"])) + (data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * 1.5641297 * (helping_values["culture_length_usage"]))
        else:
            raise ValueError('No valid option for ZusaetzlichesHeizsystem has been selected')

    gesamt_co2 = beton + stahl + aluminium + lpde + stehwand + bedachung + energieschirm + bodenabdeckung + kultursystem + transportsystem + zusaetzliches_heizsystem
    print("Gewächhauskonstruktion CO2: +")
    print("beton " + str(beton))
    print("aluminium " + str(aluminium))
    print("lpde " + str(lpde))
    print("stehwand " + str(stehwand))
    print("bedachung " + str(bedachung))
    print("energieschirm " + str(energieschirm))
    print("bodenabdeckung " + str(bodenabdeckung))
    print("kultursystem " + str(kultursystem))
    print("transportsystem " + str(transportsystem))
    print("zusaetzliches_heizsystem " + str(zusaetzliches_heizsystem))
    print("gwh-konstruktion: " + str(gesamt_co2))
    return gesamt_co2



def calc_energy_source_co2(data, helping_values, all_options):

    # Energietraeger
    # They should always have the unit kWh already
    energietraeger = 0
    erdgas = 0
    biogas = 0
    heizoel = 0
    steinkohle = 0
    braunkohle = 0
    hackschnitzel = 0
    geothermie = 0
    tiefengeothermie = 0
    bhkwerdgas = 0
    bhkwbiomethan = 0
    for option in data["Energietraeger"]:
        # Check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kWh":
            raise ValueError('Energietraeger value unit has not been converted to kWh!')
        energietraegertyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if energietraegertyp == "Erdgas":
            erdgas = menge * 0.252
        elif energietraegertyp == "Biogas":
            biogas = menge * 0.06785
        elif energietraegertyp == "Heizoel":
            heizoel = menge * 0.371
        elif energietraegertyp == "Steinkohle":
            steinkohle = menge * 0.285
        elif energietraegertyp == "Braunkohle":
            braunkohle = menge * 0.364
        elif energietraegertyp == "Hackschnitzel":
            hackschnitzel = menge * 0.025
        elif energietraegertyp == "Geothermie(oberflaechennah)":
            geothermie = menge * 0.0348
        elif energietraegertyp == "Tiefengeothermie":
            tiefengeothermie = menge * 0.00633
        else:
            raise ValueError('No valid option for Energietraeger has been selected')

    # BHKW also counts to Energietraeger
    bhkwverwendung = all_options.get(id=data["BHKW"][0][0]).option_value
    if bhkwverwendung == "nein":
        energietraeger = energietraeger  # nothing
    elif bhkwverwendung == "ja":
        bhkw_erdgas = data["BHKW:AnteilErdgas"]
        bhkw_biomethan = data["BHKW:AnteilBiomethan"]
        # Check if the values have the correct unit
        if MeasurementUnits.objects.get(id=bhkw_erdgas[1]).unit_name != "kWh" or MeasurementUnits.objects.get(id=bhkw_biomethan[1]).unit_name != "kWh":
            raise ValueError('BHKW value unit has not been converted to kWh!')
        else:
            bhkwerdgas = bhkw_erdgas[0] * 0.252
            bhkwbiomethan = bhkw_biomethan[0] * 0.06785
    else:
        raise ValueError('No valid option for BHKW has been selected')

    energietraeger = energietraeger + erdgas + biogas + heizoel + steinkohle + braunkohle + hackschnitzel + geothermie + tiefengeothermie + bhkwerdgas + bhkwbiomethan
    print("energietraeger: " + str(energietraeger))
    return energietraeger


def calc_electric_power_co2(data, helping_values, all_options):
    # Tiefengeothermie: !!!Falls bei Wärmeverbrauch ausgewählt, dann Wert=0!!!
    # BHKW-Erdgas: !!!Falls BHKW ausgewählt, dann Wert=0!!!
    # BHKW-Biomethan: !!!Falls BHKW ausgewählt, dann Wert=0!!!

    # CO2 usage
    strom_gesamt_co2 = 0
    deutscher_strommix_co2 = 0
    oekostrom_co2 = 0
    photovoltaik_co2 = 0
    windenergie_land_co2 = 0
    windenergie_see_co2 = 0
    wasserkraft_co2 = 0
    tiefengeothermie_co2 = 0
    bhkwerdgas_co2 = 0
    bhkwbiomethan_co2 = 0
    diesel_co2 = 0

    # Part of total kWh
    deutscher_strommix_anteil = 0
    oekostrom_anteil = 0
    photovoltaik_anteil = 0
    windenergie_land_anteil = 0
    windenergie_see_anteil = 0
    wasserkraft_anteil = 0
    tiefengeothermie_anteil = 0
    bhkwerdgas_anteil = 0
    bhkwbiomethan_anteil= 0
    diesel_anteil = 0
    for option in data["Stromherkunft"]:
        # Check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kWh":
            raise ValueError('Stromherkunft value unit has not been converted to kWh!')
        stromtyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if stromtyp == "Deutscher Strommix":
            deutscher_strommix_co2 = menge * 0.485 * helping_values["culture_length_usage"]
            deutscher_strommix_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Oekostrom (Durschnitt Deutschland)":
            oekostrom_co2 = menge * 0.024293333 * helping_values["culture_length_usage"]
            oekostrom_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Photovoltaik":
            photovoltaik_co2 = menge * 0.05571 * helping_values["culture_length_usage"]
            photovoltaik_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (Land)":
            windenergie_land_co2 = menge * 0.0088 * helping_values["culture_length_usage"]
            windenergie_land_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (See)":
            windenergie_see_co2 = menge * 0.00437 * helping_values["culture_length_usage"]
            windenergie_see_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Wasserkraft":
            wasserkraft_co2 = menge * 0.0027 * helping_values["culture_length_usage"]
            wasserkraft_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Tiefengeothermie":
            tiefengeothermie_co2 = menge * 0.00633 * helping_values["culture_length_usage"]
            tiefengeothermie_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Biomethan":
            bhkwerdgas_co2 = menge * 0.06785 * helping_values["culture_length_usage"]
            bhkwerdgas_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Erdgas":
            bhkwbiomethan_co2 = menge * 0.252 * helping_values["culture_length_usage"]
            bhkwbiomethan_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Diesel":
            diesel_co2 = menge * 0.048675561 * helping_values["culture_length_usage"]
            diesel_anteil = menge / helping_values["energyconsumption_company"]
        else:
            raise ValueError('No valid option for Stromherkunft has been selected')

        # Tiefengeothermie: !!!Falls bei Wärmeverbrauch ausgewählt, dann Wert=0!!!
        # BHKW-Erdgas: !!!Falls BHKW ausgewählt, dann Wert=0!!!
        # BHKW-Biomethan: !!!Falls BHKW ausgewählt, dann Wert=0!!!
        for option in data["Energietraeger"]:
            if all_options.get(id=option[0]).option_value == "Tiefengeothermie":
                tiefengeothermie_co2 = 0
        if all_options.get(id=data["BHKW"][0][0]).option_value == "ja":
            bhkwerdgas_co2 = 0
            bhkwbiomethan_co2 = 0

    strom_gesamt_co2 = deutscher_strommix_co2 + oekostrom_co2 + photovoltaik_co2 + windenergie_land_co2 + windenergie_see_co2 + wasserkraft_co2 + tiefengeothermie_co2 + bhkwerdgas_co2 + bhkwbiomethan_co2 + diesel_co2
    # Take Belichtung into account if it isn't already included in the calculation
    if all_options.get(id=data["Zusatzbelichtung"][0][0]).option_value == "ja" and all_options.get(id=data["Belichtungsstrom"][0][0]).option_value == "nein":
        deutscher_strommix_co2 = deutscher_strommix_co2 + (helping_values["energyconsumption_lighting"] * deutscher_strommix_anteil * 0.485)
        oekostrom_co2 = oekostrom_co2 + (helping_values["energyconsumption_lighting"] * oekostrom_anteil * 0.024293333)
        photovoltaik_co2 = photovoltaik_co2 + (helping_values["energyconsumption_lighting"] * photovoltaik_anteil * 0.05571)
        windenergie_land_co2 = windenergie_land_co2 + (helping_values["energyconsumption_lighting"] * windenergie_land_anteil * 0.0088)
        windenergie_see_co2 = windenergie_see_co2 + (helping_values["energyconsumption_lighting"] * windenergie_see_anteil * 0.00437)
        wasserkraft_co2 = wasserkraft_co2 + (helping_values["energyconsumption_lighting"] * wasserkraft_anteil * 0.0027)
        tiefengeothermie_co2 = tiefengeothermie_co2 + (helping_values["energyconsumption_lighting"] * tiefengeothermie_anteil * 0.00633)
        bhkwerdgas_co2 = bhkwerdgas_co2 + (helping_values["energyconsumption_lighting"] * bhkwerdgas_anteil * 0.06785)
        bhkwbiomethan_co2 = bhkwbiomethan_co2 + (helping_values["energyconsumption_lighting"] * bhkwbiomethan_anteil * 0.252)
        diesel_co2 = diesel_co2 + (helping_values["energyconsumption_lighting"] * diesel_anteil * 0.048675561)
        strom_gesamt_co2 = deutscher_strommix_co2 + oekostrom_co2 + photovoltaik_co2 + windenergie_land_co2 + windenergie_see_co2 + wasserkraft_co2 + tiefengeothermie_co2 + bhkwerdgas_co2 + bhkwbiomethan_co2 + diesel_co2
        print("deutscher_strommix_co2: " + str(deutscher_strommix_co2))
        print("oekostrom_co2: " + str(oekostrom_co2))
        print("photovoltaik_co2: " + str(photovoltaik_co2))
        print("windenergie_land_co2: " + str(windenergie_land_co2))
        print("windenergie_see_co2: " + str(windenergie_see_co2))
        print("wasserkraft_co2: " + str(wasserkraft_co2))
        print("tiefengeothermie_co2: " + str(tiefengeothermie_co2))
        print("bhkwerdgas_co2: " + str(bhkwerdgas_co2))
        print("bhkwbiomethan_co2: " + str(bhkwbiomethan_co2))
        print("diesel_co2: " + str(diesel_co2))


    print("strom: " + str(strom_gesamt_co2))
    return strom_gesamt_co2


def calc_co2_added(data, helping_values, all_options):

    # CO2-Herkunft
    co2_zudosierung = 0
    for option in data["CO2-Herkunft"]:
        # Check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kg":
            raise ValueError('CO2-Herkunft value unit has not been converted to kg!')

        co2_zudosierungtyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if co2_zudosierungtyp == "technisches CO2":
            co2_zudosierung = co2_zudosierung + menge * 0.5
        elif co2_zudosierungtyp == "direkte Gasverbrennung":
            co2_zudosierung = co2_zudosierung + menge * 0.252
        elif co2_zudosierungtyp == "eigenes BHKW":  # There is no need to check, if energietraeger uses bhkw since it has no impact anyways.
            co2_zudosierung = co2_zudosierung + menge * 0
        else:
            raise ValueError('No valid option for CO2-Herkunft has been selected')

    print("co2_zudosierung: " + str(co2_zudosierung))
    return co2_zudosierung


def calc_fertilizer_co2(data, helping_values, all_options):
    # CO2-Herkunft
    duengemittel_einfach = 0
    for option in data["Duengemittel:VereinfachteAngabe"]:
        # TODO Korrekte Äquivalente einfügen
        duengemittel_einfachtyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if duengemittel_einfachtyp == "A/B Bag: Standardduengung":
            duengemittel_einfach = duengemittel_einfach + menge * 1
        elif duengemittel_einfachtyp == "Vinasse":
            duengemittel_einfach = duengemittel_einfach + menge * 2
        elif duengemittel_einfachtyp == "Pferdemist":
            duengemittel_einfach = duengemittel_einfach + menge * 3
        elif duengemittel_einfachtyp == "Kompost":
            duengemittel_einfach = duengemittel_einfach + menge * 4
        elif duengemittel_einfachtyp == "Hornmehl, -griess, -spaene":
            duengemittel_einfach = duengemittel_einfach + menge * 5
        elif duengemittel_einfachtyp == "Blutmehl":
            duengemittel_einfach = duengemittel_einfach + menge * 6
        elif duengemittel_einfachtyp == "Mist":
            duengemittel_einfach = duengemittel_einfach + menge * 7
        elif duengemittel_einfachtyp == "Gruenduengung":
            duengemittel_einfach = duengemittel_einfach + menge * 8
        elif duengemittel_einfachtyp == "Knochenmehl":
            duengemittel_einfach = duengemittel_einfach + menge * 9
        elif duengemittel_einfachtyp == "Pflanzkali":
            duengemittel_einfach = duengemittel_einfach + menge * 10
        elif duengemittel_einfachtyp == "org. Vollduenger":
            duengemittel_einfach = duengemittel_einfach + menge * 11
        else:
            raise ValueError('No valid option for Duengemittel:VereinfachteAngabe has been selected')

    duengemittel_detailliert = 0
    for option in data["Duengemittel:DetaillierteAngabe"]:
    # TODO Korrekte Äquivalente einfügen
        duengemittel_detaillierttyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if duengemittel_detaillierttyp == "Ammoniumnitrat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 1.94
        elif duengemittel_detaillierttyp == "Kaliumnitrat (Kalisalpeter)":
            duengemittel_detailliert = duengemittel_detailliert + menge * 0.677
        elif duengemittel_detaillierttyp == "Calciumnitrat fluessig (Kalksalpeter)":
            duengemittel_detailliert = duengemittel_detailliert + menge * 4.43
        elif duengemittel_detaillierttyp == "Calciumnitrat fest":
            duengemittel_detailliert = duengemittel_detailliert + menge * 4.43
        elif duengemittel_detaillierttyp == "Kaliumcholird, KCL, muriate of potash":
            duengemittel_detailliert = duengemittel_detailliert + menge * 0.377
        elif duengemittel_detaillierttyp == "Kaliumsulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 1.13
        elif duengemittel_detaillierttyp == "Monokaliumphosphat (Flory6)":
            duengemittel_detailliert = duengemittel_detailliert + menge * 0.729
        elif duengemittel_detaillierttyp == "Borax":
            duengemittel_detailliert = duengemittel_detailliert + menge * 1.62
        elif duengemittel_detaillierttyp == "Eisen DDTPA 3%":
            duengemittel_detailliert = duengemittel_detailliert + menge * 1
        elif duengemittel_detaillierttyp == "Eisen EDDHA 6 %":
            duengemittel_detailliert = duengemittel_detailliert + menge * 2
        elif duengemittel_detaillierttyp == "25 % Cu Kupfersulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 3
        elif duengemittel_detaillierttyp == "32 % Mn Mangansulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 4
        elif duengemittel_detaillierttyp == "Natriummolybdat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 5
        elif duengemittel_detaillierttyp == "Zinksulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 6
        elif duengemittel_detaillierttyp == "Chlorbleichlauge":
            duengemittel_detailliert = duengemittel_detailliert + menge * 7
        elif duengemittel_detaillierttyp == "Bittersalz":
            duengemittel_detailliert = duengemittel_detailliert + menge * 8
        elif duengemittel_detaillierttyp == "Phosphorsaeure 75%":
            duengemittel_detailliert = duengemittel_detailliert + menge * 9
        elif duengemittel_detaillierttyp == "Salpetersaeure 65%":
            duengemittel_detailliert = duengemittel_detailliert + menge * 10
        elif duengemittel_detaillierttyp == "Salpetersaeure 38%":
            duengemittel_detailliert = duengemittel_detailliert + menge * 11
        elif duengemittel_detaillierttyp == "Kalksalpeter":
            duengemittel_detailliert = duengemittel_detailliert + menge * 12
        elif duengemittel_detaillierttyp == "Magnesiumnitrat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 13
        elif duengemittel_detaillierttyp == "Magnesiumsulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 14
        elif duengemittel_detaillierttyp == "Kalisilikat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 15
        elif duengemittel_detaillierttyp == "Mangansulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 16
        elif duengemittel_detaillierttyp == "Kupfersulfat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 17
        elif duengemittel_detaillierttyp == "Ammoniummolybdat":
            duengemittel_detailliert = duengemittel_detailliert + menge * 18
        else:
            raise ValueError('No valid option for Duengemittel:DetaillierteAngabe has been selected')

    print("duengemittel: " + str(duengemittel_detailliert+duengemittel_einfach))
    return duengemittel_einfach + duengemittel_detailliert


def calc_psm_co2(data):
    fungizide = data["FungizideKg"][0] * 11
    insektizide = data["InsektizideKg"][0] * 11

    print("psm: " + str(fungizide+insektizide))
    return fungizide + insektizide


def calc_nuetzlinge_co2(data, helping_values, all_options):
    # Nuetzlinge
    # TODO Korrekte Äquivalente einfügen
    nuetzlinge_co2 = 0
    for option in data["Nuetzlinge"]:
        nuetzlingeart = all_options.get(id=option[0]).option_value
        menge = option[1]

        if nuetzlingeart == "Hummeln":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 1
        elif nuetzlingeart == "Erzwespe (Encasia, Eretmocerus, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 2
        elif nuetzlingeart == "Macrolophus (oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 3
        elif nuetzlingeart == "Schlupfwespen (Aphidius, Dacnusa, Diglyphus, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 4
        elif nuetzlingeart == "Raubmilben (Phytoseiulus, Amblyseius, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 5
        elif nuetzlingeart == "Gallmuecken (Aphidoletes, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 6
        elif nuetzlingeart == "Florfliegen (Chrysoperla, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 7
        elif nuetzlingeart == "Futter fuer Macrolophus (Ephestia-Eier, Sitrotroga-Eier, Artemia, oder vergleichbares)":
            nuetzlinge_co2 = nuetzlinge_co2 + menge * 8
        else:
            raise ValueError('No valid option for Nuetzlinge has been selected')

    print("nuetzlinge_co2: " + str(nuetzlinge_co2))
    return nuetzlinge_co2


def calc_pflanzenbehaelter_co2(data, helping_values, all_options):

    # Growbags + Kuebel
    growbagskuebelverwendung = all_options.get(id=data["GrowbagsKuebel"][0][0]).option_value
    growbags_co2 = 0
    kuebel_co2 = 0
    volumen = 0
    if growbagskuebelverwendung == "Growbags":
        growbags_co2 = ((helping_values["row_length_total"]*0.2*2+helping_values["row_length_total"]*0.11*2+helping_values["row_length_total"]/1*2*(0.15*0.11))*0.186) * 2.78897
    elif growbagskuebelverwendung == "Kuebel":
        if data["Kuebel:Alter"][0] <= 10:
            kuebel_co2 = ((0.03*data["Kuebel:VolumenProTopf"][0]-0.0214) / (data["Kuebel:JungpflanzenProTopf"][0]*helping_values["plant_count_total"]) / 10) * 2.88
    elif growbagskuebelverwendung == "nichts":
        growbags_co2 = 0  # nothing
    else:
        raise ValueError('No valid option for GrowbagsKuebel has been selected')

    print("pflanzenbehaelter: " + str(growbags_co2+kuebel_co2))
    return growbags_co2+kuebel_co2


def calc_substrate_co2(data, helping_values, all_options):

    # Substrat
    substrat_co2 = 0
    volumen = 0
    # Asign the correct volume for the selected pflanzenbehaelter
    # TODO Berechnung nochmal überprüfen !
    growbagskuebelverwendung = all_options.get(id=data["GrowbagsKuebel"][0][0]).option_value
    if growbagskuebelverwendung == "Growbags":
        volumen = helping_values["row_length_total"] * 2 * 0.11
    elif growbagskuebelverwendung == "Kuebel":
        volumen = data["Kuebel:VolumenProTopf"][0]/data["Kuebel:JungpflanzenProTopf"][0] * helping_values["plant_count_total"]

    for option in data["Substrat"]:
        substratmaterial = all_options.get(id=option[0]).option_value
        nutzdauer = option[1]

        if substratmaterial == "Standardsubstrat":
            substrat_co2 = substrat_co2 + (volumen * 100)/nutzdauer
        elif substratmaterial == "Kokos":
            substrat_co2 = substrat_co2 + (volumen * 33.29)/nutzdauer
        elif substratmaterial == "Steinwolle":
            substrat_co2 = substrat_co2 + (volumen * 93.01)/nutzdauer
        elif substratmaterial == "Perlite":
            substrat_co2 = substrat_co2 + (volumen * 93.37) / nutzdauer
        elif substratmaterial == "Nachhaltiges Substrat":
            substrat_co2 = substrat_co2 + (volumen * 16.01) / nutzdauer
        else:
            raise ValueError('No valid option for Substrat has been selected')


    print("substrat_co2: " + str(substrat_co2))
    return substrat_co2


def calc_young_plants_substrate_co2(data, helping_values, all_options):
    jungpflanzen_substratmaterial = all_options.get(id=data["Jungpflanzen:Substrat"][0][0]).option_value
    jungpflanzenverwendung = all_options.get(id=data["Jungpflanzen:Zukauf"][0][0]).option_value
    junpflanzen_substrat_co2 = 0
    volumen = (0.1*0.1*0.1) * helping_values["plant_count_total"]
    if jungpflanzenverwendung == "nein":
        return junpflanzen_substrat_co2
    elif jungpflanzenverwendung == "ja":
        if jungpflanzen_substratmaterial == "Standardsubstrat":
            junpflanzen_substrat_co2 = (volumen * 100)
        elif jungpflanzen_substratmaterial == "Kokos":
            junpflanzen_substrat_co2 = (volumen * 33.29)
        elif jungpflanzen_substratmaterial == "Steinwolle":
            junpflanzen_substrat_co2 = (volumen * 93.01)
        elif jungpflanzen_substratmaterial == "Perlite":
            junpflanzen_substrat_co2 = (volumen * 93.37)
        elif jungpflanzen_substratmaterial == "Nachhaltiges Substrat":
            junpflanzen_substrat_co2 = (volumen * 16.01)
        else:
            raise ValueError('No valid option for Jungpflanzen:Substrat has been selected')
    else:
        raise ValueError('No valid option for Jungpflanzen:Zukauf has been selected')

    print("jungpflanzen_substrat_co2: " + str(junpflanzen_substrat_co2))
    return junpflanzen_substrat_co2


def calc_young_plants_transport_co2(data, helping_values, all_options):

    young_plants_transport_co2 = helping_values["plant_count_total"] / 1056 * 0.5 * data["Jungpflanzen:Distanz"][0] * 0.112

    print("young_plants_transport_co2: " + str(young_plants_transport_co2))
    return young_plants_transport_co2

def calc_cords_co2(data, helping_values, all_options):

    schnuerematerial = all_options.get(id=data["SchnuereRankhilfen:Material"][0][0]).option_value
    schnuere_co2 = 0
    nutzdauer = data["SchnuereRankhilfen:Wiederverwendung"][0]
    if schnuerematerial == "Kunststoff":
        schnuere_co2 = ((helping_values["cord_length_total"] * 1/1000) * 1.73) / nutzdauer
    elif schnuerematerial == "Jute":
        schnuere_co2 = ((helping_values["cord_length_total"] * 3/900) * 0.4) / nutzdauer
    elif schnuerematerial == "Sisal":
        schnuere_co2 = ((helping_values["cord_length_total"] * 3/900) * 0.4) / nutzdauer
    elif schnuerematerial == "Zellulose":
        schnuere_co2 = ((helping_values["cord_length_total"] * 3/900) * 0.4) / nutzdauer
    elif schnuerematerial == "andere Nachhaltige/abbaubare Option Substrat":
        schnuere_co2 = ((helping_values["cord_length_total"] * 3/900) * 0.4) / nutzdauer
    elif schnuerematerial == "Bambusstab":
        schnuere_co2 = ((helping_values["cord_length_total"] * 0.32) * 1.2) / nutzdauer
    elif schnuerematerial == "Edelstahl":
        schnuere_co2 = ((helping_values["cord_length_total"] * 0.62) * 1.712) / nutzdauer
    else:
        raise ValueError('No valid option for SchnuereRankhilfen:Material has been selected')

    print("schnuere_co2: " + str(schnuere_co2))
    return schnuere_co2


def calc_clips_co2(data, helping_values, all_options):

    klipseverwendung = all_options.get(id=data["Klipse"][0][0]).option_value
    klipsematerial = all_options.get(id=data["Klipse:Material"][0][0]).option_value
    klipse_co2 = 0
    nutzdauer = data["Klipse:Wiederverwendung"][0]
    if klipseverwendung == "nein":
        return klipse_co2
    if klipseverwendung == "ja":
        if klipsematerial == "Kunststoff":
            klipse_co2 = ((helping_values["clips_count_total"] * 0.0005) * 1.73) / nutzdauer
        elif klipsematerial == "Metall":
            klipse_co2 = ((helping_values["clips_count_total"] * 0.0008) * 1.73) / nutzdauer
        elif klipsematerial == "Nachhaltige / kompostierbare Option":
            klipse_co2 = ((helping_values["clips_count_total"] * 0.0008) * 0.4) / nutzdauer
        else:
            raise ValueError('No valid option for Klipse:Material has been selected')
    else:
        raise ValueError('No valid option for Klipse has been selected')

    print("klipse_co2: " + str(klipse_co2))
    return klipse_co2


def calc_panicle_hanger_co2(data, helping_values, all_options):

    rispenbuegelverwendung = all_options.get(id=data["Rispenbuegel"][0][0]).option_value
    rispenbuegelmaterial = all_options.get(id=data["Rispenbuegel:Material"][0][0]).option_value
    rispenbuegel_co2 = 0
    nutzdauer = data["Rispenbuegel:Wiederverwendung"][0]
    if rispenbuegelverwendung == "nein":
        return rispenbuegel_co2
    if rispenbuegelverwendung == "ja":
        if rispenbuegelmaterial == "Kunststoff":
            rispenbuegel_co2 = ((helping_values["panicle_hanger_count_total"] * 0.0008) * 1.73) / nutzdauer
        elif rispenbuegelmaterial == "Metall":
            rispenbuegel_co2 = ((helping_values["panicle_hanger_count_total"] * 0.001) * 1.73) / nutzdauer
        elif rispenbuegelmaterial == "Nachhaltige / kompostierbare Option":
            rispenbuegel_co2 = ((helping_values["panicle_hanger_count_total"] * 0.001) * 0.4) / nutzdauer
        else:
            raise ValueError('No valid option for Rispenbuegel:Material has been selected')
    else:
        raise ValueError('No valid option for Rispenbuegel has been selected')

    print("rispenbuegel_co2: " + str(rispenbuegel_co2))
    return rispenbuegel_co2


def calc_irrigation_co2(data, helping_values, all_options):

    bewaesserungmaterial = all_options.get(id=data["Bewaesserungsart"][0][0]).option_value
    bewaesserung_co2 = 0

    if bewaesserungmaterial == "Tropfschlaeuche":
        bewaesserung_co2 = (((helping_values["row_length_total"] + data["Breite"][0]) * 1.36/100) * 2.67) / 10
    elif bewaesserungmaterial == "Bodenschsprenkler":
        bewaesserung_co2 = (((helping_values["row_length_total"] + data["Breite"][0]) * 4/30) * 2.67) / 15
    elif bewaesserungmaterial == "Handschlauch":
        bewaesserung_co2 = (((helping_values["row_length_total"] + data["Breite"][0]) * 4/30) * 2.67) / 15
    else:
        raise ValueError('No valid option for Bewaesserungsart has been selected')

    print("bewaesserung_co2: " + str(bewaesserung_co2))
    return bewaesserung_co2


def calc_packaging_co2(data, helping_values, all_options):
    # Verpackungsmaterial
    verpackung_co2 = 0
    for option in data["Verpackungsmaterial"]:
        verpackungmaterial = all_options.get(id=option[0]).option_value
        menge = option[1]
        if verpackungmaterial == "Karton":
            verpackung_co2 = verpackung_co2 + menge * 0.748
        elif verpackungmaterial == "Plastik":
            verpackung_co2 = verpackung_co2 + menge * 1.73
        else:
            raise ValueError('No valid option for Verpackungsmaterial has been selected')

    # Mehrwegsteigen
    verpackung_co2 = verpackung_co2 + (data["Verpackungsmaterial:AnzahlMehrwegsteigen"][0] / 50 * 0.003662)

    print("verpackung_co2: " + str(verpackung_co2))
    return verpackung_co2


def calc_other_consumables_co2(data, helping_values, all_options):
    # Sonstige Verbrauchsmaterialien
    sonstige_verbrauchsmaterialien_co2 = 0
    for option in data["SonstigeVerbrauchsmaterialien"]:
        sonstige_verbrauchsmaterialienmaterial = all_options.get(id=option[0]).option_value
        menge = option[1]
        nutzdauer = option[3]
        if sonstige_verbrauchsmaterialienmaterial == "Folie":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 2.67 / nutzdauer
        elif sonstige_verbrauchsmaterialienmaterial == "Eisen":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 1.5641297 / nutzdauer
        elif sonstige_verbrauchsmaterialienmaterial == "Alluminium":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 14.6 / nutzdauer
        elif sonstige_verbrauchsmaterialienmaterial == "Kunststoff":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 1.73 / nutzdauer
        elif sonstige_verbrauchsmaterialienmaterial == "Holz":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 0.0044 / nutzdauer
        elif sonstige_verbrauchsmaterialienmaterial == "Pappe":
            sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 0.748 / nutzdauer
        else:
            raise ValueError('No valid option for SonstigeVerbrauchsmaterialien has been selected')

    print("sonstige_verbrauchsmaterialien_co2: " + str(sonstige_verbrauchsmaterialien_co2))
    return sonstige_verbrauchsmaterialien_co2


def calc_transport_co2(data, helping_values, all_options):

    transport_co2 = 0

    snackVerwendung = all_options.get(id=data["10-30Gramm(Snack)"][0][0]).option_value
    cocktailVerwendung = all_options.get(id=data["30-100Gramm(Cocktail)"][0][0]).option_value
    rispenVerwendung = all_options.get(id=data["100-150Gramm(Rispen)"][0][0]).option_value
    fleischVerwendung = all_options.get(id=data[">150Gramm(Fleisch)"][0][0]).option_value
    distanz = data["Transport:Distanz"][0]

    if snackVerwendung == "ja":
        transport_co2 = transport_co2 + data["SnackErtragJahr"][0] * distanz * 0.112
    if cocktailVerwendung == "ja":
        transport_co2 = transport_co2 + data["CocktailErtragJahr"][0] * distanz * 0.112
    if rispenVerwendung == "ja":
        transport_co2 = transport_co2 + data["RispenErtragJahr"][0] * distanz * 0.112
    if fleischVerwendung == "ja":
        transport_co2 = transport_co2 + data["FleischErtragJahr"][0] * distanz * 0.112

    print("transport_co2: " + str(transport_co2))
    return transport_co2


def calc_additional_machineusage_co2(data, helping_values, all_options):
    # Zusaetzlicher Machineneinsatz
    zusaetzlicher_maschineneinsatz_co2 = 0
    for option in data["ZusaetzlicherMaschineneinsatz"]:
        zusaetzlicher_maschineneinsatzart = all_options.get(id=option[0]).option_value
        verbrauch = option[1]
        nutzdauer = option[3]
        if zusaetzlicher_maschineneinsatzart == "Gabelstapler":
            zusaetzlicher_maschineneinsatz_co2 = zusaetzlicher_maschineneinsatz_co2 + verbrauch * nutzdauer * 0.476534124
        else:
            raise ValueError('No valid option for ZusaetzlicherMaschineneinsatz has been selected')

    print("zusaetzlicher_maschineneinsatz_co2: " + str(zusaetzlicher_maschineneinsatz_co2))
    return zusaetzlicher_maschineneinsatz_co2



