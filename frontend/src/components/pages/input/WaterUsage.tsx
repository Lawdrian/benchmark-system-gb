import React, {useState} from "react";
import {
    MeasureValue,
    SelectionValue,
    MeasureUnitInputProps,
    DynamicInputUnitSelectProps,
    DynamicInputUnitSelectField, MeasureUnitInputField
} from "../../utils/inputPage/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/inputPage/InputPaginationButtons";
import {SectionDivider} from "../../utils/inputPage/layout";
import {parseToFloat} from "../../../helpers/InputHelpers";

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


    const vorlaufmengeGesamtProps: MeasureUnitInputProps = {
        title: "Vorlaufmenge Gesamt",
        label: "Tragen Sie die Gesamtvorlaufmenge ein, welche für das berechnete Haus pro Jahr verbraucht wurde",
        optional: true,
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
            error: showMeasureInputError(waterUsage?.restwasser)
        },
        selectProps: {
            lookupValues: unitValues.measures.Restwasser,
            value: waterUsage.restwasser?.unit,
            onChange: event => setWaterUsageState({
                ...waterUsage,
                restwasser: {unit: parseToFloat(event.target.value), value: waterUsage.restwasser?.value??null}
            }),
            error: showSelectInputError(waterUsage?.restwasser?.unit)
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
            <Grid item container xs={12} spacing={4}>
                <MeasureUnitInputField {...vorlaufmengeGesamtProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputUnitSelectField {...vorlaufmengeAnteileProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureUnitInputField {...restwasserProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    )

}
export default connector(WaterUsageInput)
