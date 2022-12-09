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

from backend.models import Options, OptionUnits, OptionGroups
from .utils import default_value, default_option


def calc_co2_footprint(data):
    all_options = Options.objects.all()
    helping_values = calc_helping_values(data, all_options)
    konstruktion_co2, energieschirm_co2, bodenabdeckung_co2, produktionssystem_co2, bewaesserungsart_co2, heizsystem_co2, zusaetzliches_heizsystem_co2, \
    konstruktion_h2o, energieschirm_h2o, bodenabdeckung_h2o, produktionssystem_h2o, bewaesserung_h2o, heizsystem_h2o, zusaetzliches_heizsystem_h2o = calc_greenhouse_construction(data, helping_values, all_options)
    energietraeger_co2, energietraeger_h2o = calc_energy_source(data, helping_values, all_options)
    strom_co2, strom_h2o = calc_electric_power(data, helping_values, all_options)
    co2_zudosierung_co2, co2_zudosierung_h2o = calc_co2_added(data, helping_values, all_options)
    duengemittel_co2, duengemittel_h2o = calc_fertilizer(data, helping_values, all_options)
    psm_co2, psm_h2o = calc_psm(data)
    pflanzenbehaelter_co2, pflanzenbehaelter_h2o = calc_pflanzenbehaelter(data, helping_values, all_options)
    substrat_co2, substrat_h2o = calc_substrate(data, helping_values, all_options)
    junpflanzen_substrat_co2, junpflanzen_substrat_h2o = calc_young_plants_substrate(data, helping_values, all_options)
    young_plants_transport_co2, young_plants_transport_h2o = calc_young_plants_transport(data, helping_values, all_options)
    schnuere_co2, schnuere_h2o = calc_cords(data, helping_values, all_options)
    klipse_co2, klipse_h2o = calc_clips(data, helping_values, all_options)
    rispenbuegel_co2, rispenbuegel_h2o = calc_panicle_hanger(data, helping_values, all_options)
    verpackung_co2, verpackung_h2o = calc_packaging(data, helping_values, all_options)
    sonstige_verbrauchsmaterialien_co2, sonstige_verbrauchsmaterialien_h2o = calc_other_consumables(data, helping_values, all_options)

    calculation_results = {
        "konstruktion_co2": konstruktion_co2,
        "energieschirm_co2": energieschirm_co2,
        "bodenabdeckung_co2": bodenabdeckung_co2,
        "produktionssystem_co2": produktionssystem_co2,
        "heizsystem_co2": heizsystem_co2,
        "zusaetzliches_heizsystem_co2": zusaetzliches_heizsystem_co2,
        "bewaesserung_co2": bewaesserungsart_co2,
        "energietraeger_co2": energietraeger_co2,
        "strom_co2": strom_co2,
        "co2_zudosierung_co2": co2_zudosierung_co2,
        "duengemittel_co2": duengemittel_co2,
        "psm_co2": psm_co2,
        "pflanzenbehaelter_co2": pflanzenbehaelter_co2,
        "substrat_co2": substrat_co2,
        "jungpflanzen_substrat_co2": junpflanzen_substrat_co2,
        "jungpflanzen_transport_co2": young_plants_transport_co2,
        "schnuere_co2": schnuere_co2,
        "klipse_co2": klipse_co2,
        "rispenbuegel_co2": rispenbuegel_co2,
        "verpackung_co2": verpackung_co2 ,
        "sonstige_verbrauchsmaterialien_co2": sonstige_verbrauchsmaterialien_co2
    }
    co2_footprint = sum(calculation_results.values())
    print("co2_footprint: " + str(co2_footprint))

    calculation_results["co2_footprint"] = co2_footprint
    calculation_results["co2_footprint_norm"] = co2_footprint / (
            data["SnackErtragJahr"][0] +
            data["CocktailErtragJahr"][0] +
            data["RispenErtragJahr"][0] +
            data["FleischErtragJahr"][0]
    )

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
        culture_length = (52 - round(data["KulturBeginn"][0], 0)) + round(data["KulturEnde"][0], 0)
    if data["NebenkulturEnde"][0] > data["NebenkulturBeginn"][0]:
        side_culture_length = round(data["NebenkulturEnde"][0]-data["NebenkulturBeginn"][0], 0)
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
    snack_shoots_count = snack_count*data["SnackTriebzahl"][0]
    cocktail_shoots_count = cocktail_count*data["CocktailTriebzahl"][0]
    rispen_shoots_count = rispen_count*data["RispenTriebzahl"][0]
    fleisch_shoots_count = fleisch_count*data["FleischTriebzahl"][0]
    shoots_count_total = snack_shoots_count+cocktail_shoots_count+rispen_shoots_count+fleisch_shoots_count
    cord_length_total = data["SchnuereRankhilfen:Laenge"][0]*shoots_count_total
    clips_count_total = data["Klipse:AnzahlProTrieb"][0]*shoots_count_total
    panicle_hanger_count_total = rispen_shoots_count*data["Rispenbuegel:AnzahlProTrieb"][0] + fleisch_shoots_count * data["Rispenbuegel:AnzahlProTrieb"][0]

    # Check if bhkw is used or not
    energietraeger_id = OptionGroups.objects.get(option_group_name="Energietraeger").id
    bhkw_erdgas_option = all_options.get(option_group=energietraeger_id, option_value="BHKW Erdgas").id
    bhkw_biomethan_option = all_options.get(option_group=energietraeger_id, option_value="BHKW Biomethan").id
    bhkw_usage = False
    for option in data["Energietraeger"]:
        if option[0] == bhkw_erdgas_option or option[0] == bhkw_biomethan_option:
            bhkw_usage = True


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
    print("bhkw_usage: " + str(bhkw_usage))
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
        "panicle_hanger_count_total": panicle_hanger_count_total,
        "bhkw_usage": bhkw_usage
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
    if (data["Nutzflaeche"][0] > 0): return data["Nutzflaeche"][0]
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


