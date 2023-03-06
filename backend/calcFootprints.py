import math

from backend.models import Options, OptionUnits, OptionGroups, MeasurementUnits
from .data.equivalents import co2_equivalents, h2o_equivalents
from .utils import default_value, default_option


def calc_footprints(data):
    """Function that calculates the co2 and h2o footprints for a greenhouse dataset.

    This function calls multiple functions that calculate the footprints for each specific category.

    Args:
        data : contains the data that is used for the footprint calculation

    Returns:
        dictionary contains the calculated footprints for both co2 and h2o
    """

    try:
        all_options = Options.objects.all()
        helping_values = calc_helping_values(data, all_options)
        konstruktion_co2, energieschirm_co2, bodenabdeckung_co2, produktionssystem_co2, bewaesserung_co2, heizsystem_co2, zusaetzliches_heizsystem_co2, \
        konstruktion_h2o, energieschirm_h2o, bodenabdeckung_h2o, produktionssystem_h2o, bewaesserung_h2o, heizsystem_h2o, zusaetzliches_heizsystem_h2o = calc_greenhouse_construction(data, helping_values, all_options)
        energietraeger_co2, energietraeger_h2o = calc_energy_source(data, all_options)
        strom_co2, strom_h2o = calc_electric_power(data, helping_values, all_options)
        brunnenwasser_co2, brunnenwasser_h2o, regenwasser_co2, regenwasser_h2o, stadtwasser_co2, stadtwasser_h2o, oberflaechenwasser_co2, oberflaechenwasser_h2o = calc_water_usage(data, all_options)
        co2_zudosierung_co2, co2_zudosierung_h2o = calc_co2_added(data, all_options)
        duengemittel_co2, duengemittel_h2o = calc_fertilizer(data, all_options)
        psm_co2, psm_h2o = calc_psm(data)
        pflanzenbehaelter_co2, pflanzenbehaelter_h2o = calc_plantbags(data, helping_values, all_options)
        substrat_co2, substrat_h2o = calc_substrate(data, helping_values, all_options)
        jungpflanzen_substrat_co2, jungpflanzen_substrat_h2o = calc_young_plants_substrate(data, helping_values, all_options)
        jungpflanzen_transport_co2, jungpflanzen_transport_h2o = calc_young_plants_transport(data, helping_values)
        schnuere_co2, schnuere_h2o = calc_cords(data, helping_values, all_options)
        klipse_co2, klipse_h2o = calc_clips(data, helping_values, all_options)
        rispenbuegel_co2, rispenbuegel_h2o = calc_panicle_hanger(data, helping_values, all_options)
        verpackung_co2, verpackung_h2o = calc_packaging(data, all_options)
        sonstige_verbrauchsmaterialien_co2, sonstige_verbrauchsmaterialien_h2o = calc_other_consumables(data, all_options)
    except Exception as e:
        print(e)
        raise e

    co2_results = {
        "konstruktion_co2": konstruktion_co2,
        "energieschirm_co2": energieschirm_co2,
        "bodenabdeckung_co2": bodenabdeckung_co2,
        "produktionssystem_co2": produktionssystem_co2,
        "heizsystem_co2": heizsystem_co2,
        "zusaetzliches_heizsystem_co2": zusaetzliches_heizsystem_co2,
        "bewaesserung_co2": bewaesserung_co2,
        "energietraeger_co2": energietraeger_co2,
        "strom_co2": strom_co2,
        "brunnenwasser_co2": brunnenwasser_co2,
        "regenwasser_co2": regenwasser_co2,
        "stadtwasser_co2": stadtwasser_co2,
        "oberflaechenwasser_co2": oberflaechenwasser_co2,
        "co2_zudosierung_co2": co2_zudosierung_co2,
        "duengemittel_co2": duengemittel_co2,
        "psm_co2": psm_co2,
        "pflanzenbehaelter_co2": pflanzenbehaelter_co2,
        "substrat_co2": substrat_co2,
        "jungpflanzen_substrat_co2": jungpflanzen_substrat_co2,
        "jungpflanzen_transport_co2": jungpflanzen_transport_co2,
        "schnuere_co2": schnuere_co2,
        "klipse_co2": klipse_co2,
        "rispenbuegel_co2": rispenbuegel_co2,
        "verpackung_co2": verpackung_co2,
        "sonstige_verbrauchsmaterialien_co2": sonstige_verbrauchsmaterialien_co2
    }

    # round every result to 2 decimal places
    rounded_co2_results = {k: round(v, 2) for k, v in co2_results.items()}

    co2_footprint = sum(rounded_co2_results.values())
    print("co2_footprint: " + str(co2_footprint))

    rounded_co2_results["co2_footprint"] = co2_footprint
    co2_footprint_norm_kg = round(co2_footprint / helping_values["total_harvest"], 2)
    print("co2_footprint_norm_kg: " + str(co2_footprint_norm_kg))
    rounded_co2_results["co2_footprint_norm_kg"] = co2_footprint_norm_kg
    rounded_co2_results["co2_footprint_norm_m2"] = round(co2_footprint / helping_values["gh_size"], 2)

    h2o_results = {
        "konstruktion_h2o": konstruktion_h2o,
        "energieschirm_h2o": energieschirm_h2o,
        "bodenabdeckung_h2o": bodenabdeckung_h2o,
        "produktionssystem_h2o": produktionssystem_h2o,
        "heizsystem_h2o": heizsystem_h2o,
        "zusaetzliches_heizsystem_h2o": zusaetzliches_heizsystem_h2o,
        "bewaesserung_h2o": bewaesserung_h2o,
        "energietraeger_h2o": energietraeger_h2o,
        "strom_h2o": strom_h2o,
        "brunnenwasser_h2o": brunnenwasser_h2o,
        "regenwasser_h2o": regenwasser_h2o,
        "stadtwasser_h2o": stadtwasser_h2o,
        "oberflaechenwasser_h2o": oberflaechenwasser_h2o,
        "co2_zudosierung_h2o": co2_zudosierung_h2o,
        "duengemittel_h2o": duengemittel_h2o,
        "psm_h2o": psm_h2o,
        "pflanzenbehaelter_h2o": pflanzenbehaelter_h2o,
        "substrat_h2o": substrat_h2o,
        "jungpflanzen_substrat_h2o": jungpflanzen_substrat_h2o,
        "jungpflanzen_transport_h2o": jungpflanzen_transport_h2o,
        "schnuere_h2o": schnuere_h2o,
        "klipse_h2o": klipse_h2o,
        "rispenbuegel_h2o": rispenbuegel_h2o,
        "verpackung_h2o": verpackung_h2o,
        "sonstige_verbrauchsmaterialien_h2o": sonstige_verbrauchsmaterialien_h2o
    }

    # round every result to 2 decimal places
    rounded_h2o_results = {k: round(v, 2) for k, v in h2o_results.items()}

    h2o_footprint = sum(rounded_h2o_results.values())
    print("h2o_footprint: " + str(h2o_footprint))

    rounded_h2o_results["h2o_footprint"] = h2o_footprint
    rounded_h2o_results["h2o_footprint_norm_kg"] = round(h2o_footprint / helping_values["total_harvest"], 2)
    rounded_h2o_results["h2o_footprint_norm_m2"] = round(h2o_footprint / helping_values["gh_size"], 2)
    direct_h2o_footprint = rounded_h2o_results["regenwasser_h2o"] + \
                           rounded_h2o_results["brunnenwasser_h2o"] + \
                           rounded_h2o_results["stadtwasser_h2o"] + \
                           rounded_h2o_results["oberflaechenwasser_h2o"]

    print("direct_h2o_footprint", direct_h2o_footprint)
    print("direct_h2o_footprint_norm_kg", direct_h2o_footprint / helping_values["total_harvest"])
    print("direct_h2o_footprint_norm_m2", direct_h2o_footprint / helping_values["gh_size"])
    rounded_h2o_results["direct_h2o_footprint"] = direct_h2o_footprint
    rounded_h2o_results["direct_h2o_footprint_norm_kg"] = direct_h2o_footprint / helping_values["total_harvest"]
    rounded_h2o_results["direct_h2o_footprint_norm_m2"] = direct_h2o_footprint / helping_values["gh_size"]

    return rounded_co2_results | rounded_h2o_results


