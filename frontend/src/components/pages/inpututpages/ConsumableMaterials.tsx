// Verbrauchsmaterialien
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DateValue,
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureValue,
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
    growbagsVolumen: MeasureValue | null
    growbagsLaenge: MeasureValue | null
    growbagsPflanzenAnz: MeasureValue | null
    growbagsSubstrat: SelectionValue[]
    kuebel: number | null
    kuebelVolumenProTopf: MeasureValue | null
    kuebelJungpflanzenProTopf: MeasureValue | null
    kuebelAlter: DateValue | null
    schnurMaterial: number | null
    schnurLaengeProTrieb: MeasureValue | null
    schnurWiederverwendung: MeasureValue | null
    klipseMaterial: number | null
    klipseGesamtmenge: MeasureValue | null
    klipseAnzProTrieb: MeasureValue | null
    klipseWiederverwendung: MeasureValue | null
    rispenbuegelMaterial: number | null
    rispenbuegelAnzProTrieb: MeasureValue | null
    rispenbuegelWiederverwendung: MeasureValue | null
    bewaesserArt: number | null
    bodenfolien: number | null
    bodenfolienVerwendungsdauer: MeasureValue | null
    jungpflanzenZukauf: number | null
    jungpflanzenDistanz: MeasureValue | null
    jungpflanzenSubstrat: number | null
    verpackungsmaterial: SelectionValue[]
    sonstVerbrauchsmaterialien: SelectionValue[]
    transportDistanz: MeasureValue | null
    zusaetzlicherMaschineneinsatz: SelectionValue[]


}

const ConsumableMaterialsInput = (props: ConsumableMaterialsProps) => {
    const [consumableMaterials, setConsumableMaterials] = useState<ConsumableMaterialsState>(props.values)

    const setConsumableMaterialsState = (consumableMaterials: ConsumableMaterialsState) => {
        setConsumableMaterials(consumableMaterials)
        props.provideConsumables(consumableMaterials)
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
                growbagsVolumen: {value:parseFloat(event.target.value),unit:consumableMaterials.growbagsVolumen?.unit??null}
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
                growbagsLaenge: {value:parseFloat(event.target.value),unit:consumableMaterials.growbagsLaenge?.unit??null}
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
                growbagsPflanzenAnz: {value:parseFloat(event.target.value),unit:consumableMaterials.growbagsPflanzenAnz?.unit??null}
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
                schnurLaenge: {value:parseFloat(event.target.value),unit:consumableMaterials.schnurLaenge?.unit??null}
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
                schnurWiederverwendung: {value:parseFloat(event.target.value),unit:consumableMaterials.schnurWiederverwendung?.unit??null}
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
                klipseGesamtmenge: {value:parseFloat(event.target.value),unit:consumableMaterials.klipseGesamtmenge?.unit??null}
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
                klipseAnzProTrieb: {value:parseFloat(event.target.value),unit:consumableMaterials.klipseAnzProTrieb?.unit??null}
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
                klipseWiederverwendung: {value:parseFloat(event.target.value),unit:consumableMaterials.klipseWiederverwendung?.unit??null}
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
                rispenbuegelGesamtmenge: {value:parseFloat(event.target.value),unit:consumableMaterials.rispenbuegelGesamtmenge?.unit??null}
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
                rispenbuegelWiederverwendung: {value:parseFloat(event.target.value),unit:consumableMaterials.rispenbuegelWiederverwendung?.unit??null}
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
                bodenfolienVerwendungsdauer: {value:parseFloat(event.target.value),unit:consumableMaterials.bodenfolienVerwendungsdauer?.unit??null}
            })
        }
    }

    const sonstVerbrauchsmaterialienProps: DynamicInputProps = {
        title: "Sonstige Verbrauchsmaterialien",
        label: "Geben Sie sonstige Verbrauchsmaterialien und die Gebrauchslänge an.",
        textFieldProps: {placeholder: "kg", label: "Menge"},
        textField2Props: {placeholder:"Jahre", label:"Wiederverwendung"},
        selectProps: {
            lookupValues: props.lookupValues.SonstigeVerbrauchsmaterialien
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            sonstVerbrauchsmaterialien: values.map(value => {
                return {
                    selectValue: value.selectValue,
                    textFieldValue:value.textFieldValue,
                    textField2Value:value.textField2Value
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
                plastikVerpackung:{value:parseFloat(event.target.value),unit:consumableMaterials.plastikVerpackung?.unit??null}
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
                kartonVerpackung: {value:parseFloat(event.target.value),unit:consumableMaterials.kartonVerpackung?.unit??null}
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
                transportFrequenz: {value:parseFloat(event.target.value),unit:consumableMaterials.transportFrequenz?.unit??null}
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
                transportDistanz: {value:parseFloat(event.target.value),unit:consumableMaterials.transportDistanz?.unit??null}
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
                jungpflanzenDistanz: {value:parseFloat(event.target.value),unit:consumableMaterials.jungpflanzenDistanz?.unit??null}
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
