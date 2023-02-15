from backend.models import Options, Calculations, Results, Selections, GreenhouseData, Measurements, Measures


def get_harvest(greenhouse_data_id, all_measurements):
    """Calculates the harvest of every fruit class of a data set.

    Args:
        greenhouse_data_id: the ID of the data set, the harvest should be calculated from
        all_measurements: all measurements, so that this function does not need to call the database

    Returns:
        snack_harvest: harvest of fruit class snack
        cocktail_harvest: harvest of fruit class cocktail
        rispen_harvest: harvest of fruit class rispen
        fleisch_harvest: harvest of fruit class fleisch
    """

    snack_harvest_id = all_measurements.get(measurement_name="SnackErtragJahr")
    snack_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=snack_harvest_id
             ).measure_value
    cocktail_harvest_id = all_measurements.get(measurement_name="CocktailErtragJahr")
    cocktail_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=cocktail_harvest_id
             ).measure_value
    rispen_harvest_id = all_measurements.get(measurement_name="RispenErtragJahr")
    rispen_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=rispen_harvest_id
             ).measure_value
    fleisch_harvest_id = all_measurements.get(measurement_name="FleischErtragJahr")
    fleisch_harvest = Measures.objects \
        .get(greenhouse_data_id=greenhouse_data_id,
             measurement_id=fleisch_harvest_id
             ).measure_value
    return snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest


