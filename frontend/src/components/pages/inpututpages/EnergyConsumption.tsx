import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureUnitInputField, MeasureUnitInputProps, MeasureValue,
    SelectionValue, SelectShowConditionalRadioInputField, SelectShowConditionalRadioInputProps,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/inputPage/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";
import {SectionDivider} from "../../utils/inputPage/layout";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type EnergyConsumptionProps = ReduxProps & SubpageProps & {
    provideEnergyConsumption: Function
    values: EnergyConsumptionState
}

export type EnergyConsumptionState = {
    energietraeger: SelectionValue[]
    bhkw: number | null
    bhkwMenge: MeasureValue | null
    bhkwAnteilErdgas: MeasureValue | null
    bhkwAnteilBiomethan: MeasureValue | null
    gwhStromverbrauch: MeasureValue | null
    betriebStromverbrauch: MeasureValue | null
    stromherkunft: SelectionValue[]
    zusatzbelichtung: number | null
    belichtungsstrom: number | null
    belichtungsstromEinheit: number | null
    belichtungsstromStromverbrauch: MeasureValue | null
    belichtungsstromAnzLampen: MeasureValue | null
    belichtungsstromAnschlussleistung: MeasureValue | null
    belichtungsstromLaufzeitTag: MeasureValue | null
}

