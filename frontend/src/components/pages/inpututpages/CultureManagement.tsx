import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SelectionRadioInputField,
    SelectionRadioInputProps,
    SelectionValue
} from "../../utils/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {FormControlLabel, Radio} from "@mui/material";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CultureManagementProps = ReduxProps & SubpageProps & {
    provideCultureManagement: Function
    values: CultureManagementState
}

export type CultureManagementState = {
    mittlereSolltemperaturTag: MeasureValue | null
    mittlereSolltemperaturNacht: MeasureValue | null
    entfeuchtung: number | null
    luftfeuchte: MeasureValue | null
}

const CultureManagementInput = (props: CultureManagementProps) => {
    const [cultureManagement, setCultureManagement] = useState<CultureManagementState>(props.values)

    const setCultureManagementState = (cultureManagement: CultureManagementState) => {
        setCultureManagement(cultureManagement)
        props.provideCultureManagement(cultureManagement)
    }

    // Properties of the input fields
    const anzahlTriebeProps: DynamicInputProps = {
        title: "Anzahl Triebe",
        label: "Wieviele Triebe werden pro Pflanze im Durchschnitt erzielt?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.AnzahlTriebe
        },
        onValueChange: values => setCultureManagementState({
            ...cultureManagement,
            anzahlTriebe: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.anzahlTriebe
    }

    const mittlereSolltemperaturTagProps: MeasureInputProps = {
        title: "Mittlere Solltemperatur Tag",
        label: "Mittlere Luftsolltemperatur Tag (Innen; über den Kulturverlauf)",
        textFieldProps: {
            value: cultureManagement.mittlereSolltemperaturTag,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                mittlereSolltemperaturTag: {value:parseFloat(event.target.value),unit:cultureManagement.mittlereSolltemperaturTag?.unit??null}
            })
        }
    }

    const mittlereSolltemperaturNachtProps: MeasureInputProps = {
        title: "Mittlere Solltemperatur Nacht",
        label: "Mittlere Luftsolltemperatur Nacht (Innen; über den Kulturverlauf)",
        textFieldProps: {
            value: cultureManagement.mittlereSolltemperaturNacht,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                mittlereSolltemperaturNacht: {value:parseFloat(event.target.value),unit:cultureManagement.mittlereSolltemperaturTag?.unit??null}
            })
        }
    }

    const entfeuchtungProps: SelectionRadioInputProps = {
        title: "Entfeuchtung",
        label: "Ist eine aktive Entfeuchtung aktiviert?",
        radioProps: {
            value: cultureManagement.entfeuchtung,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                entfeuchtung: parseFloat(event.target.value)
            })
        },
    }

    const relativeFeuchteProps: MeasureInputProps = {
        title: "Relative Feuchte",
        label: "Wie hoch ist die relative Luftfeuchte im Gewächshaus? Stellt bei aktivierter Entfeuchtung den Sollwert für die Regelung dar.",
        textFieldProps: {
            value: cultureManagement.relativeFeuchte,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                relativeFeuchte: parseFloat(event.target.value)
            })
        }
    }

    const kulturmassnahmeAusgeizenProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ausgeizen",
        label: "Wie häufig wird ausgegeizt?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAusgeizen,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                kulturmassnahmeAusgeizen: {value:parseFloat(event.target.value),unit:cultureManagement.kulturmassnahmeAusgeizen?.unit??null}
            })
        }
    }

    const kulturmassnahmeAusblattenAnzahlMonatProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ausblatten",
        label: "Wie häufig wird innerhalb eines Monats ausgeblattet?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAusblattenAnzahlMonat,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                kulturmassnahmeAusblattenAnzahlMonat: {value:parseFloat(event.target.value),unit:cultureManagement.kulturmassnahmeAusblattenAnzahlMonat?.unit??null}
            })
        }
    }

    const kulturmassnahmeAusblattenMengeProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ausblatten",
        label: "Wieviele Blätter pro Pflanze werden je Durchgang entfernt?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAusblattenMenge,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                kulturmassnahmeAusblattenMenge: {value:parseFloat(event.target.value),unit:cultureManagement.kulturmassnahmeAusblattenMenge?.unit??null}
            })
        }
    }

    const kulturmassnahmeAblassenProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ablassen",
        label: "Wie häufig lassen Sie die Pflanzen ab?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAblassen,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                kulturmassnahmeAblassen: {value:parseFloat(event.target.value),unit:cultureManagement.kulturmassnahmeAblassen?.unit??null}
            })
        }
    }


    return (
        <Grid container xs={12} spacing={8}>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...anzahlTriebeProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...mittlereSolltemperaturTagProps}/>
                <MeasureInputField {...mittlereSolltemperaturNachtProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionRadioInputField {...entfeuchtungProps}>
                    {props.lookupValues.Entfeuchtung.map(option => {
                        return <FormControlLabel
                            value={option.id}
                            control={<Radio/>}
                            label={option.values}
                        />
                    })}
                </SelectionRadioInputField>
                <MeasureInputField {...relativeFeuchteProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...kulturmassnahmeAusgeizenProps} />
                <MeasureInputField {...kulturmassnahmeAblassenProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...kulturmassnahmeAusblattenAnzahlMonatProps} />
                <MeasureInputField {...kulturmassnahmeAusblattenMengeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...props.paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    )

}
export default connector(CultureManagementInput)
