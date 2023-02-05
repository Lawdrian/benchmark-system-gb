"""
    This file contains a function that validates the input data.

"""
from backend.models import Measurements, Options, OptionGroups
from backend.utils import default_value, default_option, generic_error_message, input_error_message


def validate_mandatory_fields(data):
    """Function that checks if every mandatory input field has been filled out. Fields that depend on a conditional
        field that hasn't been selected can have a default value.

        Args:
            data : contains the data that needs to be validated

        Returns:
            boolean: valid data -> True; invalid data -> False
    """

    # retrieve all measurements, optiongroups and options from the database
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
        1: ("Waermeversorgung", ["JA"], ["WaermeteilungFlaeche"], []),
        2: ("Energieschirm", ["Ja"], ["AlterEnergieschirm"], ["EnergieschirmTyp"]),
        3: ("ZusaetzlichesHeizsystem", ["Ja"], ["AlterZusaetzlichesHeizsystem"], ["ZusaetzlichesHeizsystemTyp"]),
        4: ("10-30Gramm(Snack)", ["JA"], ["SnackReihenanzahl", "SnackPflanzenabstandInDerReihe", "SnackTriebzahl", "SnackErtragJahr"], []),
        5: ("30-100Gramm(Cocktail)", ["JA"], ["CocktailReihenanzahl", "CocktailPflanzenabstandInDerReihe", "CocktailTriebzahl", "CocktailErtragJahr"], []),
        6: ("100-150Gramm(Rispen)", ["JA"], ["RispenReihenanzahl", "RispenPflanzenabstandInDerReihe", "RispenTriebzahl", "RispenErtragJahr"], []),
        7: (">150Gramm(Fleisch)", ["JA"], ["FleischReihenanzahl", "FleischPflanzenabstandInDerReihe", "FleischTriebzahl", "FleischErtragJahr"], []),
        8: ("Heizsystem", ["ROHRHEIZUNG (HOCH, NIEDRIG, ETC.)", "TRANSPORTSYSTEM", "DECKENLUFTERHITZER", "KONVEKTIONSHEIZUNG"], ["AlterHeizsystem"], []),
        9: ("Nebenkultur", ["JA"], ["NebenkulturBeginn", "NebenkulturEnde"], []),
        10: ("Zusatzbelichtung", ["JA"], [], ["Belichtungsstrom"]),
        11: ("Belichtungsstrom", ["NEIN"], [], ["BelichtungsstromEinheit"], []),
        12: ("BelichtungsstromEinheit", ["KWH"], ["Belichtung:Stromverbrauch"], []),
        13: ("BelichtungsstromEinheit", ["ANGABEN"], ["Belichtung:LaufzeitProJahr", "Belichtung:AnzahlLampen", "Belichtung:AnschlussleistungProLampe"], []),
        14: ("GrowbagsKuebel", ["GROWBAGS", "Andere Kulturgefaesse (Topf, Kuebel)"], [], ["Substrat"]),
        15: ("GrowbagsKuebel", ["Andere Kulturgefaesse (Topf, Kuebel)"], ["Kuebel:VolumenProTopf", "Kuebel:JungpflanzenProTopf", "Kuebel:Alter"], []),
        16: ("Jungpflanzen:Zukauf", ["JA"], ["Jungpflanzen:Distanz"], []),
        17: ("Schnur", ["JA"], ["SchnuereRankhilfen:Laenge", "SchnuereRankhilfen:Wiederverwendung"], ["SchnuereRankhilfen:Material"]),
        18: ("Klipse", ["JA"], ["Klipse:AnzahlProTrieb", "Klipse:Wiederverwendung"], ["Klipse:Material"]),
        19: ("Rispenbuegel", ["JA"], ["Rispenbuegel:AnzahlProTrieb", "Rispenbuegel:Wiederverwendung"], ["Rispenbuegel:Material"]),
        20: ("Produktionssystem", ["HYDROPONIK OFFEN", "HYDROPONIK GESCHLOSSEN"], ["AlterProduktionssystem"], []),
        21: ("Land", ["GERMANY"], [], ["Region"]),
        22: ("WasserVerbrauch", ["JA"], ["VorlaufmengeGesamt"], ["VorlaufmengeAnteile"])  # Restwasser will always be optional
    }

    for key, values in eventually_optional_fields.items():
        optiongroup = values[0]
        conditions = values[1]
        measurements = values[2]
        optiongroups = values[3]
        # retrieve the selected option id for the current optiongroup
        selected_option_id = data[optiongroup][0][0]
        selected_option_value = all_options.filter(id=selected_option_id)[0].option_value
        # compare the value with the conditional rule to see if the fields that depend on the optiongroup are mandatory
        optiongroup_required = False
        for condition in conditions:
            if condition.upper() == selected_option_value.upper():
                optiongroup_required = True

        if(optiongroup_required == False):
            # if a measurement is not mandatory delete it out of the mandatory measurements list
            if len(measurements) != 0:
                for not_required_measurement in measurements:
                    del mandatory_measurements[not_required_measurement]

            # if an optiongroup is not mandatory delete it out of the mandatory optiongroups list
            if len(optiongroups) != 0:
                for not_required_optiongroup in optiongroups:
                    try:
                        del mandatory_optiongroups[not_required_optiongroup]
                    except KeyError:
                        print("Optiongroup " + str(not_required_optiongroup) + " has already been deleted or doesn't exist")
                        return False, generic_error_message

    # this place is for manually deleting always optional fields out of the mandatory lists
    del mandatory_optiongroups["SonstigeVerbrauchsmaterialien"]
    del mandatory_optiongroups["CO2-Herkunft"]
    del mandatory_optiongroups["Duengemittel:VereinfachteAngabe"]
    del mandatory_optiongroups["Duengemittel:DetaillierteAngabe"]
    del mandatory_optiongroups["Verpackungsmaterial"]
    del mandatory_optiongroups["Bodenabdeckung"]
    del mandatory_measurements["FungizideKg"]
    del mandatory_measurements["FungizideLiter"]
    del mandatory_measurements["InsektizideKg"]
    del mandatory_measurements["InsektizideLiter"]
    del mandatory_measurements["Verpackungsmaterial:AnzahlMehrwegsteigen"]
    del mandatory_measurements["Restwasser"]

    # check if any element in the mandatory_measurements list has a default value
    for name, value in mandatory_measurements.items():
        if data[value.measurement_name] == default_value:
            print("Error: Mandatory measurement field " + value.measurement_name + " has default value!")
            return False, input_error_message

    # check if any element in the mandatory_optiongroups list has a default value
    for name, value in mandatory_optiongroups.items():
        if data[value.option_group_name] == default_option:
            print("Error: Mandatory option group " + value.option_group_name + " has default value!")
            return False, input_error_message

    # check if at least one fruitclass has been selected
    fruit_class_fields = ["10-30Gramm(Snack)", "30-100Gramm(Cocktail)", "100-150Gramm(Rispen)", ">150Gramm(Fleisch)"]
    fruit_class_selected = False
    for fruit_class in fruit_class_fields:
        if all_options.get(id=data[fruit_class][0][0]).option_value == "ja":
            fruit_class_selected = True

    if not fruit_class_selected:
        print("Error: No fruit class has been selected")
        return False, "Es wurde keine Fruchtklasse ausgewählt. Bitte wählen Sie mindestens eine Fruchtklasse aus."

    return True, ""
