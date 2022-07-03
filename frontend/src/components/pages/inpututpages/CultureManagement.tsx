import React, {useState} from "react";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps,
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
    anzahlTriebe: SelectionValue[]
    mittlereSolltemperaturTag: number | null
    mittlereSolltemperaturNacht: number | null
    entfeuchtung: number | null
    relativeFeuchte: number | null
    kulturmassnahmeAusgeizen: number | null
    kulturmassnahmeAusblattenAnzahlMonat: number | null
    kulturmassnahmeAusblattenMenge: number| null
    kulturmassnahmeAblassen: number | null
}

const CultureManagementInput = (props: CultureManagementProps) => {
    const [cultureManagement, setCultureManagementState] = useState<CultureManagementState>(props.values)


    const setCultureManagement = (cultureManagement: CultureManagementState) => {
        setCultureManagementState(cultureManagement)
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
        onValueChange: values => setCultureManagement({
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
            onChange: event => setCultureManagement({
                ...cultureManagement,
                mittlereSolltemperaturTag: parseFloat(event.target.value)
            })
        }
    }

    const mittlereSolltemperaturNachtProps: MeasureInputProps = {
        title: "Mittlere Solltemperatur Nacht",
        label: "Mittlere Luftsolltemperatur Nacht (Innen; über den Kulturverlauf)",
        textFieldProps: {
            value: cultureManagement.mittlereSolltemperaturNacht,
            onChange: event => setCultureManagement({
                ...cultureManagement,
                mittlereSolltemperaturNacht: parseFloat(event.target.value)
            })
        }
    }

    const entfeuchtungProps: SelectionRadioInputProps = {
        title: "Entfeuchtung",
        label: "Ist eine aktive Entfeuchtung aktiviert?",
        radioProps: {
            value: cultureManagement.entfeuchtung,
            onChange: event => setCultureManagement({
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
            onChange: event => setCultureManagement({
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
            onChange: event => setCultureManagement({
                ...cultureManagement,
                kulturmassnahmeAusgeizen: parseFloat(event.target.value)
            })
        }
    }

    const kulturmassnahmeAusblattenAnzahlMonatProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ausblatten",
        label: "Wie häufig wird innerhalb eines Monats ausgeblattet?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAusblattenAnzahlMonat,
            onChange: event => setCultureManagement({
                ...cultureManagement,
                kulturmassnahmeAusblattenAnzahlMonat: parseFloat(event.target.value)
            })
        }
    }

    const kulturmassnahmeAusblattenMengeProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ausblatten",
        label: "Wieviele Blätter pro Pflanze werden je Durchgang entfernt?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAusblattenMenge,
            onChange: event => setCultureManagement({
                ...cultureManagement,
                kulturmassnahmeAusblattenMenge: parseFloat(event.target.value)
            })
        }
    }

    const kulturmassnahmeAblassenProps: MeasureInputProps = {
        title: "Kulturmaßnahme Ablassen",
        label: "Wie häufig lassen Sie die Pflanzen ab?",
        textFieldProps: {
            value: cultureManagement.kulturmassnahmeAblassen,
            onChange: event => setCultureManagement({
                ...cultureManagement,
                kulturmassnahmeAblassen: parseFloat(event.target.value)
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
