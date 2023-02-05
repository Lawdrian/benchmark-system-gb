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
import {InputPaginationButtonsProps} from "../../utils/input/InputPaginationButtons";
import {indexedTabProps, TabPanel} from "../../../helpers/TabPanel";
import {loadLookupValues, loadUnitValues} from "../../../actions/lookup";
import HelpingMaterialsInput, {HelpingMaterialsState} from "./subpages/HelpingMaterials";
import CompanyInformationInput, {CompanyInformationState} from "./subpages/CompanyInformation";
import {DateValue, MeasureValue, SelectionValue} from "../../utils/input/InputFields";
import CultureInformationInput, {CultureInformationState} from "./subpages/CultureInformation";
import CompanyMaterialsInput, {CompanyMaterialsState} from "./subpages/CompanyMaterials";
import EnergyConsumptionInput, {EnergyConsumptionState} from "./subpages/EnergyConsumption";
import {submitGreenhouseData} from "../../../actions/submission";
import {GreenhouseData} from "../../../types/reduxTypes";
import {useNavigate} from "react-router-dom";
import {Tab, Tabs} from "@mui/material";
import {RootState} from "../../../store";
import {format} from "date-fns";
import WaterUsageInput, {WaterUsageState} from "./subpages/WaterUsage";

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
    mode: InputMode
    datasetId?: number
}

export type SubpageProps = {
    paginationProps: InputPaginationButtonsProps
}

export type DataToSubmit = {
    companyInformation: CompanyInformationState
    cultureInformation: CultureInformationState
    energyConsumption: EnergyConsumptionState
    waterUsage: WaterUsageState
    helpingMaterials: HelpingMaterialsState
    companyMaterials: CompanyMaterialsState
}

export const defaultValue = "(0,0)"
export const defaultOption = "[(0,)]"

export enum InputMode {
    create,
    update
}


const formatOptionValue = (value: number|null): string => {
    if (value==null) return defaultOption

    return `[(${value})]`
}

const formatOptionValues = (values: SelectionValue[]): string => {
    if (values[0].selectValue == null || values[0].textFieldValue.value == null) return defaultOption

    let formattedString = "["

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
    formattedString = formattedString + "]"
    return formattedString
}

