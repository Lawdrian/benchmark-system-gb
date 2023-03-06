// Verbrauchsmittel
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DynamicInputField,
    DynamicInputProps,
    DynamicInputUnitSelectField,
    DynamicInputUnitSelectProps,
    MeasureInputField,
    MeasureInputProps,
    MeasureValue,
    SelectionValue
} from "../../../utils/input/InputFields"
import {RootState} from "../../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../../utils/input/InputPaginationButtons";
import {SectionDivider} from "../../../utils/input/layout";
import {parseToFloat} from "../../../../helpers/InputHelpers";
import {CO2} from "../../../../helpers/LayoutHelpers";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues,
    submissionSuccess: state.submission.successful,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type HelpingMaterialsProps = ReduxProps & SubpageProps & {
    provideHelpingMaterials: Function
    values: HelpingMaterialsState
}

/**
 * This type contains the types for the {@link helpingMaterials} state.
 */
export type HelpingMaterialsState = {
    co2Herkunft: SelectionValue[]
    duengemittelSimple: SelectionValue[]
    duengemittelDetail: SelectionValue[]
    fungizideKg: MeasureValue | null
    fungizideLiter: MeasureValue | null
    insektizideKg: MeasureValue | null
    insektizideLiter: MeasureValue | null
}

/**
 * This functional component renders the sub-page helping materials for the input page.
 * @param values - Initial values for the input state of the component
 * @param provideHelpingMaterials - Function to update the parent state on state change in this child
 * @param paginationProps - Contains the properties used for navigating the sub-pages and submitting the form
 * @param lookupValues - Values used for multiple choice fields
 * @param submissionSuccess - Boolean value determining, whether the submission was a success or not
 * @param unitValues - Values used for displaying the unit in the input fields
 */
const HelpingMaterialsInput = ({values, provideHelpingMaterials, paginationProps, lookupValues, unitValues, submissionSuccess}: HelpingMaterialsProps) => {
    const [helpingMaterials, setHelpingMaterials] = useState<HelpingMaterialsState>(values)

    const setHelpingMaterialsState = (helpingMaterials: HelpingMaterialsState) => {
        setHelpingMaterials(helpingMaterials)
        provideHelpingMaterials(helpingMaterials)
    }

    // properties of the input fields
    const co2HerkunftProps: DynamicInputUnitSelectProps = {
        title: `${CO2}-Zudosierung`,
        label: `Wie und in welcher Menge führen Sie der Kultur ${CO2} zu? (falls zutreffend)`,
        optional: true,
        submissionSuccess: submissionSuccess,
        textFieldProps:{},
        selectProps: {
            lookupValues: lookupValues["CO2-Herkunft"]
        },
        unitSelectProps: {
            lookupValues: lookupValues["CO2-Herkunft"],
            unitValues: unitValues,
            optionGroup: "CO2-Herkunft"
        },
        onValueChange: values => setHelpingMaterialsState({
            ...helpingMaterials,
            co2Herkunft: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: values.co2Herkunft
    }

    const duengemittelSimpleProps: DynamicInputProps = {
        title: "Vereinfachte Angaben",
        label: "Tragen Sie die Mengen der verwendeten Düngemittel für das zu berechnende Haus ein. Die vereinfachte Angabe kann ggf. Ungenauigkeiten bei der Berechnung der Footprints führen.",
        optional: true,
        submissionSuccess: submissionSuccess,
        unitProps: {
            unitName: unitValues.selections["Duengemittel:VereinfachteAngabe"].Pferdemist[0]?.values,
            optionGroup: "Duengemittel:VereinfachteAngabe",
            unitValues: unitValues
        },
        textFieldProps:{},
        selectProps: {
            lookupValues: lookupValues["Duengemittel:VereinfachteAngabe"]
        },
        onValueChange: values => setHelpingMaterialsState({
            ...helpingMaterials,
            duengemittelSimple: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: values.duengemittelSimple
    }

    const duengemittelDetailProps: DynamicInputProps = {
        title: "Detaillierte Angaben",
        label: "Tragen Sie die Mengen der verwendeten Düngemittel für das zu berechnende Haus ein.",
        optional: true,
        submissionSuccess: submissionSuccess,
        unitProps: {
            unitName: unitValues.selections["Duengemittel:DetaillierteAngabe"].Ammoniummolybdat[0]?.values,
            optionGroup: "Duengemittel:DetaillierteAngabe",
            unitValues: unitValues
        },
        selectProps: {
            lookupValues: lookupValues["Duengemittel:DetaillierteAngabe"]
        },
        textFieldProps: {},
        onValueChange: values => setHelpingMaterialsState({
            ...helpingMaterials,
            duengemittelDetail: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: values.duengemittelDetail
    }

    const fungizideKgProps: MeasureInputProps = {
        title: "Angabe Festmittel (kg)",
        label: "Wie viele feste Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Fungizide und geben Sie diese in Kilogramm an.",
        optional: true,
        unitName: unitValues.measures.FungizideKg[0]?.values,
        textFieldProps: {
            value: helpingMaterials.fungizideKg?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                fungizideKg: {value:parseToFloat(event.target.value),unit:unitValues.measures.FungizideKg[0]?.id}
            })
        },
    }

    const fungizideLiterProps: MeasureInputProps = {
        title: "Angabe Flüssigmittel (Liter)",
        label: "Wie viele flüssige Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssigen Fungizide und geben Sie diese in Liter an.",
        optional: true,
        unitName: unitValues.measures.FungizideLiter[0]?.values,
        textFieldProps: {
            value: helpingMaterials.fungizideLiter?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                fungizideLiter: {value:parseToFloat(event.target.value),unit:unitValues.measures.FungizideLiter[0].id}
            })
        },
    }

    const insektizideKgProps: MeasureInputProps = {
        title: "Angabe Festmittel (kg)",
        label: "Wie viele feste Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Mittel und geben Sie diese in Kilogramm an.",
        optional: true,
        unitName: unitValues.measures.InsektizideKg[0]?.values,
        textFieldProps: {
            value: helpingMaterials.insektizideKg?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                insektizideKg: {value:parseToFloat(event.target.value),unit:unitValues.measures.InsektizideKg[0].id}
            })
        },
    }

    const insektizideLiterProps: MeasureInputProps = {
        title: "Angabe Flüssigmittel (Liter)",
        label: "Wie viele flüssige Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssigen Mittel und geben Sie diese in Liter an.",
        optional: true,
        unitName: unitValues.measures.InsektizideLiter[0]?.values,
        textFieldProps: {
            value: helpingMaterials.insektizideLiter?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                insektizideLiter: {value:parseToFloat(event.target.value),unit:unitValues.measures.InsektizideLiter[0].id}
            })
        },
    }

    return (
        <Grid container xs={12} spacing={8}>
            <SectionDivider title={CO2}/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputUnitSelectField {...co2HerkunftProps} />
            </Grid>
            <SectionDivider title="Düngemittel"/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...duengemittelSimpleProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...duengemittelDetailProps} />
            </Grid>
            <SectionDivider title="Fungizide"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...fungizideKgProps} />
                <MeasureInputField {...fungizideLiterProps} />
            </Grid>
            <SectionDivider title="Insektizide"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...insektizideKgProps} />
                <MeasureInputField {...insektizideLiterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
               <Grid item xs={12}>
                    <InputPaginationButtons {...paginationProps} />
               </Grid>
            </Grid>
        </Grid>
    );
}

export default connector(HelpingMaterialsInput)
