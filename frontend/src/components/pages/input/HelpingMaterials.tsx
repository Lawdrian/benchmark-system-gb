// Verbrauchsmittel
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps,
    MeasureValue,
    SelectionValue
} from "../../utils/inputPage/InputFields"
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/inputPage/InputPaginationButtons";
import {SectionDivider} from "../../utils/inputPage/layout";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type HelpingMaterialsProps = ReduxProps & SubpageProps & {
    provideHelpingMaterials: Function
    values: HelpingMaterialsState
}

export type HelpingMaterialsState = {
    co2Herkunft: SelectionValue[]
    duengemittelSimple: SelectionValue[]
    duengemittelDetail: SelectionValue[]
    fungizideKg: MeasureValue | null
    fungizideLiter: MeasureValue | null
    insektizideKg: MeasureValue | null
    insektizideLiter: MeasureValue | null
    nuetzlinge: SelectionValue[]
}

const HelpingMaterialsInput = (props: HelpingMaterialsProps) => {
    const [helpingMaterials, setHelpingMaterials] = useState<HelpingMaterialsState>(props.values)

    const setHelpingMaterialsState = (helpingMaterials: HelpingMaterialsState) => {
        setHelpingMaterials(helpingMaterials)
        props.provideHelpingMaterials(helpingMaterials)
    }

    const co2HerkunftProps: DynamicInputProps = {
        title: "CO2-Zudosierung",
        label: "Wie und in welcher Menge führen Sie der Kultur CO2 zu? (falls zutreffend)",
        optional: true,
        textFieldProps:{},
        selectProps: {
            lookupValues: props.lookupValues["CO2-Herkunft"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["CO2-Herkunft"],
            unitValues: props.unitValues,
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
        initValues: props.values.co2Herkunft
    }

    const duengemittelSimpleProps: DynamicInputProps = {
        title: "Vereinfachte Angaben",
        label: "Tragen Sie die Mengen der verwendeten Düngemittel für das zu berechnende Haus ein. Die vereinfachte Angabe kann ggf. Ungenauigkeiten bei der Berechnung der Fußabdrücke führen.",
        optional: true,
        textFieldProps:{},
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"],
            unitValues:  props.unitValues,
            optionGroup: "Duengemittel:VereinfachteAngabe"
        },
        onValueChange: values => setHelpingMaterialsState({
            ...helpingMaterials,
            duengemittelSimple: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.duengemittelSimple
    }

    const duengemittelDetailProps: DynamicInputProps = {
        title: "Detaillierte Angaben",
        label: "Tragen Sie die Mengen der verwendeten Düngemittel für das zu berechnende Haus ein.",
        optional: true,
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:DetaillierteAngabe"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["Duengemittel:DetaillierteAngabe"],
            unitValues:  props.unitValues,
            optionGroup: "Duengemittel:DetaillierteAngabe"
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
        initValues: props.values.duengemittelDetail
    }

    const fungizideKgProps: MeasureInputProps = {
        title: "Angabe Festmittel (kg)",
        label: "Wie viele feste Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Fungizide und geben Sie diese in Kilogramm an.",
        optional: true,
        unitName: props.unitValues.measures.FungizideKg[0]?.values,
        textFieldProps: {
            value: helpingMaterials.fungizideKg?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                fungizideKg: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FungizideKg[0]?.id}
            })
        },
    }

    const fungizideLiterProps: MeasureInputProps = {
        title: "Angabe Flüssigmittel (Liter)",
        label: "Wie viele flüssige Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssigen Fungizide und geben Sie diese in Liter an.",
        optional: true,
        unitName: "Liter",
        textFieldProps: {
            value: helpingMaterials.fungizideLiter?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                fungizideLiter: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FungizideKg[0].id}
            })
        },
    }

    const insektizideKgProps: MeasureInputProps = {
        title: "Angabe Festmittel (kg)",
        label: "Wie viele feste Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Mittel und geben Sie diese in Kilogramm an.",
        optional: true,
        unitName: props.unitValues.measures.InsektizideKg[0]?.values,
        textFieldProps: {
            value: helpingMaterials.insektizideKg?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                insektizideKg: {value:parseFloat(event.target.value),unit:props.unitValues.measures.InsektizideKg[0].id}
            })
        },
    }

    const insektizideLiterProps: MeasureInputProps = {
        title: "Angabe Flüssigmittel (Liter)",
        label: "Wie viele flüssige Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssigen Mittel und geben Sie diese in Liter an.",
        optional: true,
        unitName: "Liter",
        textFieldProps: {
            value: helpingMaterials.insektizideLiter?.value,
            onChange: event => setHelpingMaterialsState({
                ...helpingMaterials,
                insektizideLiter: {value:parseFloat(event.target.value),unit:props.unitValues.measures.InsektizideKg[0].id}
            })
        },
    }

    /* // For now this Field won't be used, but might be added again in the future
    const nuetzlingeProps: DynamicInputProps = {
        title: "Nützlinge",
        label: "Welche und wieviele Nützlinge werden in der genannten Kulturdauer ausgebracht?",
        optional: true,
        textFieldProps: {

        },
        selectProps: {
            lookupValues: props.lookupValues.Nuetzlinge
        },
        onValueChange: values => setHelpingMaterialsState({
            ...helpingMaterials,
            nuetzlinge: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue, unitFieldValue: value.unitFieldValue
                }
            })
        }),
        unitSelectProps: {
            lookupValues: props.lookupValues.Nuetzlinge,
            unitValues: props.unitValues,
            optionGroup: 'Nuetzlinge'
        },
        initValues: props.values.nuetzlinge
    }
    */

    return (
        <Grid container xs={12} spacing={8}>
            <SectionDivider title={"CO2"}/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...co2HerkunftProps} />
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
                    <InputPaginationButtons {...props.paginationProps} />
               </Grid>
            </Grid>
        </Grid>
    );
}

export default connector(HelpingMaterialsInput)