def calc_greenhouse_construction(data, helping_values, all_options):
    # First check which kind of greenhouse is used
    norm_id = data["GWHArt"][0][0]
    norm_name = all_options.get(id=norm_id).option_value
    stehwandmaterial= all_options.get(id=data["Stehwandmaterial"][0][0]).option_value
    bedachungsmaterial = all_options.get(id=data["Bedachungsmaterial"][0][0]).option_value

    beton_co2 = 0
    stahl_co2 = 0
    aluminium_co2 = 0
    lpde_co2 = 0
    stehwand_co2 = 0
    bedachung_co2 = 0

    beton_h2o = 0
    stahl_h2o = 0
    aluminium_h2o = 0
    lpde_h2o = 0
    stehwand_h2o = 0
    bedachung_h2o = 0

    # GWHart
    if norm_name == "Venlo" or norm_name == "Deutsche Norm":
        # Materials
        if data["GWHAlter"][0] <= 20:
            if norm_name == "Venlo":
                beton = helping_values["gh_size"] * 2.52032 * helping_values["culture_length_usage"]
                beton_co2 = beton * 0.1707
                beton_h2o = beton * 0.1707

                stahl = helping_values["gh_size"] * 0.55 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * 1.5641297
                stahl_h2o = stahl * 1.5641297

                aluminium = helping_values["gh_size"] * 0.125 * helping_values["culture_length_usage"]
                aluminium_co2 = 14.365981 * aluminium
                aluminium_h2o = 14.365981 * aluminium
            elif norm_name == "Deutsche Norm":
                beton = helping_values["gh_size"] * 2.52 * helping_values["culture_length_usage"]
                beton_co2 = beton * 0.1707
                beton_h2o = beton * 0.1707

                stahl = helping_values["gh_size"] * 0.55 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * 1.5641297
                stahl_h2o = stahl * 1.5641297

                aluminium = helping_values["gh_size"] * 0.015 * helping_values["culture_length_usage"]
                aluminium_co2 = aluminium * 14.365981
                aluminium_h2o = aluminium * 14.365981

        # Stehwand
        if stehwandmaterial == "Einfachglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"] * 0.664 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 1.1
                stehwand_h2o = stehwand * 1.1
        elif stehwandmaterial == "Doppelglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"] * 1.328 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 1.1
                stehwand_h2o = stehwand * 1.1
        elif stehwandmaterial == "Doppelstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"] * 0.17 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 1
                stehwand_h2o = stehwand * 1
        elif stehwandmaterial == "Dreifachstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"] * 0.27 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 1
                stehwand_h2o = stehwand * 1
        elif stehwandmaterial == "Einfachfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"] * 0.0374 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 2.78897
                stehwand_h2o = stehwand * 2.78897
        elif stehwandmaterial == "Doppelfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"] * 0.0748 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * 2.78897
                stehwand_h2o = stehwand * 2.78897
        else:
            raise ValueError('No valid option for Stehwandmaterial has been selected')

        # Bedachung
        if bedachungsmaterial == "Einfachglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 0.664 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 1.1
                bedachung_h2o = bedachung * 1.1
        elif bedachungsmaterial == "Doppelglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 1.328 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 1.1
                bedachung_h2o = bedachung * 1.1
        elif bedachungsmaterial == "Doppelstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.17 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 1
                bedachung_h2o = bedachung * 1
        elif bedachungsmaterial == "Dreifachstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.27 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 1
                bedachung_h2o = bedachung * 1
        elif bedachungsmaterial == "Einfachfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0374 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 2.78897
                bedachung_h2o = bedachung * 2.78897
        elif bedachungsmaterial == "Doppelfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0748 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * 2.78897
                bedachung_h2o = bedachung * 2.78897
        else:
            raise ValueError('No valid option for Bedachungsmaterial has been selected')

    elif norm_name == "Folientunnel":
        if(bedachungsmaterial == "Einfachfolie"):
            if data["AlterBedachungsmaterial"][0] <= 5:
                lpde = helping_values["hull_size"]["total"] * 0.06 * helping_values["culture_length_usage"]
                lpde_co2 = lpde * 2.78897
                lpde_h2o = lpde * 2.78897
            if data["GWHAlter"][0] <= 20:
                stahl = helping_values["gh_size"] * 0.13 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * 1.5641297
                stahl_h2o = stahl * 1.5641297
        else: # Assume Doppelfolie has been selected. If something else has been selected this will be assumed to not cause unneccessary errors.
            if data["AlterBedachungsmaterial"][0] <= 5:
                lpde = helping_values["hull_size"]["total"] * 0.14 * helping_values["culture_length_usage"]
                lpde_co2 = lpde * 2.78897
                lpde_h2o = lpde * 2.78897
            if data["AlterBedachungsmaterial"][0] <= 5:
                stahl = helping_values["gh_size"] * 0.195 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * 1.5641297
                stahl_h2o = stahl * 1.5641297
    else:
        raise ValueError('No valid option for GWHArt has been selected')

    # Energieschirm
    energieschirm_co2 = 0
    energieschirm_h2o = 0
    energieschirmverwendung = all_options.get(id=data["Energieschirm"][0][0]).option_value

    if data["AlterEnergieschirm"][0] <= 10 and energieschirmverwendung == "ja":
        energieschirmmaterial = all_options.get(id=data["EnergieschirmTyp"][0][0]).option_value
        if energieschirmmaterial == "einfach":
            energieschirm = helping_values["gh_size"] * 0.05 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * 2.67
            energieschirm_h2o = energieschirm * 2.67
        elif energieschirmmaterial == "doppelt":
            energieschirm = helping_values["gh_size"] * 0.1 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * 2.67
            energieschirm_h2o = energieschirm * 2.67
        elif energieschirmmaterial == "einfach, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.05 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * 4.5168
            energieschirm_h2o = energieschirm * 4.5168
        elif energieschirmmaterial == "doppelt, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.1 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * 4.5168
            energieschirm_h2o = energieschirm * 4.5168
        else:
            raise ValueError('No valid option for Energieschirm has been selected')

    # Bodenabdeckung
    bodenabdeckung_co2 = 0
    bodenabdeckung_h2o = 0
    if data["Bodenabdeckung"] != default_option:
        for option in data["Bodenabdeckung"]:
            bodenabdeckungmaterial = all_options.get(id=option[0]).option_value
            nutzdauer = option[1]
            if bodenabdeckungmaterial == "Bodenfolie":
                if nutzdauer <= 10:
                    bodenabdeckung = helping_values["culture_size"] * 0.01
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * 2.67
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * 2.67
            elif bodenabdeckungmaterial == "Bodengewebe":
                if nutzdauer <= 10:
                    bodenabdeckung = helping_values["culture_size"] * 0.02
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * 2.67
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * 2.67
            elif bodenabdeckungmaterial == "Beton":
                if nutzdauer <= 20:
                    bodenabdeckung = helping_values["culture_size"] * 2.52
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * 0.1707
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * 0.1707
            else:
                raise ValueError('No valid option for Bodenabdeckung has been selected')

    # Produktionssystem
    produktionssystemtyp = all_options.get(id=data["Produktionssystem"][0][0]).option_value
    produktionstyp = all_options.get(id=data["Produktionstyp"][0][0]).option_value
    produktionssystem_co2 = 0
    produktionssystem_h2o = 0
    if data["AlterProduktionssystem"][0] <= 15:
        if produktionssystemtyp == "Boden" or produktionstyp == "Biologisch":  # Biologisch doesn't have Produktionssystem
            pass
        elif produktionssystemtyp == "Hydroponik offen":
            produktionssystem = helping_values["row_length_total"] * 2 * 0.133333333
            produktionssystem_co2 = produktionssystem * 1.73
            produktionssystem_h2o = produktionssystem * 1.73
        elif produktionssystemtyp == "Hydroponik geschlossen":
            produktionssystem = helping_values["row_length_total"] * 2 * 0.133333333
            produktionssystem_co2 = produktionssystem * 1.73
            produktionssystem_h2o = produktionssystem * 1.73
        else:
            raise ValueError('No valid option for Produktionssystem has been selected')

    # Bewässerungsart
    bewaesserungmaterial = all_options.get(id=data["Bewaesserungsart"][0][0]).option_value
    bewaesserung_co2 = 0
    bewaesserung_h2o = 0
    if bewaesserungmaterial == "Tropfschlaeuche":
        bewaesserung = ((helping_values["row_length_total"] + data["Breite"][0]) * 1.36 / 100) / 10
        bewaesserung_co2 = bewaesserung * 2.67
        bewaesserung_h2o = bewaesserung * 2.67
    elif bewaesserungmaterial == "Bodenschsprenkler":
        bewaesserung = ((helping_values["row_length_total"]/3 + data["Breite"][0]) * 4 / 30) / 15
        bewaesserung_co2 = bewaesserung * 2.67
        bewaesserung_h2o = bewaesserung * 2.67
    elif bewaesserungmaterial == "Handschlauch":
        bewaesserung = (math.sqrt(helping_values["gh_size"]*2.5) * 4 / 30) / 15
        bewaesserung_co2 = bewaesserung * 2.67
        bewaesserung_h2o = bewaesserung * 2.67
    else:
        raise ValueError('No valid option for Bewaesserungsart has been selected')

    # Heizsystem
    heizsystemtyp = all_options.get(id=data["Heizsystem"][0][0]).option_value
    heizsystem_co2 = 0
    heizsystem_h2o = 0

    if data["AlterHeizsystem"][0] <= 20:
        if heizsystemtyp == "Transportsystem":
            heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * 1.5641297
            heizsystem_h2o = heizsystem * 1.5641297
        elif heizsystemtyp == "Rohrheizung (hoch, niedrig, etc.)":
            heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * 1.5641297
            heizsystem_h2o = heizsystem * 1.5641297
        elif heizsystemtyp == "Konvektionsheizung":
            heizsystem = data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * 1.5641297
            heizsystem_h2o = heizsystem * 1.5641297
        elif heizsystemtyp == "Deckenlufterhitzer":
            pass
        elif heizsystemtyp == "Keines":
            pass
        else:
            raise ValueError('No valid option for Heizsystem has been selected')

    # Zusaetzliches Heizsystem
    zusaetzliches_heizsystem_co2 = 0
    zusaetzliches_heizsystem_h2o = 0
    zusaetzliches_heizsystemverwendung = all_options.get(id=data["ZusaetzlichesHeizsystem"][0][0]).option_value
    if zusaetzliches_heizsystemverwendung == "ja":
        zusaetzliches_heizsystemtyp = all_options.get(id=data["ZusaetzlichesHeizsystemTyp"][0][0]).option_value
        if data["AlterZusaetzlichesHeizsystem"][0] <= 20:
            if zusaetzliches_heizsystemtyp == "Transportsystem":
                zusaetzliches_heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * 1.5641297
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * 1.5641297
            elif heizsystemtyp == "Rohrheizung (hoch, niedrig, etc.)":
                heizsystem = helping_values["walk_length_total"] * 0.135 * 1.5641297
        if data["AlterZusaetzlichesHeizsystem"][0] <= 15:
            if zusaetzliches_heizsystemtyp == "Konvektionsheizung":
                zusaetzliches_heizsystem = data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * 1.5641297
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * 1.5641297
            elif zusaetzliches_heizsystemtyp == "Vegetationsheizung":
                zusaetzliches_heizsystem = helping_values["row_length_total"] * 2 * 0.133333333 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * 1.5641297
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * 1.5641297
            elif heizsystemtyp == "Deckenlufterhitzer":
                pass
            else:
                raise ValueError('No valid option for ZusaetzlichesHeizsystem has been selected')

    konstruktion_co2 = beton_co2 + stahl_co2 + aluminium_co2 + lpde_co2 + stehwand_co2 + bedachung_co2
    konstruktion_h2o = beton_h2o + stahl_h2o + aluminium_h2o + lpde_h2o + stehwand_h2o + bedachung_h2o
    gesamt_co2 = beton_co2 + stahl_co2 + aluminium_co2 + lpde_co2 + stehwand_co2 + bedachung_co2 + energieschirm_co2 + bodenabdeckung_co2 + produktionssystem_co2 + bewaesserung_co2 + heizsystem_co2 + zusaetzliches_heizsystem_co2
    gesamt_h2o = beton_h2o + stahl_h2o + aluminium_h2o + lpde_h2o + stehwand_h2o + bedachung_h2o + energieschirm_h2o + bodenabdeckung_h2o + produktionssystem_h2o + bewaesserung_h2o + heizsystem_h2o + zusaetzliches_heizsystem_h2o
    print("Gewächhauskonstruktion CO2:")
    print("beton_co2 " + str(beton_co2))
    print("aluminium_co2 " + str(aluminium_co2))
    print("lpde_co2 " + str(lpde_co2))
    print("stehwand_co2 " + str(stehwand_co2))
    print("bedachung_co2 " + str(bedachung_co2))
    print("energieschirm_co2 " + str(energieschirm_co2))
    print("bodenabdeckung_co2 " + str(bodenabdeckung_co2))
    print("produktionssystem_co2 " + str(produktionssystem_co2))
    print("bewässerungsart_co2 " + str(bewaesserung_co2))
    print("heizsystem_co2 " + str(heizsystem_co2))
    print("zusaetzliches_heizsystem_co2 " + str(zusaetzliches_heizsystem_co2))
    print("gwh-konstruktion_co2: " + str(gesamt_co2))

    print("Gewächhauskonstruktion H2O:")
    print("beton_h2o " + str(beton_h2o))
    print("aluminium_h2o " + str(aluminium_h2o))
    print("lpde_h2o " + str(lpde_h2o))
    print("stehwand_h2o " + str(stehwand_h2o))
    print("bedachung_h2o " + str(bedachung_h2o))
    print("energieschirm_h2o " + str(energieschirm_h2o))
    print("bodenabdeckung_h2o " + str(bodenabdeckung_h2o))
    print("produktionssystem_h2o " + str(produktionssystem_h2o))
    print("bewässerungsart_h2o " + str(bewaesserung_h2o))
    print("heizsystem_h2o " + str(heizsystem_h2o))
    print("zusaetzliches_heizsystem_h2o " + str(zusaetzliches_heizsystem_h2o))
    print("gwh-konstruktion_h2o: " + str(gesamt_co2))
    return konstruktion_co2, energieschirm_co2, bodenabdeckung_co2, produktionssystem_co2, bewaesserung_co2, heizsystem_co2, zusaetzliches_heizsystem_co2, \
           konstruktion_h2o, energieschirm_h2o, bodenabdeckung_h2o, produktionssystem_h2o, bewaesserung_h2o, heizsystem_h2o, zusaetzliches_heizsystem_h2o



