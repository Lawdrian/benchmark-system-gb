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

    default_value = "0.000"
    default_option = "[(0,)]"


    # Retrieve all measurements, optiongroups and options from the database
    mandatory_measurements = Measurements.objects.in_bulk(
        field_name='measurement_name')  # transform table to a dict

    mandatory_optiongroups = OptionGroups.objects.in_bulk(
        field_name='option_group_name')

    all_options = Options.objects.all(
    )

    # optiongroups that have measurements that depend on them as value
    eventually_optional_measurements = {
        "Nebenkultur": ["Nebenkulturdauer"],
        "Belichtungsstrom": ["StromverbrauchBelichtungAnschlussleistung", "StromverbrauchBelichtungAnzahlLampen", "StromverbrauchBelichtungLaufzeitTag"],
        "Growbags": ["VolumenGrowbags", "LaengeGrowbags", "PflanzenproBag"],
        "Bodenfolien": ["BodenfolienVerwendungsdauer"],
        "JungpflanzenZukauf": ["JungpflanzenDistanz"]
    }

    # optiongroups that have optiongroups that depend on them as value
    eventually_optional_optiongroups = {
        "Growbags": ["Substrat"],
        "Zusatzbelichtung": ["Belichtungsstrom"]
    }

    # optiongroup fields that other fields depend on and as value the condition that needs to be met
    # for the dependend fields to be mandatory
    conditional_optiongroups = {
        "Nebenkultur": "JA",
        "Zusatzbelichtung": "JA",
        "Belichtungsstrom": "NEIN",
        "Growbags": "JA",
        "Bodenfolien": "JA",
        "JungpflanzenZukauf": "JA"

    }

    for optiongroup in conditional_optiongroups:
        # retrieve the selected option id for the current optiongroup
        selected_option_id = data[optiongroup][0][0]
        selected_option_value = all_options.filter(id=selected_option_id)[0].option_value
        # compare the value with the conditional rule to see if the fields that depend on the optiongorup are mandatory
        optiongroup_required = selected_option_value.upper() == conditional_optiongroups.get(optiongroup)

        if(optiongroup_required == False):
            # if a measurement is not mandatory delete it out of the mandatory measurements list
            if eventually_optional_measurements.get(optiongroup) is not None:
                for not_required_measurement in eventually_optional_measurements.get(optiongroup):
                    del mandatory_measurements[not_required_measurement]

            # if an optiongroup is not mandatory delete it out of the mandatory optiongroups list
            if eventually_optional_optiongroups.get(optiongroup) is not None:
                for not_required_optiongroup in eventually_optional_optiongroups.get(optiongroup):
                    del mandatory_optiongroups[not_required_optiongroup]

    # check if any element in the mandatory_measurements list has a default value
    for name, value in mandatory_measurements.items():
        print(data[value.measurement_name])
        print(data[value.measurement_name] == default_value)
        if data[value.measurement_name] == default_value:
            print("Error: Mandatory measurement field has default value!")
            return False

    # check if any element in the mandatory_optiongroups list has a default value
    for name, value in mandatory_optiongroups.items():
        print(str(data[value.option_group_name]))
        print(type(data[value.option_group_name]))
        if str(data[value.option_group_name]) == default_option:
            print("Error: Mandatory option group has default value!")
            return False

    return True