const formatMeasureValue = (value: MeasureValue | null): string => {

    if (value != null &&
        value.value != null &&
        value.value != 0 &&
        value.unit != null
    ) {
        return `(${value.value},${value.unit})`
    }
    else return defaultValue

}

 const formatDateValue = (date: DateValue | null) => {

        if(date!=null && date.value) {
            const today = new Date()
            const age = today.getFullYear() - date.value.getFullYear()
            if (age > 0) return `(${age},${date.unit})`
            else return `(1,${date.unit})`
        }
        else return defaultValue
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
        waterUsage,
        helpingMaterials,
        companyMaterials
    } = dataToSubmit



    // TODO: Implement a proper default value concept. Maybe get default value object from server?
    //submittionData maps the data from the dataToSubmit state so it can be used in the post request
    let submissionData: GreenhouseData = {
        // Measure input fields
        greenhouse_name: companyInformation?.gewaechshausName ??  "Standardhaus",
        date: companyInformation.datum ? format(companyInformation.datum, 'yyyy-MM-dd') : new Date().toISOString().substring(0, 10),
        GWHFlaeche: formatMeasureValue(companyInformation?.gwhFlaeche),
        Nutzflaeche: formatMeasureValue(companyInformation?.nutzflaeche),
        WaermeteilungFlaeche: formatMeasureValue(energyConsumption?.waermeteilungFlaeche),
        GWHAlter: formatDateValue(companyInformation?.gwhAlter),
        AlterBedachungsmaterial: formatDateValue(companyInformation?.bedachungsmaterialAlter),
        AlterStehwandmaterial: formatDateValue(companyInformation?.stehwandmaterialAlter),
        AlterEnergieschirm: formatDateValue(companyInformation?.energieschirmAlter),
        Stehwandhoehe: formatMeasureValue(companyInformation?.stehwandhoehe),
        Laenge: formatMeasureValue(companyInformation?.laenge),
        Breite: formatMeasureValue(companyInformation?.breite),
        Kappenbreite: formatMeasureValue(companyInformation?.kappenbreite),
        Scheibenlaenge: formatMeasureValue(companyInformation?.scheibenlaenge),
        "Reihenabstand(Rinnenabstand)": formatMeasureValue(companyInformation?.reihenabstand),
        Vorwegbreite: formatMeasureValue(companyInformation?.vorwegbreite),
        AlterHeizsystem: formatDateValue(companyInformation?.heizsystemAlter),
        AlterProduktionssystem: formatDateValue(companyInformation?.produktionssystemAlter),
        AlterZusaetzlichesHeizsystem: formatDateValue(companyInformation?.zusaetzlichesHeizsystemAlter),
        SnackReihenanzahl: formatMeasureValue(cultureInformation?.snackReihenanzahl),
        SnackPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.snackPflanzenabstand),
        SnackTriebzahl: formatMeasureValue(cultureInformation?.snackTriebzahl),
        SnackErtragJahr: formatMeasureValue(cultureInformation?.snackErtragJahr),
        CocktailReihenanzahl: formatMeasureValue(cultureInformation?.cocktailReihenanzahl),
        CocktailPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.cocktailPflanzenabstand),
        CocktailTriebzahl: formatMeasureValue(cultureInformation?.cocktailTriebzahl),
        CocktailErtragJahr: formatMeasureValue(cultureInformation?.cocktailErtragJahr),
        RispenReihenanzahl: formatMeasureValue(cultureInformation?.rispenReihenanzahl),
        RispenPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.rispenPflanzenabstand),
        RispenTriebzahl: formatMeasureValue(cultureInformation?.rispenTriebzahl),
        RispenErtragJahr: formatMeasureValue(cultureInformation?.rispenErtragJahr),
        FleischReihenanzahl: formatMeasureValue(cultureInformation?.fleischReihenanzahl),
        FleischPflanzenabstandInDerReihe: formatMeasureValue(cultureInformation?.fleischPflanzenabstand),
        FleischTriebzahl: formatMeasureValue(cultureInformation?.fleischTriebzahl),
        FleischErtragJahr: formatMeasureValue(cultureInformation?.fleischErtragJahr),
        KulturBeginn: formatMeasureValue(cultureInformation?.kulturBeginn),
        KulturEnde: formatMeasureValue(cultureInformation?.kulturEnde),
        NebenkulturBeginn: formatMeasureValue(cultureInformation?.nebenkulturBeginn),
        NebenkulturEnde: formatMeasureValue(cultureInformation?.nebenkulturEnde),
        "Belichtung:Stromverbrauch": formatMeasureValue(energyConsumption?.belichtungsstromStromverbrauch),
        "Belichtung:AnzahlLampen": formatMeasureValue(energyConsumption?.belichtungsstromAnzLampen),
        "Belichtung:AnschlussleistungProLampe": formatMeasureValue(energyConsumption?.belichtungsstromAnschlussleistung),
        "Belichtung:LaufzeitProJahr": formatMeasureValue(energyConsumption?.belichtungsstromLaufzeitJahr),
        VorlaufmengeGesamt: formatMeasureValue(waterUsage?.vorlaufmengeGesamt),
        Restwasser: formatMeasureValue(waterUsage?.restwasser),
        FungizideKg: formatMeasureValue(helpingMaterials?.fungizideKg),
        FungizideLiter: formatMeasureValue(helpingMaterials?.fungizideLiter),
        InsektizideKg: formatMeasureValue(helpingMaterials?.insektizideKg),
        InsektizideLiter: formatMeasureValue(helpingMaterials?.insektizideLiter),
        "Kuebel:VolumenProTopf": formatMeasureValue(companyMaterials?.kuebelVolumenProTopf),
        "Kuebel:JungpflanzenProTopf": formatMeasureValue(companyMaterials?.kuebelJungpflanzenProTopf),
        "Kuebel:Alter": formatMeasureValue(companyMaterials?.kuebelAlter),
        "SchnuereRankhilfen:Laenge": formatMeasureValue(companyMaterials?.schnurLaengeProTrieb),
        "SchnuereRankhilfen:Wiederverwendung": formatMeasureValue(companyMaterials?.schnurWiederverwendung),
        "Klipse:AnzahlProTrieb": formatMeasureValue(companyMaterials?.klipseAnzProTrieb),
        "Klipse:Wiederverwendung": formatMeasureValue(companyMaterials?.klipseWiederverwendung),
        "Rispenbuegel:AnzahlProTrieb": formatMeasureValue(companyMaterials?.rispenbuegelAnzProTrieb),
        "Rispenbuegel:Wiederverwendung": formatMeasureValue(companyMaterials?.rispenbuegelWiederverwendung),
        "Jungpflanzen:Distanz": formatMeasureValue(companyMaterials?.jungpflanzenDistanz),
        "Verpackungsmaterial:AnzahlMehrwegsteigen": formatMeasureValue(companyMaterials?.anzahlNutzungenMehrwegsteigen),
        // Selection input fields
        Waermeversorgung: formatOptionValue(energyConsumption.waermeversorgung),
        GWHArt: formatOptionValue(companyInformation.gwhArt),
        Land: formatOptionValue(companyInformation.land),
        Region: formatOptionValue(companyInformation.region),
        Bedachungsmaterial: formatOptionValue(companyInformation.bedachungsmaterial),
        Stehwandmaterial: formatOptionValue(companyInformation.stehwandmaterial),
        Energieschirm: formatOptionValue(companyInformation.energieschirm),
        Heizsystem: formatOptionValue(companyInformation.heizsystem),
        Produktionstyp: formatOptionValue(companyInformation.produktionsweise),
        Produktionssystem: formatOptionValue(companyInformation.produktionssystem),
        EnergieschirmTyp: formatOptionValue(companyInformation.energieschirmTyp),
        ZusaetzlichesHeizsystem: formatOptionValue(companyInformation.zusaetzlichesHeizsystem),
        ZusaetzlichesHeizsystemTyp: formatOptionValue(companyInformation.zusaetzlichesHeizsystemTyp),
        "10-30Gramm(Snack)": formatOptionValue(cultureInformation.snack),
        "30-100Gramm(Cocktail)": formatOptionValue(cultureInformation.cocktail),
        "100-150Gramm(Rispen)": formatOptionValue(cultureInformation.rispen),
        ">150Gramm(Fleisch)": formatOptionValue(cultureInformation.fleisch),
        Nebenkultur: formatOptionValue(cultureInformation.nebenkultur),
        Zusatzbelichtung: formatOptionValue(energyConsumption.zusatzbelichtung),
        Belichtungsstrom: formatOptionValue(energyConsumption.belichtungsstrom),
        BelichtungsstromEinheit: formatOptionValue(energyConsumption.belichtungsstromEinheit),
        WasserVerbrauch: formatOptionValue(waterUsage.wasserVerbrauch),
        VorlaufmengeAnteile: formatOptionValues(waterUsage.vorlaufmengeAnteile),
        GrowbagsKuebel: formatOptionValue(companyMaterials.growbagsKuebel),
        Schnur: formatOptionValue(companyMaterials.schnur),
        "SchnuereRankhilfen:Material": formatOptionValue(companyMaterials.schnurMaterial),
        Klipse: formatOptionValue(companyMaterials.klipse),
        "Klipse:Material": formatOptionValue(companyMaterials.klipseMaterial),
        Rispenbuegel: formatOptionValue(companyMaterials.rispenbuegel),
        "Rispenbuegel:Material": formatOptionValue(companyMaterials.rispenbuegelMaterial),
        Bewaesserungsart: formatOptionValue(companyInformation.bewaesserArt),
        "Jungpflanzen:Zukauf": formatOptionValue(companyMaterials.jungpflanzenZukauf),
        "Jungpflanzen:Substrat": formatOptionValue(companyMaterials.jungpflanzenSubstrat),
        // Dynamic input fields
        Bodenabdeckung: formatOptionValues(companyInformation.bodenabdeckung),
        Energietraeger: formatOptionValues(energyConsumption.energietraeger),
        Stromherkunft: formatOptionValues(energyConsumption.stromherkunft),
        "CO2-Herkunft": formatOptionValues(helpingMaterials.co2Herkunft),
        "Duengemittel:VereinfachteAngabe": formatOptionValues(helpingMaterials.duengemittelSimple),
        "Duengemittel:DetaillierteAngabe": formatOptionValues(helpingMaterials.duengemittelDetail),
        Substrat: formatOptionValues(companyMaterials.growbagsKuebelSubstrat),
        Verpackungsmaterial: formatOptionValues(companyMaterials.verpackungsmaterial),
        SonstigeVerbrauchsmaterialien: formatOptionValues(companyMaterials.sonstVerbrauchsmaterialien),
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
        hasNext: () => tab < 5,
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
                (errorMessage: string) => {
                    handleSubmitError(errorMessage)
                },
                props.mode,
                props.datasetId
            )

        }
    }

    const showMeasureInputError = (value: MeasureValue): boolean => {
        if ((value.value == null || value.value == 0) && props.submission.successful == false) return true
        return false
    }

    const showDateInputError = (date: DateValue): boolean => {
        if ((date.value == null) && props.submission.successful == false) return true
        return false
    }

    const showSelectInputError = (value: number): boolean => {
        if ((value == null || value == 0) && props.submission.successful == false) return true
        return false
    }


    //These functions are passed down to the subpages so that they can update the main state with their state
    const setCompanyInformation = (companyInformation: CompanyInformationState) => setDataToSubmit({...dataToSubmit, companyInformation})
    const setCultureInformation = (cultureInformation: CultureInformationState) => setDataToSubmit({...dataToSubmit, cultureInformation})
    const setEnergyConsumption = (energyConsumption: EnergyConsumptionState) => setDataToSubmit({...dataToSubmit, energyConsumption})
    const setWaterUsage = (waterUsage: WaterUsageState) => setDataToSubmit({...dataToSubmit, waterUsage})
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
              <Tab label="Wasserverbrauch" {...indexedTabProps(3)} />
              <Tab label="Hilfsstoffe" {...indexedTabProps(4)} />
              <Tab label="Betriebsstoffe" {...indexedTabProps(5)} />
            </Tabs>

            <TabPanel index={0} value={tab}>
                <CompanyInformationInput paginationProps={paginationProps} provideCompanyInformation={setCompanyInformation} values={dataToSubmit.companyInformation} showDateInputError={showDateInputError} showSelectInputError={showSelectInputError} showMeasureInputError={showMeasureInputError}/>
            </TabPanel>
            <TabPanel index={1} value={tab}>
                <CultureInformationInput paginationProps={paginationProps} provideCultureInformation={setCultureInformation} values={dataToSubmit.cultureInformation} showSelectInputError={showSelectInputError} showMeasureInputError={showMeasureInputError}/>
            </TabPanel>
            <TabPanel index={2} value={tab}>
                <EnergyConsumptionInput paginationProps={paginationProps} provideEnergyConsumption={setEnergyConsumption} values={dataToSubmit.energyConsumption} showSelectInputError={showSelectInputError} showMeasureInputError={showMeasureInputError}/>
            </TabPanel>
            <TabPanel index={3} value={tab}>
                <WaterUsageInput paginationProps={paginationProps} provideWaterUsage={setWaterUsage} values={dataToSubmit.waterUsage} showSelectInputError={showSelectInputError} showMeasureInputError={showMeasureInputError}/>
            </TabPanel>
            <TabPanel index={4} value={tab}>
                <HelpingMaterialsInput paginationProps={paginationProps} provideHelpingMaterials={setHelpingMaterials} values={dataToSubmit.helpingMaterials}/>
            </TabPanel>
            <TabPanel index={5} value={tab}>
                <CompanyMaterialsInput paginationProps={paginationProps} provideCompanyMaterials={setCompanyMaterials} values={dataToSubmit.companyMaterials} showSelectInputError={showSelectInputError} showMeasureInputError={showMeasureInputError}/>
            </TabPanel>
        </Box>
    );
}
export default connector(PageInputData)









