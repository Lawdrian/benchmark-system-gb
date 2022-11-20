/**
 * #####################################################################
 * This is the page component for rendering the data input page. It uses
 * the files inside the inputpages folder. Each file stands for a different
 * tab. The files have their own state, that will get bought up to the
 * PageInputData component via hooks:
 * (for Example provideCompanyInformation={setCompanyInformation})
 *######################################################################
 */


import * as React from "react";
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import {connect, ConnectedProps} from "react-redux";
import {InputPaginationButtonsProps} from "../utils/inputPage/InputPaginationButtons";
import {indexedTabProps, TabPanel} from "../../helpers/TabPanel";
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";
import HelpingMaterialsInput, {HelpingMaterialsState} from "./input/HelpingMaterials";
import CompanyInformationInput, {CompanyInformationState} from "./input/CompanyInformation";
import {MeasureValue, SelectionValue} from "../utils/inputPage/InputFields";
import CultureInformationInput, {CultureInformationState} from "./input/CultureInformation";
import CompanyMaterialsInput, {CompanyMaterialsState} from "./input/CompanyMaterials";
import EnergyConsumptionInput, {EnergyConsumptionState} from "./input/EnergyConsumption";
import {submitGreenhouseData} from "../../actions/submission";
import {GreenhouseData} from "../../types/reduxTypes";
import {useNavigate} from "react-router-dom";
import {Tab, Tabs} from "@mui/material";
import {RootState} from "../../store";
import {format} from "date-fns";

const mapStateToProps = (state: RootState) => ({
    submission: state.submission,
    unitValues: state.lookup.unitValues
});

