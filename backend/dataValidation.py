"""
    This file contains a function that validates the input data.

"""
from backend.models import Measurements, Options, OptionGroups


def validate_greenhouse_data(data):
    """Function that checks if every mandatory input field has been filled out. Fields that depend on a conditional
        field that hasn't been selected can have a default value.

        Args:
            data : Contains the data that needs to be validated

        Returns:
            boolean: true = valid date; false = invalid data
    """

    default_value = (0.0, 0)
    default_option = "[(0,)]"


    # Retrieve all measurements, optiongroups and options from the database
    mandatory_measurements = Measurements.objects.in_bulk(
        field_name='measurement_name')  # transform table to a dict

    mandatory_optiongroups = OptionGroups.objects.in_bulk(
        field_name='option_group_name')

    all_options = Options.objects.all(
    )

    # 1st element is option that makes the following fields mandatory
    # 2nd element are measurements that depend on conditional field
    # 3rd element are option_groups that depend on conditional field
    eventually_optional_fields = {
        1: ("EinheitlicheWaermeversorgung", "NEIN", ["WaermeteilungFlaeche"], []),
        2: ("Energieschirm", "Ja", ["AlterEnergieschirm"], ["EnergieschirmTyp"]),
        3: ("ZusaetzlichesHeizsystem", "Ja", ["AlterZusaetzlichesHeizsystem"], ["ZusaetzlichesHeizsystemTyp"]),
        4: ("10-30Gramm(Snack)", "JA", ["SnackReihenanzahl", "SnackPflanzenabstandInDerReihe", "SnackTriebzahl", "SnackErtragJahr"], []),
        5: ("30-100Gramm(Cocktail)", "JA", ["CocktailReihenanzahl", "CocktailPflanzenabstandInDerReihe", "CocktailTriebzahl", "CocktailErtragJahr"], []),
        6: ("100-150Gramm(Rispen)", "JA", ["RispenReihenanzahl", "RispenPflanzenabstandInDerReihe", "RispenTriebzahl", "RispenErtragJahr"], []),
        7: (">150Gramm(Fleisch)", "JA", ["FleischReihenanzahl", "FleischPflanzenabstandInDerReihe", "FleischTriebzahl", "FleischErtragJahr"], []),
        8: ("Transportsystem", "JA", ["AlterTransportsystem"], []),
        9: ("Nebenkultur", "JA", ["NebenkulturBeginn", "NebenkulturEnde"], []),
        10: ("Zusatzbelichtung", "JA", [], ["Belichtungsstrom"]),
        11: ("Belichtungsstrom", "NEIN", [], ["BelichtungsstromEinheit"], []),
        12: ("BelichtungsstromEinheit", "KWH", ["Belichtung:Stromverbrauch"], []),
        13: ("BelichtungsstromEinheit", "ANGABEN", ["Belichtung:LaufzeitProJahr", "Belichtung:AnzahlLampen", "Belichtung:AnschlussleistungProLampe"], []),
        14: ("GrowbagsKuebel", "GROWBAGS", [], ["Substrat"]),
        15: ("GrowbagsKuebel", "KUEBEL", ["Kuebel:VolumenProTopf", "Kuebel:JungpflanzenProTopf", "Kuebel:Alter"], ["Substrat"]),
        16: ("Jungpflanzen:Zukauf", "JA", ["Jungpflanzen:Distanz"], ["Jungpflanzen:Substrat"]),
        17: ("Klipse", "JA", ["Klipse:AnzahlProTrieb", "Klipse:Wiederverwendung"], ["Klipse:Material"]),
        18: ("Rispenbuegel", "JA", ["Rispenbuegel:AnzahlProTrieb", "Rispenbuegel:Wiederverwendung"], ["Rispenbuegel:Material"])
    }

    for key, values in eventually_optional_fields.items():
        optiongroup = values[0]
        condition = values[1]
        measurements = values[2]
        optiongroups = values[3]
        # retrieve the selected option id for the current optiongroup
        selected_option_id = data[optiongroup][0][0]
        selected_option_value = all_options.filter(id=selected_option_id)[0].option_value
        print(selected_option_value)
        # compare the value with the conditional rule to see if the fields that depend on the optiongroup are mandatory
        optiongroup_required = selected_option_value.upper() == condition
        #print(optiongroup_required)

        #print("not required")
        if(optiongroup_required == False):
            # if a measurement is not mandatory delete it out of the mandatory measurements list
            if len(measurements) != 0:
                for not_required_measurement in measurements:
                    #print("This one is not required:")
                    #print(not_required_measurement)
                    del mandatory_measurements[not_required_measurement]

            # if an optiongroup is not mandatory delete it out of the mandatory optiongroups list
            if len(optiongroups) != 0:
                for not_required_optiongroup in optiongroups:
                    try:
                        del mandatory_optiongroups[not_required_optiongroup]
                    except KeyError:
                        print("Optiongroup " + str(not_required_optiongroup) + " has already been deleted or doesn't exist")

    # This place is for manually deleting always optional fields out of the mandatory lists
    del mandatory_optiongroups["ZusaetzlicherMaschineneinsatz"]
    del mandatory_measurements["BHKW:AnteilErdgas"]
    del mandatory_measurements["BHKW:AnteilBiomethan"]

    # check if any element in the mandatory_measurements list has a default value
    for name, value in mandatory_measurements.items():
        #print(name)
        #print(data[value.measurement_name])
        #print(data[value.measurement_name] == default_value)
        if data[value.measurement_name] == default_value:
            print("Error: Mandatory measurement field " + value.measurement_name + " has default value!")
            return False

    # check if any element in the mandatory_optiongroups list has a default value
    for name, value in mandatory_optiongroups.items():
        #print(str(data[value.option_group_name]))
        #print(type(data[value.option_group_name]))
        if str(data[value.option_group_name]) == default_option:
            print("Error: Mandatory option group " + value.option_group_name + " has default value!")
            return False

    return True
