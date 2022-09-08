// Verbrauchsmaterialien
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DateInputField,
    DateInputProps,
    DateValue,
    DynamicInputField,
    DynamicInputProps,
    MeasureInputField,
    MeasureInputProps, MeasureUnitInputProps, MeasureValue,
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
import {TextField} from "@mui/material";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues
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
    anzahlNutzungenMehrwegsteigen: MeasureValue | null
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

    const growbagsVolumenProps: MeasureUnitInputProps = {
        title: "Growbags Volumen",
        label: "Welches Volumen haben die verwendeten Bags? Sie können entweder direkt das Volumen angeben, die Länge oder die Pflanzen pro Bag?",
        textFieldProps: {
            value: consumableMaterials.growbagsVolumen?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsVolumen: {value:parseFloat(event.target.value),unit:consumableMaterials.growbagsVolumen?.unit??null}
            })
        },
        selectProps: {
            value: consumableMaterials.growbagsVolumen?.unit,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsVolumen: {value:consumableMaterials.growbagsVolumen?.value?? null ,unit:parseFloat(event.target.value)}
            }),
            lookupValues: props.unitValues.measures["Growbags:Volumen"]
        }
    }

    const growbagsLaengeProps: MeasureInputProps = {
        title: "Growbags Länge",
        label: "Wie lang sind die Growbags, die Sie verwenden?",
        unitName: props.unitValues.measures["Growbags:Laenge"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.growbagsLaenge?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsLaenge: {value:parseFloat(event.target.value),unit:consumableMaterials.growbagsLaenge?.unit??null}
            })
        }
    }

    const growbagsPflanzenAnzProps: MeasureInputProps = {
        title: "Pflanzen pro Growbag",
        label: "Wie viele Pflanzen verwenden Sie in einem Growbag?",
        unitName: props.unitValues.measures["Growbags:PflanzenproBag"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.growbagsPflanzenAnz?.value,
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
        textField2Props: {},
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

    const kuebelProps: SingleShowConditionalRadioInputProps = {
        title: "Kübel",
        label: "Verwenden Sie Kübel/Töpfe?",
        radioGroupProps: {
            value: consumableMaterials.kuebel,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kuebel: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Kuebel,
        showChildren: value => {
            let trueOptions = props.lookupValues.Kuebel.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const kuebelVolumenProps: MeasureInputProps = {
        title: "Volumen pro Topf",
        label: "Wie viel Liter fasst ein Kübel/Topf?",
        unitName: props.unitValues.measures["Kuebel:VolumenProTopf"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.kuebelVolumenProTopf?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kuebelVolumenProTopf: {value:parseFloat(event.target.value),unit:consumableMaterials.kuebelVolumenProTopf?.unit??null}
            })
        }
    }

    const kuebelJungpflanzenProps: MeasureInputProps = {
        title: "Jungpflanzen pro Topf",
        label: "Wie viele Jungpflanzen fasst ein Kübel/Topf?",
        unitName: props.unitValues.measures["Kuebel:JungpflanzenProTopf"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.kuebelJungpflanzenProTopf?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kuebelJungpflanzenProTopf: {value:parseFloat(event.target.value),unit:consumableMaterials.kuebelJungpflanzenProTopf?.unit??null}
            })
        }
    }

    const kuebelAnschaffungsjahrProps: DateInputProps = {
        title: "Alter Kübel",
        label: "Seit wann nutzen Sie die Kübel?",
        datePickerProps: {
            views: ['year'],
            value: consumableMaterials.kuebelAlter?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kuebelAlter: {value:event,unit:consumableMaterials.kuebelAlter?.unit??null}
            }),
            renderInput: () => <TextField/>
        }
    }



     const schnurMaterialProps: SelectionInputProps = {
        title: "Material",
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
        title: "Länge",
        label: "Wie lang sind die Schnüre/Rankhilfen je Trieb?",
        unitName: props.unitValues.measures["SchnuereRankhilfen:Laenge"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.schnurLaengeProTrieb?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                schnurLaengeProTrieb: {value:parseFloat(event.target.value),unit:consumableMaterials.schnurLaengeProTrieb?.unit??null}
            })
        }
    }

    const schnurWiederverwendungProps: MeasureInputProps = {
        title: "Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: props.unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.schnurWiederverwendung?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                schnurWiederverwendung: {value:parseFloat(event.target.value),unit:consumableMaterials.schnurWiederverwendung?.unit??null}
            })
        }
    }

    const klipseMaterialProps: SelectionInputProps = {
        title: "Material",
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

    const klipseAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Klipse pro Trieb an.",
        unitName: props.unitValues.measures["Klipse:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.klipseAnzProTrieb?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseAnzProTrieb: {value:parseFloat(event.target.value),unit:consumableMaterials.klipseAnzProTrieb?.unit??null}
            })
        }
    }

    const klipseWiederverwendungProps: MeasureInputProps = {
        title: "Wiederverwendung",
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
        title: "Material",
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

    const rispenbuegelAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Rispenbügel pro Trieb an.",
        unitName: props.unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.rispenbuegelAnzProTrieb?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegelAnzProTrieb: {value:parseFloat(event.target.value),unit:consumableMaterials.rispenbuegelAnzProTrieb?.unit??null}
            })
        }
    }

    const rispenbuegelWiederverwendungProps: MeasureInputProps = {
        title: "Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: props.unitValues.measures["Rispenbuegel:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.rispenbuegelWiederverwendung?.value,
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
        title: "Bodenabdeckung",
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
        title: "Wiederverwendung",
        label: "Wie lange verbleiben die Bodenfolien im Gewächshaus?",
        unitName: props.unitValues.measures["Bodenabdeckung:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.bodenfolienVerwendungsdauer?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                bodenfolienVerwendungsdauer: {value:parseFloat(event.target.value),unit:consumableMaterials.bodenfolienVerwendungsdauer?.unit??null}
            })
        }
    }

    const jungpflanzenZukaufProps: SingleShowConditionalRadioInputProps = {
        title: "Jungpflanzen",
        label: "Werden die Junpflanzen zugekauft?",
        radioGroupProps: {
            value: consumableMaterials.jungpflanzenZukauf,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                jungpflanzenZukauf: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues["Jungpflanzen:Zukauf"],
        showChildren: value => {
            let trueOptions = props.lookupValues["Jungpflanzen:Zukauf"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const jungpflanzenDistanzProps: MeasureInputProps = {
        title: "Entfernung",
        label: "Wie weit werden die Jungpflanzen zu Ihnen transportiert?",
        unitName: props.unitValues.measures["Jungpflanzen:Distanz"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.jungpflanzenDistanz?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                jungpflanzenDistanz: {value:parseFloat(event.target.value),unit:consumableMaterials.jungpflanzenDistanz?.unit??null}
            })
        }
    }

    const jungpflanzenSubstratProps: SelectionInputProps = {
        title: "Substrat",
        label: "Welches Substrat wird bei den zugekauften Jungpflanzen verwendet?",
        selectProps: {
            value: consumableMaterials.jungpflanzenSubstrat,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                jungpflanzenSubstrat: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Jungpflanzen:Substrat"]
        }
    }



    const verpackungsmaterialProps: DynamicInputProps = {
        title: "Verpackungsmaterial",
        label: "Welches Material benutzen Sie für die Verpackung Ihrer Ware?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Verpackungsmaterial
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Verpackungsmaterial,
            unitValues:  props.unitValues,
            optionGroup: "Verpackungsmaterial"
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            verpackungsmaterial: values.map(value => {
                return {
                    selectValue: value.selectValue,
                    textFieldValue:value.textFieldValue,
                    textField2Value:value.textField2Value
                }
            })
        }),
        initValues: props.values.verpackungsmaterial
    }

    const verpackungAnzahlNutzungenMehrwegsteigen: MeasureInputProps = {
        title: "Mehrwegsteigen",
        label: "Anzahl Nutzungen von Mehrwegsteigen (IFCO, EPS)",
        unitName: props.unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.anzahlNutzungenMehrwegsteigen?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                anzahlNutzungenMehrwegsteigen: {value:parseFloat(event.target.value),unit:consumableMaterials.anzahlNutzungenMehrwegsteigen?.unit??null}
            })
        }
    }

    const sonstVerbrauchsmaterialienProps: DynamicInputProps = {
        title: "Sonstige Verbrauchsmaterialien",
        label: "Geben Sie sonstige Verbrauchsmaterialien und die Gebrauchslänge an.",
        textFieldProps: {},
        textField2Props: {placeholder:"Jahre", label:"Wiederverwendung"},
        selectProps: {
            lookupValues: props.lookupValues.SonstigeVerbrauchsmaterialien
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.SonstigeVerbrauchsmaterialien,
            unitValues:  props.unitValues,
            optionGroup: "SonstigeVerbrauchsmaterialien"
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

    const transportDistanzProps: MeasureInputProps = {
        title: "Warentransport Distanz",
        label: "Welche Strecke wird dabei durchschnittlich gefahren? (Hin- & Rückfahrt)?",
        unitName: props.unitValues.measures["Transport:Distanz"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.transportDistanz?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                transportDistanz: {value:parseFloat(event.target.value),unit:consumableMaterials.transportDistanz?.unit??null}
            })
        }
    }

    const zusaetzlicherMaschineneinsatzProps: DynamicInputProps = {
        title: "Zusätzlicher Maschineneinsatz",
        label: "Geben Sie Ihren zusaetzlichen Maschineneinsatz an.",
        textFieldProps: {},
        textField2Props: {placeholder:"h/a", label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: props.lookupValues.ZusaetzlicherMaschineneinsatz
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.ZusaetzlicherMaschineneinsatz,
            unitValues:  props.unitValues,
            optionGroup: "ZusaetzlicherMaschineneinsatz"
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            zusaetzlicherMaschineneinsatz: values.map(value => {
                return {
                    selectValue: value.selectValue,
                    textFieldValue:value.textFieldValue,
                    textField2Value:value.textField2Value
                }
            })
        }),
        initValues: props.values.zusaetzlicherMaschineneinsatz
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
                <SingleShowConditionalRadioInputField {...kuebelProps}>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...kuebelVolumenProps} />
                        <MeasureInputField {...kuebelJungpflanzenProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <DateInputField {...kuebelAnschaffungsjahrProps} />
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
                <MeasureInputField {...klipseAnzProTriebProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...klipseWiederverwendungProps} />
                <SelectionInputField {...rispenbuegelMaterialProps}/>
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
                <SingleShowConditionalRadioInputField {...jungpflanzenZukaufProps} >
                    <MeasureInputField {...jungpflanzenDistanzProps} />
                    <SelectionInputField {...jungpflanzenSubstratProps}/>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...verpackungsmaterialProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...sonstVerbrauchsmaterialienProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...transportDistanzProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...zusaetzlicherMaschineneinsatzProps} />
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