const mapDispatchToProps = {
    submitGreenhouseData,
    loadLookupValues,
    loadUnitValues
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type InputDataProps = ReduxProps & {
    initialData : DataToSubmit
}

export type SubpageProps = {
    paginationProps: InputPaginationButtonsProps
}

export type DataToSubmit = {
    companyInformation: CompanyInformationState
    cultureInformation: CultureInformationState
    energyConsumption: EnergyConsumptionState
    helpingMaterials: HelpingMaterialsState
    companyMaterials: CompanyMaterialsState
}

const formatOptionValues = (values: SelectionValue[]|number): string => {
    let formattedString = "["

    if(typeof(values)!='number') {
        for (let i = 0; i < values.length; i++) {
            let value = values[i]
            let tupleString =
                "(" +
                value.selectValue +
                (value.textFieldValue.value && value.textFieldValue.unit ?
                    ("," + value.textFieldValue.value + "," + value.textFieldValue.unit + (value.textField2Value ? "," + value.textField2Value : "")) : "") +
                ")"
            formattedString = formattedString + tupleString
            if (i < values.length - 1) {
                formattedString = formattedString + ","
            }
        }
    }
    else {
        formattedString = formattedString + "(" + values + ")"
    }

    formattedString = formattedString + "]"

    return formattedString
}

const formatMeasureValue = (value: MeasureValue | null): string | null => {
    if (value==null) return null
    let formattedString=""
    if (value.value != null && value.unit != null) {
        formattedString = `(${value.value},${value.unit})`
    }
    else return null

    return formattedString
}


/**
 * This function processes the data from the state of the input page component and maps it to the correct
 * values and types specified by the GreenhouseData type.
 *
 *
 * @param {DataToSubmit} dataToSubmit The state for the whole input page
 *
 * @return GreenhouseData Data in the GreenhouseData format that is used by the submitGrennhouseData function to
 * save the data to the database
 */
const processDataToSubmit = (dataToSubmit: DataToSubmit): GreenhouseData => {
    const {
        companyInformation,
        cultureInformation,
        energyConsumption,
        helpingMaterials,
        companyMaterials
    } = dataToSubmit

    const defaultValue = "(0,0)"
    const defaultOption = "[(0,)]"

    const calcAge = (year?: Date | null) => {
        if(year!=null) {
            const today = new Date()
            const age = today.getFullYear() - year.getFullYear()
            if (age > 0) return `(${age},1)`
            else return "(1,1)"
        }
        else return defaultValue
    }



    // TODO: Implement a proper default value concept. Maybe get default value object from server?
    //submittionData maps the data from the dataToSubmit state so it can be used in the post request
    let submissionData: GreenhouseData = {
        greenhouse_name: companyInformation?.gewaechshausName ??  "Standardhaus",
        date: companyInformation.datum ? format(companyInformation.datum, 'yyyy-MM-dd') : new Date().toISOString().substring(0, 10),
        PLZ: formatMeasureValue(companyInformation?.plz) ?? defaultValue,
        GWHFlaeche: formatMeasureValue(companyInformation?.gwhFlaeche) ?? defaultValue,
        Nutzflaeche: formatMeasureValue(companyInformation?.nutzflaeche) ?? defaultValue,
        WaermeteilungFlaeche: formatMeasureValue(energyConsumption?.waermeteilungFlaeche) ?? defaultValue,
        GWHAlter: companyInformation?.gwhAlter ? calcAge(companyInformation?.gwhAlter.value) : defaultValue,
        AlterBedachungsmaterial: companyInformation?.bedachungsmaterialAlter ? calcAge(companyInformation?.bedachungsmaterialAlter.value) : defaultValue,
        AlterStehwandmaterial: companyInformation?.stehwandmaterialAlter ? calcAge(companyInformation?.stehwandmaterialAlter.value) : defaultValue,
        AlterEnergieschirm: companyInformation?.energieschirmAlter ? calcAge(companyInformation?.energieschirmAlter.value) : defaultValue,
        Stehwandhoehe: formatMeasureValue(companyInformation?.stehwandhoehe) ?? defaultValue,
        Laenge: formatMeasureValue(companyInformation?.laenge) ?? defaultValue,
        Breite: formatMeasureValue(companyInformation?.breite) ?? defaultValue,
        Kappenbreite: formatMeasureValue(companyInformation?.kappenbreite) ?? defaultValue,
        Scheibenlaenge: formatMeasureValue(companyInformation?.scheibenlaenge) ?? defaultValue,
        "Reihenabstand(Rinnenabstand)": formatMeasureValue(companyInformation?.reihenabstand) ?? defaultValue,
        Vorwegbreite: formatMeasureValue(companyInformation?.vorwegbreite) ?? defaultValue,
        AlterHeizsystem: companyInformation?.heizsystemAlter ? calcAge(companyInformation?.heizsystemAlter.value): defaultValue,
        AlterProduktionssystem: companyInformation?.produktionssystemAlter ? calcAge(companyInformation?.produktionssystemAlter.value) : defaultValue,
        AlterZusaetzlichesHeizsystem: companyInformation?.zusaetzlichesHeizsystemAlter ? calcAge(companyInformation?.zusaetzlichesHeizsystemAlter.value) : defaultValue,
        SnackReihenanzahl: formatMeasureValue(cultureInformation?.snackReihenanzahl) ?? defaultValue,
        SnackPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.snackPflanzenabstand) ?? defaultValue,
        SnackTriebzahl: formatMeasureValue(cultureInformation?.snackTriebzahl) ?? defaultValue,
        SnackErtragJahr: formatMeasureValue(cultureInformation?.snackErtragJahr) ?? defaultValue,
        CocktailReihenanzahl: formatMeasureValue(cultureInformation?.cocktailReihenanzahl) ?? defaultValue,
        CocktailPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.cocktailPflanzenabstand) ?? defaultValue,
        CocktailTriebzahl: formatMeasureValue(cultureInformation?.cocktailTriebzahl) ?? defaultValue,
        CocktailErtragJahr: formatMeasureValue(cultureInformation?.cocktailErtragJahr) ?? defaultValue,
        RispenReihenanzahl: formatMeasureValue(cultureInformation?.rispenReihenanzahl) ?? defaultValue,
        RispenPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.rispenPflanzenabstand) ?? defaultValue,
        RispenTriebzahl: formatMeasureValue(cultureInformation?.rispenTriebzahl) ?? defaultValue,
        RispenErtragJahr: formatMeasureValue(cultureInformation?.rispenErtragJahr) ?? defaultValue,
        FleischReihenanzahl: formatMeasureValue(cultureInformation?.fleischReihenanzahl) ?? defaultValue,
        FleischPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.fleischPflanzenabstand) ?? defaultValue,
        FleischTriebzahl: formatMeasureValue(cultureInformation?.fleischTriebzahl) ?? defaultValue,
        FleischErtragJahr: formatMeasureValue(cultureInformation?.fleischErtragJahr) ?? defaultValue,
        KulturBeginn: formatMeasureValue(cultureInformation?.kulturBeginn) ?? defaultValue,
        KulturEnde: formatMeasureValue(cultureInformation?.kulturEnde) ?? defaultValue,
        NebenkulturBeginn: formatMeasureValue(cultureInformation?.nebenkulturBeginn) ?? defaultValue,
        NebenkulturEnde: formatMeasureValue(cultureInformation?.nebenkulturEnde) ?? defaultValue,
        "BHKW:AnteilErdgas": formatMeasureValue(energyConsumption?.bhkwAnteilErdgas) ?? defaultValue,
        "BHKW:AnteilBiomethan": formatMeasureValue(energyConsumption?.bhkwAnteilBiomethan) ?? defaultValue,
        "Belichtung:Stromverbrauch": formatMeasureValue(energyConsumption?.belichtungsstromStromverbrauch) ?? defaultValue,
        "Belichtung:AnzahlLampen": formatMeasureValue(energyConsumption?.belichtungsstromAnzLampen) ?? defaultValue,
        "Belichtung:AnschlussleistungProLampe": formatMeasureValue(energyConsumption?.belichtungsstromAnschlussleistung) ?? defaultValue,
        "Belichtung:LaufzeitProJahr": formatMeasureValue(energyConsumption?.belichtungsstromLaufzeitJahr) ?? defaultValue,
        FungizideKg: formatMeasureValue({value: (helpingMaterials?.fungizideKg?.value??0)+100*(helpingMaterials.fungizideLiter?.value??0), unit: helpingMaterials?.fungizideKg?.unit??null}) ?? defaultValue, //The 100 is the factor to convert from liter to kg
        InsektizideKg: formatMeasureValue({value: (helpingMaterials?.insektizideKg?.value??0)+100*(helpingMaterials.insektizideLiter?.value??0), unit: helpingMaterials?.insektizideKg?.unit??null}) ?? defaultValue, //The 100 is the factor to convert from liter to kg
        "Kuebel:VolumenProTopf": formatMeasureValue(companyMaterials?.kuebelVolumenProTopf) ?? defaultValue,
        "Kuebel:JungpflanzenProTopf": formatMeasureValue(companyMaterials?.kuebelJungpflanzenProTopf) ?? defaultValue,
        "Kuebel:Alter": formatMeasureValue(companyMaterials?.kuebelAlter) ?? defaultValue,
        "SchnuereRankhilfen:Laenge": formatMeasureValue(companyMaterials?.schnurLaengeProTrieb) ?? defaultValue,
        "SchnuereRankhilfen:Wiederverwendung": formatMeasureValue(companyMaterials?.schnurWiederverwendung) ?? defaultValue,
        "Klipse:AnzahlProTrieb": formatMeasureValue(companyMaterials?.klipseAnzProTrieb) ?? defaultValue,
        "Klipse:Wiederverwendung": formatMeasureValue(companyMaterials?.klipseWiederverwendung) ?? defaultValue,
        "Rispenbuegel:AnzahlProTrieb": formatMeasureValue(companyMaterials?.rispenbuegelAnzProTrieb) ?? defaultValue,
        "Rispenbuegel:Wiederverwendung": formatMeasureValue(companyMaterials?.rispenbuegelWiederverwendung) ?? defaultValue,
        "Jungpflanzen:Distanz": formatMeasureValue(companyMaterials?.jungpflanzenDistanz) ?? defaultValue,
        "Verpackungsmaterial:AnzahlMehrwegsteigen": formatMeasureValue(companyMaterials?.anzahlNutzungenMehrwegsteigen) ?? defaultValue,
        Waermeversorgung: energyConsumption?.waermeversorgung ? formatOptionValues(energyConsumption.waermeversorgung) : defaultOption,
        GWHArt: companyInformation?.gwhArt ? formatOptionValues(companyInformation.gwhArt) : defaultOption,
        Bedachungsmaterial: companyInformation?.bedachungsmaterial ? formatOptionValues(companyInformation.bedachungsmaterial) : defaultOption,
        Stehwandmaterial: companyInformation?.stehwandmaterial ? formatOptionValues(companyInformation.stehwandmaterial) : defaultOption,
        Energieschirm: companyInformation?.energieschirm ? formatOptionValues(companyInformation.energieschirm) : defaultOption,
        Heizsystem: companyInformation?.heizsystem ? formatOptionValues(companyInformation.heizsystem) : defaultOption,
        Produktionstyp: companyInformation?.produktionsweise ? formatOptionValues(companyInformation.produktionsweise) : defaultOption,
        Produktionssystem: companyInformation?.produktionssystem ? formatOptionValues(companyInformation.produktionssystem) : defaultOption,
        ZusaetzlichesHeizsystem: companyInformation?.zusaetzlichesHeizsystem ? formatOptionValues(companyInformation.zusaetzlichesHeizsystem) : defaultOption,
        "10-30Gramm(Snack)": cultureInformation?.snack ? formatOptionValues(cultureInformation.snack) : defaultOption,
        "30-100Gramm(Cocktail)": cultureInformation?.cocktail ? formatOptionValues(cultureInformation.cocktail) : defaultOption,
        "100-150Gramm(Rispen)": cultureInformation?.rispen ? formatOptionValues(cultureInformation.rispen) : defaultOption,
        ">150Gramm(Fleisch)": cultureInformation?.fleisch ? formatOptionValues(cultureInformation.fleisch) : defaultOption,
        Nebenkultur: cultureInformation?.nebenkultur ? formatOptionValues(cultureInformation.nebenkultur) : defaultOption,
        Energietraeger: energyConsumption?.energietraeger[0].selectValue ? formatOptionValues(energyConsumption.energietraeger) : defaultOption,
        BHKW: energyConsumption?.bhkw ? formatOptionValues(energyConsumption.bhkw) : defaultOption,
        Stromherkunft: energyConsumption?.stromherkunft[0].selectValue ? formatOptionValues(energyConsumption.stromherkunft) : defaultOption,
        GrowbagsKuebel: companyMaterials?.growbagsKuebel ? formatOptionValues(companyMaterials.growbagsKuebel) : defaultOption,
        Schnur:companyMaterials?.schnur? formatOptionValues(companyMaterials.schnur) : defaultOption,
        Klipse:companyMaterials?.klipse ? formatOptionValues(companyMaterials.klipse) : defaultOption,
        Rispenbuegel:companyMaterials?.rispenbuegel ? formatOptionValues(companyMaterials.rispenbuegel) : defaultOption,
        Bewaesserungsart: companyInformation?.bewaesserArt ? formatOptionValues(companyInformation.bewaesserArt) : defaultOption,
        "Jungpflanzen:Zukauf": companyMaterials?.jungpflanzenZukauf ? formatOptionValues(companyMaterials.jungpflanzenZukauf) : defaultOption,
        "CO2-Herkunft": helpingMaterials?.co2Herkunft[0].selectValue ? formatOptionValues(helpingMaterials.co2Herkunft) : defaultOption,
        "Duengemittel:VereinfachteAngabe": helpingMaterials?.duengemittelSimple[0].selectValue ? formatOptionValues(helpingMaterials.duengemittelSimple) : defaultOption,
        "Duengemittel:DetaillierteAngabe": helpingMaterials?.duengemittelDetail[0].selectValue ? formatOptionValues(helpingMaterials.duengemittelDetail) : defaultOption,
        "Jungpflanzen:Substrat": companyMaterials?.jungpflanzenSubstrat ? formatOptionValues(companyMaterials.jungpflanzenSubstrat) : defaultOption,
        "SchnuereRankhilfen:Material": companyMaterials?.schnurMaterial ? formatOptionValues(companyMaterials.schnurMaterial) : defaultOption,
        Bodenabdeckung: companyInformation?.bodenabdeckung[0].selectValue ? formatOptionValues(companyInformation.bodenabdeckung) : defaultOption,
        SonstigeVerbrauchsmaterialien: companyMaterials?.sonstVerbrauchsmaterialien[0].selectValue ? formatOptionValues(companyMaterials.sonstVerbrauchsmaterialien) : defaultOption,
        Verpackungsmaterial: companyMaterials?.verpackungsmaterial[0].selectValue ? formatOptionValues(companyMaterials.verpackungsmaterial) : defaultOption,
        BelichtungsstromEinheit: energyConsumption?.belichtungsstromEinheit ? formatOptionValues(energyConsumption.belichtungsstromEinheit) : defaultOption,
        "Klipse:Material": companyMaterials?.klipseMaterial ? formatOptionValues(companyMaterials.klipseMaterial) : defaultOption,
        "Rispenbuegel:Material": companyMaterials?.rispenbuegelMaterial ? formatOptionValues(companyMaterials.rispenbuegelMaterial) : defaultOption,
        Substrat: companyMaterials?.growbagsKuebelSubstrat && companyMaterials?.growbagsKuebelSubstrat[0].selectValue != null ? formatOptionValues(companyMaterials.growbagsKuebelSubstrat) : defaultOption,
        Zusatzbelichtung: energyConsumption?.zusatzbelichtung ? formatOptionValues(energyConsumption.zusatzbelichtung) : defaultOption,
        Belichtungsstrom: energyConsumption?.belichtungsstrom ? formatOptionValues(energyConsumption.belichtungsstrom) : defaultOption,
        EnergieschirmTyp: companyInformation?.energieschirmTyp ? formatOptionValues(companyInformation.energieschirmTyp) : defaultOption,
        ZusaetzlichesHeizsystemTyp: companyInformation?.zusaetzlichesHeizsystemTyp ? formatOptionValues(companyInformation.zusaetzlichesHeizsystemTyp) : defaultOption,
    }
    console.log("SubmissionData:")
    console.log(submissionData)
    return submissionData
}

