import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SelectionValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";

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
    strom: MeasureValue | null
    stromherkunft: SelectionValue[]
    zusatzbelichtung: number | null
    belichtungsstrom: number | null
    belichtungsstromAnschlussleistung: MeasureValue | null
    belichtungsstromAnzLampen: MeasureValue | null
    belichtungsstromLaufzeitTag: MeasureValue | null
}

const EnergyConsumptionInput = (props: EnergyConsumptionProps) => {
    const [energyConsumption, setEnergyConsumption] = useState<EnergyConsumptionState>(props.values)

    const setEnergyConsumptionState = (energyConsumption: EnergyConsumptionState) => {
        setEnergyConsumption(energyConsumption)
        props.provideEnergyConsumption(energyConsumption)
    }

    // Properties of the input fields
    const energietraegerProps: DynamicInputProps = {
        title: "Energieträger",
        label: "Welche Mengen der verschiedenen Energieträger wurden in der Kulturdauer verbrauch, bzw. welche Wärmemengen wurden dadurch produziert (falls Daten vorhanden)?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Energietraeger
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

    const stromProps: MeasureInputProps = {
        title: "Strom",
        label: "Stromverbrauch für die Kulturfläch",
        textFieldProps: {
            value: energyConsumption.strom,
            placeholder: props.unitValues.measures.Strom[0].values,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                strom: {value:parseFloat(event.target.value),unit:energyConsumption.strom?.unit??null}
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

    const belichtungsstromAnschlussleistungProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Anschlussleistung",
        label: "Anschlussleistung pro Lampe",
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnschlussleistung,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnschlussleistung: {value:parseFloat(event.target.value),unit:energyConsumption.belichtungsstromAnschlussleistung?.unit??null}
            })
        }
    }

    const belichtungsstromAnzLampenProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Anzahl Lampen",
        label: "Anzahl Lampen",
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnzLampen,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnzLampen: {value:parseFloat(event.target.value),unit:energyConsumption.belichtungsstromAnzLampen?.unit??null}
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
                belichtungsstromLaufzeitTag: {value: parseFloat(event.target.value), unit:energyConsumption.belichtungsstromLaufzeitTag?.unit??null}
            })
        }
    }


    return(

        <Grid container xs={12} spacing={8}>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...energietraegerProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...stromProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...stromherkunftProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...zusatzbelichtungProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SingleShowConditionalRadioInputField {...belichtungsstromProps}>
                            <Grid item container xs={12} spacing={4}>
                                <MeasureInputField {...belichtungsstromAnschlussleistungProps}/>
                                <MeasureInputField {...belichtungsstromAnzLampenProps}/>
                            </Grid>
                            <Grid item container xs={12} spacing={4}>
                                <MeasureInputField {...belichtungsstromLaufzeitTagProps}/>
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
