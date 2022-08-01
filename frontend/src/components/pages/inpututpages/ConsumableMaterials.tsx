// Verbrauchsmaterialien
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps,
    SelectionInputField,
    SelectionInputProps,
    SelectionValue,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/InputFields"
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";

const mapStateToProps = (state: RootState) => ({
  lookupValues: state.lookup.lookupValues,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type ConsumableMaterialsProps = ReduxProps & SubpageProps & {
    provideConsumables: Function
    values: ConsumableMaterialsState
}

export type ConsumableMaterialsState = {
    growbags: number | null
    growbagsVolumen: number | null
    growbagsLaenge: number | null
    growbagsPflanzenAnz: number | null
    growbagsSubstrat: SelectionValue[]
    schnurMaterial: number | null
    schnurLaenge: number | null
    schnurWiederverwendung: number | null
    klipseMaterial: number | null
    klipseGesamtmenge: number | null
    klipseAnzProTrieb: number | null
    klipseWiederverwendung: number | null
    rispenbuegelMaterial: number | null
    rispenbuegelGesamtmenge: number | null
    rispenbuegelAnzProTrieb: number | null
    rispenbuegelWiederverwendung: number | null
    bewaesserArt: number | null
    bodenfolien: number | null
    bodenfolienVerwendungsdauer: number | null
    sonstVerbrauchsmaterialien: SelectionValue[]
    jungpflanzenEinkauf: number | null
    jungpflanzenDistanz: number | null
    plastikVerpackung: number | null
    kartonVerpackung: number | null
    transportFrequenz: number | null
    transportDistanz: number | null


}

const ConsumableMaterialsInput = (props: ConsumableMaterialsProps) => {
    const [consumableMaterials, setConsumableMaterials] = useState<ConsumableMaterialsState>(props.values)

    const setConsumableMaterialsState = (consumableMaterials: ConsumableMaterialsState) => {
        setConsumableMaterials(consumableMaterials)
        props.provideConsumables(consumableMaterials)
        console.log("Data: ", consumableMaterials)
    }

    // Properties of the input fields

    const growbagsProps: SingleShowConditionalRadioInputProps = {
        title: "Growbags",
        label: "Verwenden Sie Growbags?",
        radioGroupProps: {
            value: consumableMaterials.growbags,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbags: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Growbags,
        showChildren: value => {
            let trueOptions = props.lookupValues.Growbags.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const growbagsVolumenProps: MeasureInputProps = {
        title: "Growbags Volumen",
        label: "Welches Volumen haben die verwendeten Bags? Sie können entweder direkt das Volumen angeben, die Länge oder die Pflanzen pro Bag?",
        textFieldProps: {
            value: consumableMaterials.growbagsVolumen,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsVolumen: parseFloat(event.target.value)
            })
        }
    }

    const growbagsLaengeProps: MeasureInputProps = {
        title: "Growbags Länge",
        label: "Wie lang sind die Growbags, die Sie verwenden?",
        textFieldProps: {
            value: consumableMaterials.growbagsLaenge,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsLaenge: parseFloat(event.target.value)
            })
        }
    }

    const growbagsPflanzenAnzProps: MeasureInputProps = {
        title: "Pflanzen pro Growbag",
        label: "Wie viele Pflanzen verwenden Sie in einem Growbag?",
        textFieldProps: {
            value: consumableMaterials.growbagsPflanzenAnz,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsPflanzenAnz: parseFloat(event.target.value)
            })
        }
    }

    const growbagsSubstratProps: DynamicInputProps = {
        title: "Substrat",
        label: "Welches Substrat und zu welchem Anteil wird verwendet?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Substrat
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            growbagsSubstrat: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.growbagsSubstrat
    }

     const schnurMaterialProps: SelectionInputProps = {
        title: "Schnurmaterial",
        label: "Aus welchem Material sind die  Schnüre/Rankhilfen, falls welche verwendet werden?",
        selectProps: {
            value: consumableMaterials.schnurMaterial,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                schnurMaterial: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["SchnuereRankhilfen:Material"]
        }
    }

    const schnurLaengeProps: MeasureInputProps = {
        title: "Schnurlänge",
        label: "Wie lang sind die Schnüre/Rankhilfen je Trieb?",
        textFieldProps: {
            value: consumableMaterials.schnurLaenge,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                schnurLaenge: parseFloat(event.target.value)
            })
        }
    }

    const schnurWiederverwendungProps: MeasureInputProps = {
        title: "Schnur Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        textFieldProps: {
            value: consumableMaterials.schnurWiederverwendung,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                schnurWiederverwendung: parseFloat(event.target.value)
            })
        }
    }

    const klipseMaterialProps: SelectionInputProps = {
        title: "Klipse Material",
        label: "Aus welchem Material sind die Klipse, falls welche verwendet werden?",
        selectProps: {
            value: consumableMaterials.klipseMaterial,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseMaterial: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Klipse:Material"]
        },
    }

    const klipseGesamtmengeProps: MeasureInputProps = {
        title: "Klipse Gesamtmenge",
        label: "Geben Sie entweder die Gesamtmenge pro Kulturdauer, oder die Anzahl pro Trieb und Kulturdauer an.",
        textFieldProps: {
            value: consumableMaterials.klipseGesamtmenge,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseGesamtmenge: parseFloat(event.target.value)
            })
        }
    }

    const klipseAnzProTriebProps: MeasureInputProps = {
        title: "Klipse Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Klipse pro Trieb an.",
        textFieldProps: {
            value: consumableMaterials.klipseAnzProTrieb,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseAnzProTrieb: parseFloat(event.target.value)
            })
        }
    }

    const klipseWiederverwendungProps: MeasureInputProps = {
        title: "Klipse Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        textFieldProps: {
            value: consumableMaterials.klipseWiederverwendung,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseWiederverwendung: parseFloat(event.target.value)
            })
        }
    }

    const rispenbuegelMaterialProps: SelectionInputProps = {
        title: "Rispenbügel Material",
        label: "Aus welchem Material sind die Rispenbügel, falls welche verwendet werden?",
        selectProps: {
            value: consumableMaterials.rispenbuegelMaterial,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegelMaterial: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Rispenbuegel:Material"]
        },
    }

    const rispenbuegelGesamtmengeProps: MeasureInputProps = {
        title: "Rispenbügel Gesamtmenge",
        label: "Geben Sie entweder die Gesamtmenge pro Kulturdauer, oder die Anzahl pro Trieb und Kulturdauer an.",
        textFieldProps: {
            value: consumableMaterials.rispenbuegelGesamtmenge,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegelGesamtmenge: parseFloat(event.target.value)
            })
        }
    }

    const rispenbuegelAnzProTriebProps: MeasureInputProps = {
        title: "Rispenbügel Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Rispenbügel pro Trieb an.",
        textFieldProps: {
            value: consumableMaterials.rispenbuegelAnzProTrieb,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegelAnzProTrieb: parseFloat(event.target.value)
            })
        }
    }

    const rispenbuegelWiederverwendungProps: MeasureInputProps = {
        title: "Rispenbügel Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        textFieldProps: {
            value: consumableMaterials.rispenbuegelWiederverwendung,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegelWiederverwendung: parseFloat(event.target.value)
            })
        }
    }

    const bewaesserArtProps: SelectionInputProps = {
        title: "Bewässerungsart",
        label: "Welche Bewässerungsart verwenden Sie?",
        selectProps: {
            value: consumableMaterials.bewaesserArt,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                bewaesserArt: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues.Bewaesserungsart
        }
    }

    const bodenfolienProps: SingleShowConditionalRadioInputProps = {
        title: "Bodenfolie",
        label: "Verwenden Sie Bodenfolien?",
        radioGroupProps: {
            value: consumableMaterials.bodenfolien,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                bodenfolien: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Bodenfolien,
        showChildren: value => {
            let trueOptions = props.lookupValues.Bodenfolien.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const bodenfolienVerwendungsdauerProps: MeasureInputProps = {
        title: "Bodenfolie Verwendungsdauer",
        label: "Wielange verbleiben die Bodenfolien im Gewächshaus?",
        textFieldProps: {
            value: consumableMaterials.bodenfolienVerwendungsdauer,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                bodenfolienVerwendungsdauer: parseFloat(event.target.value)
            })
        }
    }

    const sonstVerbrauchsmaterialienProps: DynamicInputProps = {
        title: "Sonstige Verbrauchsmaterialien",
        label: "Geben Sie sonstige Verbrauchsmaterialien und die Gebrauchslänge an.",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.SonstigeVerbrauchsmaterialien
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            sonstVerbrauchsmaterialien: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue
                }
            })
        }),
        initValues: props.values.sonstVerbrauchsmaterialien
    }


    const plastikVerpackungProps: MeasureInputProps = {
        title: "Plastik",
        label: "Menge an verwendetem Plastik",
        textFieldProps: {
            value: consumableMaterials.plastikVerpackung,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                plastikVerpackung: parseFloat(event.target.value)
            })
        }
    }

    const kartonVerpackungProps: MeasureInputProps = {
        title: "Karton",
        label: "Menge an verwendetem Karton",
        textFieldProps: {
            value: consumableMaterials.kartonVerpackung,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kartonVerpackung: parseFloat(event.target.value)
            })
        }
    }

    const transportFrequenzProps: MeasureInputProps = {
        title: "Warentransport Häufigkeit",
        label: "Wie häufig wird pro Woche Ware ausgeliefert?",
        textFieldProps: {
            value: consumableMaterials.transportFrequenz,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                transportFrequenz: parseFloat(event.target.value)
            })
        }
    }

    const transportDistanzProps: MeasureInputProps = {
        title: "Warentransport Distanz",
        label: "Welche Strecke wird dabei durchschnittlich gefahren? (Hin- & Rückfahrt)?",
        textFieldProps: {
            value: consumableMaterials.transportDistanz,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                transportDistanz: parseFloat(event.target.value)
            })
        }
    }

    const jungpflanzenEinkaufProps: SingleShowConditionalRadioInputProps = {
        title: "Jungpflanzen",
        label: "Werden die Junpflanzen zugekauft?",
        radioGroupProps: {
            value: consumableMaterials.jungpflanzenEinkauf,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                jungpflanzenEinkauf: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.JungpflanzenZukauf,
        showChildren: value => {
            let trueOptions = props.lookupValues.JungpflanzenZukauf.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const jungpflanzenDistanzProps: MeasureInputProps = {
        title: "Jungpflanzen Entfernung",
        label: "Wie weit werden die Jungpflanzen zu Ihnen transportiert?",
        textFieldProps: {
            value: consumableMaterials.jungpflanzenDistanz,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                jungpflanzenDistanz: parseFloat(event.target.value)
            })
        }
    }


    return (
        <Grid container xs={12} spacing={8}>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...growbagsProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...growbagsVolumenProps} />
                        <MeasureInputField {...growbagsLaengeProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...growbagsPflanzenAnzProps} />
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                         <DynamicInputField {...growbagsSubstratProps}/>
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...schnurMaterialProps} />
                <MeasureInputField {...schnurLaengeProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...schnurWiederverwendungProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...klipseMaterialProps}/>
                <MeasureInputField {...klipseGesamtmengeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...klipseAnzProTriebProps}/>
                <MeasureInputField {...klipseWiederverwendungProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...rispenbuegelMaterialProps}/>
                <MeasureInputField {...rispenbuegelGesamtmengeProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...rispenbuegelAnzProTriebProps}/>
                <MeasureInputField {...rispenbuegelWiederverwendungProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...bewaesserArtProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...bodenfolienProps}>
                    {<Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...bodenfolienVerwendungsdauerProps}/>
                    </Grid>}
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...sonstVerbrauchsmaterialienProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...plastikVerpackungProps}/>
                <MeasureInputField {...kartonVerpackungProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...transportFrequenzProps} />
                <MeasureInputField {...transportDistanzProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...jungpflanzenEinkaufProps} >
                    <MeasureInputField {...jungpflanzenDistanzProps} />
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...props.paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default connector(ConsumableMaterialsInput);
