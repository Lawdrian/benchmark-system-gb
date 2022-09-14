// Verbrauchsmittel
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureUnitInputField, MeasureUnitInputProps, MeasureValue,
    SelectionInputField,
    SelectionInputProps,
    SelectionValue
} from "../../utils/inputPage/InputFields"
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

type ConsumableItemsProps = ReduxProps & SubpageProps & {
    provideItems: Function
    values: ConsumableItemsState
}

export type ConsumableItemsState = {
    co2Herkunft: SelectionValue[]
    duengemittelSimple: SelectionValue[]
    duengemittelDetail: SelectionValue[]
    fungizide: MeasureValue | null
    insektizide: MeasureValue | null
    nuetzlinge: SelectionValue[]
}

const ConsumableItemsInput = (props: ConsumableItemsProps) => {
    const [consumableItems, setConsumableItems] = useState<ConsumableItemsState>(props.values)

    const setConsumableItemsState = (consumableItems: ConsumableItemsState) => {
        setConsumableItems(consumableItems)
        props.provideItems(consumableItems)
        console.log(consumableItems.duengemittelDetail)
    }

    const co2HerkunftProps: DynamicInputProps = {
        title: "CO2 Zudosierung",
        label: "Wie und wieviel CO2 führen Sie der Kultur hinzu?.",
        textFieldProps:{},
        selectProps: {
            lookupValues: props.lookupValues["CO2-Herkunft"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["CO2-Herkunft"],
            unitValues: props.unitValues,
            optionGroup: "CO2-Herkunft"
        },
        onValueChange: values => setConsumableItemsState({
            ...consumableItems,
            co2Herkunft: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.co2Herkunft
    }

    const duengemittelSimpleProps: DynamicInputProps = {
        title: "Einfach",
        label: "Verwendetes Düngemittel und Menge eintragen.",
        textFieldProps:{},
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"],
            unitValues:  props.unitValues,
            optionGroup: "Duengemittel:VereinfachteAngabe"
        },
        onValueChange: values => setConsumableItemsState({
            ...consumableItems,
            duengemittelSimple: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.duengemittelSimple
    }

    const duengemittelDetailProps: DynamicInputProps = {
        title: "Detailliert",
        label: "Verwendetes Düngemittel und Menge eintragen.",
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:DetaillierteAngabe"]
        },
        unitSelectProps: {
            lookupValues: props.lookupValues["Duengemittel:DetaillierteAngabe"],
            unitValues:  props.unitValues,
            optionGroup: "Duengemittel:DetaillierteAngabe"
        },
        textFieldProps: {},
        onValueChange: values => setConsumableItemsState({
            ...consumableItems,
            duengemittelDetail: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.duengemittelDetail
    }

    const fungizideProps: MeasureUnitInputProps = {
        title: "Fungizide",
        label: "Wieviele Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten Fungizide und geben Sie diese in Kilogramm an.",
        textFieldProps: {
            value: consumableItems.fungizide?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                fungizide: {value:parseFloat(event.target.value),unit:consumableItems.fungizide?.unit??null}
            })
        },
        selectProps: {
            value: consumableItems.fungizide?.unit,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                fungizide: {value:consumableItems.fungizide?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures.Fungizide
        }
    }

    const insektizideProps: MeasureUnitInputProps = {
        title: "Insektizide",
        label: "Wieviele Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten Mittel und geben Sie diese in Kilogramm an.",
        textFieldProps: {
            value: consumableItems.insektizide?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                insektizide: {value:parseFloat(event.target.value),unit:consumableItems.insektizide?.unit??null}
            })
        },
        selectProps: {
            value: consumableItems.insektizide?.unit,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                insektizide: {value:consumableItems.insektizide?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures.Insektizide
        }
    }

    const nuetzlingeProps: DynamicInputProps = {
        title: "Nützlinge",
        label: "Welche und wieviele Nützlinge werden in der genannten Kulturdauer ausgebracht?",
        textFieldProps: {

        },
        selectProps: {
            lookupValues: props.lookupValues.Nuetzlinge
        },
        onValueChange: values => setConsumableItemsState({
            ...consumableItems,
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

    return (
        <Grid container xs={12} spacing={8}>
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
            <SectionDivider title="Pflanzenschutzmittel"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureUnitInputField {...fungizideProps} />
                <MeasureUnitInputField {...insektizideProps} />
            </Grid>
            <SectionDivider title=""/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...nuetzlingeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
               <Grid item xs={12}>
                    <InputPaginationButtons {...props.paginationProps} />
               </Grid>
            </Grid>
        </Grid>
    );
}

export default connector(ConsumableItemsInput)