def calc_helping_values(data, all_options):
    """This function calculates various helping values needed for calculating the co2 and h2o footprints

    Args:
        data : greenhouse dataset

    Returns:
        dictionary: contains the calculated variables
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
    gh_size = calc_gh_size(data)
    culture_size = calc_culture_size(data, gh_size)
    hull_size = calc_hull_size(data)
    row_count = data["SnackReihenanzahl"][0]+data["CocktailReihenanzahl"][0]+data["RispenReihenanzahl"][0]+data["FleischReihenanzahl"][0]
    row_length = data["Laenge"][0]-data["Vorwegbreite"][0]
    row_length_total = row_length*row_count
    walk_length_total = (row_count-1)*row_length

    # calculate the amount of fruits
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
    total_harvest = data["SnackErtragJahr"][0] + data["CocktailErtragJahr"][0] + data["RispenErtragJahr"][0] + data["FleischErtragJahr"][0]

    # check if bhkw is used or not
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
    print("total_harvest" + str(total_harvest))
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
        "total_harvest": total_harvest,
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

    Args:
        data : greenhouse dataset
        all_options: all options in the database

    Returns:
        energyconsumption for lighting
    """

    if all_options.filter(id=data["Zusatzbelichtung"][0][0])[0].option_value == "ja" and all_options.filter(id=data["Belichtungsstrom"][0][0])[0].option_value == "nein":
        if(data["Belichtung:Stromverbrauch"][0]> 0): return data["Belichtung:Stromverbrauch"][0]
        else:
            return data["Belichtung:AnzahlLampen"][0]*data["Belichtung:AnschlussleistungProLampe"][0]*data["Belichtung:LaufzeitProJahr"][0]/1000
    else:
        return 0


def calc_gh_size(data):
    """Calculates the size of the greenhouse.

    Args:
        data : greenhouse dataset

    Returns:
        greenhouse size
    """

    if (data["GWHFlaeche"][0] > 0): return data["GWHFlaeche"][0]
    else:
        return data["Laenge"][0]*data["Breite"][0]


def calc_culture_size(data, gh_size):
    """Calculates the size of the culture.

    Args:
        data : greenhouse dataset

    Returns:
        size that the culture takes up
    """

    if (data["Nutzflaeche"][0] > 0): return data["Nutzflaeche"][0]
    else:
        return gh_size-(data["Vorwegbreite"][0]*data["Breite"][0])


