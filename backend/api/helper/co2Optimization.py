from backend.models import OptionGroups, Options, Selections


def create_co2optimization_data(dataset):

    energyconsumption_constants = {
        "Heizoel":0.371,
        "Braunkohle":0.364,
        "Steinkohle":0.285,
        "Erdgas":0.252,
        "Biogas":0.06785,
        "Geothermie(oberflaechennah)":0.0348,
        "Hackschnitzel":0.025,
        "Tiefengeothermie":0.00633
    }

    # energyconsumption
    response_data = dict()


    energyconsumption_dict = dict()
    option_group = OptionGroups.objects.filter(option_group_name='Energietraeger')

    if option_group.exists():
        energyconsumption_dict['unit'] = 'kg C02 Äq / kwh'
        options = Options.objects.filter(option_group_id=option_group[0].id)
        total_value = 0
        selections_dict = dict() # Used for saving the selected values in it to find out which one is the biggest one

        for option in options:
            selection = Selections.objects.filter(greenhouse_data_id=dataset.id).filter(option_id=option.id)

            if selection.exists():
                selections_dict[option.option_value] = selection[0].amount

        if len(selections_dict) != 0:
            highest_value = dict(sorted(selections_dict.items(), reverse=True, key=lambda item: item[1]))
            highest_option = list(highest_value.keys())[0]
            index = list(energyconsumption_constants).index(highest_option)
            print(index)



    tableData = []

    tableDataRow = dict()
