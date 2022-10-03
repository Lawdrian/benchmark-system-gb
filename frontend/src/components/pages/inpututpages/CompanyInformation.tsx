import React, {useState} from "react";
import {
    DateInputField,
    DateInputProps, DateValue,
    MeasureInputField,
    MeasureInputProps, MeasureValue,
    SelectionInputField,
    SelectionInputProps,
    SelectionRadioInputField,
    SelectionRadioInputProps, SingleShowConditionalRadioInputField, SingleShowConditionalRadioInputProps
} from "../../utils/inputPage/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {FormControlLabel, Radio, TextField} from "@mui/material";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";
import lookup from "../../../reducers/lookup";
import {format} from "date-fns";
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
    gwhGesamtFlaeche: MeasureValue | null
    einheitlicheWaermeversorgung: number | null
    gwhFlaeche: MeasureValue | null
    waermeteilungFlaeche: MeasureValue | null
    gwhArt: number | null
    gwhAlter: DateValue | null
    bedachungsmaterial: number | null
    bedachungsmaterialAlter: DateValue | null
    stehwandmaterial: number | null
    stehwandmaterialAlter: DateValue | null
    energieschirm: number | null
    energieschirmAlter: DateValue | null
    stehwandhoehe: MeasureValue
    laenge: MeasureValue | null
    breite: MeasureValue | null
    knappenbreite: MeasureValue | null
    scheibenlaenge: MeasureValue | null
    reihenabstand: MeasureValue | null
    vorwegbreite: MeasureValue | null
    produktionstyp: number | null
    kultursystem: number | null
    kultursystemAlter: DateValue | null
    transportsystem: number | null
    transportsystemAlter: DateValue | null
    zusaetzlichesHeizsystem: number | null
    zusaetzlichesHeizsystemAlter: DateValue | null
}

