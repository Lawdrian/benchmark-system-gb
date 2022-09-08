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
} from "../../utils/InputFields"
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

type ConsumableItemsProps = ReduxProps & SubpageProps & {
    provideItems: Function
    values: ConsumableItemsState
}

export type ConsumableItemsState = {
    co2Zudosierung: MeasureValue | null
    co2Herkunft: number | null
    duengemittelDetail: SelectionValue[]
    duengemittelSimple: SelectionValue[]
    fungizide: MeasureValue | null
    insektizide: MeasureValue | null
    nuetzlinge: SelectionValue[]
}

const ConsumableItemsInput = (props: ConsumableItemsProps) => {
    const [consumableItems, setConsumableItems] = useState<ConsumableItemsState>(props.values)

    const setConsumableItemsState = (consumableItems: ConsumableItemsState) => {
        setConsumableItems(consumableItems)
        props.provideItems(consumableItems)
    }

    // Properties of the input fields
    const co2ZudosierungProps: MeasureInputProps = {
        title: "CO2 Zudosierung",
        label: "Wieviel CO2 wird in der Kulturdauer zudosiert?",
        textFieldProps: {
            value: consumableItems.co2Zudosierung,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                co2Zudosierung: {value:parseFloat(event.target.value),unit:consumableItems.co2Zudosierung?.unit??null}
            })
        }
    }

    const co2HerkunftProps: SelectionInputProps = {
        title: "CO2 Herkunft",
        label: "Herkunft des CO2 auswählen.",
        selectProps: {
            value: consumableItems.co2Herkunft,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                co2Herkunft: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["CO2-Herkunft"]
        },
    }

    const duengemittelSimpleProps: DynamicInputProps = {
        title: "Düngemittel Einfach",
        label: "Verwendetes Düngemittel und Menge eintragen.",
        textFieldProps:{},
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"]
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
        title: "Düngemittel Detail",
        label: "Verwendetes Düngemittel und Menge eintragen.",
        selectProps: {
            lookupValues: props.lookupValues["Duengemittel:VereinfachteAngabe"]
        },
        textFieldProps: {
        },
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

    const insektizideProps: MeasureInputProps = {
        title: "Insektizide",
        label: "Wieviele Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten Mittel und geben Sie diese in Kilogramm an.",
        textFieldProps: {
            value: consumableItems.insektizide,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                insektizide: {value:parseFloat(event.target.value),unit:consumableItems.insektizide?.unit??null}
            })
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
                <MeasureInputField {...co2ZudosierungProps}/>
                <SelectionInputField {...co2HerkunftProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...duengemittelSimpleProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...duengemittelDetailProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureUnitInputField {...fungizideProps} />
                <MeasureInputField {...insektizideProps} />
            </Grid>
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
