import React, {useState} from "react";
import {
    DateInputField,
    DateInputProps,
    DateValue,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps,
    MeasureValue,
    SelectionInputField,
    SelectionInputProps,
    SelectionRadioInputProps,
    ConditionalSelectionInputProps,
    SelectionValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps,
    ConditionalSelectionInputField,
    DynamicInputField
} from "../../utils/inputPage/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {Divider, Paper, TextField, Typography} from "@mui/material";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/inputPage/InputPaginationButtons";
import {SectionDivider} from "../../utils/inputPage/layout";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
  unitValues: state.lookup.unitValues
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CompanyInformationProps = ReduxProps & SubpageProps & {
    provideCompanyInformation: Function
    values: CompanyInformationState
}

export type CompanyInformationState = {
    gewaechshausName: string | null
    datum: Date | null
    plz: MeasureValue | null
    gwhFlaeche: MeasureValue | null
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

const CompanyInformationInput = (props: CompanyInformationProps) => {
    const [companyInformation, setCompanyInformation] = useState<CompanyInformationState>(props.values)

    const setCompanyInformationState = (companyInformation: CompanyInformationState) => {
        setCompanyInformation(companyInformation)
        props.provideCompanyInformation(companyInformation)
        console.log(companyInformation.produktionssystemAlter)
    }


    const datumProps: DateInputProps = {
        title: "Datensatzzeitraum",
        label: "Auf welchen Zeitraum beziehen sich die Daten?",
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

    const plzProps: MeasureInputProps = {
        title: "Postleitzahl",
        label: "Zur Bestimmung der regionalen Wasserverfügbarkeit",
        unitName: props.unitValues.measures.PLZ[0]?.values,
        textFieldProps: {
            placeholder: "Postleitzahl",
            value: companyInformation.plz?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                plz: {value: parseFloat(event.target.value),unit: props.unitValues.measures.PLZ[0].id}
            }),
            inputProps: { min: 11111, max: 99999 },
            helperText: companyInformation.plz?.value ? (
                companyInformation.plz?.value > 99999 ||
                companyInformation.plz?.value < 11111) ? "Geben Sie eine valide Postleitzahl an!": undefined : undefined,
            error: companyInformation.plz?.value ? (
                companyInformation.plz?.value > 99999 ||
                companyInformation.plz?.value < 11111
            ) : false
        }
    }

    const produktionsweiseProps: SelectionInputProps = {
        title: "Produktionsweise",
        label: "Auf welche Weise produzieren Sie?",
        selectProps: {
            value: companyInformation.produktionsweise,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionsweise: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Produktionstyp
        }
    }

    const gwhflaecheProps: MeasureInputProps = {
        title: "Gewächshausfläche",
        label: "Gesamtfläche des zu berechnenden Hauses",
        unitName: props.unitValues.measures.GWHFlaeche[0]?.values,
        textFieldProps: {
            value: companyInformation.gwhFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhFlaeche: {value: parseFloat(event.target.value),unit:props.unitValues.measures.GWHFlaeche[0].id}
            })
        }
    }

    const nutzflaecheProps: MeasureInputProps = {
        title: "Nutzfläche",
        label: "Effektiv genutzte/bestellte Fläche des Hauses",
        unitName: "m2",
        textFieldProps: {
            value: companyInformation.gwhFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhFlaeche: {value: parseFloat(event.target.value),unit:props.unitValues.measures.Nutzflaeche[0].id}
            })
        }
    }

    const gwhArtProps: SelectionInputProps = {
        title: "Bauart",
        label: "Typ der GWH-Bauart",
        selectProps: {
            lookupValues: props.lookupValues.GWHArt,
            value: companyInformation.gwhArt,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhArt: parseFloat(event.target.value)
            })
        },
    }

    const gwhAlterProps: DateInputProps = {
        title: "Baujahr",
        label: "In welchem Jahr wurde das Gewächhaus gebaut?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.gwhAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhAlter: {value:event,unit:props.unitValues.measures.GWHAlter[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const bedachungsmaterialProps: SelectionInputProps = {
        title: "Bedachungsmaterial",
        label: "Aus welchem Material besteht die Bedachung?",
        selectProps: {
            lookupValues: props.lookupValues.Bedachungsmaterial,
            value: companyInformation.bedachungsmaterial,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                bedachungsmaterial: parseFloat(event.target.value)
            })
        }
    }

    const bedachungsmaterialAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Bedachung",
        label: "Eindeckungsjahr des momentanen Bedachungsmaterials",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.bedachungsmaterialAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                bedachungsmaterialAlter: {value:event,unit:companyInformation.bedachungsmaterialAlter?.unit??null}
            }),
            renderInput: () => <TextField/>
        }
    }

    const stehwandmaterialProps: SelectionInputProps = {
        title: "Stehwandmaterial",
        label: "Aus welchem Material bestehen die Stehwände?",
        selectProps: {
            lookupValues: props.lookupValues.Stehwandmaterial,
            value: companyInformation.stehwandmaterial,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandmaterial: parseFloat(event.target.value)
            })
        }
    }

    const stehwandmaterialAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Stehwand",
        label: "In welchem Jahr wurde das momentane Stehwandmaterial angebracht?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.stehwandmaterialAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandmaterialAlter: {value:event,unit:props.unitValues.measures.AlterStehwandmaterial[0].id}
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
                stehwandhoehe: {value:parseFloat(event.target.value), unit: props.unitValues.measures.Stehwandhoehe[0].id}
            })
        }
    }

    const laengeProps: MeasureInputProps = {
        title: "Länge",
        label: "Wie lang ist das Gewächshaus?",
        unitName: props.unitValues.measures.Laenge[0]?.values,
        textFieldProps: {
            value: companyInformation.laenge?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                laenge: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Laenge[0].id}
            })
        }
    }

    const breiteProps: MeasureInputProps = {
        title: "Breite",
        label: "Wie breit ist das Gewächshaus?",
        unitName: props.unitValues.measures.Breite[0]?.values,
        textFieldProps: {
            value: companyInformation.breite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                breite: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Breite[0].id}
            })
        }
    }

    const kappenbreiteProps: MeasureInputProps = {
        title: "Kappenbreite",
        label: "Wie viele Meter beträgt die Knappenbreite?",
        unitName: props.unitValues.measures.Kappenbreite[0]?.values,
        textFieldProps: {
            value: companyInformation.kappenbreite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                kappenbreite: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Kappenbreite[0].id}
            })
        }
    }

    const scheibenlaengeProps: MeasureInputProps = {
        title: "Scheibenlänge",
        label: "Wie lang sind die Scheiben der Bedachung?",
        unitName: props.unitValues.measures.Scheibenlaenge[0]?.values,
        textFieldProps: {
            value: companyInformation.scheibenlaenge?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                scheibenlaenge: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Scheibenlaenge[0].id}
            })
        }
    }

    const reihenabstandProps: MeasureInputProps = {
        title: "Reihenabstand",
        label: "Wie groß ist der Abstand zwischen den Kulturreihen? (Reihenmitte zu Reihenmitte)",
         unitName: props.unitValues.measures["Reihenabstand(Rinnenabstand)"][0]?.values,
        textFieldProps: {
            value: companyInformation.reihenabstand?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                reihenabstand: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Reihenabstand(Rinnenabstand)"][0].id}
            })
        }
    }

    const vorwegbreiteProps: MeasureInputProps = {
        title: "Vorwegbreite",
        label: "Wie breit ist der Vorweg?",
        unitName: props.unitValues.measures.Vorwegbreite[0]?.values,
        textFieldProps: {
            value: companyInformation.vorwegbreite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                vorwegbreite: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Vorwegbreite[0].id}
            })
        }
    }

    const bodenabdeckungProps: DynamicInputProps = {
        title: "Bodenabdeckung",
        label: "Welche Bodenabdeckungen werden verwendet? Wie lang ist die erwartete Nutzungsdauer?",
        optional: true,
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Bodenabdeckung
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Bodenabdeckung,
            unitValues:  props.unitValues,
            optionGroup: "Bodenabdeckung"
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
        initValues: props.values.bodenabdeckung
    }

    const energieschirmProps: SingleShowConditionalRadioInputProps = {
        title: "Wärmedämmschirm / Schattierung",
        label: "Verwenden Sie einen entsprechenden Schirm?",
        radioGroupProps: {
            value: companyInformation.energieschirm,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirm: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Energieschirm,
        showChildren: value => {
            let trueOptions = props.lookupValues.Energieschirm.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const energieschirmTypProps: SelectionInputProps = {
        title: "Schirmbauart",
        label: "Welche Art von Schirm/Schirmen wird verwendet?",
        selectProps: {
            lookupValues: props.lookupValues.EnergieschirmTyp,
            value: companyInformation.energieschirmTyp,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirmTyp: parseFloat(event.target.value)
            })
        }
    }

    const energieschirmAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Schirm",
        label: "In welchem Jahr wurde der momentane Schirm angebracht?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.energieschirmAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirmAlter: {value:event,unit:props.unitValues.measures.AlterEnergieschirm[0].id}
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
                produktionssystem: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Produktionssystem
        },
        hideChildren: value => {
            let wrongOption = props.lookupValues.Produktionssystem.filter(option => option.values.toUpperCase() == "BODEN");
            return wrongOption.length > 0 && wrongOption[0].id == value
        }
    }

    const produktionssystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Produktionssystem",
        label: "Wann wurde das momentane System installiert? (Bei Produktion im Boden nicht zutreffend)",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.produktionssystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionssystemAlter: {value:event,unit:props.unitValues.measures.AlterProduktionssystem[0].id}
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
                bewaesserArt: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Bewaesserungsart
        }
    }
    
    const heizsystemProps: ConditionalSelectionInputProps = {
        title: "Hauptsystem zur Wärmeverteilung",
        label: "Welches System nutzen Sie primär zur Wärmeverteilung?",
        selectProps: {
            lookupValues: props.lookupValues.Heizsystem,
            value: companyInformation.heizsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                heizsystem: parseFloat(event.target.value)
            }),
        },
        hideChildren: value => {
            let trueOptions = props.lookupValues.Heizsystem.filter(option => option.values.toUpperCase() == "KEINES");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }

    }

    const heizsystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr Heizsystem",
        label: "Wann wurde das momentane System installiert?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.heizsystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                heizsystemAlter: {value:event,unit:props.unitValues.measures.AlterHeizsystem[0].id}
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
                zusaetzlichesHeizsystem: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.ZusaetzlichesHeizsystem,
        showChildren: value => {
            let trueOptions = props.lookupValues.ZusaetzlichesHeizsystem.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const zusaetzlichesHeizsystemTypProps: SelectionInputProps = {
        title: "Typ",
        label: "Welches zusätzliche System verwenden Sie?",
        selectProps: {
            lookupValues: props.lookupValues.ZusaetzlichesHeizsystemTyp,
            value: companyInformation.zusaetzlichesHeizsystemTyp,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystemTyp: parseFloat(event.target.value)
            }),
        },
    }

    const zusaetzlichesHeizsystemAlterProps: DateInputProps = {
        title: "Anschaffungsjahr sekundäres Heizsystem",
        label: "Wann wurde das momentane System installiert?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.zusaetzlichesHeizsystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystemAlter: {value:event,unit:props.unitValues.measures.AlterZusaetzlichesHeizsystem[0].id}
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
                <MeasureInputField {...plzProps} />
            </Grid>
            <Grid item container xs={12}  spacing={4}>
                <SelectionInputField {...produktionsweiseProps} />
            </Grid>
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
                    <InputPaginationButtons {...props.paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    )

}
export default connector(CompanyInformationInput)
