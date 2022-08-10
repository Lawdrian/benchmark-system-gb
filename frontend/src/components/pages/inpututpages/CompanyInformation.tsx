import React, {useState} from "react";
import {
    DateInputField,
    DateInputProps,
    MeasureInputField,
    MeasureInputProps,
    SelectionInputField,
    SelectionInputProps,
    SelectionRadioInputField,
    SelectionRadioInputProps
} from "../../utils/InputFields";
import Grid from "@mui/material/Grid";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {FormControlLabel, Radio, TextField} from "@mui/material";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";
import lookup from "../../../reducers/lookup";
import {format} from "date-fns";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
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
    plz: number | null
    gwhArt: number | null
    gwhAlter: number | null
    bedachungsmaterial: number | null
    alterdesBedachungsmaterials: number | null
    artdesStehwandmaterials: number | null
    energieschirm: number | null
    alterEnergieschirm: number| null
    stehwandhoehe: number | null
    laenge: number | null
    breite: number | null
    knappenbreite: number | null
    scheibenlaenge: number | null
    produktion: number | null
    kultursystem: number | null
    alterKultursystem: number | null
    reihenabstand: number| null
    transportsystem: number | null
}

const CompanyInformationInput = (props: CompanyInformationProps) => {
    const [companyInformation, setCompanyInformation] = useState<CompanyInformationState>(props.values)

    const setCompanyInformationState = (companyInformation: CompanyInformationState) => {
        setCompanyInformation(companyInformation)
        props.provideCompanyInformation(companyInformation)
    }

    // Properties of the input fields
    const gewaechshausNameProps: MeasureInputProps = {
        title: "Gewächshaus Name",
        label: "Wie lautet der Name Ihres Gewächshauses?",
        textFieldProps: {
            value: companyInformation.gewaechshausName,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gewaechshausName: event.target.value
            }),
            type:"text",
            placeholder:"Name",
            error: companyInformation.gewaechshausName==="1"
        }
    }

    const datumProps: DateInputProps = {
        title: "Datum",
        label: "Von wann sind diese Daten?",
        datePickerProps: {
            value: companyInformation.datum,
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
        textFieldProps: {
            value: companyInformation.plz,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                plz: parseFloat(event.target.value)
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

    const gwhAlterProps: SelectionInputProps = {
        title: "Gewächshaus Alter",
        label: "Alter des Gewächshauses",
        selectProps: {
            lookupValues: props.lookupValues.GWHAlter,
            value: companyInformation.gwhAlter,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                gwhAlter: parseFloat(event.target.value)
            })
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

    const alterdesBedachungsmaterialsProps: SelectionInputProps = {
        title: "Bedachungsmaterial Alter",
        label: "Wie alt ist das Bedachungsmaterial?",
        selectProps: {
            lookupValues: props.lookupValues.AlterdesBedachungsmaterials,
            value: companyInformation.alterdesBedachungsmaterials,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                alterdesBedachungsmaterials: parseFloat(event.target.value)
            })
        }
    }

    const artdesStehwandmaterialsProps: SelectionInputProps = {
        title: "Stehwandmaterial",
        label: "Aus welchem Material bestehen die Stehwände?",
        selectProps: {
            lookupValues: props.lookupValues.ArtdesStehwandmaterial,
            value: companyInformation.artdesStehwandmaterials,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                artdesStehwandmaterials: parseFloat(event.target.value)
            })
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

    const alterEnergieschirmProps: MeasureInputProps = {
        title: "Alter Energieschirm",
        label: "Wie alt ist der Energieschirm?",
        textFieldProps: {
            value: companyInformation.alterEnergieschirm,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                alterEnergieschirm: parseFloat(event.target.value)
            })
        }
    }

    const stehwandhoeheProps: MeasureInputProps = {
        title: "Stehwandhöhe",
        label: "Höhe der Stehwände",
        textFieldProps: {
            value: companyInformation.stehwandhoehe,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                stehwandhoehe: parseFloat(event.target.value)
            })
        }
    }

    const laengeProps: MeasureInputProps = {
        title: "Länge",
        label: "Wie lang ist das Gewächshaus?",
        textFieldProps: {
            value: companyInformation.laenge,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                laenge: parseFloat(event.target.value)
            })
        }
    }

    const breiteProps: MeasureInputProps = {
        title: "Breite",
        label: "Wie breit ist das Gewächshaus?",
        textFieldProps: {
            value: companyInformation.breite,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                breite: parseFloat(event.target.value)
            })
        }
    }

    const knappenbreiteProps: MeasureInputProps = {
        title: "Knappenbreite",
        label: "Wie viele Meter beträgt die Knappenbreite?",
        textFieldProps: {
            value: companyInformation.knappenbreite,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                knappenbreite: parseFloat(event.target.value)
            })
        }
    }

    const scheibenlaengeProps: MeasureInputProps = {
        title: "Scheibenlänge",
        label: "Wie lang sind die Scheiben der Bedachung?",
        textFieldProps: {
            value: companyInformation.scheibenlaenge,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                scheibenlaenge: parseFloat(event.target.value)
            })
        }
    }

    const produktionProps: SelectionInputProps = {
        title: "Produktion",
        label: "Auf welche Weise produzieren Sie?",
        selectProps: {
            value: companyInformation.produktion,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                produktion: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Produktion
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
    
    const alterKultursystemProps: MeasureInputProps = {
        title: "Kultursystem Alter",
        label: "Wie alt ist das Hydroponiksystem?",
        textFieldProps: {
            value: companyInformation.alterKultursystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                alterKultursystem: parseFloat(event.target.value)
            })
        }
    }
    
    const reihenabstandProps: MeasureInputProps = {
        title: "Reihenabstand",
        label: "Wie groß ist der Abstand zwischen den Reihen (Reihenmitte zu Reihenmitte)",
        textFieldProps: {
            value: companyInformation.reihenabstand,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                reihenabstand: parseFloat(event.target.value)
            })
        }
    }
    
    const transportsystemProps: SelectionRadioInputProps = {
        title: "Transportsystem",
        label: "Verwenden Sie ein Transportsystem? (Buisrail oder vergleichbares)",
        radioProps: {
            value: companyInformation.transportsystem,
            onChange: event => setCompanyInformationState({
                ...companyInformation,
                transportsystem: parseFloat(event.target.value)
            })
        }
    }

    return (
        <Grid container xs={12} spacing={8}>
            <Grid item container xs={12}  spacing={4}>
                <MeasureInputField {...gewaechshausNameProps} />
                <DateInputField {...datumProps} />
            </Grid>
            <Grid item container xs={12}  spacing={4}>
                <SelectionInputField {...gwhArtProps} />
                <SelectionInputField {...gwhAlterProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...bedachungsmaterialProps} />
                <SelectionInputField {...alterdesBedachungsmaterialsProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...artdesStehwandmaterialsProps} />
                <MeasureInputField {...stehwandhoeheProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...plzProps} />
                <SelectionInputField {...produktionProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...energieschirmProps} />
                <MeasureInputField {...alterEnergieschirmProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...laengeProps} />
                <MeasureInputField {...breiteProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...knappenbreiteProps} />
                <MeasureInputField {...scheibenlaengeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...kultursystemProps} />
                <MeasureInputField {...alterKultursystemProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...reihenabstandProps} />
                <SelectionRadioInputField {...transportsystemProps}>
                    {props.lookupValues.Transportsystem.map(option => {
                        return <FormControlLabel
                            value={option.id}
                            control={<Radio/>}
                            label={option.values}
                        />
                    })}
                </SelectionRadioInputField>
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
