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
    unitValues: state.lookup.unitValues
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

    const mittlereSolltemperaturTagProps: MeasureInputProps = {
        title: "Mittlere Solltemperatur Tag",
        label: "Mittlere Luftsolltemperatur Tag (Innen; über den Kulturverlauf)",
        unitName: props.unitValues.measures.MittlereSolltemperaturTag[0]?.values,
        textFieldProps: {
            value: cultureManagement.mittlereSolltemperaturTag?.value,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                mittlereSolltemperaturTag: {value:parseFloat(event.target.value),unit:cultureManagement.mittlereSolltemperaturTag?.unit??null}
            })
        }
    }

    const mittlereSolltemperaturNachtProps: MeasureInputProps = {
        title: "Mittlere Solltemperatur Nacht",
        label: "Mittlere Luftsolltemperatur Nacht (Innen; über den Kulturverlauf)",
        unitName: props.unitValues.measures.MittlereSolltemperaturNacht[0]?.values,
        textFieldProps: {
            value: cultureManagement.mittlereSolltemperaturNacht?.value,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                mittlereSolltemperaturNacht: {value:parseFloat(event.target.value),unit:cultureManagement.mittlereSolltemperaturNacht?.unit??null}
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

    const luftfeuchteProps: MeasureInputProps = {
        title: "Luftfeuchte",
        label: "Wie hoch ist die relative Luftfeuchte im Gewächshaus? Stellt bei aktivierter Entfeuchtung den Sollwert für die Regelung dar.",
        unitName: props.unitValues.measures.Luftfeuchte[0]?.values,
        textFieldProps: {
            value: cultureManagement.luftfeuchte?.value,
            onChange: event => setCultureManagementState({
                ...cultureManagement,
                luftfeuchte: {value:parseFloat(event.target.value),unit:cultureManagement.luftfeuchte?.unit??null}
            })
        }
    }

    return (
        <Grid container xs={12} spacing={8}>
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
                <MeasureInputField {...luftfeuchteProps}/>
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