def calc_hull_size(data):
    """Calculates the size of the greenhouse hull depending on which norm used.

    Args:
        data : greenhouse dataset

    Returns:
        hull size of the greenhouse
    """

    norm_id = data["GWHArt"][0][0]
    norm_name = Options.objects.get(id=norm_id).option_value
    hull_size_wall = 0
    hull_size_roof = 0
    if(norm_name=="Venlo"):
        hull_size_wall = (data["Laenge"][0]+data["Breite"][0])*2*data["Stehwandhoehe"][0]+((((math.sqrt(abs((data["Scheibenlaenge"][0]**2) - (data["Kappenbreite"][0]/2)**2)))*data["Kappenbreite"][0])/2)*(data["Breite"][0]/data["Kappenbreite"][0]))
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
    """Calculates the size of the footprint for the greenhouse construction.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the categories of the greenhouse construction
    """

    # first check which kind of greenhouse is used
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

    # input field: GWHart
    if norm_name == "Venlo" or norm_name == "Deutsche Norm":
        # calculate material footprints
        if data["GWHAlter"][0] <= 20:
            if norm_name == "Venlo":
                beton = helping_values["gh_size"] * 2.52032 * helping_values["culture_length_usage"]
                beton_co2 = beton * co2_equivalents["beton"]
                beton_h2o = beton * h2o_equivalents["beton"]

                stahl = helping_values["gh_size"] * 0.55 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * co2_equivalents["stahl"]
                stahl_h2o = stahl * h2o_equivalents["stahl"]

                aluminium = helping_values["gh_size"] * 0.125 * helping_values["culture_length_usage"]
                aluminium_co2 = aluminium * co2_equivalents["aluminium"]
                aluminium_h2o = aluminium * h2o_equivalents["aluminium"]
            elif norm_name == "Deutsche Norm":
                beton = helping_values["gh_size"] * 2.52 * helping_values["culture_length_usage"]
                beton_co2 = beton * co2_equivalents["beton"]
                beton_h2o = beton * h2o_equivalents["beton"]

                stahl = helping_values["gh_size"] * 0.55 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * co2_equivalents["stahl"]
                stahl_h2o = stahl * h2o_equivalents["stahl"]

                aluminium = helping_values["gh_size"] * 0.015 * helping_values["culture_length_usage"]
                aluminium_co2 = aluminium * co2_equivalents["aluminium"]
                aluminium_h2o = aluminium * h2o_equivalents["aluminium"]

        # input field: Stehwand
        if stehwandmaterial == "Einfachglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"] * 0.664 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["stehwand_glas"]
                stehwand_h2o = stehwand * h2o_equivalents["stehwand_glas"]
        elif stehwandmaterial == "Doppelglas":
            if data["AlterStehwandmaterial"][0] <= 15:
                stehwand = helping_values["hull_size"]["wall"] * 1.328 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["stehwand_glas"]
                stehwand_h2o = stehwand * h2o_equivalents["stehwand_glas"]
        elif stehwandmaterial == "Doppelstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"] * 0.17 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["bedachung_stegplatte"]
                stehwand_h2o = stehwand * h2o_equivalents["bedachung_stegplatte"]
        elif stehwandmaterial == "Dreifachstegplatte":
            if data["AlterStehwandmaterial"][0] <= 10:
                stehwand = helping_values["hull_size"]["wall"] * 0.27 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["stehwand_stegplatte"]
                stehwand_h2o = stehwand * h2o_equivalents["stehwand_stegplatte"]
        elif stehwandmaterial == "Einfachfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"] * 0.0374 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["stehwand_folie"]
                stehwand_h2o = stehwand * h2o_equivalents["stehwand_folie"]
        elif stehwandmaterial == "Doppelfolie":
            if data["AlterStehwandmaterial"][0] <= 5:
                stehwand = helping_values["hull_size"]["wall"] * 0.0748 * helping_values["culture_length_usage"]
                stehwand_co2 = stehwand * co2_equivalents["stehwand_folie"]
                stehwand_h2o = stehwand * h2o_equivalents["stehwand_folie"]
        else:
            raise ValueError('No valid option for Stehwandmaterial has been selected')

        # input field: Bedachung
        if bedachungsmaterial == "Einfachglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 0.664 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_glas"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_glas"]
        elif bedachungsmaterial == "Doppelglas":
            if data["AlterBedachungsmaterial"][0] <= 15:
                bedachung = helping_values["hull_size"]["wall"] * 1.328 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_glas"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_glas"]
        elif bedachungsmaterial == "Doppelstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.17 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_stegplatte"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_stegplatte"]
        elif bedachungsmaterial == "Dreifachstegplatte":
            if data["AlterBedachungsmaterial"][0] <= 10:
                bedachung = helping_values["hull_size"]["wall"] * 0.27 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_stegplatte"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_stegplatte"]
        elif bedachungsmaterial == "Einfachfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0374 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_folie"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_folie"]
        elif bedachungsmaterial == "Doppelfolie":
            if data["AlterBedachungsmaterial"][0] <= 5:
                bedachung = helping_values["hull_size"]["wall"] * 0.0748 * helping_values["culture_length_usage"]
                bedachung_co2 = bedachung * co2_equivalents["bedachung_folie"]
                bedachung_h2o = bedachung * h2o_equivalents["bedachung_folie"]
        else:
            raise ValueError('No valid option for Bedachungsmaterial has been selected')

    elif norm_name == "Folientunnel":
        if(bedachungsmaterial == "Einfachfolie"):
            if data["AlterBedachungsmaterial"][0] <= 5:
                lpde = helping_values["hull_size"]["total"] * 0.06 * helping_values["culture_length_usage"]
                lpde_co2 = lpde * co2_equivalents["lpde"]
                lpde_h2o = lpde * h2o_equivalents["lpde"]
            if data["GWHAlter"][0] <= 20:
                stahl = helping_values["gh_size"] * 0.13 * helping_values["culture_length_usage"]
                stahl_co2 = stahl * co2_equivalents["stahl"]
                stahl_h2o = stahl * h2o_equivalents["stahl"]
        else:
            # assume option Doppelfolie has been selected.
            # if something else has been selected this will be assumed to not cause unnecessary errors.
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

    # input field: Energieschirm
    energieschirm_co2 = 0
    energieschirm_h2o = 0
    energieschirmverwendung = all_options.get(id=data["Energieschirm"][0][0]).option_value

    if data["AlterEnergieschirm"][0] <= 10 and energieschirmverwendung == "ja":
        energieschirmmaterial = all_options.get(id=data["EnergieschirmTyp"][0][0]).option_value
        if energieschirmmaterial == "einfach":
            energieschirm = helping_values["gh_size"] * 0.05 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * co2_equivalents["energieschirm"]
            energieschirm_h2o = energieschirm * h2o_equivalents["energieschirm"]
        elif energieschirmmaterial == "doppelt":
            energieschirm = helping_values["gh_size"] * 0.1 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * co2_equivalents["energieschirm"]
            energieschirm_h2o = energieschirm * h2o_equivalents["energieschirm"]
        elif energieschirmmaterial == "einfach, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.05 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * co2_equivalents["energieschirm_aluminisiert"]
            energieschirm_h2o = energieschirm * h2o_equivalents["energieschirm_aluminisiert"]
        elif energieschirmmaterial == "doppelt, aluminisiert":
            energieschirm = helping_values["gh_size"] * 0.1 * helping_values["culture_length_usage"]
            energieschirm_co2 = energieschirm * co2_equivalents["energieschirm_aluminisiert"]
            energieschirm_h2o = energieschirm * h2o_equivalents["energieschirm_aluminisiert"]
        else:
            raise ValueError('No valid option for Energieschirm has been selected')

    # input field: Bodenabdeckung
    bodenabdeckung_co2 = 0
    bodenabdeckung_h2o = 0
    if data["Bodenabdeckung"] != default_option:
        for option in data["Bodenabdeckung"]:
            bodenabdeckungmaterial = all_options.get(id=option[0]).option_value
            nutzdauer = option[1]
            if bodenabdeckungmaterial == "Bodenfolie":
                if nutzdauer <= 10:
                    bodenabdeckung = helping_values["culture_size"] * 0.01
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * co2_equivalents["bodenabdeckung_bodenfolie"]
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * h2o_equivalents["bodenabdeckung_bodenfolie"]
            elif bodenabdeckungmaterial == "Bodengewebe":
                if nutzdauer <= 10:
                    bodenabdeckung = helping_values["culture_size"] * 0.02
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * co2_equivalents["bodenabdeckung_bodengewebe"]
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * h2o_equivalents["bodenabdeckung_bodengewebe"]
            elif bodenabdeckungmaterial == "Beton":
                if nutzdauer <= 20:
                    bodenabdeckung = helping_values["culture_size"] * 2.52
                    bodenabdeckung_co2 = bodenabdeckung_co2 + bodenabdeckung * co2_equivalents["bodenabdeckung_beton"]
                    bodenabdeckung_h2o = bodenabdeckung_h2o + bodenabdeckung * h2o_equivalents["bodenabdeckung_beton"]
            else:
                raise ValueError('No valid option for Bodenabdeckung has been selected')

    # input field: Produktionssystem
    produktionssystemtyp = all_options.get(id=data["Produktionssystem"][0][0]).option_value
    produktionstyp = all_options.get(id=data["Produktionstyp"][0][0]).option_value
    produktionssystem_co2 = 0
    produktionssystem_h2o = 0
    if data["AlterProduktionssystem"][0] <= 15:
        if produktionssystemtyp == "Boden" or produktionstyp == "Biologisch":  # Biologisch doesn't have Produktionssystem
            pass
        elif produktionssystemtyp == "Hydroponik offen":
            produktionssystem = helping_values["row_length_total"] * 2 * 0.133333333
            produktionssystem_co2 = produktionssystem * co2_equivalents["produktionssystem_hydroponik"]
            produktionssystem_h2o = produktionssystem * h2o_equivalents["produktionssystem_hydroponik"]
        elif produktionssystemtyp == "Hydroponik geschlossen":
            produktionssystem = helping_values["row_length_total"] * 2 * 0.133333333
            produktionssystem_co2 = produktionssystem * co2_equivalents["produktionssystem_hydroponik"]
            produktionssystem_h2o = produktionssystem * h2o_equivalents["produktionssystem_hydroponik"]
        else:
            raise ValueError('No valid option for Produktionssystem has been selected')

    # input field: Bewässerungsart
    bewaesserungmaterial = all_options.get(id=data["Bewaesserungsart"][0][0]).option_value
    bewaesserung_co2 = 0
    bewaesserung_h2o = 0
    if bewaesserungmaterial == "Tropfschlaeuche":
        bewaesserung = ((helping_values["row_length_total"] + data["Breite"][0]) * 1.36 / 100) / 10
        bewaesserung_co2 = bewaesserung * co2_equivalents["bewaesserung_tropfschlaeuche"]
        bewaesserung_h2o = bewaesserung * h2o_equivalents["bewaesserung_tropfschlaeuche"]
    elif bewaesserungmaterial == "Bodensprinkler":
        bewaesserung = ((helping_values["row_length_total"]/3 + data["Breite"][0]) * 4 / 30) / 15
        bewaesserung_co2 = bewaesserung * co2_equivalents["bewaesserung_bodensprinkler"]
        bewaesserung_h2o = bewaesserung * h2o_equivalents["bewaesserung_bodensprinkler"]
    elif bewaesserungmaterial == "Handschlauch":
        bewaesserung = (math.sqrt(abs(helping_values["gh_size"]*2.5)) * 4 / 30) / 15
        bewaesserung_co2 = bewaesserung * co2_equivalents["bewaesserung_handschlauch"]
        bewaesserung_h2o = bewaesserung * h2o_equivalents["bewaesserung_handschlauch"]
    else:
        raise ValueError('No valid option for Bewaesserungsart has been selected')

    # input field: Heizsystem
    heizsystemtyp = all_options.get(id=data["Heizsystem"][0][0]).option_value
    heizsystem_co2 = 0
    heizsystem_h2o = 0

    if data["AlterHeizsystem"][0] <= 20:
        if heizsystemtyp == "Transportsystem":
            heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * co2_equivalents["heizsystem"]
            heizsystem_h2o = heizsystem * h2o_equivalents["heizsystem"]
        elif heizsystemtyp == "Rohrheizung (hoch, niedrig, etc.)":
            heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * co2_equivalents["heizsystem"]
            heizsystem_h2o = heizsystem * h2o_equivalents["heizsystem"]
        elif heizsystemtyp == "Konvektionsheizung":
            heizsystem = data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * helping_values["culture_length_usage"]
            heizsystem_co2 = heizsystem * co2_equivalents["heizsystem"]
            heizsystem_h2o = heizsystem * h2o_equivalents["heizsystem"]
        elif heizsystemtyp == "Deckenlufterhitzer":
            pass
        elif heizsystemtyp == "Keines":
            pass
        else:
            raise ValueError('No valid option for Heizsystem has been selected')

    # input field: Zusaetzliches Heizsystem
    zusaetzliches_heizsystem_co2 = 0
    zusaetzliches_heizsystem_h2o = 0
    zusaetzliches_heizsystemverwendung = all_options.get(id=data["ZusaetzlichesHeizsystem"][0][0]).option_value
    if zusaetzliches_heizsystemverwendung == "ja":
        zusaetzliches_heizsystemtyp = all_options.get(id=data["ZusaetzlichesHeizsystemTyp"][0][0]).option_value
        if zusaetzliches_heizsystemtyp == "Transportsystem":
            if data["AlterZusaetzlichesHeizsystem"][0] <= 20:
                zusaetzliches_heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * co2_equivalents["heizsystem"]
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * h2o_equivalents["heizsystem"]
        elif zusaetzliches_heizsystemtyp == "Rohrheizung (hoch, niedrig, etc.)":
            if data["AlterZusaetzlichesHeizsystem"][0] <= 20:
                zusaetzliches_heizsystem = helping_values["walk_length_total"] * 0.135 * 2.7 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * co2_equivalents["heizsystem"]
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * h2o_equivalents["heizsystem"]
        elif zusaetzliches_heizsystemtyp == "Konvektionsheizung":
            if data["AlterZusaetzlichesHeizsystem"][0] <= 15:
                zusaetzliches_heizsystem = data["Laenge"][0] * 0.8 * 2 * 7 * 0.466666667 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * co2_equivalents["heizsystem"]
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * h2o_equivalents["heizsystem"]
        elif zusaetzliches_heizsystemtyp == "Vegetationsheizung":
            if data["AlterZusaetzlichesHeizsystem"][0] <= 15:
                zusaetzliches_heizsystem = helping_values["row_length_total"] * 2 * 0.133333333 * helping_values["culture_length_usage"]
                zusaetzliches_heizsystem_co2 = zusaetzliches_heizsystem * co2_equivalents["heizsystem"]
                zusaetzliches_heizsystem_h2o = zusaetzliches_heizsystem * h2o_equivalents["heizsystem"]
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
    print("gwh-konstruktion_h2o: " + str(gesamt_h2o))
    return konstruktion_co2, energieschirm_co2, bodenabdeckung_co2, produktionssystem_co2, bewaesserung_co2, heizsystem_co2, zusaetzliches_heizsystem_co2, \
           konstruktion_h2o, energieschirm_h2o, bodenabdeckung_h2o, produktionssystem_h2o, bewaesserung_h2o, heizsystem_h2o, zusaetzliches_heizsystem_h2o