def calc_total_and_normalized_data(greenhouse_data, all_measurements, calculation_ids, calculation_names):
    """Calculates total and normalized footprint data for a data set.

    This function uses the footprint data, normalizes it and transforms it into dictionaries/lists,
    so that it can be processed by the frontend. In total 3 lists of dictionaries are created:

    Args:
        greenhouse_data: all datasets of one greenhouse
        all_measurements: all measurements saved in the database
        calculation_ids: the IDs of all calculation fields used
        calculation_names: the names of all calculation fields used

    Returns:
         total_data_set_list: list containing the data for the total footprint
         normalizedkg_data_set_list: list containing the data for the footprint normalized to kg harvest
         normalizedm2_data_set_list: list containing the data for the footprint normalized to m2 greenhouse
    """

    total_data_set_list = []
    normalizedkg_data_set_list = []
    normalizedm2_data_set_list = []
    for data_set in greenhouse_data:

        total_data_dict = dict()
        normalizedkg_data_dict = dict()
        normalizedm2_data_dict = dict()
        total_data_dict['label'] = data_set.date
        normalizedkg_data_dict['label'] = data_set.date
        normalizedm2_data_dict['label'] = data_set.date

        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
            data_set.id,
            all_measurements)
        total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

        gh_size_id = all_measurements.get(measurement_name="GWHFlaeche")
        gh_size = Measures.objects \
            .get(greenhouse_data_id=data_set.id,
                 measurement_id=gh_size_id
                 ).measure_value

        for i, calculation_id in enumerate(calculation_ids):
            value = Results.objects \
                .filter(greenhouse_data_id=data_set.id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']

            total_data_dict[calculation_names[i]] = value
            normalizedkg_data_dict[calculation_names[i]] = round(value / total_harvest, 2)
            normalizedm2_data_dict[calculation_names[i]] = round(value / gh_size, 2)

        total_data_set_list.append(total_data_dict)
        normalizedkg_data_set_list.append(normalizedkg_data_dict)
        normalizedm2_data_set_list.append(normalizedm2_data_dict)

    return total_data_set_list, normalizedkg_data_set_list, normalizedm2_data_set_list


def calc_fruit_size_data(dataset, all_measurements, calculation_ids, calculation_names):
    """Calculates the fruit size footprint data for a data set.

    This function calculates the footprint split up into the fruit sizes. The calculated data is normalized.

    Args:
        dataset: one data sets of one greenhouse
        all_measurements: all measurements saved in the database
        calculation_ids: the IDs of all calculation fields used
        calculation_names: the names of all calculation fields used

    Returns:
        fruitsizekg_data_set_list: list containing the data for the footprint normalized to kg harvest of the fruit size
        fruitsizem2_data_set_list: list containing the data for the footprint normalized to m2 space of the fruit size
    """

    fruitsizekg_data_set_list = []
    fruitsizem2_data_set_list = []
    fruitsizes = ["Snack", "Cocktail", "Rispen", "Fleisch"]
    fruitunit = ["10-30Gramm", "30-100Gramm", "100-150Gramm", ">150Gramm"]

    length_id = Measurements.objects.get(measurement_name="Laenge")
    length = Measures.objects \
        .get(greenhouse_data_id=dataset.id,
             measurement_id=length_id
             ).measure_value

    lead_width_id = Measurements.objects.get(measurement_name="Vorwegbreite")
    lead_width = Measures.objects \
        .get(greenhouse_data_id=dataset.id,
             measurement_id=lead_width_id
             ).measure_value

    row_length = length - lead_width

    # calculate the total amount of rows
    total_row_count = 0
    for fruit in fruitsizes:
        fruit_row_count_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
        total_row_count = total_row_count + Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_row_count_id
                 ).measure_value
    row_distance_id = Measurements.objects.get(measurement_name="Reihenabstand(Rinnenabstand)").id
    row_distance = Measures.objects.filter(greenhouse_data_id=dataset.id, measurement_id=row_distance_id)[
        0].measure_value
    # gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
    # gh_size = Measures.objects \
    #    .get(greenhouse_data_id=dataset.id,
    #         measurement_id=gh_size_id
    #         ).measure_value
    # print("gh_size: ", gh_size)
    # print("fruit_size: ", (total_row_count * row_length * row_distance))
    snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(dataset, all_measurements)
    total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest
    # calculate the normalized footprint for every fruit size
    for index, fruit in enumerate(fruitsizes):
        fruitsizekg_data_dict = dict()
        fruitsizem2_data_dict = dict()
        fruitsizekg_data_dict['label'] = fruitunit[index]
        fruitsizem2_data_dict['label'] = fruitunit[index]
        fruit_row_count_id = Measurements.objects.get(measurement_name=fruit + "Reihenanzahl")
        fruit_row_count = Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_row_count_id
                 ).measure_value

        fruit_harvest_id = Measurements.objects.get(measurement_name=fruit + "ErtragJahr")
        fruit_harvest = Measures.objects \
            .get(greenhouse_data_id=dataset.id,
                 measurement_id=fruit_harvest_id
                 ).measure_value

        # calculate the normalized partial footprint value of one fruit size
        for i, calculation_id in enumerate(calculation_ids):
            value = Results.objects \
                .filter(greenhouse_data_id=dataset.id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']
            if fruit_harvest != 0.000:
                fruitsizekg_data_dict[calculation_names[i]] = round(value * (
                        fruit_row_count / total_row_count) / fruit_harvest, 2)
                fruitsizem2_data_dict[calculation_names[i]] = round(value * (fruit_harvest / total_harvest) / (
                        fruit_row_count * row_length * row_distance), 2)
            else:
                fruitsizekg_data_dict[calculation_names[i]] = 0
                fruitsizem2_data_dict[calculation_names[i]] = 0
        fruitsizekg_data_set_list.append(fruitsizekg_data_dict)
        fruitsizem2_data_set_list.append(fruitsizem2_data_dict)
    return fruitsizekg_data_set_list, fruitsizem2_data_set_list


def add_best_and_worst_performer(
        recent_dataset_is_biologic,
        calculation_name_kg,
        calculation_name_m2,
        calculation_ids,
        calculation_names,
        all_measurements,
        normalizedkg_greenhouse_dict,
        normalizedm2_greenhouse_dict,
        benchmarkkg_greenhouse_dict,
        benchmarkm2_greenhouse_dict,
        normalizedkg_data_set_list,
        normalizedm2_data_set_list,
        benchmarkkg_data_set_list,
        benchmarkm2_data_set_list
):
    """Adds the best and worst performer data sets to the footprint data.

    This functions retrieves the best and worst performer from the database. They have to have the same
    production type as the most recent data set of the user.

    Args:
        recent_dataset_is_biologic (boolean): says if the recent data set has the production type biologic
        calculation_name_kg: name of the normalized per kg total footprint in the Calculations table
        calculation_name_m2: name of the normalized per m2 total footprint in the Calculations table
        calculation_ids: The IDs of all fields in the Calculations table that resemble the footprint
        calculation_names: The names of all fields in the Calculations table that resemble the footprint
        all_measurements: all measurements saved in the database
        normalizedkg_greenhouse_dict: dict in that the data set of the best performer for kg should be saved in
        normalizedm2_greenhouse_dict: dict in that the data set of the best performer for m2 should be saved in
        benchmarkkg_greenhouse_dict: dict in that the data sets of the best & worst performer for kg should be saved in
        benchmarkm2_greenhouse_dict: dict in that the data sets of the best & worst performer for m2 should be saved in
        normalizedkg_data_set_list: list containing all data sets normalized for kg of a greenhouse
        normalizedm2_data_set_list: list containing all data sets normalized for m2 of a greenhouse
        benchmarkkg_data_set_list: list containing the most recent data set normalized for kg of a greenhouse
        benchmarkm2_data_set_list: list containing the most recent data set normalized for m2 of a greenhouse

    Returns:
        normalizedkg_greenhouse_dict: dict containing all normalized footprint data for kg of a greenhouse
        normalizedm2_greenhouse_dict: dict containing all normalized footprint data for m2 of a greenhouse
        benchmarkkg_greenhouse_dict: dict containing all benchmark footprint data for kg of a greenhouse
        benchmarkm2_greenhouse_dict: dict containing all benchmark footprint data for m2 of a greenhouse


    """
    # find the best performers for both kg and m2 normalization
    best_performer_dataset_kg = find_performer_dataset(recent_dataset_is_biologic, calculation_name_kg, True)
    best_performer_dataset_m2 = find_performer_dataset(recent_dataset_is_biologic, calculation_name_m2, True)

    # generate the footprint data for the best performers
    if best_performer_dataset_kg is not None and best_performer_dataset_m2 is not None:
        best_performer_normalizedkg_dict = dict()
        best_performer_normalizedm2_dict = dict()
        best_performer_normalizedkg_dict['label'] = "Best Performer"
        best_performer_normalizedm2_dict['label'] = "Best Performer"
        normalizedkg_greenhouse_dict['best_performer_date'] = best_performer_dataset_kg[0].date
        normalizedm2_greenhouse_dict['best_performer_date'] = best_performer_dataset_m2[0].date
        benchmarkkg_greenhouse_dict['best_performer_date'] = best_performer_dataset_kg[0].date
        benchmarkm2_greenhouse_dict['best_performer_date'] = best_performer_dataset_m2[0].date
        if recent_dataset_is_biologic:
            normalizedkg_greenhouse_dict['performer_productiontype'] = "Biologisch"
            normalizedm2_greenhouse_dict['performer_productiontype'] = "Biologisch"
            benchmarkkg_greenhouse_dict['performer_productiontype'] = "Biologisch"
            benchmarkm2_greenhouse_dict['performer_productiontype'] = "Biologisch"
        else:
            normalizedkg_greenhouse_dict['performer_productiontype'] = "Konventionell"
            normalizedm2_greenhouse_dict['performer_productiontype'] = "Konventionell"
            benchmarkkg_greenhouse_dict['performer_productiontype'] = "Konventionell"
            benchmarkm2_greenhouse_dict['performer_productiontype'] = "Konventionell"

        snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(best_performer_dataset_kg[0].id,
                                                                                       all_measurements)
        total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

        gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
        gh_size = Measures.objects \
            .get(greenhouse_data_id=best_performer_dataset_m2[0].id,
                 measurement_id=gh_size_id
                 ).measure_value

        for i, calculation_id in enumerate(calculation_ids):
            value_kg = Results.objects \
                .filter(greenhouse_data_id=best_performer_dataset_kg[0].id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']

            value_m2 = Results.objects \
                .filter(greenhouse_data_id=best_performer_dataset_m2[0].id,
                        calculation_id=calculation_id) \
                .values('result_value')[0]['result_value']

            best_performer_normalizedkg_dict[calculation_names[i]] = round(value_kg / total_harvest, 2)
            best_performer_normalizedm2_dict[calculation_names[i]] = round(value_m2 / gh_size, 2)

        normalizedkg_data_set_list.append(best_performer_normalizedkg_dict)
        normalizedm2_data_set_list.append(best_performer_normalizedm2_dict)
        benchmarkkg_data_set_list.append(best_performer_normalizedkg_dict)
        benchmarkm2_data_set_list.append(best_performer_normalizedm2_dict)

        # find the worst performers for both kg and m2 normalization
        worst_performer_dataset_kg = find_performer_dataset(recent_dataset_is_biologic, calculation_name_kg, False)
        worst_performer_dataset_m2 = find_performer_dataset(recent_dataset_is_biologic, calculation_name_m2, False)

        # generate the footprint data for the worst performers
        if worst_performer_dataset_kg is not None and worst_performer_dataset_m2 is not None:
            worst_performer_benchmarkkg_dict = dict()
            worst_performer_benchmarkm2_dict = dict()
            worst_performer_benchmarkkg_dict['label'] = "Worst Performer"
            worst_performer_benchmarkm2_dict['label'] = "Worst Performer"
            benchmarkkg_greenhouse_dict['worst_performer_date'] = worst_performer_dataset_kg[0].date
            benchmarkm2_greenhouse_dict['worst_performer_date'] = worst_performer_dataset_m2[0].date

            snack_harvest, cocktail_harvest, rispen_harvest, fleisch_harvest = get_harvest(
                worst_performer_dataset_kg[0].id, all_measurements)

            total_harvest = snack_harvest + cocktail_harvest + rispen_harvest + fleisch_harvest

            gh_size_id = Measurements.objects.get(measurement_name="GWHFlaeche")
            gh_size = Measures.objects \
                .get(greenhouse_data_id=best_performer_dataset_m2[0].id,
                     measurement_id=gh_size_id
                     ).measure_value

            for i, calculation_id in enumerate(calculation_ids):
                value_kg = Results.objects \
                    .filter(greenhouse_data_id=worst_performer_dataset_kg[0].id,
                            calculation_id=calculation_id) \
                    .values('result_value')[0]['result_value']
                value_m2 = Results.objects \
                    .filter(greenhouse_data_id=worst_performer_dataset_m2[0].id,
                            calculation_id=calculation_id) \
                    .values('result_value')[0]['result_value']

                worst_performer_benchmarkkg_dict[calculation_names[i]] = round(value_kg / total_harvest, 2)
                worst_performer_benchmarkm2_dict[calculation_names[i]] = round(value_m2 / gh_size, 2)

            benchmarkkg_data_set_list.append(worst_performer_benchmarkkg_dict)
            benchmarkm2_data_set_list.append(worst_performer_benchmarkm2_dict)

            normalizedkg_greenhouse_dict['greenhouse_datasets'] = normalizedkg_data_set_list
            normalizedm2_greenhouse_dict['greenhouse_datasets'] = normalizedm2_data_set_list
            benchmarkkg_greenhouse_dict['greenhouse_datasets'] = benchmarkkg_data_set_list
            benchmarkm2_greenhouse_dict['greenhouse_datasets'] = benchmarkm2_data_set_list

            return normalizedkg_greenhouse_dict, normalizedm2_greenhouse_dict, \
                   benchmarkkg_greenhouse_dict, benchmarkm2_greenhouse_dict


def is_productiontype_biologic(dataset):
    """Check is the production type is biologic of a data set.

    Args:
        dataset: data set of which the production type should be checked
        boolean: true, if production type is biologic, else false

    """
    # check what production type the most recent data set uses
    biologic_id = Options.objects.filter(option_value="Biologisch")[0]
    biologic = Selections.objects.filter(greenhouse_data_id=dataset).filter(option_id=biologic_id)
    if biologic.exists():
        return True
    else:
        return False


def find_performer_dataset(recent_dataset_is_biologic, calculation_name, is_best_performer):
    """This function finds the data set with the lowest or highest normalized footprint.

    The searched for data set has to have the same production type as the provided data set.

    Args:
        recent_dataset_is_biologic (boolean): true -> production type biologic; false -> production type conventional
        calculation_name: the calculation field that will be used to determine the performer
        is_best_performer (boolean): true -> find best performer; false -> find worst performer

    Returns:
        GreenhouseData: data set of the best or worst performer in the database

    """
    # check what production type the most recent dataset uses
    if recent_dataset_is_biologic:
        productiontype_id = Options.objects.filter(option_value="Biologisch")[0]
    else:
        productiontype_id = Options.objects.filter(option_value="Konventionell")[0]

    # retrieve the result_values of the high performer and append them to total_response_data (Using normalized data)
    footprint_id = Calculations.objects.get(calculation_name=calculation_name).id

    if is_best_performer:
        result_value = 'result_value'  # Sort from min to max
    else:
        result_value = '-result_value'  # Sort from max to min

    performers = Results.objects.filter(calculation_id=footprint_id).filter(result_value__gt=0).order_by(result_value)
    index = 0
    while index < len(performers):
        performer_id = performers[index].greenhouse_data_id
        performer = Selections.objects.filter(
            greenhouse_data_id=performer_id).filter(option_id=productiontype_id)
        if performer.exists():
            return GreenhouseData.objects.filter(id=performer_id)

        index = index + 1
    return None
