import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    DynamicInputUnitSelectField,
    DynamicInputUnitSelectProps,
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SelectionValue, SelectShowConditionalRadioInputField, SelectShowConditionalRadioInputProps,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
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

type EnergyConsumptionProps = ReduxProps & SubpageProps & {
    provideEnergyConsumption: Function
    showMeasureInputError: Function
    showSelectInputError: Function
    values: EnergyConsumptionState
}

export type EnergyConsumptionState = {
    waermeversorgung: number | null
    waermeteilungFlaeche: MeasureValue | null
    energietraeger: SelectionValue[]
    stromherkunft: SelectionValue[]
    zusatzbelichtung: number | null
    belichtungsstrom: number | null
    belichtungsstromEinheit: number | null
    belichtungsstromStromverbrauch: MeasureValue | null
    belichtungsstromAnzLampen: MeasureValue | null
    belichtungsstromAnschlussleistung: MeasureValue | null
    belichtungsstromLaufzeitJahr: MeasureValue | null
}

const EnergyConsumptionInput = ({values, provideEnergyConsumption, paginationProps, lookupValues, submissionSuccess, unitValues, showSelectInputError, showMeasureInputError}: EnergyConsumptionProps) => {
    const [energyConsumption, setEnergyConsumption] = useState<EnergyConsumptionState>(values)

    const setEnergyConsumptionState = (energyConsumption: EnergyConsumptionState) => {
        setEnergyConsumption(energyConsumption)
        provideEnergyConsumption(energyConsumption)
    }

    // Properties of the input fields
    const waermeversorgungProps: SingleShowConditionalRadioInputProps = {
        title: "Geteilte Wärmeversorgung",
        label: "Teilt sich das zu berechnende Haus die Wärmeversorgung mit anderen Häusern?",
        radioGroupProps: {
            value: energyConsumption.waermeversorgung,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                waermeversorgung: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Waermeversorgung,
        showChildren: value => {
            let trueOptions = lookupValues.Waermeversorgung.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const waermeteilungFlaecheProps: MeasureInputProps = {
        title: "Gewächshausfläche mit gleicher Wärmeversorgung",
        label: "Wie viel Fläche wird durch die selbe Wärmequelle insgesamt versorgt?",
        unitName: "m2",
        textFieldProps: {
            value: energyConsumption.waermeteilungFlaeche?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                waermeteilungFlaeche: {value: parseToFloat(event.target.value),unit:unitValues.measures.WaermeteilungFlaeche[0].id}
            }),
            error: showMeasureInputError(energyConsumption.waermeteilungFlaeche)
        }
    }

    const energietraegerProps: DynamicInputUnitSelectProps = {
        title: "Wärmebereitstellung / Energieträger",
        label: "Welche Mengen der verschiedenen Energieträger wurden in der Kulturdauer verbraucht, bzw. welche Wärmemengen wurden dadurch produziert?",
        submissionSuccess: submissionSuccess,
        textFieldProps: {},
        selectProps: {
            lookupValues: lookupValues.Energietraeger
        },
        unitSelectProps: {
            lookupValues: lookupValues.Energietraeger,
            unitValues:  unitValues,
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
        initValues: values.energietraeger
    }

    const stromherkunftProps: DynamicInputProps = {
        title: "Strom: Herkunft und Mengen",
        label: "Welchen Ursprung hat der Strom für das zu berechnende Haus und in welchen Mengen wird dieser für die Kulturdauer bezogen?",
        submissionSuccess: submissionSuccess,
        textFieldProps: {},
        selectProps: {
            lookupValues: lookupValues.Stromherkunft
        },
        unitProps: {
            unitName: unitValues.selections.Stromherkunft.Photovoltaik[0]?.values,
            optionGroup: "Stromherkunft",
            unitValues: unitValues
        },
        onValueChange: values => setEnergyConsumptionState({
            ...energyConsumption,
            stromherkunft: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: values.stromherkunft
    }

    const zusatzbelichtungProps: SingleShowConditionalRadioInputProps = {
        title: "Zusatzbelichtung",
        label: "Wird die Kultur belichtet?",
        radioGroupProps: {
            value: energyConsumption.zusatzbelichtung,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                zusatzbelichtung: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Zusatzbelichtung,
        showChildren: value => {
            let trueOptions = lookupValues.Zusatzbelichtung.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const belichtungsstromProps: SingleShowConditionalRadioInputProps = {
        title: "Belichtungsstrom",
        label: "Ist der Stromverbrauch der Belichtung im zuvor genannten Stromverbrauch enthalten?",
        radioGroupProps: {
            value: energyConsumption.belichtungsstrom,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstrom: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Belichtungsstrom,
        showChildren: value => {
            let trueOptions = lookupValues.Belichtungsstrom.filter(option => option.values.toUpperCase() == "NEIN");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const belichtungsstromVerbrauchProps: MeasureInputProps = {
        title: "Stromverbauch in kWh",
        label: "Stromverbrauch der Belichtung in Kilowattstunden",
        unitName: unitValues.measures["Belichtung:Stromverbrauch"][0]?.values,
        textFieldProps: {
            value: energyConsumption.belichtungsstromStromverbrauch?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromStromverbrauch: {value: parseToFloat(event.target.value), unit:unitValues.measures["Belichtung:Stromverbrauch"][0].id}
            }),
            error: showMeasureInputError(energyConsumption.belichtungsstromStromverbrauch)
        }
    }

    const belichtungsstromAnschlussleistungProps: MeasureInputProps = {
        title: "Anschlussleistung",
        label: "Wie viel Watt hat eine der Lampen?",
        unitName: unitValues.measures["Belichtung:AnschlussleistungProLampe"][0]?.values,
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnschlussleistung?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnschlussleistung: {value:parseToFloat(event.target.value),unit:unitValues.measures["Belichtung:AnschlussleistungProLampe"][0].id}
            }),
            error: showMeasureInputError(energyConsumption.belichtungsstromAnschlussleistung)
        }
    }

    const belichtungsstromAnzLampenProps: MeasureInputProps = {
        title: "Anzahl Lampen",
        label: "Wie viele Lampen sind in dem zu berechnenden Haus installiert?",
        unitName: unitValues.measures["Belichtung:AnzahlLampen"][0]?.values,
        textFieldProps: {
            value: energyConsumption.belichtungsstromAnzLampen?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromAnzLampen: {value:parseToFloat(event.target.value),unit:unitValues.measures["Belichtung:AnzahlLampen"][0].id}
            }),
            error: showMeasureInputError(energyConsumption.belichtungsstromAnzLampen)
        }
    }

    const belichtungsstromLaufzeitJahrProps: MeasureInputProps = {
        title: "Laufzeit pro Kulturjahr",
        label: "Wie viele Stunden läuft die Belichtung im Kulturjahr?",
        unitName: unitValues.measures["Belichtung:LaufzeitProJahr"][0]?.values,
        textFieldProps: {
            value: energyConsumption.belichtungsstromLaufzeitJahr?.value,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromLaufzeitJahr: {value: parseToFloat(event.target.value), unit:unitValues.measures["Belichtung:LaufzeitProJahr"][0].id}
            }),
            error: showMeasureInputError(energyConsumption.belichtungsstromLaufzeitJahr)
        }
    }



    const belichtungsstromEinheitProps: SelectShowConditionalRadioInputProps = {
        title: "Ermittlung vom Belichtungsstrom",
        label: "Liegt Ihnen der Belichtungsstromverbrauch in kWh vor, oder soll dieser durch weitere Angaben ermittelt werden?",
        radioGroupProps: {
            value: energyConsumption.belichtungsstromEinheit,
            onChange: event => setEnergyConsumptionState({
                ...energyConsumption,
                belichtungsstromEinheit: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.BelichtungsstromEinheit,
        showFirstChildren: value => {
            let trueOptions = lookupValues.BelichtungsstromEinheit.filter(option => option.values.toUpperCase() == "KWH");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        showSecondChildren: value => {
                let trueOptions = lookupValues.BelichtungsstromEinheit.filter(option => option.values.toUpperCase() == "ANGABEN");
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
                    <MeasureInputField {...belichtungsstromLaufzeitJahrProps}/>
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
                <SingleShowConditionalRadioInputField {...waermeversorgungProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...waermeteilungFlaecheProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputUnitSelectField {...energietraegerProps}/>
            </Grid>
            <SectionDivider title="Stromverbrauch"/>
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
                    <InputPaginationButtons {...paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    )

}
export default connector(EnergyConsumptionInput)
