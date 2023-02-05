import React, {useState} from "react";
import {
    DateInputField,
    DateInputProps,
    DateValue,
    MeasureInputField,
    MeasureInputProps,
    MeasureValue,
    SelectionInputField,
    SelectionInputProps,
    ConditionalSelectionInputProps,
    SelectionValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps,
    ConditionalSelectionInputField,
    DynamicInputField, DynamicInputProps
} from "../../../utils/input/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../../store";
import {connect, ConnectedProps} from "react-redux";
import {Divider, Paper, TextField, Typography} from "@mui/material";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../../utils/input/InputPaginationButtons";
import {SectionDivider} from "../../../utils/input/layout";
import {parseToFloat} from "../../../../helpers/InputHelpers";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues,
    submissionSuccess: state.submission.successful
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CompanyInformationProps = ReduxProps & SubpageProps & {
    provideCompanyInformation: Function
    showMeasureInputError: Function
    showDateInputError: Function
    showSelectInputError: Function
    values: CompanyInformationState
}

export type CompanyInformationState = {
    gewaechshausName: string | null
    datum: Date | null
    land: number | null
    region: number | null
    gwhFlaeche: MeasureValue | null
    nutzflaeche: MeasureValue | null
    gwhArt: number | null
    gwhAlter: DateValue | null
    bedachungsmaterial: number | null
    bedachungsmaterialAlter: DateValue | null
    stehwandmaterial: number | null
    stehwandmaterialAlter: DateValue | null
    energieschirm: number | null
    energieschirmTyp: number | null
    energieschirmAlter: DateValue | null
    stehwandhoehe: MeasureValue
    laenge: MeasureValue | null
    breite: MeasureValue | null
    kappenbreite: MeasureValue | null
    scheibenlaenge: MeasureValue | null
    reihenabstand: MeasureValue | null
    vorwegbreite: MeasureValue | null
    bodenabdeckung: SelectionValue[]
    produktionsweise: number | null
    produktionssystem: number | null
    produktionssystemAlter: DateValue | null
    heizsystem: number | null
    heizsystemAlter: DateValue | null
    bewaesserArt: number | null,
    zusaetzlichesHeizsystem: number | null
    zusaetzlichesHeizsystemTyp: number | null
    zusaetzlichesHeizsystemAlter: DateValue | null
}

