"""
    This file contains a function that standardises the values/units to keep a clean database.

"""
from backend.models import OptionUnits, MeasurementUnits, Options, Measurements
from backend.utils import default_option, default_value


def standardize_units(data):

    all_options = Options.objects.all()

    all_optionunits = OptionUnits.objects.all()

    all_measurements = Measurements.objects.all()

    all_measurementunits = MeasurementUnits.objects.all()



    for index, selected_option in enumerate(data["Energietraeger"]):
        selected_option_value = all_options.filter(id=selected_option[0])[0].option_value
        kwh_energietraeger_id = all_optionunits.filter(option_id=selected_option[0]).filter(unit_name="kWh")[0].id
        selected_optionunit_name = all_optionunits.filter(id=selected_option[2])[0].unit_name

        # calculating the correct value in kWh
        if(selected_optionunit_name !="kWh"):
            new_value = ()
            if(selected_option_value=="Erdgas"):
                new_value = data["Energietraeger"][index][1]*10.4/1.1268
            elif(selected_option_value=="Biogas"):
                new_value = data["Energietraeger"][index][1]*5/1.1268
            elif(selected_option_value=="Heizoel"):
                if(selected_optionunit_name == "liter"):
                    new_value = data["Energietraeger"][index][1]*0.85*11.87
                elif(selected_optionunit_name == "kg"):
                    new_value = data["Energietraeger"][index][1]*0.85*11.87*1.17647059
            elif(selected_option_value=="Steinkohle"):
                new_value = data["Energietraeger"][index][1]*8.06
            elif(selected_option_value=="Braunkohle"):
                new_value = data["Energietraeger"][index][1]*4.17
            elif(selected_option_value=="Hackschnitzel"):
                new_value = data["Energietraeger"][index][1]*3.5
            elif(selected_option_value=="BHKW Biomethan"):
                new_value = data["Energietraeger"][index][1]*10.4/1.1268
            elif(selected_option_value=="BHKW Erdgas"):
                new_value = data["Energietraeger"][index][1]*10.4/1.1268
            else:
                new_value = (0, 0, 0)

            values_list = list(data["Energietraeger"][index])
            values_list[1] = round(new_value, 0)
            values_list[2] = kwh_energietraeger_id
            data["Energietraeger"][index] = tuple(values_list)

    # Co2-Zudosierung should have the unit kg
    #technisches CO2: m3*(0,00196*1000) = kg
    #direkte Gasverbrennung: m3*(0,00196*1000) = kg
    #eigenes BHKW: m3*(0,00196*1000) = kg !!!FALLS BHKW verwendet wird, dann Wert=0!!!
    if data["CO2-Herkunft"] != default_option:
        for index, selected_option in enumerate(data["CO2-Herkunft"]):
            selected_option_value = all_options.filter(id=selected_option[0])[0].option_value
            kwh_co2herkunft_id = all_optionunits.filter(option_id=selected_option[0]).filter(unit_name="kg")[0].id
            selected_optionunit_name = all_optionunits.filter(id=selected_option[2])[0].unit_name

            # calculating the correct value in kWh
            if(selected_optionunit_name !="kg"):
                new_value = ()
                if (selected_optionunit_name == "m3"):
                    new_value = data["CO2-Herkunft"][index][1]*(0.00196*1000) #No differentiation is needed since all three options have the same conversion formula

                elif(selected_optionunit_name == "kg/m2/a"):
                    new_value = data["CO2-Herkunft"][index][1]*data["GWHFlaeche"][0]  # No differentiation is needed since all three options have the same conversion formula


                values_list = list(data["VorlaufmengeAnteile"][index])
                values_list[1] = round(new_value, 2)
                values_list[2] = kwh_co2herkunft_id
                data["CO2-Herkunft"][index] = tuple(values_list)


    # VorlaufmengeGesamt schould have the unit Liter
    if data["VorlaufmengeGesamt"] != default_value:
        measurement_id = all_measurements.filter(measurement_name="VorlaufmengeGesamt")[0].id
        selected_measurementunit_name = all_measurementunits.filter(id=data["VorlaufmengeGesamt"][1])[0].unit_name
        liter_unit_id = all_measurementunits.filter(measurement_id=measurement_id).filter(unit_name="Liter")[0].id
        if (selected_measurementunit_name != "Liter"):
            if selected_measurementunit_name == "m3":

                new_value = data["VorlaufmengeGesamt"][0] * 1000
                values_list = [round(new_value, 2), liter_unit_id]

                data["VorlaufmengeGesamt"] = tuple(values_list)


    # Restwasser schould have the unit Liter
    if data["Restwasser"] != default_value:
        measurement_id = all_measurements.filter(measurement_name="Restwasser")[0].id
        selected_measurementunit_name = all_measurementunits.filter(id=data["Restwasser"][1])[0].unit_name
        liter_unit_id = all_measurementunits.filter(measurement_id=measurement_id).filter(unit_name="Liter")[0].id
        if (selected_measurementunit_name != "Liter"):
            if selected_measurementunit_name == "m3":
                new_value = data["Restwasser"][0] * 1000
                values_list = [round(new_value, 2), liter_unit_id]

                data["Restwasser"] = tuple(values_list)

    # VorlaufmengeAnteile should have the unit Liter
    if data["VorlaufmengeAnteile"] != default_option:
        for index, selected_option in enumerate(data["VorlaufmengeAnteile"]):
            selected_option_value = all_options.filter(id=selected_option[0])[0].option_value
            liter_unit_id = all_optionunits.filter(option_id=selected_option[0]).filter(unit_name="Liter")[0].id
            selected_optionunit_name = all_optionunits.filter(id=selected_option[2])[0].unit_name

            # calculating the correct value in kWh
            if (selected_optionunit_name != "Liter"):
                new_value = ()
                if (selected_optionunit_name == "m3"):
                    new_value = data["VorlaufmengeAnteile"][index][1] * 1000

                elif (selected_optionunit_name == "%"):
                    if (data["VorlaufmengeGesamt"] == default_value):
                        new_value = data["VorlaufmengeAnteile"][index][1] * 1 / 100  # TODO update 1 to correct value
                    else:
                        new_value = data["VorlaufmengeAnteile"][index][1] * data["VorlaufmengeGesamt"][0] / 100

                values_list = list(data["VorlaufmengeAnteile"][index])
                values_list[1] = round(new_value, 2)
                values_list[2] = liter_unit_id
                data["VorlaufmengeAnteile"][index] = tuple(values_list)
                print("VorlaufmengeAnteile", values_list)
    return data