const CompanyInformationInput = (props: CompanyInformationProps) => {
    const [companyInformation, setCompanyInformation] = useState<CompanyInformationState>(props.values)

    const setCompanyInformationState = (companyInformation: CompanyInformationState) => {
        setCompanyInformation(companyInformation)
        props.provideCompanyInformation(companyInformation)
        console.log(companyInformation.gewaechshausName)
    }

    // Properties of the input fields
    const gewaechshausNameProps: MeasureInputProps = {
        title: "Gewächshaus Name",
        label: "Wie lautet der Name Ihres Gewächshauses? Wenn Sie einen neuen Datensatz für ein bestehendes Gewächshaus eingeben möchten, dann geben Sie dessen Namen in dieses Feld ein.",
        unitName:"",
        textFieldProps: {
            value: companyInformation.gewaechshausName,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gewaechshausName: event.target.value
            }),
            type:"text",
            placeholder:"Name",
        }
    }

    const datumProps: DateInputProps = {
        title: "Datum",
        label: "Von wann sind diese Daten?",
        datePickerProps: {
            value: companyInformation.datum,
            inputFormat: "dd/MM/yyyy",
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                datum: event
            }),
            renderInput: () => <TextField/>
        }
    }

    const plzProps: MeasureInputProps = {
        title: "Postleitzahl",
        label: "Postleitzahl (zur Wetterdatenbestimmung)",
        unitName: props.unitValues.measures.PLZ[0]?.values,
        textFieldProps: {
            value: companyInformation.plz?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                plz: {value: parseFloat(event.target.value),unit: props.unitValues.measures.PLZ[0].id}
            })
        }
    }

    const gwhGesamtFlaecheProps: MeasureInputProps = {
        title: "Gewächshaus Gesamtfläche",
        label: "Die gesamte Fläche des Gewächshauses",
        unitName: props.unitValues.measures.GWHGesamtflaeche[0]?.values,
        textFieldProps: {
            value: companyInformation.gwhGesamtFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhGesamtFlaeche: {value: parseFloat(event.target.value),unit:props.unitValues.measures.GWHGesamtflaeche[0].id}
            })
        }
    }

    const einheitlicheWaermeversorgungProps: SingleShowConditionalRadioInputProps = {
        title: "Einheitliche Wärmeversorgung",
        label: "Ist die Wärmeversorgung Einheitlich?",
        radioGroupProps: {
            value: companyInformation.einheitlicheWaermeversorgung,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                einheitlicheWaermeversorgung: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.EinheitlicheWaermeversorgung,
        showChildren: value => {
            let trueOptions = props.lookupValues.EinheitlicheWaermeversorgung.filter(option => option.values.toUpperCase() == "NEIN");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const waermeteilungFlaecheProps: MeasureInputProps = {
        title: "Wärmeverteilung Fläche",
        label: "Wie viel Fläche ist Wärmeverteilt?",
        unitName: "m2",
        textFieldProps: {
            value: companyInformation.waermeteilungFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                waermeteilungFlaeche: {value: parseFloat(event.target.value),unit:props.unitValues.measures.WaermeteilungFlaeche[0].id}
            })
        }
    }

    const gwhFlaecheProps: MeasureInputProps = {
        title: "Gewächshaus Fläche",
        label: "Wie groß ist die Fläche eines Hauses?",
        unitName: "m2",
        textFieldProps: {
            value: companyInformation.gwhFlaeche?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhFlaeche: {value: parseFloat(event.target.value),unit:props.unitValues.measures.GWHFlaeche[0].id}
            })
        }
    }

    const gwhArtProps: SelectionInputProps = {
        title: "Gewächshaus Art",
        label: "Bauart des Gewächshauses",
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
        title: "Gewächshaus Alter",
        label: "Wann wurde das Gewächshaus gebaut?",
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
        title: "Alter Bedachungsmaterial",
        label: "Seit wann nutzen Sie das Bedachungsmaterial?",
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
        title: "Alter Stehwandmaterial",
        label: "Seit wann nutzen Sie das Stehwandmaterial?",
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

    const energieschirmProps: SelectionInputProps = {
        title: "Energieschirm",
        label: "Art des Energieschirms",
        selectProps: {
            lookupValues: props.lookupValues.Energieschirm,
            value: companyInformation.energieschirm,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                energieschirm: parseFloat(event.target.value)
            })
        }
    }

    const energieschirmAlterProps: DateInputProps = {
        title: "Alter Energieschirm",
        label: "Seit wann nutzen Sie den Energieschirm?",
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

    const stehwandhoeheProps: MeasureInputProps = {
        title: "Stehwandhöhe",
        label: "Höhe der Stehwände",
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
            value: companyInformation.knappenbreite?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                knappenbreite: {value:parseFloat(event.target.value),unit:props.unitValues.measures.Kappenbreite[0].id}
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
        title: "Reihenabstand (Rinnenabstand)",
        label: "Wie groß ist der Abstand zwischen den Reihen (Reihenmitte zu Reihenmitte)",
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

    const transportsystemProps: SingleShowConditionalRadioInputProps = {
        title: "Transportsystem",
        label: "Verwenden Sie ein Transportsystem? (Buisrail oder vergleichbares)",
        radioGroupProps: {
            value: companyInformation.transportsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                transportsystem: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Transportsystem,
        showChildren: value => {
            let trueOptions = props.lookupValues.Transportsystem.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const transportsystemAlterProps: DateInputProps = {
        title: "Alter Transportsystem",
        label: "Seit wann nutzen Sie das Transportsystem?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.transportsystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                transportsystemAlter: {value:event,unit:props.unitValues.measures.AlterTransportsystem[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }


    const produktionstypProps: SelectionInputProps = {
        title: "Produktionstyp",
        label: "Auf welche Weise produzieren Sie?",
        selectProps: {
            value: companyInformation.produktionstyp,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktionstyp: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Produktionstyp
        }
    }

    const kultursystemProps: SelectionInputProps = {
        title: "Kultursystem",
        label: "Welches Kultursystem wird verwendet?",
        selectProps: {
            value: companyInformation.kultursystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                kultursystem: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Kultursystem
        }
    }

    const kultursystemAlterProps: DateInputProps = {
        title: "Alter Kultursystem",
        label: "Wie alt ist das Hydroponiksystem?",
        datePickerProps: {
            views: ['year'],
            value: companyInformation.kultursystemAlter?.value,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                kultursystemAlter: {value:event,unit:props.unitValues.measures.AlterKultursystem[0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const zusaetzlichesHeizsystemProps: SelectionRadioInputProps = {
        title: "Zusätzliches Heizsystem",
        label: "Welches zusätzliche Heizsystem wird verwendet?",
        radioProps: {
            value: companyInformation.zusaetzlichesHeizsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                zusaetzlichesHeizsystem: parseFloat(event.target.value)
            }),
        },
    }

    const zusaetzlichesHeizsystemAlterProps: DateInputProps = {
        title: "Alter zusätzliches Heizsystem",
        label: "Wie alt ist das zusätzliche Heizsystem?",
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
            <SectionDivider title="Allgemeine Daten"/>
            <Grid item container xs={12}  spacing={4}>
                <MeasureInputField {...gewaechshausNameProps} />
                <DateInputField {...datumProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...plzProps} />
            </Grid>
            <SectionDivider title=""/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...einheitlicheWaermeversorgungProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...waermeteilungFlaecheProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
                <MeasureInputField {...gwhGesamtFlaecheProps} />
                <MeasureInputField {...gwhFlaecheProps} />
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
                <SelectionInputField {...energieschirmProps} />
                <DateInputField {...energieschirmAlterProps} />
            </Grid>
            <SectionDivider title="Gewächshaus Konstruktion"/>
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
            <SectionDivider title=""/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...transportsystemProps}>
                    <Grid item container xs={12} spacing={4}>
                        <DateInputField {...transportsystemAlterProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...produktionstypProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...kultursystemProps} />
                <DateInputField {...kultursystemAlterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionRadioInputField {...zusaetzlichesHeizsystemProps}>
                    {props.lookupValues.ZusaetzlichesHeizsystem.map(option => {
                        return <FormControlLabel
                            value={option.id}
                            control={<Radio/>}
                            label={option.values}
                        />
                    })}
                </SelectionRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DateInputField {...zusaetzlichesHeizsystemAlterProps} />
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
