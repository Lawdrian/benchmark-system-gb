import React, {useState} from "react";
import {
    MeasureValue,
    SelectionValue,
    MeasureUnitInputProps,
    DynamicInputUnitSelectProps,
    DynamicInputUnitSelectField,
    MeasureUnitInputField,
    SingleShowConditionalRadioInputProps,
    SingleShowConditionalRadioInputField
} from "../../../utils/input/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../../utils/input/InputPaginationButtons";
import {SectionDivider} from "../../../utils/input/layout";
import {parseToFloat} from "../../../../helpers/InputHelpers";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues,
    submissionSuccess: state.submission.successful
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type WaterUsageProps = ReduxProps & SubpageProps & {
    provideWaterUsage: Function
    showMeasureInputError: Function
    showSelectInputError: Function
    values: WaterUsageState
}

export type WaterUsageState = {
    wasserVerbrauch: number | null
    vorlaufmengeGesamt: MeasureValue | null
    vorlaufmengeAnteile: SelectionValue[]
    restwasser: MeasureValue | null
}

const WaterUsageInput = ({values, provideWaterUsage, paginationProps, lookupValues, submissionSuccess, unitValues, showSelectInputError, showMeasureInputError}: WaterUsageProps) => {
    const [waterUsage, setWaterUsage] = useState<WaterUsageState>(values)

    const setWaterUsageState = (waterUsage: WaterUsageState) => {
        setWaterUsage(waterUsage)
        provideWaterUsage(waterUsage)
    }


    const wasserVerbrauchProps: SingleShowConditionalRadioInputProps = {
        title: "Wasserverbrauch Daten",
        label: "Haben Sie Daten zu dem Wasserverbrauch Ihres Gewächshauses?",
        radioGroupProps: {
            value: waterUsage.wasserVerbrauch,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                wasserVerbrauch: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.WasserVerbrauch,
        showChildren: value => {
            let trueOptions = lookupValues.WasserVerbrauch.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const vorlaufmengeGesamtProps: MeasureUnitInputProps = {
        title: "Vorlaufmenge Gesamt",
        label: "Tragen Sie die Gesamtvorlaufmenge ein, welche für das berechnete Haus pro Jahr verbraucht wurde",
        textFieldProps: {
            value: waterUsage.vorlaufmengeGesamt?.value,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                vorlaufmengeGesamt: {value: parseToFloat(event.target.value), unit: waterUsage.vorlaufmengeGesamt?.unit??null}
            }),
            error: showMeasureInputError(waterUsage?.vorlaufmengeGesamt)
        },
        selectProps: {
            lookupValues: unitValues.measures.VorlaufmengeGesamt,
            value: waterUsage.vorlaufmengeGesamt?.unit,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                vorlaufmengeGesamt: {unit: parseToFloat(event.target.value), value: waterUsage.vorlaufmengeGesamt?.value??null}
            }),
            error: showSelectInputError(waterUsage?.vorlaufmengeGesamt?.unit)
        }
    }

    const restwasserProps: MeasureUnitInputProps = {
        title: "Restwasser",
        label: "Wie hoch ist die Menge an Restnährlösung zu Kulturende, die entweder entsorgt oder für die neue Kultur aufbereitet wird?",
        optional: true,
        textFieldProps: {
            value: waterUsage.restwasser?.value,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                restwasser: {value: parseToFloat(event.target.value), unit: waterUsage.restwasser?.unit??null}
            }),
        },
        selectProps: {
            lookupValues: unitValues.measures.Restwasser,
            value: waterUsage.restwasser?.unit,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                restwasser: {unit: parseToFloat(event.target.value), value: waterUsage.restwasser?.value??null}
            }),
        }
    }

    const vorlaufmengeAnteileProps: DynamicInputUnitSelectProps = {
        title: "Vorlaufmenge Anteile",
        label: "Aus welchen Anteilen setzt sich die Vorlaufmenge zusammen? Wenn Sie keine genauen Werte wissen, dann schätzen Sie prozentuale Anteile",
        submissionSuccess: submissionSuccess,
        textFieldProps: {},
        selectProps: {
            lookupValues: lookupValues.VorlaufmengeAnteile
        },
        unitSelectProps: {
            lookupValues: lookupValues.VorlaufmengeAnteile,
            unitValues:  unitValues,
            optionGroup: "VorlaufmengeAnteile"
        },
        onValueChange: values => setWaterUsageState({
            ...waterUsage,
            vorlaufmengeAnteile: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: values.vorlaufmengeAnteile
    }


    return (
        <Grid container xs={12} spacing={8}>
            <SectionDivider title="Wasserverbrauch"/>
            <SingleShowConditionalRadioInputField {...wasserVerbrauchProps}>
                <Grid item container xs={12} spacing={4}>
                     <MeasureUnitInputField {...vorlaufmengeGesamtProps}/>
                </Grid>
                <Grid item container xs={12} spacing={4}>
                    <DynamicInputUnitSelectField {...vorlaufmengeAnteileProps}/>
                </Grid>
                <Grid item container xs={12} spacing={4}>
                    <MeasureUnitInputField {...restwasserProps}/>
                </Grid>
            </SingleShowConditionalRadioInputField>
            <Grid item xs={12}>
                <InputPaginationButtons {...paginationProps} />
            </Grid>
        </Grid>
    )

}
export default connector(WaterUsageInput)
