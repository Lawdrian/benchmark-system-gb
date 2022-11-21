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
import InputPaginationButtons from "../../utils/inputPage/InputPaginationButtons";
import {TextField} from "@mui/material";
import {SectionDivider} from "../../utils/inputPage/layout";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CompanyMaterialsProps = ReduxProps & SubpageProps & {
    provideCompanyMaterials: Function
    values: CompanyMaterialsState
}

export type CompanyMaterialsState = {
    growbagsKuebel: number | null
    growbagsKuebelSubstrat: SelectionValue[]
    kuebelVolumenProTopf: MeasureValue | null
    kuebelJungpflanzenProTopf: MeasureValue | null
    kuebelAlter: DateValue | null
    schnur: number | null
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
    jungpflanzenZukauf: number | null
    jungpflanzenDistanz: MeasureValue | null
    jungpflanzenSubstrat: number | null
    verpackungsmaterial: SelectionValue[]
    anzahlNutzungenMehrwegsteigen: MeasureValue | null
    sonstVerbrauchsmaterialien: SelectionValue[]
    zusaetzlicherMaschineneinsatz: SelectionValue[]


}

const CompanyMaterialsInput = (props: CompanyMaterialsProps) => {
    const [companyMaterials, setCompanyMaterials] = useState<CompanyMaterialsState>(props.values)

    const setCompanyMaterialsState = (companyMaterials: CompanyMaterialsState) => {
        setCompanyMaterials(companyMaterials)
        props.provideCompanyMaterials(companyMaterials)
    }

    // Properties of the input fields
    const growbagsKuebelSubstratProps: DynamicInputProps = {
        title: "Substratart & Nutzungsdauer",
        label: "Welches Substrat wird verwendet und wie lange?",
        textFieldProps: {label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: props.lookupValues.Substrat
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Substrat,
            unitValues:  props.unitValues,
            optionGroup: "Substrat"
        },
        onValueChange: values => setCompanyMaterialsState({
            ...companyMaterials,
            growbagsKuebelSubstrat: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue, textField2Value: value.textField2Value
                }
            })
        }),
        initValues: props.values.growbagsKuebelSubstrat
    }

    const kuebelVolumenProps: MeasureInputProps = {
        title: "Gefäßvolumen",
        label: "Wie viel Liter hat ein Kulturgefäß?",
        unitName: props.unitValues.measures["Kuebel:VolumenProTopf"][0]?.values,
        textFieldProps: {
            value: companyMaterials.kuebelVolumenProTopf?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelVolumenProTopf: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Kuebel:VolumenProTopf"][0].id}
            })
        }
    }

    const kuebelJungpflanzenProps: MeasureInputProps = {
        title: "Anzahl Pflanzen pro Gefäß",
        label: "Wie viele Jungpflanzen werden pro Topf ausgepflanzt?",
        unitName: props.unitValues.measures["Kuebel:JungpflanzenProTopf"][0]?.values,
        textFieldProps: {
            value: companyMaterials.kuebelJungpflanzenProTopf?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelJungpflanzenProTopf: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Kuebel:JungpflanzenProTopf"][0].id}
            })
        }
    }

    const kuebelAnschaffungsjahrProps: DateInputProps = {
        title: "Verwendungsdauer",
        label: "Wie lange verwenden Sie das Gefäß durchschnittlich?",
        datePickerProps: {
            views: ['year'],
            value: companyMaterials.kuebelAlter?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelAlter: {value:event,unit:props.unitValues.measures["Kuebel:Alter"][0].id}
            }),
            renderInput: () => <TextField/>
        }
    }

    const growbagsKuebelProps: SelectShowConditionalRadioInputProps = {
        title: "Kulturgefäß",
        label: "Welches Gefäß wird für die Pflanzen verwendet?",
        radioGroupProps: {
            value: companyMaterials.growbagsKuebel,
            onChange: event => setCompanyMaterialsState({
                    ...companyMaterials,
                    growbagsKuebel: parseFloat(event.target.value)
                })
        },
        radioButtonValues: props.lookupValues.GrowbagsKuebel,
        showFirstChildren: value => {
            let trueOptions = props.lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "GROWBAGS");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        showSecondChildren: value => {
            let trueOptions = props.lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "Andere Kulturgefäße (Topf, Kübel)".toUpperCase());
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

    const schnurProps: SingleShowConditionalRadioInputProps = {
        title: "Schnüre / Rankhilfen",
        label: "Verwenden Sie Schnüre/Rankhilfen?",
        radioGroupProps: {
            value: companyMaterials.schnur,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                schnur: parseFloat(event.target.value)
            })
        },
        radioButtonValues: props.lookupValues.Schnur,
        showChildren: value => {
            let trueOptions = props.lookupValues.Schnur.filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }


     const schnurMaterialProps: SelectionInputProps = {
        title: "Material",
        label: "Aus welchem Material sind die Schnüre/Rankhilfen?",
        selectProps: {
            value: companyMaterials.schnurMaterial,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
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
            value: companyMaterials.schnurLaengeProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                schnurLaengeProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["SchnuereRankhilfen:Laenge"][0].id}
            })
        }
    }

    const schnurWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: props.unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.schnurWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                schnurWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0].id}
            })
        }
    }

    const klipseProps: SingleShowConditionalRadioInputProps = {
        title: "Klipse / Ringe",
        label: "Verwenden Sie Klipse oder Ringe zur Befestigung der Pflanzen?",
        radioGroupProps: {
            value: companyMaterials.klipse,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
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
        label: "Aus welchem Material sind die Klipse?",
        selectProps: {
            value: companyMaterials.klipseMaterial,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipseMaterial: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Klipse:Material"]
        },
    }

    const klipseAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Klipse pro Trieb und Kulturjahr an.",
        unitName: props.unitValues.measures["Klipse:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: companyMaterials.klipseAnzProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipseAnzProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Klipse:AnzahlProTrieb"][0].id}
            })
        }
    }

    const klipseWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: props.unitValues.measures["Klipse:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.klipseWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipseWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Klipse:Wiederverwendung"][0].id}
            })
        }
    }

    const rispenbuegelProps: SingleShowConditionalRadioInputProps = {
        title: "Trossbügel",
        label: "Verwenden Sie Tross-/Rispenbügel?",
        radioGroupProps: {
            value: companyMaterials.rispenbuegel,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
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
        label: "Aus welchem Material sind die Bügel?",
        selectProps: {
            value: companyMaterials.rispenbuegelMaterial,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegelMaterial: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Rispenbuegel:Material"]
        },
    }

    const rispenbuegelAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Bügel pro Trieb und Kulturjahr an.",
        unitName: props.unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: companyMaterials.rispenbuegelAnzProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegelAnzProTrieb: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0].id}
            })
        }
    }

    const rispenbuegelWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: props.unitValues.measures["Rispenbuegel:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.rispenbuegelWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegelWiederverwendung: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Rispenbuegel:Wiederverwendung"][0].id}
            })
        }
    }

    const jungpflanzenZukaufProps: SingleShowConditionalRadioInputProps = {
        title: "Jungpflanzen",
        label: "Werden die Junpflanzen zugekauft?",
        radioGroupProps: {
            value: companyMaterials.jungpflanzenZukauf,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
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
        label: "Wie weit ist der Transport zu Ihnen?",
        unitName: props.unitValues.measures["Jungpflanzen:Distanz"][0]?.values,
        textFieldProps: {
            value: companyMaterials.jungpflanzenDistanz?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                jungpflanzenDistanz: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Jungpflanzen:Distanz"][0].id}
            })
        }
    }

    const jungpflanzenSubstratProps: SelectionInputProps = {
        title: "Jungpflanzensubstrat",
        label: "Welches Substrat wird bei der Jungpflanzenanzucht verwendet?",
        selectProps: {
            value: companyMaterials.jungpflanzenSubstrat,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                jungpflanzenSubstrat: parseFloat(event.target.value)
            }),
            lookupValues: props.lookupValues["Jungpflanzen:Substrat"]
        }
    }



    const verpackungsmaterialProps: DynamicInputProps = {
        title: "Verpackungsmaterial",
        label: "Welches Material wird für die Verpackung der Ware in dem entsprechenden Haus verwendet?",
        optional: true,
        textFieldProps: {},
        selectProps: {
            lookupValues: props.lookupValues.Verpackungsmaterial
        },
        unitSelectProps: {
            lookupValues: props.lookupValues.Verpackungsmaterial,
            unitValues:  props.unitValues,
            optionGroup: "Verpackungsmaterial"
        },
        onValueChange: values => setCompanyMaterialsState({
            ...companyMaterials,
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
        label: "Anzahl der individuellen Nutzungen von Mehrwegsteigen. (IFCO, EPS) Eine Nutzung beinhaltet das Befüllen mit Ware, das Ausliefern, sowie Zurückerhalten der Steige oder einer gleichwertigen Steige.",
        optional: true,
        unitName: props.unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0]?.values,
        textFieldProps: {
            value: companyMaterials.anzahlNutzungenMehrwegsteigen?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                anzahlNutzungenMehrwegsteigen: {value:parseFloat(event.target.value),unit:props.unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0].id}
            })
        }
    }

    const sonstVerbrauchsmaterialienProps: DynamicInputProps = {
        title: "Sonstige Betriebsmittel",
        label: "Geben Sie sonstige Materialienverwendungen oder –verbräuche und deren Nutzungsdauern an, falls diese noch nicht erfasst wurden.",
        optional: true,
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
        onValueChange: values => setCompanyMaterialsState({
            ...companyMaterials,
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
        title: "Zusätzlicher Maschineneinsatz",
        label: "Geben Sie Ihren zusaetzlichen Maschineneinsatz an, falls Sie welche verwenden.",
        optional: true,
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
        onValueChange: values => setCompanyMaterialsState({
            ...companyMaterials,
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
            <SectionDivider title="Kulturgefäße & Substrate"/>
            <Grid item container xs={12} spacing={4}>
                <SelectShowConditionalRadioInputField {...growbagsKuebelProps}/>
            </Grid>
            <SectionDivider title="Schnüre / Rankhilfen"/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...schnurProps}>
                    <Grid item container xs={12} spacing={4}>
                        <SelectionInputField {...schnurMaterialProps}/>
                        <MeasureInputField {...schnurLaengeProps}/>
                    </Grid>
                    <Grid item container xs={12} spacing={4}>
                        <MeasureInputField {...schnurWiederverwendungProps} />
                    </Grid>
                </SingleShowConditionalRadioInputField>
            </Grid>
            <SectionDivider title="Klipse / Ringe"/>
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
            <SectionDivider title="Trossbügel"/>
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
            <SectionDivider title="Jungpflanzen"/>
            <Grid item container xs={12} spacing={4}>
                <SingleShowConditionalRadioInputField {...jungpflanzenZukaufProps} >
                    <MeasureInputField {...jungpflanzenDistanzProps} />
                </SingleShowConditionalRadioInputField>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <SelectionInputField {...jungpflanzenSubstratProps}/>
            </Grid>
            <SectionDivider title="Verpackung"/>
            <Grid item container xs={12} spacing={4}>
                <DynamicInputField {...verpackungsmaterialProps}/>
            </Grid>
            <Grid item container xs={12} spacing={4}>
                <MeasureInputField {...verpackungAnzahlNutzungenMehrwegsteigen}/>
            </Grid>
            <SectionDivider title="Sonstiges"/>
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

export default connector(CompanyMaterialsInput);