def calc_energy_source(data, helping_values, all_options):

    # Energietraeger
    # They should always have the unit kWh already
    energietraeger_co2 = 0
    energietraeger_h2o = 0

    geteilte_waermeversorgung = all_options.get(id=data["Waermeversorgung"][0][0]).option_value

    for option in data["Energietraeger"]:
        # Check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kWh":
            raise ValueError('Energietraeger value unit has not been converted to kWh!')
        energietraegertyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        if energietraegertyp == "Erdgas":
            erdgas_co2 = menge * 0.252
        elif energietraegertyp == "Biogas":
            energietraeger_co2 = energietraeger_co2 + menge * 0.06785
            energietraeger_h2o = energietraeger_h2o + menge * 0.06785
        elif energietraegertyp == "Heizoel":
            energietraeger_co2 = energietraeger_co2 + menge * 0.371
            energietraeger_h2o = energietraeger_h2o + menge * 0.371
        elif energietraegertyp == "Steinkohle":
            energietraeger_co2 = energietraeger_co2 + menge * 0.285
            energietraeger_h2o = energietraeger_h2o + menge * 0.285
        elif energietraegertyp == "Braunkohle":
            energietraeger_co2 = energietraeger_co2 + menge * 0.364
            energietraeger_h2o = energietraeger_h2o + menge * 0.364
        elif energietraegertyp == "Hackschnitzel":
            energietraeger_co2 = energietraeger_co2 + menge * 0.025
            energietraeger_h2o = energietraeger_h2o + menge * 0.025
        elif energietraegertyp == "Geothermie(oberflaechennah)":
            energietraeger_co2 = energietraeger_co2 + menge * 0.0348
            energietraeger_h2o = energietraeger_h2o + menge * 0.0348
        elif energietraegertyp == "Tiefengeothermie":
            energietraeger_co2 = energietraeger_co2 + menge * 0.00633
            energietraeger_h2o = energietraeger_h2o + menge * 0.00633
        elif energietraegertyp == "BHKW Erdgas":
            energietraeger_co2 = energietraeger_co2 + menge * 0.252
            energietraeger_h2o = energietraeger_h2o + menge * 0.252
        elif energietraegertyp == "BHKW Biomethan":
            energietraeger_co2 = energietraeger_co2 + menge * 0.06785
            energietraeger_h2o = energietraeger_h2o + menge * 0.06785
        else:
            raise ValueError('No valid option for Energietraeger has been selected')


    if(geteilte_waermeversorgung=="ja"):
        energietraeger_co2 = energietraeger_co2 * (data["GWHFlaeche"][0]/data["WaermeteilungFlaeche"][0])
        energietraeger_h2o = energietraeger_h2o * (data["GWHFlaeche"][0]/data["WaermeteilungFlaeche"][0])

    print("energietraeger_co2: " + str(energietraeger_co2))
    print("energietraeger_h2o: " + str(energietraeger_h2o))
    return energietraeger_co2, energietraeger_h2o