const EnergyConsumptionInput = (props: EnergyConsumptionProps) => {
    const [energyConsumption, setEnergyConsumption] = useState<EnergyConsumptionState>(props.values)

    const setEnergyConsumptionState = (energyConsumption: EnergyConsumptionState) => {
        setEnergyConsumption(energyConsumption)
        props.provideEnergyConsumption(energyConsumption)
        console.log(energyConsumption)
    }

    // Properties of the input fields
    const energietraegerProps: DynamicInputProps = {
        title: "Energieträger",
        label: "Welche Mengen der verschiedenen Energieträger wurden in der Kulturdauer verbrauch, bzw. welche Wärmemengen wurden dadurch produziert (falls Daten vorhanden)?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Energietraeger
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Energietraeger,
            unitValues:  props.unitValues,
            optionGroup: "Energietraeger"
        },
        onValueChange: values => setEnergyConsumptionState({
            ...energyConsumption,
            energietraeger: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.energietraeger
    }

    const bhkwProps: SingleShowConditionalRadioInputProps = {
        title: "Blockheizkraftwerk",
        label: "Verwenden Sie ein Blockheizkraftwerk zur Energieerzeugung?",
        radioGroupProps: {
            value: energyConsumption.bhkw,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkw: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.BHKW,
        showChildren: value => {
            let trueOptions = props.lookupValues.BHKW.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const bhkwMengeProps: MeasureUnitInputProps = {
        title: "Menge gesamt",
        label: "Wie viel Energie wird von dem Blockheizkraftwerk verbraucht?",
        textFieldProps: {
            value: energyConsumption.bhkwMenge?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwMenge: {value:parseFloat(event.target.value),unit:energyConsumption.bhkwMenge?.unit??null}
            })
        },
        selectProps: {
            value: energyConsumption.bhkwMenge?.unit,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwMenge: {value:energyConsumption.bhkwMenge?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures["BHKW:Menge"]
        }
    }

    const bhkwAnteilErdgasProps: MeasureUnitInputProps = {
        title: "Anteil Erdgas",
        label: "Wie groß ist der Erdgas Anteil mit dem Energie erzeugt wird?",
        textFieldProps: {
            value: energyConsumption.bhkwAnteilErdgas?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwAnteilErdgas: {value:parseFloat(event.target.value),unit:energyConsumption.bhkwAnteilErdgas?.unit??null}
            })
        },
        selectProps: {
            value: energyConsumption.bhkwAnteilErdgas?.unit,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwAnteilErdgas: {value:energyConsumption.bhkwAnteilErdgas?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures["BHKW:AnteilErdgas"]
        }
    }

    const bhkwAnteilBiomethanProps: MeasureUnitInputProps = {
        title: "Anteil Biomethan",
        label: "Wie groß ist der Biomethan Anteil mit dem Energie erzeugt wird?",
        textFieldProps: {
            value: energyConsumption.bhkwAnteilBiomethan?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwAnteilBiomethan: {value:parseFloat(event.target.value),unit:energyConsumption.bhkwAnteilBiomethan?.unit??null}
            })
        },
        selectProps: {
            value: energyConsumption.bhkwAnteilBiomethan?.unit,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                bhkwAnteilBiomethan: {value:energyConsumption.bhkwAnteilBiomethan?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures["BHKW:AnteilBiomethan"]
        }
    }

    const gwhStromverbrauchProps: MeasureInputProps = {
        title: "Stromverbrauch Gewächshaus",
        label: "Stromverbrauch für die Kulturfläch",
        unitName: props.unitValues.measures.GWHStromverbrauch[0]?.values,
        textFieldProps: {
            value: energyConsumption.gwhStromverbrauch?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                gwhStromverbrauch: {value:parseFloat(event.target.value),unit:props.unitValues.measures.GWHStromverbrauch[0].id}
            })
        }
    }

    const betriebStromverbrauchProps: MeasureInputProps = {
        title: "Stromverbrauch Betrieb",
        label: "Stromverbrauch für den gesamten Betrieb",
        unitName: props.unitValues.measures.BetriebStromverbrauch[0]?.values,
        textFieldProps: {
            value: energyConsumption.betriebStromverbrauch?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                betriebStromverbrauch: {value:parseFloat(event.target.value),unit:props.unitValues.measures.BetriebStromverbrauch[0].id}
            })
        }
    }

    const stromherkunftProps: DynamicInputProps = {
        title: "Stromherkunft",
        label: "Welche Stromart beziehen Sie und wieviel?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Stromherkunft
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Stromherkunft,
            unitValues:  props.unitValues,
            optionGroup: "Stromherkunft"
        },
        onValueChange: values => setEnergyConsumptionState({
            ...energyConsumption,
            stromherkunft: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.stromherkunft
    }

    const zusatzbelichtungProps: SingleShowConditionalRadioInputProps = {
        title: "Zusatzbelichtung",
        label: "Wird die Kultur belichtet?",
        radioGroupProps: {
            value: energyConsumption.zusatzbelichtung,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                zusatzbelichtung: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Zusatzbelichtung,
        showChildren: value => {
            let trueOptions = props.lookupValues.Zusatzbelichtung.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const belichtungsstromProps: SingleShowConditionalRadioInputProps = {
        title: "Belichtungsstrom",
        label: "Ist der Stromverbrauch der Belichtung im allgemeinen Stromverbrauch enthalten?",
        radioGroupProps: {
            value: energyConsumption.belichtungsstrom,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstrom: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Belichtungsstrom,
        showChildren: value => {
            let trueOptions = props.lookupValues.Belichtungsstrom.filter(option => option.values.toUpperCase() == "NEIN");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const belichtungsstromVerbrauchProps: MeasureInputProps = {
        title: "Stromverbrauch",
        label: "Stromverbrauch der Belichtung in Kilowattstunden",
        unitName: props.unitValues.measures["Belichtung:Stromverbrauch"][0]?.values,
        textFieldProps: {
            value: energyConsumption.belichtungsstromStromverbrauch?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromStromverbrauch: {value: parseFloat(event.target.value), unit:props.unitValues.measures["Belichtung:Stromverbrauch"][0].id}
            })
        }
    }

    const belichtungsstromAnschlussleistungProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Anschlussleistung",
        label: "Anschlussleistung pro Lampe",
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnschlussleistung?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnschlussleistung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Belichtung:AnschlussleistungProLampe"][0].id}
            })
        }
    }

    const belichtungsstromAnzLampenProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Anzahl Lampen",
        label: "Anzahl Lampen",
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnzLampen?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnzLampen: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Belichtung:AnzahlLampen"][0].id}
            })
        }
    }

    const belichtungsstromLaufzeitTagProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Laufzeit Tag",
        label: "Laufzeit pro Tag",
        textFieldProps: {
            value: energyConsumption.belichtungsstromLaufzeitTag?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromLaufzeitTag: {value: parseFloat(event.target.value), unit:props.unitValues.measures["Belichtung:LaufzeitProTag"][0].id}
            })
        }
    }



    const belichtungsstromEinheitProps: SelectShowConditionalRadioInputProps = {
        title: "Belichtungsstrom Verbrauch",
        label: "Wollen Sie den Verbrauch in kWh angeben, oder Angaben über die Belichtung tätigen?",
        radioGroupProps: {
            value: energyConsumption.belichtungsstromEinheit,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromEinheit: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.BelichtungsstromEinheit,
        showFirstChildren: value => {
            let trueOptions = props.lookupValues.BelichtungsstromEinheit.filter(option => option.values.toUpperCase() == "KWH");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        showSecondChildren: value => {
                let trueOptions = props.lookupValues.BelichtungsstromEinheit.filter(option => option.values.toUpperCase() == "ANGABEN");
                return trueOptions.length > 0 && trueOptions[0].id == value
        },
        firstChildren: (
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...belichtungsstromVerbrauchProps}/>
            </Grid>
        ),
        secondChildren: (
            <>
                <Grid item container xs={12} spacing={4}>
                    <MeasureInputField {...belichtungsstromAnzLampenProps}/>
                    <MeasureInputField {...belichtungsstromLaufzeitTagProps}/>
                </Grid>
                <Grid item container xs={12} spacing={4}>
                    <MeasureInputField {...belichtungsstromAnschlussleistungProps}/>
                </Grid>
            </>
        )
    }

    return(

        <Grid container xs={12} spacing={8}>
            <SectionDivider title="Wärmeenergie"/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...energietraegerProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...bhkwProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureUnitInputField {...bhkwMengeProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureUnitInputField {...bhkwAnteilErdgasProps}/>
                        <MeasureUnitInputField {...bhkwAnteilBiomethanProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <SectionDivider title="Stromverbrauch"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...gwhStromverbrauchProps}/>
                <MeasureInputField {...betriebStromverbrauchProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...stromherkunftProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...zusatzbelichtungProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SingleShowConditionalRadioInputField {...belichtungsstromProps}>
                            <Grid item container xs={12} spacing={4}>
                                <SelectShowConditionalRadioInputField {...belichtungsstromEinheitProps}/>
                            </Grid>
                        </SingleShowConditionalRadioInputField>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...props.paginationProps} />
                </Grid>
            </Grid>
        </Grid>


    )

}
export default connector(EnergyConsumptionInput)
