import warnings

import numpy as np
import pandas as pd
import sqlite3
import csv


def trim(name, axis=None):
    return name.replace(" ", "")


def upper(name, axis=None):
    return name.upper()


def replace_uncompatible_letters(text):
    tmp = text.replace("ä", 'ae').replace("ü", "ue").replace("ö", "oe"). \
        replace("ß", "ss")
    return tmp


def remove_uncompatible_letters(filepath):
    file = open(filepath, "r")
    replaced_file = replace_uncompatible_letters(file.read())
    file.close()
    file = open(filepath, "w")
    file.write(replaced_file)
    file.close()


class NumberRowsError(Exception):
    pass


def fill_measurements(subtable):
    measurement_variables = subtable[
        subtable["Art"].str.contains("^[Ww]ert")
    ]["Name"]
    measurement_variables = measurement_variables.apply(trim, axis=1)
    measurement_variables = measurement_variables.to_frame()
    measurement_variables['id'] = list(
        range(1, measurement_variables.shape[0] + 1)
    )
    measurement_variables = measurement_variables.reindex(
        columns=["id", "Name"]
    )
    n_rows = measurement_variables.shape[0]
    measurement_variables = measurement_variables.drop_duplicates(
        subset=['Name']
    )
    measurement_variables.to_csv("backend/data/measurements.csv",
                                 index=False,
                                 header=False
                                 )
    remove_uncompatible_letters("backend/data/measurements.csv")
    return n_rows


def fill_option_groups(subtable):
    optiongroup_variables = subtable[
        subtable["Art"].str.contains(
            "([Ee]ntscheidung|[Aa]uswahl|[Kk]ategorie)")
    ]["Name"]
    optiongroup_variables = optiongroup_variables.apply(trim, axis=1)
    optiongroup_variables = optiongroup_variables.to_frame()
    optiongroup_variables['id'] = list(
        range(1, optiongroup_variables.shape[0] + 1)
    )
    optiongroup_variables = optiongroup_variables.reindex(
        columns=["id", "Name"]
    )
    n_rows = optiongroup_variables.shape[0]
    optiongroup_variables = optiongroup_variables.drop_duplicates(
        subset=['Name']
    )
    optiongroup_variables.to_csv("backend/data/optiongroups.csv",
                                 index=False,
                                 header=False
                                 )
    remove_uncompatible_letters("backend/data/optiongroups.csv")
    return n_rows


def fill_calculation_variables():
    calculation_variables = [
        "electric_power_co2",
        "heat_consumption_co2",
        "psm_co2",
        "fertilizer_co2"
    ]
    calculation_variables_frame = pd.DataFrame(columns=["id","Name"])
    calculation_variables_frame["Name"] = calculation_variables
    calculation_variables_frame.loc[0:len(calculation_variables_frame),"id"] = \
        range(1,len(calculation_variables_frame)+1)
    calculation_variables_frame.to_csv("backend/data/calculation-variables.csv",
                                 index=False,
                                 header=False
                                 )


def fill_options():
    optiongroups = pd.read_csv("backend/data/optiongroups.csv")
    categories = pd.read_excel('backend/data/Datenarten_BP6_5.xlsx',
                               sheet_name='Dropdown')
    transf_columns = list(map(trim, categories.columns))
    categories.columns = transf_columns
    categories.to_csv("backend/data/options.csv", index=False)
    remove_uncompatible_letters("backend/data/options.csv")

    options = pd.read_csv("backend/data/options.csv")
    option_groups = pd.read_csv("backend/data/optiongroups.csv", header=None)
    opt_categories = options.columns
    opt_grp_categories = option_groups.iloc[:, 1]
    difference = list(set(opt_categories).symmetric_difference(
        set(opt_grp_categories)))
    if len(difference) > 0:
        warnings.warn(
            "The following elements can not be filled automatically!" +
            " Please take care of them manually: " + str(difference))

    options_table = pd.DataFrame(columns=["option_id",
                                          "option_value",
                                          "option_group_id"])
    id = 1
    for column in opt_categories:
        option_group_id = option_groups[option_groups.iloc[:, 1] == column][0]
        if option_group_id.empty:
            continue
        options_table.replace('', np.nan, inplace=True)
        elements = options[column].dropna()
        elements = list(elements)
        elements = [i for i in elements if i.replace(" ", "") != ""]
        # write new dataset in data frame
        for i in range(0, len(elements)):
            new_dataset = pd.DataFrame({"option_id": id,
                                        "option_group_id": option_group_id,
                                        "option_value": elements[i]
                                        })
            options_table = pd.concat([options_table, new_dataset])
            id = id + 1
    options_table.to_csv("backend/data/options.csv",
                         index=False,
                         header=False
                         )
    remove_uncompatible_letters("backend/data/options.csv")


def generate_csv():
    df = pd.read_excel('backend/data/Datenarten_BP6_5.xlsx',
                       sheet_name='Basis')
    subtable = df.loc[:, ["Name", "Art"]]
    subtable = subtable.dropna(how="any")
    n_meas = fill_measurements(subtable)
    n_opt = fill_option_groups(subtable)
    if n_opt + n_meas != subtable.shape[0]:
        raise NumberRowsError("The sum of the number of rows in the " +
                              "data does not match the number of rows in" +
                              " the excel-file.\n Hint: Check the column " +
                              "'Art'. The values in this column should match " +
                              "the regex in the function 'fill_option_groups'" +
                              " or 'fill_measurements'")
    fill_options()


def fill_measurements_table(cur):
    a_file = open("backend/data/measurements.csv")
    rows = csv.reader(a_file)
    cur.executemany("INSERT INTO backend_measurements VALUES (?, ?);", rows)


def fill_optiongroups_table(cur):
    a_file = open("backend/data/optiongroups.csv")
    rows = csv.reader(a_file)
    cur.executemany("INSERT INTO backend_optiongroups VALUES (?, ?);", rows)


def fill_options_table(cur):
    a_file = open("backend/data/options.csv")
    rows = csv.reader(a_file)
    cur.executemany("INSERT INTO backend_options VALUES (?, ?, ?);", rows)

def fill_calculation_variables_table(cur):
    a_file = open("backend/data/calculation-variables.csv")
    rows = csv.reader(a_file)
    cur.executemany("INSERT INTO backend_calculations VALUES (?, ?);", rows)


def fill_database():
    con = sqlite3.connect("db.sqlite3")
    cur = con.cursor()

    fill_measurements_table(cur)
    fill_optiongroups_table(cur)
    fill_options_table(cur)
    fill_calculation_variables_table(cur)

    con.commit()
    con.close()


# generate_csv()  # execute this, if there is no csv-file in your directory yet
fill_database()
