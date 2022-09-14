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
        2: ("10-30Gramm(Snack)", "JA", ["SnackReihenanzahl", "SnackPflanzenabstandInDerReihe", "SnackTriebzahl", "SnackErtragJahr"], []),
        3: ("30-100Gramm(Cocktail)", "JA", ["CocktailReihenanzahl", "CocktailPflanzenabstandInDerReihe", "CocktailTriebzahl", "CocktailErtragJahr"], []),
        4: ("100-150Gramm(Rispen)", "JA", ["RispenReihenanzahl", "RispenPflanzenabstandInDerReihe", "RispenTriebzahl", "RispenErtragJahr"], []),
        5: (">150Gramm(Fleisch)", "JA", ["FleischReihenanzahl", "FleischPflanzenabstandInDerReihe", "FleischTriebzahl", "FleischErtragJahr"], []),
        6: ("Transportsystem", "JA", ["AlterTransportsystem"], []),
        7: ("Nebenkultur", "JA", ["NebenkulturBeginn", "NebenkulturEnde"], []),
        8: ("BHKW", "JA", ["BHKW:Menge", "BHKW:AnteilErdgas", "BHKW:AnteilBiomethan"], []),
        9: ("Zusatzbelichtung", "JA", [], ["Belichtungsstrom"]),
        10: ("Belichtungsstrom", "NEIN", [], ["BelichtungsstromEinheit"], []),
        11: ("BelichtungsstromEinheit", "KWH", ["Belichtung:Stromverbrauch"], []),
        12: ("BelichtungsstromEinheit", "ANGABEN", ["Belichtung:LaufzeitProTag", "Belichtung:AnzahlLampen", "Belichtung:AnschlussleistungProLampe"], []),
        13: ("Growbags", "JA", ["Growbags:Volumen", "Growbags:Laenge", "Growbags:PflanzenproBag"], ["Substrat"]),
        14: ("Kuebel", "JA", ["Kuebel:VolumenProTopf", "Kuebel:JungpflanzenProTopf", "Kuebel:Alter"], []),
        15: ("Bodenfolien", "JA", ["Bodenabdeckung:Wiederverwendung"], []),
        16: ("Jungpflanzen:Zukauf", "JA", ["Jungpflanzen:Distanz"], ["Jungpflanzen:Substrat"]),
    }

    for key, values in eventually_optional_fields.items():
        optiongroup = values[0]
        #print(optiongroup)
        condition = values[1]
        #print(condition)
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
                    del mandatory_optiongroups[not_required_optiongroup]

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
