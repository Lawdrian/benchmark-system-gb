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
    fungizideKg: MeasureValue | null
    fungizideLiter: MeasureValue | null
    insektizideKg: MeasureValue | null
    insektizideLiter: MeasureValue | null
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

    const fungizideKgProps: MeasureInputProps = {
        title: "Angabe Kilogramm",
        label: "Wieviele feste Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Fungizide und geben Sie diese in Kilogramm an.",
        unitName: props.unitValues.measures.FungizideKg[0]?.values,
        textFieldProps: {
            value: consumableItems.fungizideKg?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                fungizideKg: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FungizideKg[0]?.id}
            })
        },
    }

    const fungizideLiterProps: MeasureInputProps = {
        title: "Angabe Liter",
        label: "Wieviele flüssige Fungizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssige Fungizide und geben Sie diese in Liter an.",
        unitName: "Liter",
        textFieldProps: {
            value: consumableItems.fungizideLiter?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                fungizideLiter: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FungizideKg[0].id}
            })
        },
    }

    const insektizideKgProps: MeasureInputProps = {
        title: "Angabe Kilogramm",
        label: "Wieviele feste Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten festen Mittel und geben Sie diese in Kilogramm an.",
        unitName: props.unitValues.measures.InsektizideKg[0]?.values,
        textFieldProps: {
            value: consumableItems.insektizideKg?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                insektizideKg: {value:parseFloat(event.target.value),unit:props.unitValues.measures.InsektizideKg[0].id}
            })
        },
    }

    const insektizideLiterProps: MeasureInputProps = {
        title: "Angabe Liter",
        label: "Wieviele flüssige Insektizide verwenden Sie in der eingetragenen Kulturdauer? Bitte addieren Sie alle verwendeten flüssigen Mittel und geben Sie diese in Liter an.",
        unitName: "Liter",
        textFieldProps: {
            value: consumableItems.insektizideLiter?.value,
            onChange: event => setConsumableItemsState({
                ...consumableItems,
                insektizideLiter: {value:parseFloat(event.target.value),unit:props.unitValues.measures.InsektizideKg[0].id}
            })
        },
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