def calc_electric_power(data, helping_values, all_options):
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

    # H2O usage
    deutscher_strommix_h2o = 0
    oekostrom_h2o = 0
    photovoltaik_h2o = 0
    windenergie_land_h2o = 0
    windenergie_see_h2o = 0
    wasserkraft_h2o = 0
    tiefengeothermie_h2o = 0
    bhkwerdgas_h2o = 0
    bhkwbiomethan_h2o = 0
    diesel_h2o = 0

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
        netto_menge = menge * helping_values["culture_length_usage"]
        if stromtyp == "Deutscher Strommix":
            deutscher_strommix_co2 = netto_menge * 0.485
            deutscher_strommix_h2o = netto_menge * 0.485
            deutscher_strommix_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Oekostrom (Durschnitt Deutschland)":
            oekostrom_co2 = netto_menge * 0.024293333
            oekostrom_h2o = netto_menge * 0.024293333
            oekostrom_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Photovoltaik":
            photovoltaik_co2 = netto_menge * 0.05571
            photovoltaik_h2o = netto_menge * 0.05571
            photovoltaik_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (Land)":
            windenergie_land_co2 = netto_menge * 0.0088
            windenergie_land_h2o = netto_menge * 0.0088
            windenergie_land_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (See)":
            windenergie_see_co2 = netto_menge * 0.00437
            windenergie_see_h2o = netto_menge * 0.00437
            windenergie_see_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Wasserkraft":
            wasserkraft_co2 = netto_menge * 0.0027
            wasserkraft_h2o = netto_menge * 0.0027
            wasserkraft_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Tiefengeothermie":
            tiefengeothermie_co2 = netto_menge * 0.00633
            tiefengeothermie_h2o = netto_menge * 0.00633
            tiefengeothermie_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Biomethan":
            bhkwbiomethan_co2 = netto_menge * 0.06785
            bhkwbiomethan_h2o = netto_menge * 0.06785
            bhkwbiomethan_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Erdgas":
            bhkwerdgas_co2 = netto_menge * 0.252
            bhkwerdgas_h2o = netto_menge * 0.252
            bhkwerdgas_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Diesel":
            diesel_co2 = netto_menge * 0.048675561
            diesel_h2o = netto_menge * 0.048675561
            diesel_anteil = menge / helping_values["energyconsumption_company"]
        else:
            raise ValueError('No valid option for Stromherkunft has been selected')

    strom_gesamt_co2 = deutscher_strommix_co2 + oekostrom_co2 + photovoltaik_co2 + windenergie_land_co2 + windenergie_see_co2 + wasserkraft_co2 + tiefengeothermie_co2 + bhkwerdgas_co2 + bhkwbiomethan_co2 + diesel_co2
    # Take Belichtung into account if it isn't already included in the calculation
    if all_options.get(id=data["Zusatzbelichtung"][0][0]).option_value == "ja" and all_options.get(id=data["Belichtungsstrom"][0][0]).option_value == "nein":
        deutscher_strommix_co2 = deutscher_strommix_co2 + (helping_values["energyconsumption_lighting"] * deutscher_strommix_anteil * 0.485)
        deutscher_strommix_h2o = deutscher_strommix_h2o + (helping_values["energyconsumption_lighting"] * deutscher_strommix_anteil * 0.485)
        oekostrom_co2 = oekostrom_co2 + (helping_values["energyconsumption_lighting"] * oekostrom_anteil * 0.024293333)
        oekostrom_h2o = oekostrom_h2o + (helping_values["energyconsumption_lighting"] * oekostrom_anteil * 0.024293333)
        photovoltaik_co2 = photovoltaik_co2 + (helping_values["energyconsumption_lighting"] * photovoltaik_anteil * 0.05571)
        photovoltaik_h2o = photovoltaik_h2o + (helping_values["energyconsumption_lighting"] * photovoltaik_anteil * 0.05571)
        windenergie_land_co2 = windenergie_land_co2 + (helping_values["energyconsumption_lighting"] * windenergie_land_anteil * 0.0088)
        windenergie_land_h2o = windenergie_land_h2o + (helping_values["energyconsumption_lighting"] * windenergie_land_anteil * 0.0088)
        windenergie_see_co2 = windenergie_see_co2 + (helping_values["energyconsumption_lighting"] * windenergie_see_anteil * 0.00437)
        windenergie_see_h2o = windenergie_see_h2o + (helping_values["energyconsumption_lighting"] * windenergie_see_anteil * 0.00437)
        wasserkraft_co2 = wasserkraft_co2 + (helping_values["energyconsumption_lighting"] * wasserkraft_anteil * 0.0027)
        wasserkraft_h2o = wasserkraft_h2o + (helping_values["energyconsumption_lighting"] * wasserkraft_anteil * 0.0027)
        tiefengeothermie_co2 = tiefengeothermie_co2 + (helping_values["energyconsumption_lighting"] * tiefengeothermie_anteil * 0.00633)
        tiefengeothermie_h2o = tiefengeothermie_h2o + (helping_values["energyconsumption_lighting"] * tiefengeothermie_anteil * 0.00633)
        bhkwerdgas_co2 = bhkwerdgas_co2 + (helping_values["energyconsumption_lighting"] * bhkwerdgas_anteil * 0.06785)
        bhkwerdgas_h2o = bhkwerdgas_h2o + (helping_values["energyconsumption_lighting"] * bhkwerdgas_anteil * 0.06785)
        bhkwbiomethan_co2 = bhkwbiomethan_co2 + (helping_values["energyconsumption_lighting"] * bhkwbiomethan_anteil * 0.252)
        bhkwbiomethan_h2o = bhkwbiomethan_h2o + (helping_values["energyconsumption_lighting"] * bhkwbiomethan_anteil * 0.252)
        diesel_co2 = diesel_co2 + (helping_values["energyconsumption_lighting"] * diesel_anteil * 0.048675561)
        diesel_h2o = diesel_h2o + (helping_values["energyconsumption_lighting"] * diesel_anteil * 0.048675561)

    # Tiefengeothermie: !!!Falls bei Wärmeverbrauch ausgewählt, dann Wert=0!!!
    # BHKW-Erdgas: !!!Falls BHKW ausgewählt, dann Wert=0!!!
    # BHKW-Biomethan: !!!Falls BHKW ausgewählt, dann Wert=0!!!
    for option in data["Energietraeger"]:
        if all_options.get(id=option[0]).option_value == "Tiefengeothermie":
            tiefengeothermie_co2 = 0
            tiefengeothermie_h2o = 0
    if helping_values["bhkw_usage"]:
        bhkwerdgas_co2 = 0
        bhkwerdgas_h2o = 0
        bhkwbiomethan_co2 = 0
        bhkwbiomethan_h2o = 0

    # print("deutscher_strommix_co2: " + str(deutscher_strommix_co2))
    # print("oekostrom_co2: " + str(oekostrom_co2))
    # print("photovoltaik_co2: " + str(photovoltaik_co2))
    # print("windenergie_land_co2: " + str(windenergie_land_co2))
    # print("windenergie_see_co2: " + str(windenergie_see_co2))
    # print("wasserkraft_co2: " + str(wasserkraft_co2))
    # print("tiefengeothermie_co2: " + str(tiefengeothermie_co2))
    # print("bhkwerdgas_co2: " + str(bhkwerdgas_co2))
    # print("bhkwbiomethan_co2: " + str(bhkwbiomethan_co2))
    # print("diesel_co2: " + str(diesel_co2))
    strom_gesamt_co2 = deutscher_strommix_co2 + oekostrom_co2 + photovoltaik_co2 + windenergie_land_co2 + windenergie_see_co2 + wasserkraft_co2 + tiefengeothermie_co2 + bhkwerdgas_co2 + bhkwbiomethan_co2 + diesel_co2
    strom_gesamt_h2o = deutscher_strommix_h2o + oekostrom_h2o + photovoltaik_h2o + windenergie_land_h2o + windenergie_see_h2o + wasserkraft_h2o + tiefengeothermie_h2o + bhkwerdgas_h2o + bhkwbiomethan_h2o + diesel_h2o

    print("strom_co2: " + str(strom_gesamt_co2))
    print("strom_h2o: " + str(strom_gesamt_h2o))
    return strom_gesamt_co2, strom_gesamt_h2o


