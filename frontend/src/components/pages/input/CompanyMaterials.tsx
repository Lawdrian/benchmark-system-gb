// Verbrauchsmaterialien
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {
    DynamicInputField, DynamicInputProps,
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
import {SectionDivider} from "../../utils/inputPage/layout";
import {parseToFloat} from "../../../helpers/InputHelpers";

const mapStateToProps = (state: RootState) => ({
    lookupValues: state.lookup.lookupValues,
    unitValues: state.lookup.unitValues,
    submissionSuccess: state.submission.successful
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type CompanyMaterialsProps = ReduxProps & SubpageProps & {
    provideCompanyMaterials: Function
    showMeasureInputError: Function
    showSelectInputError: Function
    values: CompanyMaterialsState
}

export type CompanyMaterialsState = {
    growbagsKuebel: number | null
    growbagsKuebelSubstrat: SelectionValue[]
    kuebelVolumenProTopf: MeasureValue | null
    kuebelJungpflanzenProTopf: MeasureValue | null
    kuebelAlter: MeasureValue | null
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


}

const CompanyMaterialsInput = ({values, provideCompanyMaterials, paginationProps, lookupValues, submissionSuccess, unitValues, showSelectInputError, showMeasureInputError}: CompanyMaterialsProps) => {
    const [companyMaterials, setCompanyMaterials] = useState<CompanyMaterialsState>(values)

    const setCompanyMaterialsState = (companyMaterials: CompanyMaterialsState) => {
        setCompanyMaterials(companyMaterials)
        provideCompanyMaterials(companyMaterials)
    }

    // Properties of the input fields
    const growbagsKuebelSubstratProps: DynamicInputProps = {
        title: "Substratart & Nutzungsdauer",
        label: "Welches Substrat wird verwendet und wie lange?",
        submissionSuccess: submissionSuccess,
        unitProps: {
            unitName: unitValues.selections.Substrat.Kokos[0]?.values,
            optionGroup: "Substrat",
            unitValues: unitValues
        },
        textFieldProps: {label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: lookupValues.Substrat
        },
        onValueChange: values => setCompanyMaterialsState({
            ...companyMaterials,
            growbagsKuebelSubstrat: values.map(value => {
                return {
                    selectValue: value.selectValue, textFieldValue:value.textFieldValue, textField2Value: value.textField2Value
                }
            })
        }),
        initValues: values.growbagsKuebelSubstrat
    }

    const kuebelVolumenProps: MeasureInputProps = {
        title: "Gefäßvolumen",
        label: "Wie viel Liter hat ein Kulturgefäß?",
        unitName: unitValues.measures["Kuebel:VolumenProTopf"][0]?.values,
        textFieldProps: {
            value: companyMaterials.kuebelVolumenProTopf?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelVolumenProTopf: {value:parseToFloat(event.target.value),unit:unitValues.measures["Kuebel:VolumenProTopf"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.kuebelVolumenProTopf)
        }
    }

    const kuebelJungpflanzenProps: MeasureInputProps = {
        title: "Anzahl Pflanzen pro Gefäß",
        label: "Wie viele Jungpflanzen werden pro Topf ausgepflanzt?",
        unitName: unitValues.measures["Kuebel:JungpflanzenProTopf"][0]?.values,
        textFieldProps: {
            value: companyMaterials.kuebelJungpflanzenProTopf?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelJungpflanzenProTopf: {value:parseToFloat(event.target.value),unit:unitValues.measures["Kuebel:JungpflanzenProTopf"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.kuebelJungpflanzenProTopf)
        }
    }

    const kuebelNutzungsdauerProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange verwenden Sie das Gefäß durchschnittlich?",
        unitName: unitValues.measures["Kuebel:Alter"][0]?.values,
        textFieldProps: {
            value: companyMaterials.kuebelAlter?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                kuebelAlter: {value:parseToFloat(event.target.value),unit:unitValues.measures["Kuebel:Alter"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.kuebelAlter)
        }
    }

    const growbagsKuebelProps: SelectShowConditionalRadioInputProps = {
        title: "Kulturgefäß",
        label: "Welches Gefäß wird für die Pflanzen verwendet?",
        radioGroupProps: {
            value: companyMaterials.growbagsKuebel,
            onChange: event => setCompanyMaterialsState({
                    ...companyMaterials,
                    growbagsKuebel: parseToFloat(event.target.value)
                })
        },
        radioButtonValues: lookupValues.GrowbagsKuebel,
        showFirstChildren: value => {
            let trueOptions = lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "GROWBAGS");
            return trueOptions.length > 0 && trueOptions[0].id == value
        },
        showSecondChildren: value => {
            let trueOptions = lookupValues.GrowbagsKuebel.filter(option => option.values.toUpperCase() == "Andere Kulturgefaesse (Topf, Kuebel)".toUpperCase());
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
                    <MeasureInputField {...kuebelNutzungsdauerProps} />
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
                schnur: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Schnur,
        showChildren: value => {
            let trueOptions = lookupValues.Schnur.filter(option => option.values.toUpperCase() == "JA");
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
                schnurMaterial: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues["SchnuereRankhilfen:Material"],
            error: showSelectInputError(companyMaterials.schnurMaterial)
        }
    }

    const schnurLaengeProps: MeasureInputProps = {
        title: "Länge",
        label: "Wie lang sind die Schnüre/Rankhilfen je Trieb?",
        unitName: unitValues.measures["SchnuereRankhilfen:Laenge"][0]?.values,
        textFieldProps: {
            value: companyMaterials.schnurLaengeProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                schnurLaengeProTrieb: {value:parseToFloat(event.target.value),unit:unitValues.measures["SchnuereRankhilfen:Laenge"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.schnurLaengeProTrieb)
        }
    }

    const schnurWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.schnurWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                schnurWiederverwendung: {value:parseToFloat(event.target.value),unit:unitValues.measures["SchnuereRankhilfen:Wiederverwendung"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.schnurWiederverwendung)
        }
    }

    const klipseProps: SingleShowConditionalRadioInputProps = {
        title: "Klipse / Ringe",
        label: "Verwenden Sie Klipse oder Ringe zur Befestigung der Pflanzen?",
        radioGroupProps: {
            value: companyMaterials.klipse,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipse: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Klipse,
        showChildren: value => {
            let trueOptions = lookupValues.Klipse.filter(option => option.values.toUpperCase() == "JA");
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
                klipseMaterial: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues["Klipse:Material"],
            error: showSelectInputError(companyMaterials.klipseMaterial)
        },
    }

    const klipseAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Klipse pro Trieb und Kulturjahr an.",
        unitName: unitValues.measures["Klipse:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: companyMaterials.klipseAnzProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipseAnzProTrieb: {value:parseToFloat(event.target.value),unit:unitValues.measures["Klipse:AnzahlProTrieb"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.klipseAnzProTrieb)
        }
    }

    const klipseWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: unitValues.measures["Klipse:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.klipseWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                klipseWiederverwendung: {value:parseToFloat(event.target.value),unit:unitValues.measures["Klipse:Wiederverwendung"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.klipseWiederverwendung)
        }
    }

    const rispenbuegelProps: SingleShowConditionalRadioInputProps = {
        title: "Trossbügel",
        label: "Verwenden Sie Tross-/Rispenbügel?",
        radioGroupProps: {
            value: companyMaterials.rispenbuegel,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegel: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues.Rispenbuegel,
        showChildren: value => {
            let trueOptions = lookupValues.Rispenbuegel.filter(option => option.values.toUpperCase() == "JA");
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
                rispenbuegelMaterial: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues["Rispenbuegel:Material"],
            error: showSelectInputError(companyMaterials.rispenbuegelMaterial)
        },
    }

    const rispenbuegelAnzProTriebProps: MeasureInputProps = {
        title: "Anzahl pro Trieb",
        label: "Geben Sie die Anzahl der Bügel pro Trieb und Kulturjahr an.",
        unitName: unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0]?.values,
        textFieldProps: {
            value: companyMaterials.rispenbuegelAnzProTrieb?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegelAnzProTrieb: {value:parseToFloat(event.target.value),unit:unitValues.measures["Rispenbuegel:AnzahlProTrieb"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.rispenbuegelAnzProTrieb)
        }
    }

    const rispenbuegelWiederverwendungProps: MeasureInputProps = {
        title: "Nutzungsdauer",
        label: "Wie lange werden diese wiederverwendet?",
        unitName: unitValues.measures["Rispenbuegel:Wiederverwendung"][0]?.values,
        textFieldProps: {
            value: companyMaterials.rispenbuegelWiederverwendung?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                rispenbuegelWiederverwendung: {value:parseToFloat(event.target.value),unit:unitValues.measures["Rispenbuegel:Wiederverwendung"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.rispenbuegelWiederverwendung)
        }
    }

    const jungpflanzenZukaufProps: SingleShowConditionalRadioInputProps = {
        title: "Jungpflanzen",
        label: "Werden die Junpflanzen zugekauft?",
        radioGroupProps: {
            value: companyMaterials.jungpflanzenZukauf,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                jungpflanzenZukauf: parseToFloat(event.target.value)
            })
        },
        radioButtonValues: lookupValues["Jungpflanzen:Zukauf"],
        showChildren: value => {
            let trueOptions = lookupValues["Jungpflanzen:Zukauf"].filter(option => option.values.toUpperCase() == "JA");
            return trueOptions.length > 0 && trueOptions[0].id == value
        }
    }

    const jungpflanzenDistanzProps: MeasureInputProps = {
        title: "Entfernung",
        label: "Wie weit ist der Transport zu Ihnen?",
        unitName: unitValues.measures["Jungpflanzen:Distanz"][0]?.values,
        textFieldProps: {
            value: companyMaterials.jungpflanzenDistanz?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                jungpflanzenDistanz: {value:parseToFloat(event.target.value),unit:unitValues.measures["Jungpflanzen:Distanz"][0].id}
            }),
            error: showMeasureInputError(companyMaterials.jungpflanzenDistanz)
        }
    }

    const jungpflanzenSubstratProps: SelectionInputProps = {
        title: "Jungpflanzensubstrat",
        label: "Welches Substrat wird bei der Jungpflanzenanzucht verwendet?",
        selectProps: {
            value: companyMaterials.jungpflanzenSubstrat,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                jungpflanzenSubstrat: parseToFloat(event.target.value)
            }),
            lookupValues: lookupValues["Jungpflanzen:Substrat"],
            error: showSelectInputError(companyMaterials.jungpflanzenSubstrat)
        }
    }



    const verpackungsmaterialProps: DynamicInputProps = {
        title: "Verpackungsmaterial",
        label: "Welches Material wird für die Verpackung der Ware in dem entsprechenden Haus verwendet?",
        optional: true,
        submissionSuccess: submissionSuccess,
        textFieldProps: {},
        selectProps: {
            lookupValues: lookupValues.Verpackungsmaterial
        },
        unitProps: {
            unitName: unitValues.selections.Verpackungsmaterial.Karton[0]?.values,
            optionGroup: "Verpackungsmaterial",
            unitValues: unitValues
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
        initValues: values.verpackungsmaterial
    }

    const verpackungAnzahlNutzungenMehrwegsteigen: MeasureInputProps = {
        title: "Mehrwegsteigen",
        label: "Anzahl der individuellen Nutzungen von Mehrwegsteigen. (IFCO, EPS) Eine Nutzung beinhaltet das Befüllen mit Ware, das Ausliefern, sowie Zurückerhalten der Steige oder einer gleichwertigen Steige.",
        optional: true,
        unitName: unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0]?.values,
        textFieldProps: {
            value: companyMaterials.anzahlNutzungenMehrwegsteigen?.value,
            onChange: event => setCompanyMaterialsState({
                ...companyMaterials,
                anzahlNutzungenMehrwegsteigen: {value:parseToFloat(event.target.value),unit:unitValues.measures["Verpackungsmaterial:AnzahlMehrwegsteigen"][0].id}
            })
        }
    }

    const sonstVerbrauchsmaterialienProps: DynamicInputProps = {
        title: "Sonstige Betriebsmittel",
        label: "Geben Sie sonstige Materialienverwendungen oder –verbräuche und deren Nutzungsdauern an, falls diese noch nicht erfasst wurden.",
        optional: true,
        submissionSuccess: submissionSuccess,
        textFieldProps: {},
        textField2Props: {placeholder:"Jahre", label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: lookupValues.SonstigeVerbrauchsmaterialien
        },
        unitProps: {
            unitName: unitValues.selections.SonstigeVerbrauchsmaterialien.Alluminium[0]?.values,
            optionGroup: "SonstigeVerbrauchsmaterialien",
            unitValues: unitValues
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
        initValues: values.sonstVerbrauchsmaterialien
    }

    /*
    const zusaetzlicherMaschineneinsatzProps: DynamicInputProps = {
        title: "Zusätzlicher Maschineneinsatz",
        label: "Geben Sie Ihren zusaetzlichen Maschineneinsatz an, falls Sie welche verwenden.",
        optional: true,
        textFieldProps: {},
        textField2Props: {placeholder:"h/a", label:"Nutzungsdauer"},
        selectProps: {
            lookupValues: lookupValues.ZusaetzlicherMaschineneinsatz
        },
        unitSelectProps: {
            lookupValues: lookupValues.ZusaetzlicherMaschineneinsatz,
            unitValues:  unitValues,
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
        initValues: values.zusaetzlicherMaschineneinsatz
    }
    */

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
            <Grid item container xs={12}>
                <Grid item xs={12}>
                    <InputPaginationButtons {...paginationProps} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default connector(CompanyMaterialsInput);