const PageInputData = (props: InputDataProps) => {
    useEffect(() => {
        props.loadLookupValues()
        props.loadUnitValues()
    }, [])

    const navigate = useNavigate()

    const [dataToSubmit, setDataToSubmit] = useState<DataToSubmit>(props.initialData)
    const [tab, setTab] = useState<number>(0)
    const paginationProps: InputPaginationButtonsProps = {
        hasNext: () => tab < 4,
        hasPrevious: () => tab > 0,
        next: () => setTab(tab + 1),
        previous: () => setTab(tab - 1),
        submit: (setOpenDialog: Function, handleSubmitSuccess: Function, handleSubmitError: Function) => {
            props.submitGreenhouseData(
                processDataToSubmit(dataToSubmit),
                () => {},
                true,
                () => {setOpenDialog()},
                () => {handleSubmitSuccess()},
                () => {handleSubmitError()}
            )

        }
    }

    //These functions are passed down to the subpages so that they can update the main state with their state
    const setCompanyInformation = (companyInformation: CompanyInformationState) => setDataToSubmit({...dataToSubmit, companyInformation})
    const setCultureInformation = (cultureInformation: CultureInformationState) => setDataToSubmit({...dataToSubmit, cultureInformation})
    const setEnergyConsumption = (energyConsumption: EnergyConsumptionState) => setDataToSubmit({...dataToSubmit, energyConsumption})
    const setHelpingMaterials = (helpingMaterials: HelpingMaterialsState) => setDataToSubmit({...dataToSubmit, helpingMaterials})
    const setCompanyMaterials = (companyMaterials: CompanyMaterialsState) => {
        setDataToSubmit({...dataToSubmit, companyMaterials})
    }

    return (
        <Box sx={{width: '100%'}}>
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="tabs">
              <Tab label="Betriebsdaten" {...indexedTabProps(0)} />
              <Tab label="Kulturdaten" {...indexedTabProps(1)} />
              <Tab label="Energieverbrauch" {...indexedTabProps(2)} />
              <Tab label="Hilfsstoffe" {...indexedTabProps(3)} />
              <Tab label="Betriebsstoffe" {...indexedTabProps(4)} />
            </Tabs>

            <TabPanel index={0} value={tab}>
                <CompanyInformationInput paginationProps={paginationProps} provideCompanyInformation={setCompanyInformation} values={dataToSubmit.companyInformation}/>
            </TabPanel>
            <TabPanel index={1} value={tab}>
                <CultureInformationInput paginationProps={paginationProps} provideCultureInformation={setCultureInformation} values={dataToSubmit.cultureInformation}/>
            </TabPanel>
            <TabPanel index={2} value={tab}>
                <EnergyConsumptionInput paginationProps={paginationProps} provideEnergyConsumption={setEnergyConsumption} values={dataToSubmit.energyConsumption}/>
            </TabPanel>
            <TabPanel index={3} value={tab}>
                <HelpingMaterialsInput paginationProps={paginationProps} provideHelpingMaterials={setHelpingMaterials} values={dataToSubmit.helpingMaterials}/>
            </TabPanel>
            <TabPanel index={4} value={tab}>
                <CompanyMaterialsInput paginationProps={paginationProps} provideCompanyMaterials={setCompanyMaterials} values={dataToSubmit.companyMaterials}/>
            </TabPanel>
        </Box>
    );
}
export default connector(PageInputData)