def calc_energy_source(data, all_options):
    """Calculates the co2 and h2o footprints for the heat energy consumption

    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for heat energy consumption
    """
    # input field: Energietraeger
    # they should always have the unit kWh already
    energietraeger_co2 = 0
    energietraeger_h2o = 0

    geteilte_waermeversorgung = all_options.get(id=data["Waermeversorgung"][0][0]).option_value

    for option in data["Energietraeger"]:
        # check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kWh":
            raise ValueError('Energietraeger value unit has not been converted to kWh!')
        energietraegertyp = all_options.get(id=option[0]).option_value
        menge = option[1]

        if energietraegertyp == "Erdgas":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["erdgas"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["erdgas"]
        elif energietraegertyp == "Biogas":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["biogas"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["biogas"]
        elif energietraegertyp == "Heizoel":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["heizoel"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["heizoel"]
        elif energietraegertyp == "Steinkohle":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["steinkohle"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["steinkohle"]
        elif energietraegertyp == "Braunkohle":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["braunkohle"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["braunkohle"]
        elif energietraegertyp == "Hackschnitzel":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["hackschnitzel"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["hackschnitzel"]
        elif energietraegertyp == "Geothermie(oberflaechennah)":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["geothermie"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["geothermie"]
        elif energietraegertyp == "Tiefengeothermie":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["tiefengeothermie"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["tiefengeothermie"]
        elif energietraegertyp == "BHKW Erdgas":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["erdgas"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["erdgas"]
        elif energietraegertyp == "BHKW Biomethan":
            energietraeger_co2 = energietraeger_co2 + menge * co2_equivalents["biomethan"]
            energietraeger_h2o = energietraeger_h2o + menge * h2o_equivalents["biomethan"]
        else:
            raise ValueError('No valid option for Energietraeger has been selected')

    if geteilte_waermeversorgung == "ja":
        energietraeger_co2 = energietraeger_co2 * (data["GWHFlaeche"][0]/data["WaermeteilungFlaeche"][0])
        energietraeger_h2o = energietraeger_h2o * (data["GWHFlaeche"][0]/data["WaermeteilungFlaeche"][0])

    print("energietraeger_co2: " + str(energietraeger_co2))
    print("energietraeger_h2o: " + str(energietraeger_h2o))
    return energietraeger_co2, energietraeger_h2o


def calc_electric_power(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for electric power consumption.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the electric power consumption
    """

    # co2 usage
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

    # h2o usage
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

    # part of total kWh
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
        # check if the values have the correct unit
        if OptionUnits.objects.get(id=option[2]).unit_name != "kWh":
            raise ValueError('Stromherkunft value unit has not been converted to kWh!')
        stromtyp = all_options.get(id=option[0]).option_value
        menge = option[1]
        netto_menge = menge * helping_values["culture_length_usage"]
        if stromtyp == "Deutscher Strommix":
            deutscher_strommix_co2 = netto_menge * co2_equivalents["deutscher_strommix"]
            deutscher_strommix_h2o = netto_menge * h2o_equivalents["deutscher_strommix"]
            deutscher_strommix_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Oekostrom (Durschnitt Deutschland)":
            oekostrom_co2 = netto_menge * co2_equivalents["oekostrom"]
            oekostrom_h2o = netto_menge * h2o_equivalents["oekostrom"]
            oekostrom_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Photovoltaik":
            photovoltaik_co2 = netto_menge * co2_equivalents["photovoltaik"]
            photovoltaik_h2o = netto_menge * h2o_equivalents["photovoltaik"]
            photovoltaik_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (Land)":
            windenergie_land_co2 = netto_menge * co2_equivalents["windenergie_land"]
            windenergie_land_h2o = netto_menge * h2o_equivalents["windenergie_land"]
            windenergie_land_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Windenergie (See)":
            windenergie_see_co2 = netto_menge * co2_equivalents["windenergie_see"]
            windenergie_see_h2o = netto_menge * h2o_equivalents["windenergie_see"]
            windenergie_see_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Wasserkraft":
            wasserkraft_co2 = netto_menge * co2_equivalents["wasserkraft"]
            wasserkraft_h2o = netto_menge * h2o_equivalents["wasserkraft"]
            wasserkraft_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Tiefengeothermie":
            tiefengeothermie_co2 = netto_menge * co2_equivalents["tiefengeothermie"]
            tiefengeothermie_h2o = netto_menge * h2o_equivalents["tiefengeothermie"]
            tiefengeothermie_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Biomethan":
            bhkwbiomethan_co2 = netto_menge * co2_equivalents["biomethan"]
            bhkwbiomethan_h2o = netto_menge * h2o_equivalents["biomethan"]
            bhkwbiomethan_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "BHKW Erdgas":
            bhkwerdgas_co2 = netto_menge * co2_equivalents["erdgas"]
            bhkwerdgas_h2o = netto_menge * h2o_equivalents["erdgas"]
            bhkwerdgas_anteil = menge / helping_values["energyconsumption_company"]
        elif stromtyp == "Diesel":
            diesel_co2 = netto_menge * co2_equivalents["diesel"]
            diesel_h2o = netto_menge * h2o_equivalents["diesel"]
            diesel_anteil = menge / helping_values["energyconsumption_company"]
        else:
            raise ValueError('No valid option for Stromherkunft has been selected')

    # take field Belichtung into account if it isn't already included in the calculation
    if all_options.get(id=data["Zusatzbelichtung"][0][0]).option_value == "ja" and all_options.get(id=data["Belichtungsstrom"][0][0]).option_value == "nein":
        deutscher_strommix_co2 = deutscher_strommix_co2 + (helping_values["energyconsumption_lighting"] * deutscher_strommix_anteil * co2_equivalents["deutscher_strommix"])
        deutscher_strommix_h2o = deutscher_strommix_h2o + (helping_values["energyconsumption_lighting"] * deutscher_strommix_anteil * h2o_equivalents["deutscher_strommix"])
        oekostrom_co2 = oekostrom_co2 + (helping_values["energyconsumption_lighting"] * oekostrom_anteil * co2_equivalents["oekostrom"])
        oekostrom_h2o = oekostrom_h2o + (helping_values["energyconsumption_lighting"] * oekostrom_anteil * h2o_equivalents["oekostrom"])
        photovoltaik_co2 = photovoltaik_co2 + (helping_values["energyconsumption_lighting"] * photovoltaik_anteil * co2_equivalents["photovoltaik"])
        photovoltaik_h2o = photovoltaik_h2o + (helping_values["energyconsumption_lighting"] * photovoltaik_anteil * h2o_equivalents["photovoltaik"])
        windenergie_land_co2 = windenergie_land_co2 + (helping_values["energyconsumption_lighting"] * windenergie_land_anteil * co2_equivalents["windenergie_land"])
        windenergie_land_h2o = windenergie_land_h2o + (helping_values["energyconsumption_lighting"] * windenergie_land_anteil * h2o_equivalents["windenergie_land"])
        windenergie_see_co2 = windenergie_see_co2 + (helping_values["energyconsumption_lighting"] * windenergie_see_anteil * co2_equivalents["windenergie_see"])
        windenergie_see_h2o = windenergie_see_h2o + (helping_values["energyconsumption_lighting"] * windenergie_see_anteil * h2o_equivalents["windenergie_see"])
        wasserkraft_co2 = wasserkraft_co2 + (helping_values["energyconsumption_lighting"] * wasserkraft_anteil * co2_equivalents["wasserkraft"])
        wasserkraft_h2o = wasserkraft_h2o + (helping_values["energyconsumption_lighting"] * wasserkraft_anteil * h2o_equivalents["wasserkraft"])
        tiefengeothermie_co2 = tiefengeothermie_co2 + (helping_values["energyconsumption_lighting"] * tiefengeothermie_anteil * co2_equivalents["tiefengeothermie"])
        tiefengeothermie_h2o = tiefengeothermie_h2o + (helping_values["energyconsumption_lighting"] * tiefengeothermie_anteil * h2o_equivalents["tiefengeothermie"])
        bhkwbiomethan_co2 = bhkwbiomethan_co2 + (helping_values["energyconsumption_lighting"] * bhkwbiomethan_anteil * co2_equivalents["biomethan"])
        bhkwbiomethan_h2o = bhkwbiomethan_h2o + (helping_values["energyconsumption_lighting"] * bhkwbiomethan_anteil * h2o_equivalents["biomethan"])
        bhkwerdgas_co2 = bhkwerdgas_co2 + (helping_values["energyconsumption_lighting"] * bhkwerdgas_anteil * co2_equivalents["erdgas"])
        bhkwerdgas_h2o = bhkwerdgas_h2o + (helping_values["energyconsumption_lighting"] * bhkwerdgas_anteil * h2o_equivalents["erdgas"])
        diesel_co2 = diesel_co2 + (helping_values["energyconsumption_lighting"] * diesel_anteil * co2_equivalents["diesel"])
        diesel_h2o = diesel_h2o + (helping_values["energyconsumption_lighting"] * diesel_anteil * h2o_equivalents["diesel"])

    # input field: Tiefengeothermie: If option has already been selected for field Wärmeverbrauch, then value = 0
    # input field: BHKW-Erdgas: If option has already been selected for field Wärmeverbrauch, then value = 0
    # input field: BHKW-Biomethan: If option has already been selected for field Wärmeverbrauch, then value = 0
    for option in data["Energietraeger"]:
        if all_options.get(id=option[0]).option_value == "Tiefengeothermie":
            tiefengeothermie_co2 = 0
            tiefengeothermie_h2o = 0
    if helping_values["bhkw_usage"]:
        bhkwerdgas_co2 = 0
        bhkwerdgas_h2o = 0
        bhkwbiomethan_co2 = 0
        bhkwbiomethan_h2o = 0

    strom_gesamt_co2 = deutscher_strommix_co2 + oekostrom_co2 + photovoltaik_co2 + windenergie_land_co2 + windenergie_see_co2 + wasserkraft_co2 + tiefengeothermie_co2 + bhkwerdgas_co2 + bhkwbiomethan_co2 + diesel_co2
    strom_gesamt_h2o = deutscher_strommix_h2o + oekostrom_h2o + photovoltaik_h2o + windenergie_land_h2o + windenergie_see_h2o + wasserkraft_h2o + tiefengeothermie_h2o + bhkwerdgas_h2o + bhkwbiomethan_h2o + diesel_h2o

    print("strom_co2: " + str(strom_gesamt_co2))
    print("strom_h2o: " + str(strom_gesamt_h2o))
    return strom_gesamt_co2, strom_gesamt_h2o


def calc_water_usage(data, all_options):
    """Calculates the size of the footprints for the direct water usage.

    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the direct water usage split up into the water categories
    """

    brunnenwasser_co2 = 0
    brunnenwasser_h2o = 0
    regenwasser_co2 = 0
    regenwasser_h2o = 0
    stadtwasser_co2 = 0
    stadtwasser_h2o = 0
    oberflaechenwasser_co2 = 0
    oberflaechenwasser_h2o = 0
    wasser_daten = all_options.get(id=data["WasserVerbrauch"][0][0]).option_value
    print("wasser", wasser_daten)
    if wasser_daten == "ja":
        if data["VorlaufmengeAnteile"] != default_option:
            for option in data["VorlaufmengeAnteile"]:
                # check if the values have the correct unit
                if OptionUnits.objects.get(id=option[2]).unit_name != "Liter":
                    raise ValueError('VorlaufmengeAnteile value unit has not been converted to Liter!')

                vorlaufmengetyp = all_options.get(id=option[0]).option_value
                menge = option[1] - data["Restwasser"][0] * option[1]/data["VorlaufmengeGesamt"][0]
                # menge cannot be lower than 0
                if menge < 0:
                    menge = 0
                if vorlaufmengetyp == "Brunnenwasser":
                    brunnenwasser_co2 = brunnenwasser_co2 + menge * co2_equivalents["brunnenwasser"]
                    brunnenwasser_h2o = brunnenwasser_h2o + menge * h2o_equivalents["brunnenwasser"]
                elif vorlaufmengetyp == "Regenwasser":
                    regenwasser_co2 = regenwasser_co2 + menge * co2_equivalents["regenwasser"]
                    regenwasser_h2o = regenwasser_h2o + menge * h2o_equivalents["regenwasser"]
                elif vorlaufmengetyp == "Stadtwasser":
                    stadtwasser_co2 = stadtwasser_co2 + menge * co2_equivalents["stadtwasser"]
                    stadtwasser_h2o = stadtwasser_h2o + menge * h2o_equivalents["stadtwasser"]
                elif vorlaufmengetyp == "Oberflaechenwasser":
                    oberflaechenwasser_co2 = oberflaechenwasser_co2 + menge * co2_equivalents["oberflaechenwasser"]
                    oberflaechenwasser_h2o = oberflaechenwasser_h2o + menge * h2o_equivalents["oberflaechenwasser"]
                else:
                    raise ValueError('No valid option for VorlaufmengeAnteile has been selected')

    print("brunnenwasser_co2: " + str(brunnenwasser_co2))
    print("brunnenwasser_h2o: " + str(brunnenwasser_h2o))
    print("regenwasser_co2: " + str(regenwasser_co2))
    print("regenwasser_h2o: " + str(regenwasser_h2o))
    print("stadtwasser_co2: " + str(stadtwasser_co2))
    print("stadtwasser_h2o: " + str(stadtwasser_h2o))
    print("oberflaechenwasser_co2: " + str(oberflaechenwasser_co2))
    print("oberflaechenwasser_h2o: " + str(oberflaechenwasser_h2o))
    return brunnenwasser_co2, brunnenwasser_h2o, regenwasser_co2, regenwasser_h2o, stadtwasser_co2, stadtwasser_h2o, oberflaechenwasser_co2, oberflaechenwasser_h2o


def calc_co2_added(data, all_options):
    """Calculates the size of the footprints for the added co2

    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the added co2
    """

    # input field: CO2-Herkunft
    co2_zudosierung_co2 = 0
    co2_zudosierung_h2o = 0
    # check if there is even co2 added
    print("CO-Herkunft")
    if (data["CO2-Herkunft"] != default_option):
        for option in data["CO2-Herkunft"]:
            # check if the values have the correct unit
            if OptionUnits.objects.get(id=option[2]).unit_name != "kg":
                raise ValueError('CO2-Herkunft value unit has not been converted to kg!')

            co2_zudosierungtyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if co2_zudosierungtyp == "technisches CO2":
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * co2_equivalents["technisches_co2"]
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * h2o_equivalents["technisches_co2"]
            elif co2_zudosierungtyp == "direkte Gasverbrennung":
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * co2_equivalents["direkte_gasverbrennung"]
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * h2o_equivalents["direkte_gasverbrennung"]
            elif co2_zudosierungtyp == "eigenes BHKW":
                # there is no need to check, if energietraeger uses bhkw since it has no impact anyway.
                co2_zudosierung_co2 = co2_zudosierung_co2 + menge * co2_equivalents["eigenes_bhkw"]
                co2_zudosierung_h2o = co2_zudosierung_h2o + menge * h2o_equivalents["eigenes_bhkw"]
            else:
                raise ValueError('No valid option for CO2-Herkunft has been selected')

    print("co2_zudosierung_co2: " + str(co2_zudosierung_co2))
    print("co2_zudosierung_h2o: " + str(co2_zudosierung_h2o))
    return co2_zudosierung_co2, co2_zudosierung_h2o


def calc_fertilizer(data, all_options):
    """Calculates the co2 and h2o footprints for fertilizer usage.

    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the fertilizer usage.
    """

    # input field: CO2-Herkunft
    duengemittel_einfach_co2 = 0
    duengemittel_einfach_h2o = 0
    if data["Duengemittel:VereinfachteAngabe"] != default_option:
        for option in data["Duengemittel:VereinfachteAngabe"]:
            duengemittel_einfachtyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if duengemittel_einfachtyp == "A/B Bag: Standardduengung":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["standardduengung"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["standardduengung"]
            elif duengemittel_einfachtyp == "Vinasse":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["vinasse"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["vinasse"]
            elif duengemittel_einfachtyp == "Pferdemist":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["pferdemist"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["pferdemist"]
            elif duengemittel_einfachtyp == "Kompost":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["kompost"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["kompost"]
            elif duengemittel_einfachtyp == "Hornmehl, -griess, -spaene":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["hornmehl"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["hornmehl"]
            elif duengemittel_einfachtyp == "Blutmehl":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["blutmehl"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["blutmehl"]
            elif duengemittel_einfachtyp == "Mist":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["mist"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["mist"]
            elif duengemittel_einfachtyp == "Gruenduengung":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["gruenduengung"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["gruenduengung"]
            elif duengemittel_einfachtyp == "Knochenmehl":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["knochenmehl"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["knochenmehl"]
            elif duengemittel_einfachtyp == "Pflanzkali":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["pflanzkali"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["pflanzkali"]
            elif duengemittel_einfachtyp == "org. Vollduenger":
                duengemittel_einfach_co2 = duengemittel_einfach_co2 + menge * co2_equivalents["vollduenger"]
                duengemittel_einfach_h2o = duengemittel_einfach_h2o + menge * h2o_equivalents["vollduenger"]
            else:
                raise ValueError('No valid option for Duengemittel:VereinfachteAngabe has been selected')

    duengemittel_detailliert_co2 = 0
    duengemittel_detailliert_h2o = 0
    if data["Duengemittel:DetaillierteAngabe"] != default_option:
        for option in data["Duengemittel:DetaillierteAngabe"]:
            duengemittel_detaillierttyp = all_options.get(id=option[0]).option_value
            menge = option[1]
            if duengemittel_detaillierttyp == "Ammoniumnitrat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["ammoniumnitrat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["ammoniumnitrat"]
            elif duengemittel_detaillierttyp == "Kaliumnitrat (Kalisalpeter)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kaliumnitrat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kaliumnitrat"]
            elif duengemittel_detaillierttyp == "Calciumnitrat fluessig (Kalksalpeter)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["calciumnitrat_fluessing"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["calciumnitrat_fluessing"]
            elif duengemittel_detaillierttyp == "Calciumnitrat fest":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["calciumnitrat_fest"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["calciumnitrat_fest"]
            elif duengemittel_detaillierttyp == "Kaliumchlorid, KCL, muriate of potash":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kaliumchlorid"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kaliumchlorid"]
            elif duengemittel_detaillierttyp == "Kaliumsulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kaliumsulfat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kaliumsulfat"]
            elif duengemittel_detaillierttyp == "Monokaliumphosphat (Flory6)":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["monokaliumphosphat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["monokaliumphosphat"]
            elif duengemittel_detaillierttyp == "Borax":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["borax"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["borax"]
            elif duengemittel_detaillierttyp == "Eisen DDTPA 3%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["eisen_ddtpa"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["eisen_ddtpa"]
            elif duengemittel_detaillierttyp == "Eisen EDDHA 6 %":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["eisen_eddha"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["eisen_eddha"]
            elif duengemittel_detaillierttyp == "25 % Cu Kupfersulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kupfersulfat_25"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kupfersulfat_25"]
            elif duengemittel_detaillierttyp == "32 % Mn Mangansulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["mangansulfat_32"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["mangansulfat_32"]
            elif duengemittel_detaillierttyp == "Natriummolybdat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["natriummolybdat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["natriummolybdat"]
            elif duengemittel_detaillierttyp == "Zinksulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["zinksulfat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["zinksulfat"]
            elif duengemittel_detaillierttyp == "Chlorbleichlauge":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["chlorbleichlauge"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["chlorbleichlauge"]
            elif duengemittel_detaillierttyp == "Bittersalz":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["bittersalz"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["bittersalz"]
            elif duengemittel_detaillierttyp == "Phosphorsaeure 75%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["phosphorsaeure"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["phosphorsaeure"]
            elif duengemittel_detaillierttyp == "Salpetersaeure 65%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["salpetersaeure_65"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["salpetersaeure_65"]
            elif duengemittel_detaillierttyp == "Salpetersaeure 38%":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["salpetersaeure_38"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["salpetersaeure_38"]
            elif duengemittel_detaillierttyp == "Kalksalpeter":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kalksalpeter"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kalksalpeter"]
            elif duengemittel_detaillierttyp == "Magnesiumnitrat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["magnesiumnitrat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["magnesiumnitrat"]
            elif duengemittel_detaillierttyp == "Magnesiumsulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["magnesiumsulfat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["magnesiumsulfat"]
            elif duengemittel_detaillierttyp == "Kalisilikat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kalisilikat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kalisilikat"]
            elif duengemittel_detaillierttyp == "Mangansulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["mangansulfat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["mangansulfat"]
            elif duengemittel_detaillierttyp == "Kupfersulfat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["kupfersulfat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["kupfersulfat"]
            elif duengemittel_detaillierttyp == "Ammoniummolybdat":
                duengemittel_detailliert_co2 = duengemittel_detailliert_co2 + menge * co2_equivalents["ammoniummolybdat"]
                duengemittel_detailliert_h2o = duengemittel_detailliert_h2o + menge * h2o_equivalents["ammoniummolybdat"]
            else:
                raise ValueError('No valid option for Duengemittel:DetaillierteAngabe has been selected')

    duengemittel_co2 = duengemittel_detailliert_co2+duengemittel_einfach_co2
    duengemittel_h2o = duengemittel_detailliert_h2o+duengemittel_einfach_h2o
    print("duengemittel_co2: ", duengemittel_co2)
    print("duengemittel_h2o: ", duengemittel_h2o)
    return duengemittel_co2, duengemittel_h2o


def calc_psm(data):
    """Calculates the co2 and h2o footprints for crop protection product usage.

    Args:
        data: greenhouse dataset

    Returns:
        co2 and h2o footprints for crop protection product usage
    """

    fungizide = (data["FungizideKg"][0] + data["FungizideLiter"][0])
    insektizide = (data["InsektizideKg"][0] + data["InsektizideLiter"][0])
    fungizide_co2 = fungizide * co2_equivalents["fungizide"]
    fungizide_h2o = fungizide * h2o_equivalents["fungizide"]
    insektizide_co2 = insektizide * co2_equivalents["insektizide"]
    insektizide_h2o = insektizide * h2o_equivalents["insektizide"]

    psm_co2 = fungizide_co2 + insektizide_co2
    psm_h2o = fungizide_h2o + insektizide_h2o
    print("psm_co2: ", psm_co2)
    print("psm_h2o: ", psm_h2o)
    return psm_co2, psm_h2o


def calc_plantbags(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for plant bag usage.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for plant bag usage
    """

    # input fields: Growbags + Kuebel
    growbagskuebelverwendung = all_options.get(id=data["GrowbagsKuebel"][0][0]).option_value
    growbags_co2 = 0
    growbags_h2o = 0
    kuebel_co2 = 0
    kuebel_h2o = 0
    kuebel_nutzdauer = data["Kuebel:Alter"][0]
    if kuebel_nutzdauer <= 0:
        kuebel_nutzdauer = 1
    if growbagskuebelverwendung == "Growbags":
        growbags = ((helping_values["row_length_total"]*0.2*2+helping_values["row_length_total"]*0.11*2+helping_values["row_length_total"]/1*2*(0.15*0.11))*0.186)
        growbags_co2 = growbags * co2_equivalents["growbags"]
        growbags_h2o = growbags * h2o_equivalents["growbags"]
    elif growbagskuebelverwendung == "Andere Kulturgefaesse (Topf, Kuebel)":
        calc = (0.03 * data["Kuebel:VolumenProTopf"][0] - 0.0214)
        if calc <= 0:
            calc = 0.01
        kuebel = (calc * helping_values["plant_count_total"]) / data["Kuebel:JungpflanzenProTopf"][0] / kuebel_nutzdauer
        kuebel_co2 = kuebel * co2_equivalents["andere_kulturgefaesse"]
        kuebel_h2o = kuebel * h2o_equivalents["andere_kulturgefaesse"]
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
    """Calculates the co2 and h2o footprints for substrate consumption.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the substrate power consumption
    """

    # input field: Substrat
    substrat_co2 = 0
    substrat_h2o = 0
    volumen = 0
    # assign the correct volume for the selected option Pflanzenbehaelter
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
            substrat_co2 = substrat_co2 + (volumen * co2_equivalents["standardsubstrat"])/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * h2o_equivalents["standardsubstrat"])/nutzdauer
        elif substratmaterial == "Kokos":
            substrat_co2 = substrat_co2 + (volumen * co2_equivalents["kokos"])/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * h2o_equivalents["kokos"])/nutzdauer
        elif substratmaterial == "Steinwolle":
            substrat_co2 = substrat_co2 + (volumen * co2_equivalents["steinwolle"])/nutzdauer
            substrat_h2o = substrat_h2o + (volumen * h2o_equivalents["steinwolle"])/nutzdauer
        elif substratmaterial == "Perlite":
            substrat_co2 = substrat_co2 + (volumen * co2_equivalents["perlite"]) / nutzdauer
            substrat_h2o = substrat_h2o + (volumen * h2o_equivalents["perlite"]) / nutzdauer
        elif substratmaterial == "Nachhaltiges Substrat":
            substrat_co2 = substrat_co2 + (volumen * co2_equivalents["nachhaltiges_substrat"]) / nutzdauer
            substrat_h2o = substrat_h2o + (volumen * h2o_equivalents["nachhaltiges_substrat"]) / nutzdauer
        else:
            raise ValueError('No valid option for Substrat has been selected')

    print("substrat_co2: ", substrat_co2)
    print("substrat_h2o: ", substrat_h2o)
    return substrat_co2, substrat_h2o


def calc_young_plants_substrate(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for young plants' substrate consumption.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the young plants' substrate consumption
    """

    jungpflanzen_substratmaterial = all_options.get(id=data["Jungpflanzen:Substrat"][0][0]).option_value

    volumen = (0.1*0.1*0.1) * helping_values["plant_count_total"]
    if jungpflanzen_substratmaterial == "Standardsubstrat":
        junpflanzen_substrat_co2 = volumen * co2_equivalents["standardsubstrat"]
        junpflanzen_substrat_h2o = volumen * h2o_equivalents["standardsubstrat"]
    elif jungpflanzen_substratmaterial == "Kokos":
        junpflanzen_substrat_co2 = volumen * co2_equivalents["kokos"]
        junpflanzen_substrat_h2o = volumen * h2o_equivalents["kokos"]
    elif jungpflanzen_substratmaterial == "Steinwolle":
        junpflanzen_substrat_co2 = volumen * co2_equivalents["steinwolle"]
        junpflanzen_substrat_h2o = volumen * h2o_equivalents["steinwolle"]
    elif jungpflanzen_substratmaterial == "Perlite":
        junpflanzen_substrat_co2 = volumen * co2_equivalents["perlite"]
        junpflanzen_substrat_h2o = volumen * h2o_equivalents["perlite"]
    elif jungpflanzen_substratmaterial == "Nachhaltiges Substrat":
        junpflanzen_substrat_co2 = volumen * co2_equivalents["nachhaltiges_substrat"]
        junpflanzen_substrat_h2o = volumen * h2o_equivalents["nachhaltiges_substrat"]
    else:
        raise ValueError('No valid option for Jungpflanzen:Substrat has been selected')

    print("jungpflanzen_substrat_co2: ", junpflanzen_substrat_co2)
    print("jungpflanzen_substrat_h2o: ", junpflanzen_substrat_h2o)
    return junpflanzen_substrat_co2, junpflanzen_substrat_h2o


def calc_young_plants_transport(data, helping_values):
    """Calculates the co2 and h2o footprints for young plants' transport.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation

    Returns:
        co2 and h2o footprints for the transport of the young plants
    """

    jungpflanzen_transport_co2 = 0
    jungpflanzen_transport_h2o = 0

    if data["Jungpflanzen:Distanz"] == default_value:
        pass
    else:
        young_plants_transport = helping_values["plant_count_total"] / 1056 * 0.5 * data["Jungpflanzen:Distanz"][0]
        jungpflanzen_transport_co2 = young_plants_transport * co2_equivalents["transport"]
        jungpflanzen_transport_h2o = h2o_equivalents["transport"]  # for h2o it is a constant value

    print("jungpflanzen_transport_co2: ", jungpflanzen_transport_co2)
    print("jungpflanzen_transport_h2o: ", jungpflanzen_transport_h2o)
    return jungpflanzen_transport_co2, jungpflanzen_transport_h2o


def calc_cords(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for cords usage.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the consumptions of cords
    """

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
            schnuere_co2 = schnuere * co2_equivalents["schnuere_kunststoff"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_kunststoff"]
        elif schnuerematerial == "Jute":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_jute"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_jute"]
        elif schnuerematerial == "Sisal":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_sisal"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_sisal"]
        elif schnuerematerial == "Zellulose":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_zellulose"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_zellulose"]
        elif schnuerematerial == "andere Nachhaltige/abbaubare Option":
            schnuere = (helping_values["cord_length_total"] * 3 / 900) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_nachhaltige_option"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_nachhaltige_option"]
        elif schnuerematerial == "Bambusstab":
            schnuere = (helping_values["cord_length_total"] * 0.32) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_bambusstab"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_bambusstab"]
        elif schnuerematerial == "Edelstahl":
            schnuere = (helping_values["cord_length_total"] * 0.62) / nutzdauer
            schnuere_co2 = schnuere * co2_equivalents["schnuere_edelstahl"]
            schnuere_h2o = schnuere * h2o_equivalents["schnuere_edelstahl"]
        else:
            raise ValueError('No valid option for SchnuereRankhilfen:Material has been selected')
    else:
        raise ValueError('No valid option for Schnur has been selected')

    print("schnuere_co2: " + str(schnuere_co2))
    print("schnuere_h2o: " + str(schnuere_h2o))
    return schnuere_co2, schnuere_h2o


def calc_clips(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for clips usage.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the clips usage
    """

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
            klipse_co2 = klipse * co2_equivalents["klipse_kunststoff"]
            klipse_h2o = klipse * h2o_equivalents["klipse_kunststoff"]
        elif klipsematerial == "Metall":
            klipse = (helping_values["clips_count_total"] * 0.0008) / nutzdauer
            klipse_co2 = klipse * co2_equivalents["klipse_metall"]
            klipse_h2o = klipse * h2o_equivalents["klipse_metall"]
        elif klipsematerial == "Nachhaltige / kompostierbare Option":
            klipse = (helping_values["clips_count_total"] * 0.0008) / nutzdauer
            klipse_co2 = klipse * co2_equivalents["klipse_nachhaltige_option"]
            klipse_h2o = klipse * h2o_equivalents["klipse_nachhaltige_option"]
        else:
            raise ValueError('No valid option for Klipse:Material has been selected')
    else:
        raise ValueError('No valid option for Klipse has been selected')

    print("klipse_co2: ", klipse_co2)
    print("klipse_h2o: ", klipse_h2o)
    return klipse_co2, klipse_h2o


def calc_panicle_hanger(data, helping_values, all_options):
    """Calculates the co2 and h2o footprints for the panicle hanger consumption.

    Args:
        data: greenhouse dataset
        helping_values: dictionary of values, that are necessary for the calculation
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for the panicle hanger consumption
    """

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
            rispenbuegel_co2 = rispenbuegel * co2_equivalents["rispenbuegel_kunststoff"]
            rispenbuegel_h2o = rispenbuegel * h2o_equivalents["rispenbuegel_kunststoff"]
        elif rispenbuegelmaterial == "Metall":
            rispenbuegel = (helping_values["panicle_hanger_count_total"] * 0.001) / nutzdauer
            rispenbuegel_co2 = rispenbuegel * co2_equivalents["rispenbuegel_metall"]
            rispenbuegel_h2o = rispenbuegel * h2o_equivalents["rispenbuegel_metall"]
        elif rispenbuegelmaterial == "Nachhaltige / kompostierbare Option":
            rispenbuegel = (helping_values["panicle_hanger_count_total"] * 0.001) / nutzdauer
            rispenbuegel_co2 = rispenbuegel * co2_equivalents["rispenbuegel_nachhaltige_option"]
            rispenbuegel_h2o = rispenbuegel * h2o_equivalents["rispenbuegel_nachhaltige_option"]
        else:
            raise ValueError('No valid option for Rispenbuegel:Material has been selected')
    else:
        raise ValueError('No valid option for Rispenbuegel has been selected')

    print("rispenbuegel_co2: ", rispenbuegel_co2)
    print("rispenbuegel_h2o: ", rispenbuegel_h2o)
    return rispenbuegel_co2, rispenbuegel_h2o


def calc_packaging(data, all_options):
    """Calculates the co2 and h2o footprints for packaging consumption.
    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for packaging consumption consumption
    """

    # input field: Verpackungsmaterial
    verpackung_co2 = 0
    verpackung_h2o = 0
    if data["Verpackungsmaterial"] != default_option:
        for option in data["Verpackungsmaterial"]:
            verpackungmaterial = all_options.get(id=option[0]).option_value
            menge = option[1]
            if verpackungmaterial == "Karton":
                verpackung_co2 = verpackung_co2 + menge * co2_equivalents["verpackung_karton"]
                verpackung_h2o = verpackung_h2o + menge * h2o_equivalents["verpackung_karton"]
            elif verpackungmaterial == "Plastik":
                verpackung_co2 = verpackung_co2 + menge * co2_equivalents["verpackung_plastik"]
                verpackung_h2o = verpackung_h2o + menge * h2o_equivalents["verpackung_plastik"]
            else:
                raise ValueError('No valid option for Verpackungsmaterial has been selected')

    # input field: Mehrwegsteigen
    if data["Verpackungsmaterial:AnzahlMehrwegsteigen"] != default_value:
        verpackung_co2 = verpackung_co2 + (data["Verpackungsmaterial:AnzahlMehrwegsteigen"][0] / 50 * co2_equivalents["verpackung_mehrwegsteigen"])
        verpackung_h2o = verpackung_h2o + (data["Verpackungsmaterial:AnzahlMehrwegsteigen"][0] / 50 * h2o_equivalents["verpackung_mehrwegsteigen"])

    print("verpackung_co2: ", verpackung_co2)
    print("verpackung_h2o: ", verpackung_h2o)
    return verpackung_co2, verpackung_h2o


def calc_other_consumables(data, all_options):
    """Calculates the co2 and h2o footprints for other consumables.

    Args:
        data: greenhouse dataset
        all_options: all options in the database

    Returns:
        co2 and h2o footprints for other consumables
    """

    # input field: Sonstige Verbrauchsmaterialien
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
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_folie"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_folie"] / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Eisen":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_eisen"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_eisen"] / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Alluminium":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_alluminium"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_alluminium"] / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Kunststoff":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_kunststoff"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_kunststoff"] / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Holz":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_holz"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_holz"] / nutzdauer
            elif sonstige_verbrauchsmaterialienmaterial == "Pappe":
                sonstige_verbrauchsmaterialien_co2 = sonstige_verbrauchsmaterialien_co2 + menge * co2_equivalents["verbrauchsmaterialien_pappe"] / nutzdauer
                sonstige_verbrauchsmaterialien_h2o = sonstige_verbrauchsmaterialien_h2o + menge * h2o_equivalents["verbrauchsmaterialien_pappe"] / nutzdauer
            else:
                raise ValueError('No valid option for SonstigeVerbrauchsmaterialien has been selected')

    print("sonstige_verbrauchsmaterialien_co2: ", sonstige_verbrauchsmaterialien_co2)
    print("sonstige_verbrauchsmaterialien_h2o: ", sonstige_verbrauchsmaterialien_h2o)
    return sonstige_verbrauchsmaterialien_co2, sonstige_verbrauchsmaterialien_h2o