def calc_co2_added(data, helping_values, all_options):

    # CO2-Herkunft
    co2_zudosierung_co2 = 0
    co2_zudosierung_h2o = 0
    # Check if there is even a co2-zudosierung
    print("CO-Herkunft")
    if (data["CO2-Herkunft"] != default_option):
        for option in data["CO2-Herkunft"]:
            # Check if the values have the correct unit
            if OptionUnits.objects.get(id=option[2]).unit_name != "kg":
                raise ValueError('CO2-Herkunft value unit has not been converted to kg!')

            co2_zudosierungtyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if co2_zudosierungtyp == "technisches CO2":
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * 0.5
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * 0.5
            elif co2_zudosierungtyp == "direkte Gasverbrennung":
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * 0.252
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * 0.252
            elif co2_zudosierungtyp == "eigenes BHKW":  # There is no need to check, if energietraeger uses bhkw since it has no impact anyways.
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * 0
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * 0
            else:
                raise ValueError('No valid option for CO2-Herkunft has been selected')

    print("co2_zudosierung_co2: " + str(co2_zudosierung_co2))
    print("co2_zudosierung_h2o: " + str(co2_zudosierung_h2o))
    return co2_zudosierung_co2, co2_zudosierung_h2o


def calc_fertilizer(data, helping_values, all_options):
    # CO2-Herkunft
    duengemittel_einfach_co2 = 0
    duengemittel_einfach_h2o = 0
    if data["Duengemittel:VereinfachteAngabe"] != default_option:
        for option in data["Duengemittel:VereinfachteAngabe"]:
            # TODO Korrekte Äquivalente einfügen
            duengemittel_einfachtyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if duengemittel_einfachtyp == "A/B Bag: Standardduengung":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 1
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 1
            elif duengemittel_einfachtyp == "Vinasse":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 2
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 2
            elif duengemittel_einfachtyp == "Pferdemist":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 3
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 3
            elif duengemittel_einfachtyp == "Kompost":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 4
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 4
            elif duengemittel_einfachtyp == "Hornmehl, -griess, -spaene":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 5
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 5
            elif duengemittel_einfachtyp == "Blutmehl":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 6
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 6
            elif duengemittel_einfachtyp == "Mist":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 7
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 7
            elif duengemittel_einfachtyp == "Gruenduengung":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 8
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 8
            elif duengemittel_einfachtyp == "Knochenmehl":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 9
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 9
            elif duengemittel_einfachtyp == "Pflanzkali":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 10
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 10
            elif duengemittel_einfachtyp == "org. Vollduenger":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * 11
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * 11
            else:
                raise ValueError('No valid option for Duengemittel:VereinfachteAngabe has been selected')

    duengemittel_detailliert_co2 = 0
    duengemittel_detailliert_h2o = 0
    if data["Duengemittel:DetaillierteAngabe"] != default_option:
        for option in data["Duengemittel:DetaillierteAngabe"]:
        # TODO Korrekte Äquivalente einfügen
            duengemittel_detaillierttyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if duengemittel_detaillierttyp == "Ammoniumnitrat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 1.94
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 1.94
            elif duengemittel_detaillierttyp == "Kaliumnitrat (Kalisalpeter)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 0.677
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 0.677
            elif duengemittel_detaillierttyp == "Calciumnitrat fluessig (Kalksalpeter)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 4.43
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 4.43
            elif duengemittel_detaillierttyp == "Calciumnitrat fest":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 4.43
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 4.43
            elif duengemittel_detaillierttyp == "Kaliumcholird, KCL, muriate of potash":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 0.377
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 0.377
            elif duengemittel_detaillierttyp == "Kaliumsulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 1.13
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 1.13
            elif duengemittel_detaillierttyp == "Monokaliumphosphat (Flory6)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 0.729
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 0.729
            elif duengemittel_detaillierttyp == "Borax":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 1.62
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 1.62
            elif duengemittel_detaillierttyp == "Eisen DDTPA 3%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 1
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 1
            elif duengemittel_detaillierttyp == "Eisen EDDHA 6 %":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 2
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 2
            elif duengemittel_detaillierttyp == "25 % Cu Kupfersulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 3
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 3
            elif duengemittel_detaillierttyp == "32 % Mn Mangansulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 4
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 4
            elif duengemittel_detaillierttyp == "Natriummolybdat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 5
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 5
            elif duengemittel_detaillierttyp == "Zinksulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 6
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 6
            elif duengemittel_detaillierttyp == "Chlorbleichlauge":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 7
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 7
            elif duengemittel_detaillierttyp == "Bittersalz":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 8
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 8
            elif duengemittel_detaillierttyp == "Phosphorsaeure 75%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 9
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 9
            elif duengemittel_detaillierttyp == "Salpetersaeure 65%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 10
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 10
            elif duengemittel_detaillierttyp == "Salpetersaeure 38%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 11
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 11
            elif duengemittel_detaillierttyp == "Kalksalpeter":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 12
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 12
            elif duengemittel_detaillierttyp == "Magnesiumnitrat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 13
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 13
            elif duengemittel_detaillierttyp == "Magnesiumsulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 14
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 14
            elif duengemittel_detaillierttyp == "Kalisilikat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 15
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 15
            elif duengemittel_detaillierttyp == "Mangansulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 16
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 16
            elif duengemittel_detaillierttyp == "Kupfersulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 17
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 17
            elif duengemittel_detaillierttyp == "Ammoniummolybdat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * 18
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * 18
            else:
                raise ValueError('No valid option for Duengemittel:DetaillierteAngabe has been selected')

    duengemittel_co2 = duengemittel_detailliert_co2+duengemittel_einfach_co2
    duengemittel_h2o = duengemittel_detailliert_h2o+duengemittel_einfach_h2o
    print("duengemittel_co2: ", duengemittel_co2)
    print("duengemittel_h2o: ", duengemittel_h2o)
    return duengemittel_co2, duengemittel_h2o