const CompanyInformationInput = ({values, provideCompanyInformation, paginationProps, lookupValues, submissionSuccess, unitValues, showDateInputError, showSelectInputError, showMeasureInputError}: CompanyInformationProps) => {
    const [companyInformation, setCompanyInformation] = useState<CompanyInformationState>(values)

    const setCompanyInformationState = (companyInformation: CompanyInformationState) => {
        setCompanyInformation(companyInformation)
        provideCompanyInformation(companyInformation)
    }


    const datumProps: DateInputProps = {
        title: "Datensatzzeitraum",
        label: "Auf welchen Zeitraum beziehen sich die Daten?",
        showError: (submissionSuccess!=null? !submissionSuccess && companyInformation.datum == null: false),
        datePickerProps: {
            value: companyInformation.datum,
            views: ['year'],
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                datum: event
            }),
            renderInput: () => <TextField/>
        }
    }

    const landProps: ConditionalSelectionInputProps = {
        title: "Land",
        label: "In welchem Land steht das Gewächshaus?",
        selectProps: {
            value: companyInformation.land,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                land: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues.Land,
            error: showSelectInputError(companyInformation?.land)
        },
        showChildren: value => {
            let trueOption = lookupValues.Land.filter(option => option.values.toUpperCase() == "GERMANY");
            return trueOption.length > 0 && trueOption[0].id == value
        }
    }


    const regionProps: SelectionInputProps = {
        title: "Bundesland",
        label: "In welchem Bundesland steht das Gewächshaus?",
        selectProps: {
            value: companyInformation.region,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                region: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues.Region,
            error: showSelectInputError(companyInformation?.region)
        }
    }

    const produktionsweiseProps: SelectionInputProps = {
        title: "Produktionsweise",
        label: "Auf welche Weise produzieren Sie?",
        selectProps: {
            value: companyInformation.produktionsweise,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionsweise: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues.Produktionstyp,
            error: showSelectInputError(companyInformation?.produktionsweise)
        }
    }

    const gwhflaecheProps: MeasureInputProps = {
        title: "Gewächshausfläche",
        label: "Gesamtfläche des zu berechnenden Hauses",
        unitName: unitValues.measures.GWHFlaeche[0]?.values,
        textFieldProps: {
            value: companyInformation.gwhFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhFlaeche: {value: parseToFloat(event.target.value),unit:unitValues.measures.GWHFlaeche[0].id}
            }),
            error: showMeasureInputError(companyInformation?.gwhFlaeche)
        }
    }

    const nutzflaecheProps: MeasureInputProps = {
        title: "Nutzfläche",
        label: "Effektiv genutzte/bestellte Fläche des Hauses",
        unitName: unitValues.measures.Nutzflaeche[0]?.values,
        textFieldProps: {
            value: companyInformation.nutzflaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                nutzflaeche: {value: parseToFloat(event.target.value),unit:unitValues.measures.Nutzflaeche[0].id}
            }),
            error: showMeasureInputError(companyInformation?.nutzflaeche)
        }
    }

    const gwhArtProps: SelectionInputProps = {
        title: "Bauart",
        label: "Typ der GWH-Bauart",
        selectProps: {
            lookupValues: lookupValues.GWHArt,
            value: companyInformation.gwhArt,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhArt: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.gwhArt)
        },
    }

    const gwhAlterProps: DateInputProps = {
        title: "Baujahr",
        label: "In welchem Jahr wurde das Gewächhaus gebaut?",
        showError: showDateInputError(companyInformation?.gwhAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.gwhAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhAlter: {value:event,unit:unitValues.measures.GWHAlter[0].id}
            }),
            renderInput: () => <TextField />,
        }
    }

    const bedachungsmaterialProps: SelectionInputProps = {
        title: "Bedachungsmaterial",
        label: "Aus welchem Material besteht die Bedachung?",
        selectProps: {
            lookupValues: lookupValues.Bedachungsmaterial,
            value: companyInformation.bedachungsmaterial,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                bedachungsmaterial: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.bedachungsmaterial)
        }
    }

    const bedachungsmaterialAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Bedachung",
        label: "Eindeckungsjahr des momentanen Bedachungsmaterials",
        showError: showDateInputError(companyInformation?.bedachungsmaterialAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.bedachungsmaterialAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                bedachungsmaterialAlter: {value:event,unit:unitValues.measures.AlterBedachungsmaterial[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const stehwandmaterialProps: SelectionInputProps = {
        title: "Stehwandmaterial",
        label: "Aus welchem Material bestehen die Stehwände?",
        selectProps: {
            lookupValues: lookupValues.Stehwandmaterial,
            value: companyInformation.stehwandmaterial,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandmaterial: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.stehwandmaterial)
        }
    }

    const stehwandmaterialAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Stehwand",
        label: "In welchem Jahr wurde das momentane Stehwandmaterial angebracht?",
        showError: showDateInputError(companyInformation?.stehwandmaterialAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.stehwandmaterialAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandmaterialAlter: {value:event,unit:unitValues.measures.AlterStehwandmaterial[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const stehwandhoeheProps: MeasureInputProps = {
        title: "Stehwandhöhe",
        label: "Höhe der Stehwände ab Fundament",
        unitName: "Meter",
        textFieldProps: {
            value: companyInformation.stehwandhoehe?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandhoehe: {value:parseToFloat(event.target.value), unit: unitValues.measures.Stehwandhoehe[0].id}
            }),
            error: showMeasureInputError(companyInformation?.stehwandhoehe)
        }
    }

    const laengeProps: MeasureInputProps = {
        title: "Länge",
        label: "Wie lang ist das Gewächshaus?",
        unitName: unitValues.measures.Laenge[0]?.values,
        textFieldProps: {
            value: companyInformation.laenge?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                laenge: {value:parseToFloat(event.target.value),unit:unitValues.measures.Laenge[0].id}
            }),
            error: showMeasureInputError(companyInformation?.laenge)
        }
    }

    const breiteProps: MeasureInputProps = {
        title: "Breite",
        label: "Wie breit ist das Gewächshaus?",
        unitName: unitValues.measures.Breite[0]?.values,
        textFieldProps: {
            value: companyInformation.breite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                breite: {value:parseToFloat(event.target.value),unit:unitValues.measures.Breite[0].id}
            }),
            error: showMeasureInputError(companyInformation?.breite)
        }
    }

    const kappenbreiteProps: MeasureInputProps = {
        title: "Kappenbreite",
        label: "Wie viele Meter beträgt die Kappenbreite?",
        unitName: unitValues.measures.Kappenbreite[0]?.values,
        textFieldProps: {
            value: companyInformation.kappenbreite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                kappenbreite: {value:parseToFloat(event.target.value),unit:unitValues.measures.Kappenbreite[0].id}
            }),
            error: showMeasureInputError(companyInformation?.kappenbreite)
        }
    }

    const scheibenlaengeProps: MeasureInputProps = {
        title: "Scheibenlänge",
        label: "Wie lang sind die Scheiben der Bedachung?",
        unitName: unitValues.measures.Scheibenlaenge[0]?.values,
        textFieldProps: {
            value: companyInformation.scheibenlaenge?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                scheibenlaenge: {value:parseToFloat(event.target.value),unit:unitValues.measures.Scheibenlaenge[0].id}
            }),
            error: showMeasureInputError(companyInformation?.scheibenlaenge)
        }
    }

    const reihenabstandProps: MeasureInputProps = {
        title: "Reihenabstand",
        label: "Wie groß ist der Abstand zwischen den Kulturreihen? (Reihenmitte zu Reihenmitte)",
         unitName: unitValues.measures["Reihenabstand(Rinnenabstand)"][0]?.values,
        textFieldProps: {
            value: companyInformation.reihenabstand?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                reihenabstand: {value:parseToFloat(event.target.value),unit:unitValues.measures["Reihenabstand(Rinnenabstand)"][0].id}
            }),
            error: showMeasureInputError(companyInformation?.reihenabstand)
        }
    }

    const vorwegbreiteProps: MeasureInputProps = {
        title: "Vorwegbreite",
        label: "Wie breit ist der Vorweg?",
        unitName: unitValues.measures.Vorwegbreite[0]?.values,
        textFieldProps: {
            value: companyInformation.vorwegbreite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                vorwegbreite: {value:parseToFloat(event.target.value),unit:unitValues.measures.Vorwegbreite[0].id}
            }),
            error: showMeasureInputError(companyInformation?.vorwegbreite)
        }
    }

    const bodenabdeckungProps: DynamicInputProps = {
        title: "Bodenabdeckung",
        label: "Welche Bodenabdeckungen werden verwendet? Wie lang ist die erwartete Nutzungsdauer?",
        optional: true,
        submissionSuccess: submissionSuccess,
        unitProps: {
            unitName: unitValues.selections.Bodenabdeckung.Beton[0]?.values,
            unitValues:  unitValues,
            optionGroup: "Bodenabdeckung"
        },
        textFieldProps: {label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: lookupValues.Bodenabdeckung
        },
        onValueChange: values => setCompanyInformationState({
            ...companyInformation,
            bodenabdeckung: values.map(value => {
                return {
                    selectValue: value.selectValue,
                    textFieldValue:value.textFieldValue,
                    textField2Value:value.textField2Value
                }
            })
        }),
        initValues: values.bodenabdeckung
    }

    const energieschirmProps: SingleShowConditionalRadioInputProps = {
        title: "Wärmedämmschirm / Schattierung",
        label: "Verwenden Sie einen entsprechenden Schirm?",
        radioGroupProps: {
            value: companyInformation.energieschirm,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirm: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Energieschirm,
        showChildren: value => {
            let trueOptions = lookupValues.Energieschirm.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const energieschirmTypProps: SelectionInputProps = {
        title: "Schirmbauart",
        label: "Welche Art von Schirm/Schirmen wird verwendet?",
        selectProps: {
            lookupValues: lookupValues.EnergieschirmTyp,
            value: companyInformation.energieschirmTyp,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirmTyp: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.energieschirmTyp)
        }
    }

    const energieschirmAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Schirm",
        label: "In welchem Jahr wurde der momentane Schirm angebracht?",
        showError: showDateInputError(companyInformation?.energieschirmAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.energieschirmAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirmAlter: {value:event,unit:unitValues.measures.AlterEnergieschirm[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }


    const produktionssystemProps: ConditionalSelectionInputProps = {
        title: "Produktionssystem",
        label: "Welches System wird zur Kultivierung verwendet?",
        selectProps: {
            value: companyInformation.produktionssystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionssystem: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues.Produktionssystem,
            error: showSelectInputError(companyInformation?.produktionssystem)
        },
        showChildren: value => {
            let wrongOption = lookupValues.Produktionssystem.filter(option => option.values.toUpperCase() == "BODEN");
            return wrongOption.length > 0 && wrongOption[0].id != value
        }
    }

    const produktionssystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Produktionssystem",
        label: "Wann wurde das momentane System installiert? (Bei Produktion im Boden nicht zutreffend)",
        showError: showDateInputError(companyInformation?.produktionssystemAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.produktionssystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionssystemAlter: {value:event,unit:unitValues.measures.AlterProduktionssystem[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const bewaesserArtProps: SelectionInputProps = {
        title: "Bewässerungssystem",
        label: "Welches Bewässerungssystem wird verwendet?",
        selectProps: {
            value: companyInformation.bewaesserArt,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                bewaesserArt: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues.Bewaesserungsart,
            error: showSelectInputError(companyInformation?.bewaesserArt)
        }
    }
    
    const heizsystemProps: ConditionalSelectionInputProps = {
        title: "Hauptsystem zur Wärmeverteilung",
        label: "Welches System nutzen Sie primär zur Wärmeverteilung?",
        selectProps: {
            lookupValues: lookupValues.Heizsystem,
            value: companyInformation.heizsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                heizsystem: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.heizsystem)
        },
        showChildren: value => {
            let wrongOption = lookupValues.Heizsystem.filter(option => option.values.toUpperCase() == "KEINES");
            return wrongOption.length > 0 && wrongOption[0].id != value
        }

    }

    const heizsystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Heizsystem",
        label: "Wann wurde das momentane System installiert?",
        showError: showDateInputError(companyInformation?.heizsystemAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.heizsystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                heizsystemAlter: {value:event,unit:unitValues.measures.AlterHeizsystem[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const zusaetzlichesHeizsystemProps: SingleShowConditionalRadioInputProps = {
        title: "Sekundäres System zur Wärmeverteilung",
        label: "Verwenden Sie ein weiteres Heizsystem neben dem Hauptsystem?",
        radioGroupProps: {
            value: companyInformation.zusaetzlichesHeizsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystem: parseToFloat(event.target.value)
            }),
        },
        radioButtonValues: lookupValues.ZusaetzlichesHeizsystem,
        showChildren: value => {
            let trueOptions = lookupValues.ZusaetzlichesHeizsystem.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const zusaetzlichesHeizsystemTypProps: SelectionInputProps = {
        title: "Typ",
        label: "Welches zusätzliche System verwenden Sie?",
        selectProps: {
            lookupValues: lookupValues.ZusaetzlichesHeizsystemTyp,
            value: companyInformation.zusaetzlichesHeizsystemTyp,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystemTyp: parseToFloat(event.target.value)
            }),
            error: showSelectInputError(companyInformation?.zusaetzlichesHeizsystemTyp)
        },
    }

    const zusaetzlichesHeizsystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr sekundäres Heizsystem",
        label: "Wann wurde das momentane System installiert?",
        showError: showDateInputError(companyInformation?.zusaetzlichesHeizsystemAlter),
        datePickerProps: {
            views: ['year'],
            value: companyInformation.zusaetzlichesHeizsystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystemAlter: {value:event,unit:unitValues.measures.AlterZusaetzlichesHeizsystem[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    return (
        <Grid container xs={12} spacing={8}>
            <Grid container item xs={12} sx={{marginTop:5}}>
                <Paper sx={{p:2}}>
                    Im Folgenden können Sie die Daten für Ihre Tomatenkultur eingeben. Bei der Dateneingabe ist es wichtig, dass Sie sich auf die Daten eines spezifischen Gewächshauses, oder Gewächshausabteils beziehen. Somit werden Ungenauigkeiten bei der Berechnung der CO2- und H2O-Footprints vermieden.
                </Paper>
            </Grid>
            <SectionDivider title="Allgemeine Daten"/>
            <Grid item container xs={12}  spacing={4}>
                <DateInputField {...datumProps} />
            </Grid>
            <Grid item container xs={12}  spacing={4}>
                <SelectionInputField {...produktionsweiseProps} />
            </Grid>
            <ConditionalSelectionInputField {...landProps}>
                <SelectionInputField {...regionProps}/>
            </ConditionalSelectionInputField>
            <SectionDivider title="Gewächshauskonstruktion"/>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...gwhflaecheProps} />
                <MeasureInputField {...nutzflaecheProps} />
            </Grid>
            <Grid item container xs={12}  spacing={4}>
                <SelectionInputField {...gwhArtProps} />
                <DateInputField {...gwhAlterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...bedachungsmaterialProps} />
                <DateInputField {...bedachungsmaterialAlterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...stehwandmaterialProps} />
                <DateInputField {...stehwandmaterialAlterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...stehwandhoeheProps} />
                <MeasureInputField {...laengeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...breiteProps} />
                <MeasureInputField {...kappenbreiteProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...scheibenlaengeProps} />
                <MeasureInputField {...reihenabstandProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...vorwegbreiteProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...bodenabdeckungProps} />
            </Grid>
            <SectionDivider title="Ausstattungskomponenten"/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...energieschirmProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SelectionInputField {...energieschirmTypProps} />
                        <DateInputField {...energieschirmAlterProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <ConditionalSelectionInputField {...produktionssystemProps}>
                <DateInputField {...produktionssystemAlterProps}/>
            </ConditionalSelectionInputField>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...bewaesserArtProps} />
            </Grid>
            <ConditionalSelectionInputField {...heizsystemProps}>
                <DateInputField {...heizsystemAlterProps}/>
            </ConditionalSelectionInputField>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...zusaetzlichesHeizsystemProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SelectionInputField {...zusaetzlichesHeizsystemTypProps} />
                        <DateInputField {...zusaetzlichesHeizsystemAlterProps} />
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
export default connector(CompanyInformationInput)
