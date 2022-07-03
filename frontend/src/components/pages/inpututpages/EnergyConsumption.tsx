import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps,
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
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type EnergyConsumptionProps = ReduxProps & SubpageProps & {
    provideEnergyConsumption: Function
    values: EnergyConsumptionState
}

export type EnergyConsumptionState = {
    energietraeger: SelectionValue[]
    strom: number | null
    stromherkunft: SelectionValue[]
    zusatzbelichtung: number | null
    belichtungsstrom: number | null
    belichtungsstromAnschlussleistung: number | null
    belichtungsstromAnzLampen: number | null
    belichtungsstromLaufzeitTag: number| null
}

const EnergyConsumptionInput = (props: EnergyConsumptionProps) => {
    const [energyConsumption, setEnergyConsumptionState] = useState<EnergyConsumptionState>(props.values)

    const setEnergyConsumption = (energyConsumption: EnergyConsumptionState) => {
        setEnergyConsumptionState(energyConsumption)
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
        onValueChange: values => setEnergyConsumption({
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
            onChange: event => setEnergyConsumption({
                ...energyConsumption,
                strom: parseFloat(event.target.value)
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
        onValueChange: values => setEnergyConsumption({
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
            onChange: event => setEnergyConsumption({
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
            onChange: event => setEnergyConsumption({
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
            onChange: event => setEnergyConsumption({
                ...energyConsumption,
                belichtungsstromAnschlussleistung: parseFloat(event.target.value)
            })
        }
    }

    const belichtungsstromAnzLampenProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Anzahl Lampen",
        label: "Anzahl Lampen",
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnzLampen,
            onChange: event => setEnergyConsumption({
                ...energyConsumption,
                belichtungsstromAnzLampen: parseFloat(event.target.value)
            })
        }
    }

    const belichtungsstromLaufzeitTagProps: MeasureInputProps = {
        title: "Stromverbrauch Belichtung Laufzeit Tag",
        label: "Laufzeit pro Tag",
        textFieldProps: {
            value: energyConsumption.belichtungsstromLaufzeitTag,
            onChange: event => setEnergyConsumption({
                ...energyConsumption,
                belichtungsstromLaufzeitTag: parseFloat(event.target.value)
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