def calc_psm(data):
    fungizide = (data["FungizideKg"][0] + (data["FungizideLiter"][0] * 100))
    insektizide = (data["InsektizideKg"][0] + (data["InsektizideLiter"][0] * 100))
    fungizide_co2 = fungizide * 11
    fungizide_h2o = fungizide * 11
    insektizide_co2 = insektizide * 11
    insektizide_h2o = insektizide * 11

    psm_co2 = fungizide_co2 + insektizide_co2
    psm_h2o = fungizide_h2o + insektizide_h2o
    print("psm_co2: ", psm_co2)
    print("psm_h2o: ", psm_h2o)
    return psm_co2, psm_h2o
#def calc_nuetzlinge_co2(data, helping_values, all_options):
#    # Nuetzlinge
#    # TODO Korrekte Äquivalente einfügen
#    nuetzlinge_co2 = 0
#    if data["Nuetzlinge"] != default_option:
#        for option in data["Nuetzlinge"]:
#            nuetzlingeart = all_options.get(id=option[0]).option_value
#            menge = option[1]
#
#            if nuetzlingeart == "Hummeln":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 1
#            elif nuetzlingeart == "Erzwespe (Encasia, Eretmocerus, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 2
#            elif nuetzlingeart == "Macrolophus (oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 3
#            elif nuetzlingeart == "Schlupfwespen (Aphidius, Dacnusa, Diglyphus, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 4
#            elif nuetzlingeart == "Raubmilben (Phytoseiulus, Amblyseius, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 5
#            elif nuetzlingeart == "Gallmuecken (Aphidoletes, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 6
#            elif nuetzlingeart == "Florfliegen (Chrysoperla, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 7
#            elif nuetzlingeart == "Futter fuer Macrolophus (Ephestia-Eier, Sitrotroga-Eier, Artemia, oder vergleichbares)":
#                nuetzlinge_co2 = nuetzlinge_co2 + menge * 8
#            else:
#                raise ValueError('No valid option for Nuetzlinge has been selected')
#
#    print("nuetzlinge_co2: " + str(nuetzlinge_co2))
#    return nuetzlinge_co2


def calc_pflanzenbehaelter(data, helping_values, all_options):

    # Growbags + Kuebel
    growbagskuebelverwendung = all_options.get(id=data["GrowbagsKuebel"][0][0]).option_value
    growbags_co2 = 0
    growbags_h2o = 0
    kuebel_co2 = 0
    kuebel_h2o = 0
    volumen = 0
    kuebel_nutzdauer = data["Kuebel:Alter"][0]
    if kuebel_nutzdauer <= 0:
        kuebel_nutzdauer = 1
    if growbagskuebelverwendung == "Growbags":
        growbags = ((helping_values["row_length_total"]*0.2*2+helping_values["row_length_total"]*0.11*2+helping_values["row_length_total"]/1*2*(0.15*0.11))*0.186)
        growbags_co2 = growbags * 2.78897
        growbags_h2o = growbags * 2.78897
    elif growbagskuebelverwendung == "Andere Kulturgefaesse (Topf, Kuebel)":
        calc = (0.03 * data["Kuebel:VolumenProTopf"][0] - 0.0214)
        if calc <= 0:
            calc = 0.01
        kuebel = (calc * helping_values["plant_count_total"]) / data["Kuebel:JungpflanzenProTopf"][0] / kuebel_nutzdauer
        kuebel_co2 = kuebel * 2.88
        kuebel_h2o = kuebel * 2.88
    elif growbagskuebelverwendung == "nichts":
        pass
    else:
        raise ValueError('No valid option for GrowbagsKuebel has been selected')

    pflanzenbehaelter_co2 = growbags_co2 + kuebel_co2
    pflanzenbehaelter_h2o = growbags_h2o + kuebel_h2o

    print("pflanzenbehaelter_co2: ", pflanzenbehaelter_co2)
    print("pflanzenbehaelter_h2o: ", pflanzenbehaelter_h2o)
    return pflanzenbehaelter_co2, pflanzenbehaelter_h2o


