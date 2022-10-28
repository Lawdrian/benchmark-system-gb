import React, {useState} from "react";
import {
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/inputPage/InputFields";
import Grid from "@mui/material/Grid";
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

type CultureInformationProps = ReduxProps & SubpageProps & {
    provideCultureInformation: Function
    values: CultureInformationState
}

export type CultureInformationState = {
    snack: number | null
    snackReihenanzahl: MeasureValue | null
    snackPflanzenabstand: MeasureValue | null
    snackTriebzahl: MeasureValue | null
    snackErtragJahr: MeasureValue | null
    cocktail: number | null
    cocktailReihenanzahl: MeasureValue | null
    cocktailPflanzenabstand: MeasureValue | null
    cocktailTriebzahl: MeasureValue | null
    cocktailErtragJahr: MeasureValue | null
    rispen: number | null
    rispenReihenanzahl: MeasureValue | null
    rispenPflanzenabstand: MeasureValue | null
    rispenTriebzahl: MeasureValue | null
    rispenErtragJahr: MeasureValue | null
    fleisch: number | null
    fleischReihenanzahl: MeasureValue | null
    fleischPflanzenabstand: MeasureValue | null
    fleischTriebzahl: MeasureValue | null
    fleischErtragJahr: MeasureValue | null
    kulturflaeche: MeasureValue | null
    kulturBeginn: MeasureValue | null
    kulturEnde: MeasureValue | null
    nebenkultur: number | null
    nebenkulturBeginn: MeasureValue | null
    nebenkulturEnde: MeasureValue | null
}

const CultureInformationInput = (props: CultureInformationProps) => {
    const [cultureInformation, setCultureInformation] = useState<CultureInformationState>(props.values)

    const setCultureInformationState = (cultureInformation: CultureInformationState) => {
        setCultureInformation(cultureInformation)
        props.provideCultureInformation(cultureInformation)
    }

    //Fruchtgröße: Snack
    const snackProps: SingleShowConditionalRadioInputProps = {
        title: "10 bis 30 Gramm (Snack)",
        label: "Bauen Sie Tomaten der Größe 10 bis 30 Gramm (Snack) in Ihrem Gewächshaus an?",
        radioGroupProps: {
            value: cultureInformation.snack,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snack: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues["10-30Gramm(Snack)"],
        showChildren: value => {
            let trueOptions = props.lookupValues["10-30Gramm(Snack)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const snackReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: props.unitValues.measures.SnackReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackReihenanzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.SnackReihenanzahl[0].id}
            })
        }
    }

    const snackPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand zwischen den Pflanzen innerhalb einer Reihe?",
        unitName: props.unitValues.measures.SnackPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackPflanzenabstand: {value:parseFloat(event.target.value),unit:props.unitValues.measures.SnackPflanzenabstandInDerReihe[0].id}
            })
        }
    }

    const snackTriebzahlProps: MeasureInputProps = {
        title: "Triebzahl",
        label: "Wie viele Triebe hat eine Pflanze am Kulturende?",
        unitName: props.unitValues.measures.SnackTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackTriebzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.SnackTriebzahl[0].id}
            })
        }
    }

    const snackErtragJahrProps: MeasureInputProps = {
        title: "Ertrag pro Jahr",
        label: "Wie viel Ertrag erziehlen Sie mit dieser Fruchtgröße pro Jahr?",
        unitName: props.unitValues.measures.SnackErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackErtragJahr: {value:parseFloat(event.target.value),unit:props.unitValues.measures.SnackErtragJahr[0].id}
            })
        }
    }

    //Fruchtgröße: Cocktail
    const cocktailProps: SingleShowConditionalRadioInputProps = {
        title: "30 bis 100 Gramm (Cocktail)",
        label: "Bauen Sie Tomaten der Größe 30 birispen Gramm (Cocktail) in Ihrem Gewächshaus an?",
        radioGroupProps: {
            value: cultureInformation.cocktail,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktail: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues["30-100Gramm(Cocktail)"],
        showChildren: value => {
            let trueOptions = props.lookupValues["30-100Gramm(Cocktail)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const cocktailReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: props.unitValues.measures.CocktailReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailReihenanzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.CocktailReihenanzahl[0].id}
            })
        }
    }

    const cocktailPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand zwischen den Pflanzen innerhalb einer Reihe?",
        unitName: props.unitValues.measures.CocktailPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailPflanzenabstand: {value:parseFloat(event.target.value),unit:props.unitValues.measures.CocktailPflanzenabstandInDerReihe[0].id}
            })
        }
    }

    const cocktailTriebzahlProps: MeasureInputProps = {
        title: "Triebzahl",
        label: "Wie viele Triebe hat eine Pflanze am Kulturende?",
        unitName: props.unitValues.measures.CocktailTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailTriebzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.CocktailTriebzahl[0].id}
            })
        }
    }

    const cocktailErtragJahrProps: MeasureInputProps = {
        title: "Ertrag pro Jahr",
        label: "Wie viel Ertrag erziehlen Sie mit dieser Fruchtgröße pro Jahr?",
        unitName: props.unitValues.measures.CocktailErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailErtragJahr: {value:parseFloat(event.target.value),unit:props.unitValues.measures.CocktailErtragJahr[0].id}
            })
        }
    }
    //Fruchtgröße: Rispen
    const rispenProps: SingleShowConditionalRadioInputProps = {
        title: "100 bis 150 Gramm (Rispen)",
        label: "Bauen Sie Tomaten der Größe 100 bis 150 Gramm (Rispen) in Ihrem Gewächshaus an?",
        radioGroupProps: {
            value: cultureInformation.rispen,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispen: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues["100-150Gramm(Rispen)"],
        showChildren: value => {
            let trueOptions = props.lookupValues["100-150Gramm(Rispen)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const rispenReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: props.unitValues.measures.RispenReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenReihenanzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.RispenReihenanzahl[0].id}
            })
        }
    }

    const rispenPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand zwischen den Pflanzen innerhalb einer Reihe?",
        unitName: props.unitValues.measures.RispenPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenPflanzenabstand: {value:parseFloat(event.target.value),unit:props.unitValues.measures.RispenPflanzenabstandInDerReihe[0].id}
            })
        }
    }

    const rispenTriebzahlProps: MeasureInputProps = {
        title: "Triebzahl",
        label: "Wie viele Triebe hat eine Pflanze am Kulturende?",
        unitName: props.unitValues.measures.RispenTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenTriebzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.RispenTriebzahl[0].id}
            })
        }
    }

    const rispenErtragJahrProps: MeasureInputProps = {
        title: "Ertrag pro Jahr",
        label: "Wie viel Ertrag erziehlen Sie mit dieser Fruchtgröße pro Jahr?",
        unitName: props.unitValues.measures.RispenErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenErtragJahr: {value:parseFloat(event.target.value),unit:props.unitValues.measures.RispenErtragJahr[0].id}
            })
        }
    }

    //Fruchtgröße: Flfleisch
    const fleischProps: SingleShowConditionalRadioInputProps = {
        title: ">150 Gramm (Fleisch)",
        label: "Bauen Sie Tomaten der Größe >150 Gramm (Fleisch) in Ihrem Gewächshaus an?",
        radioGroupProps: {
            value: cultureInformation.fleisch,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleisch: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues[">150Gramm(Fleisch)"],
        showChildren: value => {
            let trueOptions = props.lookupValues[">150Gramm(Fleisch)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const fleischReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: props.unitValues.measures.FleischReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischReihenanzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FleischReihenanzahl[0].id}
            })
        }
    }

    const fleischPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand zwischen den Pflanzen innerhalb einer Reihe?",
        unitName: props.unitValues.measures.FleischPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischPflanzenabstand: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FleischPflanzenabstandInDerReihe[0].id}
            })
        }
    }

    const fleischTriebzahlProps: MeasureInputProps = {
        title: "Triebzahl",
        label: "Wie viele Triebe hat eine Pflanze am Kulturende?",
        unitName: props.unitValues.measures.FleischTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischTriebzahl: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FleischTriebzahl[0].id}
            })
        }
    }

    const fleischErtragJahrProps: MeasureInputProps = {
        title: "Ertrag pro Jahr",
        label: "Wie viel Ertrag erziehlen Sie mit dieser Fruchtgröße pro Jahr?",
        unitName: props.unitValues.measures.FleischErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischErtragJahr: {value:parseFloat(event.target.value),unit:props.unitValues.measures.FleischErtragJahr[0].id}
            })
        }
    }



    const kulturflaecheProps: MeasureInputProps = {
        title: "Kulturfläche",
        label: "Auf welcher Fläche wird die genante Fruchtgröße in dem Gewächshaus kultiviert?",
        unitName: props.unitValues.measures.Kulturflaeche[0]?.values,
        textFieldProps: {
            value: cultureInformation.kulturflaeche?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                kulturflaeche: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Kulturflaeche[0].id}
            })
        }
    }

    const kulturBeginnProps: MeasureInputProps = {
        title: "Kultur Beginn",
        label: "In welcher Kalenderwoche ist der Kulturbeginn (aufstellen der Jungpflanzen)",
        unitName: props.unitValues.measures.KulturBeginn[0]?.values,
        textFieldProps: {
            value: cultureInformation.kulturBeginn?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               kulturBeginn: {value:parseFloat(event.target.value),unit:props.unitValues.measures.KulturBeginn[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.kulturBeginn?.value ? (
                cultureInformation.kulturBeginn?.value > 52 ||
                cultureInformation.kulturBeginn?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: cultureInformation.kulturBeginn?.value ? (
                cultureInformation.kulturBeginn?.value > 52 ||
                cultureInformation.kulturBeginn?.value < 1
            ) : false
        }
    }

    const kulturEndeProps: MeasureInputProps = {
        title: "Kultur Ende",
        label: "In welcher Kalenderwoche wird zuletzt geerntet?",
                unitName: props.unitValues.measures.KulturEnde[0]?.values,
        textFieldProps: {
            value: cultureInformation.kulturEnde?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               kulturEnde: {value:parseFloat(event.target.value),unit:props.unitValues.measures.KulturEnde[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.kulturEnde?.value ? (
                cultureInformation.kulturEnde?.value > 52 ||
                cultureInformation.kulturEnde?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: cultureInformation.kulturEnde?.value ? (
                cultureInformation.kulturEnde?.value > 52 ||
                cultureInformation.kulturEnde?.value < 1
            ) : false
        }
    }

    const nebenkulturProps: SingleShowConditionalRadioInputProps = {
        title: "Nebenkultur",
        label: "Findet im selben Kulturjahr noch eine andere Nutzung des GWH außerhalb der gennanten Kulturdauer statt?",
        radioGroupProps: {
            value: cultureInformation.nebenkultur,
            onChange: event => setCultureInformationState({
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

    const nebenkulturBeginnProps: MeasureInputProps = {
        title: "Nebenkulturbeginn",
        label: "In welcher Kalenderwoche ist der Nebenkulturbeginn (aufstellen der Jungpflanzen)?",
        unitName: props.unitValues.measures.NebenkulturBeginn[0]?.values,
        textFieldProps: {
            value: cultureInformation.nebenkulturBeginn?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               nebenkulturBeginn: {value:parseFloat(event.target.value),unit:props.unitValues.measures.NebenkulturBeginn[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.nebenkulturBeginn?.value ? (
                cultureInformation.nebenkulturBeginn?.value > 52 ||
                cultureInformation.nebenkulturBeginn?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: cultureInformation.nebenkulturBeginn?.value ? (
                cultureInformation.nebenkulturBeginn?.value > 52 ||
                cultureInformation.nebenkulturBeginn?.value < 1
            ) : false
        }
    }

    const nebenkulturEndeProps: MeasureInputProps = {
        title: "Nebenkulturende",
        label: "In welcher Kalenderwoche wird zuletzt geerntet?",
        unitName: props.unitValues.measures.NebenkulturEnde[0]?.values,
        textFieldProps: {
            value: cultureInformation.nebenkulturEnde?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               nebenkulturEnde: {value:parseFloat(event.target.value),unit:props.unitValues.measures.NebenkulturEnde[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.nebenkulturEnde?.value ? (
                cultureInformation.nebenkulturEnde?.value > 52 ||
                cultureInformation.nebenkulturEnde?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: cultureInformation.nebenkulturEnde?.value ? (
                cultureInformation.nebenkulturEnde?.value > 52 ||
                cultureInformation.nebenkulturEnde?.value < 1
            ) : false
        }
    }

    return(
        <Grid container xs={12} spacing={8}>
            <SectionDivider title="Fruchtgröße"/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...snackProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...snackReihenanzahlProps}/>
                        <MeasureInputField {...snackPflanzenabstandProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...snackTriebzahlProps}/>
                        <MeasureInputField {...snackErtragJahrProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...cocktailProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...cocktailReihenanzahlProps}/>
                        <MeasureInputField {...cocktailPflanzenabstandProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...cocktailTriebzahlProps}/>
                        <MeasureInputField {...cocktailErtragJahrProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...rispenProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...rispenReihenanzahlProps}/>
                        <MeasureInputField {...rispenPflanzenabstandProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...rispenTriebzahlProps}/>
                        <MeasureInputField {...rispenErtragJahrProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...fleischProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...fleischReihenanzahlProps}/>
                        <MeasureInputField {...fleischPflanzenabstandProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...fleischTriebzahlProps}/>
                        <MeasureInputField {...fleischErtragJahrProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <SectionDivider title=""/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField  {...kulturflaecheProps}/>
                <MeasureInputField {...kulturBeginnProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...kulturEndeProps}/>
                <SingleShowConditionalRadioInputField {...nebenkulturProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...nebenkulturBeginnProps}/>
                        <MeasureInputField {...nebenkulturEndeProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
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
