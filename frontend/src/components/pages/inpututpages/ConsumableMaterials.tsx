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
    MeasureInputProps, MeasureValue,
    SelectionInputField,
    SelectionInputProps,
    SelectionValue, SelectShowConditionalRadioInputField, SelectShowConditionalRadioInputProps,
    SingleShowConditionalRadioInputField,
    SingleShowConditionalRadioInputProps
} from "../../utils/inputPage/InputFields"
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {SubpageProps} from "../PageInputData";
import InputPaginationButtons from "../../utils/InputPaginationButtons";
import {TextField} from "@mui/material";
import {SectionDivider} from "../../utils/inputPage/layout";

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
    growbagsKuebel: number | null
    growbagsKuebelSubstrat: SelectionValue[]
    kuebelVolumenProTopf: MeasureValue | null
    kuebelJungpflanzenProTopf: MeasureValue | null
    kuebelAlter: DateValue | null
    schnurMaterial: number | null
    schnurLaengeProTrieb: MeasureValue | null
    schnurWiederverwendung: MeasureValue | null
    klipse: number | null
    klipseMaterial: number | null
    klipseAnzProTrieb: MeasureValue | null
    klipseWiederverwendung: MeasureValue | null
    rispenbuegel: number | null
    rispenbuegelMaterial: number | null
    rispenbuegelAnzProTrieb: MeasureValue | null
    rispenbuegelWiederverwendung: MeasureValue | null
    bewaesserArt: number | null
    bodenabdeckung: SelectionValue[]
    jungpflanzenZukauf: number | null
    jungpflanzenDistanz: MeasureValue | null
    jungpflanzenSubstrat: number | null
    verpackungsmaterial: SelectionValue[]
    anzahlNutzungenMehrwegsteigen: MeasureValue | null
    sonstVerbrauchsmaterialien: SelectionValue[]
    zusaetzlicherMaschineneinsatz: SelectionValue[]


}