def calc_substrate(data, helping_values, all_options):

    # Substrat
    substrat_co2 = 0
    substrat_h2o = 0
    volumen = 0
    # Asign the correct volume for the selected pflanzenbehaelter
    growbagskuebelverwendung = all_options.get(id=data["GrowbagsKuebel"][0][0]).option_value
    if growbagskuebelverwendung == "Growbags":
        volumen = helping_values["row_length_total"] * 2 * 0.11
    elif growbagskuebelverwendung == "Andere Kulturgefaesse (Topf, Kuebel)":
        volumen = data["Kuebel:VolumenProTopf"][0]/data["Kuebel:JungpflanzenProTopf"][0] * helping_values["plant_count_total"]
    elif growbagskuebelverwendung == "nichts":
        print("substrat_co2: " + str(substrat_co2))
        print("substrat_h2o: " + str(substrat_h2o))
        return substrat_co2, substrat_h2o

    for option in data["Substrat"]:
        substratmaterial = all_options.get(id=option[0]).option_value
        nutzdauer = option[1]

        if substratmaterial == "Standardsubstrat":
            substrat_co2 = substrat_co2 + (volumen * 100)/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * 100)/nutzdauer
        elif substratmaterial == "Kokos":
            substrat_co2 = substrat_co2 + (volumen * 33.29)/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * 33.29)/nutzdauer
        elif substratmaterial == "Steinwolle":
            substrat_co2 = substrat_co2 + (volumen * 93.01)/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * 93.01)/nutzdauer
        elif substratmaterial == "Perlite":
            substrat_co2 = substrat_co2 + (volumen * 93.37) / nutzdauer
            substrat_h2o = substrat_h2o + (volumen * 93.37) / nutzdauer
        elif substratmaterial == "Nachhaltiges Substrat":
            substrat_co2 = substrat_co2 + (volumen * 16.01) / nutzdauer
            substrat_h2o = substrat_h2o + (volumen * 16.01) / nutzdauer
        else:
            raise ValueError('No valid option for Substrat has been selected')

    print("substrat_co2: ", substrat_co2)
    print("substrat_h2o: ", substrat_h2o)
    return substrat_co2, substrat_h2o


def calc_young_plants_substrate(data, helping_values, all_options):
    jungpflanzen_substratmaterial = all_options.get(id=data["Jungpflanzen:Substrat"][0][0]).option_value
    junpflanzen_substrat_co2 = 0
    junpflanzen_substrat_h2o = 0
    volumen = (0.1*0.1*0.1) * helping_values["plant_count_total"]
    if jungpflanzen_substratmaterial == "Standardsubstrat":
         junpflanzen_substrat_co2 = volumen * 100
         junpflanzen_substrat_h2o = volumen * 100
    elif jungpflanzen_substratmaterial == "Kokos":
        junpflanzen_substrat_co2 = volumen * 33.29
        junpflanzen_substrat_h2o = volumen * 33.29
    elif jungpflanzen_substratmaterial == "Steinwolle":
        junpflanzen_substrat_co2 = volumen * 93.01
        junpflanzen_substrat_h2o = volumen * 93.01
    elif jungpflanzen_substratmaterial == "Perlite":
        junpflanzen_substrat_co2 = volumen * 93.37
        junpflanzen_substrat_h2o = volumen * 93.37
    elif jungpflanzen_substratmaterial == "Nachhaltiges Substrat":
        junpflanzen_substrat_co2 = volumen * 16.01
        junpflanzen_substrat_h2o = volumen * 16.01
    else:
        raise ValueError('No valid option for Jungpflanzen:Substrat has been selected')

    print("jungpflanzen_substrat_co2: ", junpflanzen_substrat_co2)
    print("jungpflanzen_substrat_h2o: ", junpflanzen_substrat_h2o)
    return junpflanzen_substrat_co2, junpflanzen_substrat_h2o


def calc_young_plants_transport(data, helping_values, all_options):
    young_plants_transport_co2 = 0
    young_plants_transport_h2o = 0

    if data["Jungpflanzen:Distanz"] == default_value:
        pass
    else:
        young_plants_transport = helping_values["plant_count_total"] / 1056 * 0.5 * data["Jungpflanzen:Distanz"][0]
        young_plants_transport_co2 = young_plants_transport * 0.112
        young_plants_transport_h2o = young_plants_transport * 0.112

    print("young_plants_transport_co2: ", young_plants_transport_co2)
    print("young_plants_transport_h2o: ", young_plants_transport_h2o)
    return young_plants_transport_co2, young_plants_transport_h2o


def calc_cords(data, helping_values, all_options):
    schnurverwendung = all_options.get(id=data["Schnur"][0][0]).option_value
    schnuerematerial = all_options.get(id=data["SchnuereRankhilfen:Material"][0][0]).option_value
    schnuere_co2 = 0
    schnuere_h2o = 0

    if schnurverwendung == "nein":
        pass
    elif schnurverwendung == "ja":
        if data["SchnuereRankhilfen:Wiederverwendung"] == default_value:
            nutzdauer = 1
        else:
            nutzdauer = data["SchnuereRankhilfen:Wiederverwendung"][0]
        if schnuerematerial == "Kunststoff":
            schnuere = (helping_values["cord_length_total"] * 1/1000) / nutzdauer
            schnuere_co2 = schnuere * 1.73
            schnuere_h2o = schnuere * 1.73
        elif schnuerematerial == "Jute":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * 0.4
            schnuere_h2o = schnuere * 0.4
        elif schnuerematerial == "Sisal":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * 0.4
            schnuere_h2o = schnuere * 0.4
        elif schnuerematerial == "Zellulose":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * 0.4
            schnuere_h2o = schnuere * 0.4
        elif schnuerematerial == "andere Nachhaltige/abbaubare Option":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * 0.4
            schnuere_h2o = schnuere * 0.4
        elif schnuerematerial == "Bambusstab":
            schnuere = (helping_values["cord_length_total"] * 0.32) / nutzdauer
            schnuere_co2 = schnuere * 1.2
            schnuere_h2o = schnuere * 1.2
        elif schnuerematerial == "Edelstahl":
            schnuere = (helping_values["cord_length_total"] * 0.62) / nutzdauer
            schnuere_co2 = schnuere * 1.712
            schnuere_h2o = schnuere * 1.712
        else:
            raise ValueError('No valid option for SchnuereRankhilfen:Material has been selected')
    else:
        raise ValueError('No valid option for Schnur has been selected')

    print("schnuere_co2: " + str(schnuere_co2))
    print("schnuere_h2o: " + str(schnuere_h2o))
    return schnuere_co2, schnuere_h2o



