import React, {useState} from "react";
import {
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../../utils/input/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../../utils/input/InputPaginationButtons";
import {SectionDivider} from "../../../utils/input/layout";
import {parseToFloat} from "../../../../helpers/InputHelpers";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CultureInformationProps = ReduxProps & SubpageProps & {
    provideCultureInformation: Function
    showMeasureInputError: Function
    showSelectInputError: Function
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
    kulturBeginn: MeasureValue | null
    kulturEnde: MeasureValue | null
    nebenkultur: number | null
    nebenkulturBeginn: MeasureValue | null
    nebenkulturEnde: MeasureValue | null
}

const CultureInformationInput = ({values, provideCultureInformation, paginationProps, lookupValues, unitValues, showSelectInputError, showMeasureInputError}: CultureInformationProps) => {
    const [cultureInformation, setCultureInformation] = useState<CultureInformationState>(values)

    const setCultureInformationState = (cultureInformation: CultureInformationState) => {
        setCultureInformation(cultureInformation)
        provideCultureInformation(cultureInformation)
    }

    //Fruchtgröße: Snack
    const snackProps: SingleShowConditionalRadioInputProps = {
        title: "10 bis 30 Gramm (Snack)",
        label: "Kultivieren Sie Tomaten dieser Größe in dem zu berechnenden Haus?",
        radioGroupProps: {
            value: cultureInformation.snack,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snack: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues["10-30Gramm(Snack)"],
        showChildren: value => {
            let trueOptions = lookupValues["10-30Gramm(Snack)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const snackReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: unitValues.measures.SnackReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackReihenanzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.SnackReihenanzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.snackReihenanzahl)
        }
    }

    const snackPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand von Pflanze zu Pflanze innerhalb einer Reihe?",
        unitName: unitValues.measures.SnackPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackPflanzenabstand: {value:parseToFloat(event.target.value),unit:unitValues.measures.SnackPflanzenabstandInDerReihe[0].id}
            }),
            error: showMeasureInputError(cultureInformation.snackPflanzenabstand)
        }
    }

    const snackTriebzahlProps: MeasureInputProps = {
        title: "Triebanzahl pro Pflanze",
        label: "Wie viele Triebe hat eine Pflanze zu Kulturende?",
        unitName: unitValues.measures.SnackTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackTriebzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.SnackTriebzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.snackTriebzahl)
        }
    }

    const snackErtragJahrProps: MeasureInputProps = {
        title: "Jahresertrag",
        label: "Wie hoch ist der Ertrag der Sorte in dem zu berechnenden Kulturjahr?",
        unitName: unitValues.measures.SnackErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.snackErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                snackErtragJahr: {value:parseToFloat(event.target.value),unit:unitValues.measures.SnackErtragJahr[0].id}
            }),
            error: showMeasureInputError(cultureInformation.snackErtragJahr)
        }
    }

    //Fruchtgröße: Cocktail
    const cocktailProps: SingleShowConditionalRadioInputProps = {
        title: "30 bis 100 Gramm (Cocktail)",
        label: "Kultivieren Sie Tomaten dieser Größe in dem zu berechnenden Haus?",
        radioGroupProps: {
            value: cultureInformation.cocktail,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktail: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues["30-100Gramm(Cocktail)"],
        showChildren: value => {
            let trueOptions = lookupValues["30-100Gramm(Cocktail)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const cocktailReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: unitValues.measures.CocktailReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailReihenanzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.CocktailReihenanzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.cocktailReihenanzahl)
        }
    }

    const cocktailPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand von Pflanze zu Pflanze innerhalb einer Reihe?",
        unitName: unitValues.measures.CocktailPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailPflanzenabstand: {value:parseToFloat(event.target.value),unit:unitValues.measures.CocktailPflanzenabstandInDerReihe[0].id}
            }),
            error: showMeasureInputError(cultureInformation.cocktailPflanzenabstand)
        }
    }

    const cocktailTriebzahlProps: MeasureInputProps = {
        title: "Triebanzahl pro Pflanze",
        label: "Wie viele Triebe hat eine Pflanze zu Kulturende?",
        unitName: unitValues.measures.CocktailTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailTriebzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.CocktailTriebzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.cocktailTriebzahl)
        }
    }

    const cocktailErtragJahrProps: MeasureInputProps = {
        title: "Jahresertrag",
        label: "Wie hoch ist der Ertrag der Sorte in dem zu berechnenden Kulturjahr?",
        unitName: unitValues.measures.CocktailErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.cocktailErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                cocktailErtragJahr: {value:parseToFloat(event.target.value),unit:unitValues.measures.CocktailErtragJahr[0].id}
            }),
            error: showMeasureInputError(cultureInformation.cocktailErtragJahr)
        }
    }
    //Fruchtgröße: Rispen
    const rispenProps: SingleShowConditionalRadioInputProps = {
        title: "100 bis 150 Gramm (Rispen)",
        label: "Kultivieren Sie Tomaten dieser Größe in dem zu berechnenden Haus?",
        radioGroupProps: {
            value: cultureInformation.rispen,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispen: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues["100-150Gramm(Rispen)"],
        showChildren: value => {
            let trueOptions = lookupValues["100-150Gramm(Rispen)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const rispenReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: unitValues.measures.RispenReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenReihenanzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.RispenReihenanzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.rispenReihenanzahl)
        }
    }

    const rispenPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand von Pflanze zu Pflanze innerhalb einer Reihe?",
        unitName: unitValues.measures.RispenPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenPflanzenabstand: {value:parseToFloat(event.target.value),unit:unitValues.measures.RispenPflanzenabstandInDerReihe[0].id}
            }),
            error: showMeasureInputError(cultureInformation.rispenPflanzenabstand)
        }
    }

    const rispenTriebzahlProps: MeasureInputProps = {
        title: "Triebanzahl pro Pflanze",
        label: "Wie viele Triebe hat eine Pflanze zu Kulturende?",
        unitName: unitValues.measures.RispenTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenTriebzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.RispenTriebzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.rispenTriebzahl)
        }
    }

    const rispenErtragJahrProps: MeasureInputProps = {
        title: "Jahresertrag",
        label: "Wie hoch ist der Ertrag der Sorte in dem zu berechnenden Kulturjahr?",
        unitName: unitValues.measures.RispenErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.rispenErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                rispenErtragJahr: {value:parseToFloat(event.target.value),unit:unitValues.measures.RispenErtragJahr[0].id}
            }),
            error: showMeasureInputError(cultureInformation.rispenErtragJahr)
        }
    }

    //Fruchtgröße: Flfleisch
    const fleischProps: SingleShowConditionalRadioInputProps = {
        title: ">150 Gramm (Fleisch)",
        label: "Kultivieren Sie Tomaten dieser Größe in dem zu berechnenden Haus?",
        radioGroupProps: {
            value: cultureInformation.fleisch,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleisch: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues[">150Gramm(Fleisch)"],
        showChildren: value => {
            let trueOptions = lookupValues[">150Gramm(Fleisch)"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const fleischReihenanzahlProps: MeasureInputProps = {
        title: "Reihenanzahl",
        label: "Wie viele Reihen dieser Größe bauen Sie an?",
        unitName: unitValues.measures.FleischReihenanzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischReihenanzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischReihenanzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.FleischReihenanzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.fleischReihenanzahl)
        }
    }

    const fleischPflanzenabstandProps: MeasureInputProps = {
        title: "Pflanzenabstand in der Reihe",
        label: "Wie groß ist der Abstand von Pflanze zu Pflanze innerhalb einer Reihe?",
        unitName: unitValues.measures.FleischPflanzenabstandInDerReihe[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischPflanzenabstand?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischPflanzenabstand: {value:parseToFloat(event.target.value),unit:unitValues.measures.FleischPflanzenabstandInDerReihe[0].id}
            }),
            error: showMeasureInputError(cultureInformation.fleischPflanzenabstand)
        }
    }

    const fleischTriebzahlProps: MeasureInputProps = {
        title: "Triebanzahl pro Pflanze",
        label: "Wie viele Triebe hat eine Pflanze zu Kulturende?",
        unitName: unitValues.measures.FleischTriebzahl[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischTriebzahl?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischTriebzahl: {value:parseToFloat(event.target.value),unit:unitValues.measures.FleischTriebzahl[0].id}
            }),
            error: showMeasureInputError(cultureInformation.fleischTriebzahl)
        }
    }

    const fleischErtragJahrProps: MeasureInputProps = {
        title: "Jahresertrag",
        label: "Wie hoch ist der Ertrag der Sorte in dem zu berechnenden Kulturjahr?",
        unitName: unitValues.measures.FleischErtragJahr[0]?.values,
        textFieldProps: {
            value: cultureInformation.fleischErtragJahr?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                fleischErtragJahr: {value:parseToFloat(event.target.value),unit:unitValues.measures.FleischErtragJahr[0].id}
            }),
            error: showMeasureInputError(cultureInformation.fleischErtragJahr)
        }
    }


    const kulturBeginnProps: MeasureInputProps = {
        title: "Kulturbeginn",
        label: "In welcher Kalenderwoche werden die Jungpflanzen aufgestellt?",
        unitName: unitValues.measures.KulturBeginn[0]?.values,
        textFieldProps: {
            value: cultureInformation.kulturBeginn?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               kulturBeginn: {value:parseToFloat(event.target.value),unit:unitValues.measures.KulturBeginn[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.kulturBeginn?.value ? (
                cultureInformation.kulturBeginn?.value > 52 ||
                cultureInformation.kulturBeginn?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: showMeasureInputError(cultureInformation.kulturBeginn)
        }
    }

    const kulturEndeProps: MeasureInputProps = {
        title: "Kulturende",
        label: "In welcher Kalenderwoche wird zuletzt geerntet?",
                unitName: unitValues.measures.KulturEnde[0]?.values,
        textFieldProps: {
            value: cultureInformation.kulturEnde?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               kulturEnde: {value:parseToFloat(event.target.value),unit:unitValues.measures.KulturEnde[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.kulturEnde?.value ? (
                cultureInformation.kulturEnde?.value > 52 ||
                cultureInformation.kulturEnde?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: showMeasureInputError(cultureInformation.kulturEnde)
        }
    }

    const nebenkulturProps: SingleShowConditionalRadioInputProps = {
        title: "Nebenkultur",
        label: "Findet bis zur Folgetomatenkultur noch eine andere Nutzung des GWH statt?",
        radioGroupProps: {
            value: cultureInformation.nebenkultur,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
                nebenkultur: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Nebenkultur,
        showChildren: value => {
            let trueOptions = lookupValues.Nebenkultur.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const nebenkulturBeginnProps: MeasureInputProps = {
        title: "Nebenkulturbeginn",
        label: "In welcher Kalenderwoche beginnen Sie mit der Nebenkultur?",
        unitName: unitValues.measures.NebenkulturBeginn[0]?.values,
        textFieldProps: {
            value: cultureInformation.nebenkulturBeginn?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               nebenkulturBeginn: {value:parseToFloat(event.target.value),unit:unitValues.measures.NebenkulturBeginn[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.nebenkulturBeginn?.value ? (
                cultureInformation.nebenkulturBeginn?.value > 52 ||
                cultureInformation.nebenkulturBeginn?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: showMeasureInputError(cultureInformation.nebenkulturBeginn)
        }
    }

    const nebenkulturEndeProps: MeasureInputProps = {
        title: "Nebenkulturende",
        label: "In welcher Kalenderwoche wird zuletzt geerntet?",
        unitName: unitValues.measures.NebenkulturEnde[0]?.values,
        textFieldProps: {
            value: cultureInformation.nebenkulturEnde?.value,
            onChange: event => setCultureInformationState({
                ...cultureInformation,
               nebenkulturEnde: {value:parseToFloat(event.target.value),unit:unitValues.measures.NebenkulturEnde[0].id}
            }),
            inputProps: { min: 1, max: 52 },
            helperText: cultureInformation.nebenkulturEnde?.value ? (
                cultureInformation.nebenkulturEnde?.value > 52 ||
                cultureInformation.nebenkulturEnde?.value < 1) ? "Geben Sie eine valide Kalenderwoche an!": undefined : undefined,
            error: showMeasureInputError(cultureInformation.nebenkulturEnde)
        }
    }

    return(
        <Grid container xs={12} spacing={8}>
            <SectionDivider title="Fruchtgrößen"/>
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
            <SectionDivider title="Kulturdaten"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...kulturBeginnProps}/>
                <MeasureInputField {...kulturEndeProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...nebenkulturProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...nebenkulturBeginnProps}/>
                        <MeasureInputField {...nebenkulturEndeProps}/>
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
export default connector(CultureInformationInput)