const ConsumableMaterialsInput = (props: ConsumableMaterialsProps) => {
    const [consumableMaterials, setConsumableMaterials] = useState<ConsumableMaterialsState>(props.values)

    const setConsumableMaterialsState = (consumableMaterials: ConsumableMaterialsState) => {
        setConsumableMaterials(consumableMaterials)
        props.provideConsumables(consumableMaterials)
    }

    // Properties of the input fields
    const growbagsKuebelSubstratProps: DynamicInputProps = {
        title: "Substrat",
        label: "Welches Substrat und wie lange wird es verwendet?",
        textFieldProps: {label:"Wiederverwendung"},
        selectProps: {
            lookupValues: props.lookupValues.Substrat
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Substrat,
            unitValues:  props.unitValues,
            optionGroup: "Substrat"
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
            growbagsKuebelSubstrat: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue, textField2Value: value.textField2Value
                }
            })
        }),
        initValues: props.values.growbagsKuebelSubstrat
    }

    const kuebelVolumenProps: MeasureInputProps = {
        title: "Volumen pro Topf",
        label: "Wie viel Liter fasst ein Kübel/Topf?",
        unitName: props.unitValues.measures["Kuebel:VolumenProTopf"][0]?.values,
        textFieldProps: {
            value: consumableMaterials.kuebelVolumenProTopf?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                kuebelVolumenProTopf: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Kuebel:VolumenProTopf"][0].id}
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
                kuebelJungpflanzenProTopf: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Kuebel:JungpflanzenProTopf"][0].id}
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
                kuebelAlter: {value:event,unit:props.unitValues.measures["Kuebel:Alter"][0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const growbagsKuebelProps: SelectShowConditionalRadioInputProps = {
        title: "Unterbau",
        label: "Verwenden Sie Growbags oder Kübel?",
        radioGroupProps: {
            value: consumableMaterials.growbagsKuebel,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                growbagsKuebel: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.GrowbagsKuebel,
        showFirstChildren: value => {
            let trueOptions = props.lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "GROWBAGS");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        showSecondChildren: value => {
            let trueOptions = props.lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "KUEBEL");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        firstChildren: (
                <Grid item container xs={12} spacing={4}>
                    <DynamicInputField {...growbagsKuebelSubstratProps}/>
                </Grid>
        ),
        secondChildren: (
            <>
                <Grid item container xs={12} spacing={4}>
                    <MeasureInputField {...kuebelVolumenProps} />
                    <MeasureInputField {...kuebelJungpflanzenProps}/>
                </Grid>
                <Grid item container xs={12} spacing={4}>
                    <DateInputField {...kuebelAnschaffungsjahrProps} />
                </Grid>
                <Grid item container xs={12} spacing={4}>
                    <DynamicInputField {...growbagsKuebelSubstratProps}/>
                </Grid>
            </>
        )
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
                schnurLaengeProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["SchnuereRankhilfen:Laenge"][0].id}
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
                schnurWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0].id}
            })
        }
    }

    const klipseProps: SingleShowConditionalRadioInputProps = {
        title: "Klipse",
        label: "Verwenden Sie Klipse?",
        radioGroupProps: {
            value: consumableMaterials.klipse,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipse: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Klipse,
        showChildren: value => {
            let trueOptions = props.lookupValues.Klipse.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
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
                klipseAnzProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Klipse:AnzahlProTrieb"][0].id}
            })
        }
    }

    const klipseWiederverwendungProps: MeasureInputProps = {
        title: "Wiederverwendung",
        label: "Wie lange werden diese wiederverwendet?",
        textFieldProps: {
            value: consumableMaterials.klipseWiederverwendung?.value,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                klipseWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Klipse:Wiederverwendung"][0].id}
            })
        }
    }

    const rispenbuegelProps: SingleShowConditionalRadioInputProps = {
        title: "Rispenbügel",
        label: "Verwenden Sie Rispenbügel?",
        radioGroupProps: {
            value: consumableMaterials.rispenbuegel,
            onChange: event => setConsumableMaterialsState({
                ...consumableMaterials,
                rispenbuegel: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Rispenbuegel,
        showChildren: value => {
            let trueOptions = props.lookupValues.Rispenbuegel.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
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
                rispenbuegelAnzProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0].id}
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
                rispenbuegelWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Rispenbuegel:Wiederverwendung"][0].id}
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

    const bodenabdeckungProps: DynamicInputProps = {
        title: "Bodenabdeckung",
        label: "Welche Bodenabdeckung verwenden Sie und wie viele Jahre lang?",
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Bodenabdeckung
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Bodenabdeckung,
            unitValues:  props.unitValues,
            optionGroup: "Bodenabdeckung"
        },
        onValueChange: values => setConsumableMaterialsState({
            ...consumableMaterials,
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
                jungpflanzenDistanz: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Jungpflanzen:Distanz"][0].id}
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
                anzahlNutzungenMehrwegsteigen: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0].id}
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

    const zusaetzlicherMaschineneinsatzProps: DynamicInputProps = {
        title: "Zusätzlicher Maschineneinsatz (optional)",
        label: "Geben Sie Ihren zusaetzlichen Maschineneinsatz an, falls Sie welche verwenden.",
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
            <SectionDivider title="Unterbau"/>
            <Grid item container xs={12} spacing={4}>
                <SelectShowConditionalRadioInputField {...growbagsKuebelProps}/>
            </Grid>
            <SectionDivider title="Schnur"/>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...schnurMaterialProps} />
                <MeasureInputField {...schnurLaengeProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...schnurWiederverwendungProps} />
            </Grid>
            <SectionDivider title="Klipse"/>

            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...klipseProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SelectionInputField {...klipseMaterialProps}/>
                        <MeasureInputField {...klipseAnzProTriebProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...klipseWiederverwendungProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <SectionDivider title="Rispenbügel"/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...rispenbuegelProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SelectionInputField {...rispenbuegelMaterialProps}/>
                        <MeasureInputField {...rispenbuegelAnzProTriebProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...rispenbuegelWiederverwendungProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <SectionDivider title=""/>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...bewaesserArtProps} />
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...bodenabdeckungProps}/>
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
                <MeasureInputField {...verpackungAnzahlNutzungenMehrwegsteigen}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...sonstVerbrauchsmaterialienProps} />
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