def calc_clips(data, helping_values, all_options):

    klipseverwendung = all_options.get(id=data["Klipse"][0][0]).option_value
    klipsematerial = all_options.get(id=data["Klipse:Material"][0][0]).option_value
    klipse_co2 = 0
    klipse_h2o = 0
    if data["Klipse:Wiederverwendung"] == default_value:
        nutzdauer = 1
    else:
        nutzdauer = data["Klipse:Wiederverwendung"][0]
    if klipseverwendung == "nein":
        pass
    elif klipseverwendung == "ja":
        if klipsematerial == "Kunststoff":
            klipse = (helping_values["clips_count_total"] * 0.0005) / nutzdauer
            klipse_co2 = klipse * 1.73
            klipse_h2o = klipse * 1.73
        elif klipsematerial == "Metall":
            klipse = (helping_values["clips_count_total"] * 0.0008) / nutzdauer
            klipse_co2 = klipse * 1.73
            klipse_h2o = klipse * 1.73
        elif klipsematerial == "Nachhaltige / kompostierbare Option":
            klipse = (helping_values["clips_count_total"] * 0.0008) / nutzdauer
            klipse_co2 = klipse * 0.4
            klipse_h2o = klipse * 0.4
        else:
            raise ValueError('No valid option for Klipse:Material has been selected')
    else:
        raise ValueError('No valid option for Klipse has been selected')

    print("klipse_co2: ", klipse_co2)
    print("klipse_h2o: ", klipse_h2o)
    return klipse_co2, klipse_h2o


def calc_panicle_hanger(data, helping_values, all_options):

    rispenbuegelverwendung = all_options.get(id=data["Rispenbuegel"][0][0]).option_value
    rispenbuegelmaterial = all_options.get(id=data["Rispenbuegel:Material"][0][0]).option_value
    rispenbuegel_co2 = 0
    rispenbuegel_h2o = 0
    nutzdauer = data["Rispenbuegel:Wiederverwendung"][0]
    if rispenbuegelverwendung == "nein":
        pass
    elif rispenbuegelverwendung == "ja":
        if rispenbuegelmaterial == "Kunststoff":
            rispenbuegel = (helping_values["panicle_hanger_count_total"] * 0.0008) / nutzdauer
            rispenbuegel_co2 = rispenbuegel * 1.73
            rispenbuegel_h2o = rispenbuegel * 1.73
        elif rispenbuegelmaterial == "Metall":
            rispenbuegel = (helping_values["panicle_hanger_count_total"] * 0.001) / nutzdauer
            rispenbuegel_co2 = rispenbuegel * 1.73
            rispenbuegel_h2o = rispenbuegel * 1.73
        elif rispenbuegelmaterial == "Nachhaltige / kompostierbare Option":
            rispenbuegel = (helping_values["panicle_hanger_count_total"] * 0.001) / nutzdauer
            rispenbuegel_co2 = rispenbuegel * 0.4
            rispenbuegel_h2o = rispenbuegel * 0.4
        else:
            raise ValueError('No valid option for Rispenbuegel:Material has been selected')
    else:
        raise ValueError('No valid option for Rispenbuegel has been selected')

    print("rispenbuegel_co2: ", rispenbuegel_co2)
    print("rispenbuegel_h2o: ", rispenbuegel_h2o)
    return rispenbuegel_co2, rispenbuegel_h2o


def calc_packaging(data, helping_values, all_options):
    # Verpackungsmaterial
    verpackung_co2 = 0
    verpackung_h2o = 0
    if data["Verpackungsmaterial"] != default_option:
        for option in data["Verpackungsmaterial"]:
            verpackungmaterial = all_options.get(id=option[0]).option_value
            menge = option[1]
            if verpackungmaterial == "Karton":
                verpackung_co2 = verpackung_co2 + menge * 0.748
                verpackung_h2o = verpackung_h2o + menge * 0.748
            elif verpackungmaterial == "Plastik":
                verpackung_co2 = verpackung_co2 + menge * 1.73
                verpackung_h2o = verpackung_h2o + menge * 1.73
            else:
                raise ValueError('No valid option for Verpackungsmaterial has been selected')

    # Mehrwegsteigen
    if data["Verpackungsmaterial:AnzahlMehrwegsteigen"] != default_value:
        verpackung_co2 = verpackung_co2 + (data["Verpackungsmaterial:AnzahlMehrwegsteigen"][0] / 50 * 0.003662)
        verpackung_h2o = verpackung_h2o + (data["Verpackungsmaterial:AnzahlMehrwegsteigen"][0] / 50 * 0.003662)

    print("verpackung_co2: ", verpackung_co2)
    print("verpackung_h2o: ", verpackung_h2o)
    return verpackung_co2, verpackung_h2o


def calc_other_consumables(data, helping_values, all_options):
    # Sonstige Verbrauchsmaterialien
    sonstige_verbrauchsmaterialien_co2 = 0
    sonstige_verbrauchsmaterialien_h2o = 0
    if data["SonstigeVerbrauchsmaterialien"] != default_option:
        for option in data["SonstigeVerbrauchsmaterialien"]:
            sonstige_verbrauchsmaterialienmaterial = all_options.get(id=option[0]).option_value
            menge = option[1]
            nutzdauer = option[3]
            # shouldn't ever happen
            if nutzdauer == 0:
                nutzdauer = 1
            if sonstige_verbrauchsmaterialienmaterial == "Folie":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 2.67 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 2.67 / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Eisen":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 1.5641297 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 1.5641297 / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Alluminium":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 14.6 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 14.6 / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Kunststoff":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 1.73 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 1.73 / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Holz":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 0.0044 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 0.0044 / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Pappe":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * 0.748 / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * 0.748 / nutzdauer
            else:
                raise ValueError('No valid option for SonstigeVerbrauchsmaterialien has been selected')

    print("sonstige_verbrauchsmaterialien_co2: ", sonstige_verbrauchsmaterialien_co2)
    print("sonstige_verbrauchsmaterialien_h2o: ", sonstige_verbrauchsmaterialien_h2o)
    return sonstige_verbrauchsmaterialien_co2, sonstige_verbrauchsmaterialien_h2o


#def calc_additional_machineusage_co2(data, helping_values, all_options):
#    # Zusaetzlicher Machineneinsatz
#    zusaetzlicher_maschineneinsatz_co2 = 0
#    # Since this field is optional it is possible, that the default value comes back
#    if data["ZusaetzlicherMaschineneinsatz"] != default_option:
#        for option in data["ZusaetzlicherMaschineneinsatz"]:
#            zusaetzlicher_maschineneinsatzart = all_options.get(id=option[0]).option_value
#            verbrauch = option[1]
#            nutzdauer = option[3]
#            if zusaetzlicher_maschineneinsatzart == "Gabelstapler":
#                zusaetzlicher_maschineneinsatz_co2 = zusaetzlicher_maschineneinsatz_co2 + verbrauch * nutzdauer * 0.476534124
#            else:
#                raise ValueError('No valid option for ZusaetzlicherMaschineneinsatz has been selected')
#
#    print("zusaetzlicher_maschineneinsatz_co2: " + str(zusaetzlicher_maschineneinsatz_co2))
#    return zusaetzlicher_maschineneinsatz_co2



