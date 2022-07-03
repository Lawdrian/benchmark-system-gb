import React, {useState} from "react";
import {
    MeasureInputField,
    MeasureInputProps,
    SelectionInputField,
    SelectionInputProps,
    SelectShowConditionalRadioInputField,
    SelectShowConditionalRadioInputProps,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CultureInformationProps = ReduxProps & SubpageProps & {
    provideCultureInformation: Function
    values: CultureInformationState
}

export type CultureInformationState = {
    fruchtgewicht: number | null
    kulturflaeche: number | null
    kulturBeginn: number | null
    kulturEnde: number | null
    nebenkultur: number | null
    nebenkulturDauer: number | null
    pflanzendichte: number | null
    pflanzendichteAnzProm2: number | null
    pflanzendichteReihePflanzabstand: number| null
    pflanzendichteReihenabstand: number| null
    ertrag: number| null
}

const CultureInformationInput = (props: CultureInformationProps) => {
    const [cultureInformation, setCultureInformationSate] = useState<CultureInformationState>(props.values)

    const setCultureInformation = (cultureInformation: CultureInformationState) => {
        setCultureInformationSate(cultureInformation)
        props.provideCultureInformation(cultureInformation)
    }

    // Properties of the input fields
    const fruchtgewichtProps: SelectionInputProps = {
        title: "Fruchtgewicht",
        label: "Welche Fruchtgrößen werden in dem betreffenden Gewächshaus erzielt?",
        selectProps: {
            value: cultureInformation.fruchtgewicht,
            onChange: event => setCultureInformation({
                ...cultureInformation,
                fruchtgewicht: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Fruchtgewicht"]
        }
    }

    const kulturflaecheProps: MeasureInputProps = {
        title: "Kulturfläche",
        label: "Auf welcher Fläche wird die genante Fruchtgröße in dem Gewächshaus kultiviert?",
        textFieldProps: {
            value: cultureInformation.kulturflaeche,
            onChange: event => setCultureInformation({
                ...cultureInformation,
                kulturflaeche: parseFloat(event.target.value)
            })
        }
    }

    const kulturBeginnProps: MeasureInputProps = {
        title: "Kultur Beginn",
        label: "In welcher Kalenderwoche ist der Kulturbeginn (aufstellen der Jungpflanzen)",
        textFieldProps: {
            value: cultureInformation.kulturBeginn,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               kulturBeginn: parseFloat(event.target.value)
            })
        }
    }

    const kulturEndeProps: MeasureInputProps = {
        title: "Kultur Ende",
        label: "In welcher Kalenderwoche wird zuletzt geerntet?",
        textFieldProps: {
            value: cultureInformation.kulturEnde,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               kulturEnde: parseFloat(event.target.value)
            })
        }
    }

    const nebenkulturProps: SingleShowConditionalRadioInputProps = {
        title: "Nebenkultur",
        label: "Findet im selben Kulturjahr noch eine andere Nutzung des GWH außerhalb der gennanten Kulturdauer statt?",
        radioGroupProps: {
            value: cultureInformation.nebenkultur,
            onChange: event => setCultureInformation({
                ...cultureInformation,
                nebenkultur: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Nebenkultur,
        showChildren: value => {
            let trueOptions = props.lookupValues.Nebenkultur.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const nebenkulturDauerProps: MeasureInputProps = {
        title: "Nebenkulturdauer",
        label: "Wie viele Kalenderwochen wird das GWH anderweitig verwendet?",
        textFieldProps: {
            value: cultureInformation.nebenkulturDauer,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               nebenkulturDauer: parseFloat(event.target.value)
            })
        }
    }

    const pflanzendichteAnzProm2Props: MeasureInputProps = {
        title: "Pflanzen pro Quadratmeter",
        label: "Wie viele Pflanzen pro Quadratmeter verwenden Sie?",
        textFieldProps: {
            value: cultureInformation.pflanzendichteAnzProm2,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               pflanzendichteAnzProm2: parseFloat(event.target.value)
            })
        }
    }

    const pflanzendichteReihePflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand der Pflanzen in einer Reihe?",
        textFieldProps: {
            value: cultureInformation.pflanzendichteReihePflanzabstand,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               pflanzendichteReihePflanzabstand: parseFloat(event.target.value)
            })
        }
    }

    const pflanzendichteReihenAbstandProps: MeasureInputProps = {
        title: "Reihenabstand",
        label: "Wie groß ist der Abstand zwischen den Pflanzenreihen?",
        textFieldProps: {
            value: cultureInformation.pflanzendichteReihenabstand,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               pflanzendichteReihenabstand: parseFloat(event.target.value)
            })
        }
    }

    const pflanzendichteProps: SelectShowConditionalRadioInputProps = {
        title: "Pflanzdichte",
        label: "Geben Sie entweder die Anzahl der Pflanzen pro Quadratmeter ein, oder den Pflanzabstand in der Reihe, sowie den Reihenabstand:",
        radioGroupProps: {
            value: cultureInformation.pflanzendichte,
            onChange: event => setCultureInformation({
                ...cultureInformation,
                pflanzendichte: parseFloat(event.target.value)
            })
        },
        radioButtonValues: [{id: 1, values:"Pflanzen pro Quadratmeter"},{id:2, values:"Pflanzenabstand in der Reihe +  Reihenabstand"}],
        showFirstChildren: value => value==1,
        firstChildren:
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...pflanzendichteAnzProm2Props}/>
            </Grid>
        ,
        secondChildren:
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...pflanzendichteReihePflanzenabstandProps}/>
                <MeasureInputField {...pflanzendichteReihenAbstandProps}/>
            </Grid>
    }

    const ertragProps: MeasureInputProps = {
        title: "Ertrag pro Jahr",
        label: "Wie groß ist der Ertrag pro Jahr?",
        textFieldProps: {
            value: cultureInformation.ertrag,
            onChange: event => setCultureInformation({
                ...cultureInformation,
               ertrag: parseFloat(event.target.value)
            })
        }
    }





    return(

        <Grid container xs={12} spacing={8}>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...fruchtgewichtProps}/>
                <MeasureInputField  {...kulturflaecheProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...kulturBeginnProps}/>
                <MeasureInputField {...kulturEndeProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...nebenkulturProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...nebenkulturDauerProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectShowConditionalRadioInputField {...pflanzendichteProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...ertragProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...props.paginationProps} />
                </Grid>
            </Grid>
        </Grid>


    )

}
export default connector(CultureInformationInput)
