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
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";
import {submitGreenhouseData} from "../../actions/submission";
import {RootState} from "../../store";
import ConsumableMaterialsInput, {
    ConsumableMaterialsState
} from "./inpututpages/ConsumableMaterials";
import ConsumableItemsInput, {
    ConsumableItemsState
} from "./inpututpages/ConsumableItems";
import {Tab, Tabs} from "@mui/material";
import EnergyConsumptionInput, {
    EnergyConsumptionState
} from "./inpututpages/EnergyConsumption";
import CultureManagementInput, {
    CultureManagementState
} from "./inpututpages/CultureManagement";
import CultureInformationInput, {
    CultureInformationState
} from "./inpututpages/CultureInformation";
import CompanyInformationInput, {
    CompanyInformationState
} from "./inpututpages/CompanyInformation";
import {GreenhouseData} from "../../types/reduxTypes";
import {MeasureValue, SelectionValue} from "../utils/inputPage/InputFields";
import {InputPaginationButtonsProps} from "../utils/InputPaginationButtons";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import {indexedTabProps, TabPanel} from "../../helpers/TabPanel";

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
    cultureManagement: CultureManagementState
    energyConsumption: EnergyConsumptionState
    consumableItems: ConsumableItemsState
    consumableMaterials: ConsumableMaterialsState
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
        cultureManagement,
        energyConsumption,
        consumableItems,
        consumableMaterials
    } = dataToSubmit

    const calcAge = (year?: Date | null) => {
        if(year!=null) {
            const today = new Date()
            const age = today.getFullYear() - year.getFullYear()
            if (age > 0) return `(${age},1)`
            else return "(1,1)"
        }
        else return "(1,1)"
    }

    const defaultValue = "(0,0)"
    const defaultOption = "[(0,)]"

    // TODO: Implement a proper default value concept. Maybe get default value object from server?
    //submittionData maps the data from the dataToSubmit state so it can be used in the post request
    let submissionData: GreenhouseData = {
        greenhouse_name: companyInformation?.gewaechshausName ??  "Standardhaus",
        date: companyInformation.datum ? format(companyInformation.datum, 'yyyy-MM-dd') : new Date().toISOString().substring(0, 10),
        PLZ: formatMeasureValue(companyInformation?.plz) ?? defaultValue,
        GWHGesamtflaeche: formatMeasureValue(companyInformation?.gwhGesamtFlaeche) ?? defaultValue,
        GWHFlaeche: formatMeasureValue(companyInformation?.gwhFlaeche) ?? defaultValue,
        WaermeteilungFlaeche: formatMeasureValue(companyInformation?.waermeteilungFlaeche) ?? defaultValue,
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
        AlterTransportsystem: companyInformation?.transportsystemAlter ? calcAge(companyInformation?.transportsystemAlter.value): defaultValue,
        AlterKultursystem: companyInformation?.kultursystemAlter ? calcAge(companyInformation?.kultursystemAlter.value) : defaultValue,
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
        Kulturflaeche: formatMeasureValue(cultureInformation?.kulturflaeche) ?? defaultValue,
        KulturBeginn: formatMeasureValue(cultureInformation?.kulturBeginn) ?? defaultValue,
        KulturEnde: formatMeasureValue(cultureInformation?.kulturEnde) ?? defaultValue,
        NebenkulturBeginn: formatMeasureValue(cultureInformation?.nebenkulturBeginn) ?? defaultValue,
        NebenkulturEnde: formatMeasureValue(cultureInformation?.nebenkulturEnde) ?? defaultValue,
        MittlereSolltemperaturTag: formatMeasureValue(cultureManagement?.mittlereSolltemperaturTag) ?? defaultValue,
        MittlereSolltemperaturNacht: formatMeasureValue(cultureManagement?.mittlereSolltemperaturNacht) ?? defaultValue,
        Luftfeuchte: formatMeasureValue(cultureManagement?.luftfeuchte) ?? defaultValue,
        "BHKW:AnteilErdgas": formatMeasureValue(energyConsumption?.bhkwAnteilErdgas) ?? defaultValue,
        "BHKW:AnteilBiomethan": formatMeasureValue(energyConsumption?.bhkwAnteilBiomethan) ?? defaultValue,
        "Belichtung:Stromverbrauch": formatMeasureValue(energyConsumption?.belichtungsstromStromverbrauch) ?? defaultValue,
        "Belichtung:AnzahlLampen": formatMeasureValue(energyConsumption?.belichtungsstromAnzLampen) ?? defaultValue,
        "Belichtung:AnschlussleistungProLampe": formatMeasureValue(energyConsumption?.belichtungsstromAnschlussleistung) ?? defaultValue,
        "Belichtung:LaufzeitProJahr": formatMeasureValue(energyConsumption?.belichtungsstromLaufzeitJahr) ?? defaultValue,
        FungizideKg: formatMeasureValue({value: (consumableItems?.fungizideKg?.value??0)+100*(consumableItems.fungizideLiter?.value??0), unit: consumableItems?.fungizideKg?.unit??null}) ?? defaultValue, //The 100 is the factor to convert from liter to kg
        InsektizideKg: formatMeasureValue({value: (consumableItems?.insektizideKg?.value??0)+100*(consumableItems.insektizideLiter?.value??0), unit: consumableItems?.insektizideKg?.unit??null}) ?? defaultValue, //The 100 is the factor to convert from liter to kg
        "Kuebel:VolumenProTopf": formatMeasureValue(consumableMaterials?.kuebelVolumenProTopf) ?? defaultValue,
        "Kuebel:JungpflanzenProTopf": formatMeasureValue(consumableMaterials?.kuebelJungpflanzenProTopf) ?? defaultValue,
        "Kuebel:Alter": consumableMaterials?.kuebelAlter ? calcAge(consumableMaterials?.kuebelAlter.value) : defaultValue,
        "SchnuereRankhilfen:Laenge": formatMeasureValue(consumableMaterials?.schnurLaengeProTrieb) ?? defaultValue,
        "SchnuereRankhilfen:Wiederverwendung": formatMeasureValue(consumableMaterials?.schnurWiederverwendung) ?? defaultValue,
        "Klipse:AnzahlProTrieb": formatMeasureValue(consumableMaterials?.klipseAnzProTrieb) ?? defaultValue,
        "Klipse:Wiederverwendung": formatMeasureValue(consumableMaterials?.klipseWiederverwendung) ?? defaultValue,
        "Rispenbuegel:AnzahlProTrieb": formatMeasureValue(consumableMaterials?.rispenbuegelAnzProTrieb) ?? defaultValue,
        "Rispenbuegel:Wiederverwendung": formatMeasureValue(consumableMaterials?.rispenbuegelWiederverwendung) ?? defaultValue,
        "Jungpflanzen:Distanz": formatMeasureValue(consumableMaterials?.jungpflanzenDistanz) ?? defaultValue,
        "Verpackungsmaterial:AnzahlMehrwegsteigen": formatMeasureValue(consumableMaterials?.anzahlNutzungenMehrwegsteigen) ?? defaultValue,
        EinheitlicheWaermeversorgung: companyInformation?.einheitlicheWaermeversorgung ? formatOptionValues(companyInformation.einheitlicheWaermeversorgung) : "[]",
        GWHArt: companyInformation?.gwhArt ? formatOptionValues(companyInformation.gwhArt) : "[]",
        Bedachungsmaterial: companyInformation?.bedachungsmaterial ? formatOptionValues(companyInformation.bedachungsmaterial) : "[]",
        Stehwandmaterial: companyInformation?.stehwandmaterial ? formatOptionValues(companyInformation.stehwandmaterial) : "[]",
        Energieschirm: companyInformation?.energieschirm ? formatOptionValues(companyInformation.energieschirm) : "[]",
        Transportsystem: companyInformation?.transportsystem ? formatOptionValues(companyInformation.transportsystem) : "[]",
        Produktionstyp: companyInformation?.produktionstyp ? formatOptionValues(companyInformation.produktionstyp) : "[]",
        Kultursystem: companyInformation?.kultursystem ? formatOptionValues(companyInformation.kultursystem) : "[]",
        ZusaetzlichesHeizsystem: companyInformation?.zusaetzlichesHeizsystem ? formatOptionValues(companyInformation.zusaetzlichesHeizsystem) : "[]",
        "10-30Gramm(Snack)": cultureInformation?.snack ? formatOptionValues(cultureInformation.snack) : "[]",
        "30-100Gramm(Cocktail)": cultureInformation?.cocktail ? formatOptionValues(cultureInformation.cocktail) : "[]",
        "100-150Gramm(Rispen)": cultureInformation?.rispen ? formatOptionValues(cultureInformation.rispen) : "[]",
        ">150Gramm(Fleisch)": cultureInformation?.fleisch ? formatOptionValues(cultureInformation.fleisch) : "[]",
        Nebenkultur: cultureInformation?.nebenkultur ? formatOptionValues(cultureInformation.nebenkultur) : "[]",
        Entfeuchtung: cultureManagement?.entfeuchtung ? formatOptionValues(cultureManagement.entfeuchtung) : "[]",
        Energietraeger: energyConsumption?.energietraeger ? formatOptionValues(energyConsumption.energietraeger) : "[]",
        BHKW: energyConsumption?.bhkw ? formatOptionValues(energyConsumption.bhkw) : "[]",
        Stromherkunft: energyConsumption?.stromherkunft ? formatOptionValues(energyConsumption.stromherkunft) : "[]",
        "CO2-Herkunft": consumableItems?.co2Herkunft ? formatOptionValues(consumableItems.co2Herkunft) : "[]",
        "Duengemittel:VereinfachteAngabe": consumableItems?.duengemittelSimple ? formatOptionValues(consumableItems.duengemittelSimple) : "[]",
        "Duengemittel:DetaillierteAngabe": consumableItems?.duengemittelDetail ? formatOptionValues(consumableItems.duengemittelDetail) : "[]",
        Nuetzlinge: consumableItems?.nuetzlinge ? formatOptionValues(consumableItems.nuetzlinge) : "[]",
        GrowbagsKuebel: consumableMaterials?.growbagsKuebel ? formatOptionValues(consumableMaterials.growbagsKuebel) : "[]",
        "SchnuereRankhilfen:Material": consumableMaterials?.schnurMaterial ? formatOptionValues(consumableMaterials.schnurMaterial) : "[]",
        Klipse:consumableMaterials?.klipse ? formatOptionValues(consumableMaterials.klipse) : "[]",
        Rispenbuegel:consumableMaterials?.rispenbuegel ? formatOptionValues(consumableMaterials.rispenbuegel) : "[]",
        Bewaesserungsart: consumableMaterials?.bewaesserArt ? formatOptionValues(consumableMaterials.bewaesserArt) : "[]",
        Bodenabdeckung: consumableMaterials?.bodenabdeckung ? formatOptionValues(consumableMaterials.bodenabdeckung) : "[]",
        "Jungpflanzen:Zukauf": consumableMaterials?.jungpflanzenZukauf ? formatOptionValues(consumableMaterials.jungpflanzenZukauf) : "[]",
        Verpackungsmaterial: consumableMaterials?.verpackungsmaterial ? formatOptionValues(consumableMaterials.verpackungsmaterial) : "[]",
        SonstigeVerbrauchsmaterialien: consumableMaterials?.sonstVerbrauchsmaterialien ? formatOptionValues(consumableMaterials.sonstVerbrauchsmaterialien) : "[]",
        //Fields that might be optional due to dependency on conditional fields. Because of that only these fields get the defaultOption,
        // so that the other fields will trigger an error in the frontend validation if they are not filled out:
        "Jungpflanzen:Substrat": consumableMaterials?.jungpflanzenSubstrat ? formatOptionValues(consumableMaterials.jungpflanzenSubstrat) : defaultOption,
        ZusaetzlicherMaschineneinsatz: consumableMaterials?.zusaetzlicherMaschineneinsatz[0].selectValue ? formatOptionValues(consumableMaterials.zusaetzlicherMaschineneinsatz) : defaultOption,
        BelichtungsstromEinheit: energyConsumption?.belichtungsstromEinheit ? formatOptionValues(energyConsumption.belichtungsstromEinheit) : defaultOption,
        "Klipse:Material": consumableMaterials?.klipseMaterial ? formatOptionValues(consumableMaterials.klipseMaterial) : defaultOption,
        "Rispenbuegel:Material": consumableMaterials?.rispenbuegelMaterial ? formatOptionValues(consumableMaterials.rispenbuegelMaterial) : defaultOption,
        Substrat: consumableMaterials?.growbagsKuebelSubstrat && consumableMaterials?.growbagsKuebelSubstrat[0].selectValue != null ? formatOptionValues(consumableMaterials.growbagsKuebelSubstrat) : defaultOption,
        Zusatzbelichtung: energyConsumption?.zusatzbelichtung ? formatOptionValues(energyConsumption.zusatzbelichtung) : defaultOption,
        Belichtungsstrom: energyConsumption?.belichtungsstrom ? formatOptionValues(energyConsumption.belichtungsstrom) : defaultOption

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
        submit: (setShowAlert: Function) => {
            props.submitGreenhouseData(
                processDataToSubmit(dataToSubmit),
                () => {},
                true,
                () => {},
                () => {navigate("../co2-footprint")},
                () => {setShowAlert()}
            )

        }
    }

    //These functions are passed down to the subpages so that they can update the main state with their state
    const setCompanyInformation = (companyInformation: CompanyInformationState) => setDataToSubmit({...dataToSubmit, companyInformation})
    const setCultureInformation = (cultureInformation: CultureInformationState) => setDataToSubmit({...dataToSubmit, cultureInformation})
    const setCultureManagement = (cultureManagement: CultureManagementState) => setDataToSubmit({...dataToSubmit, cultureManagement})
    const setEnergyConsumption = (energyConsumption: EnergyConsumptionState) => setDataToSubmit({...dataToSubmit, energyConsumption})
    const setConsumableItems = (consumableItems: ConsumableItemsState) => setDataToSubmit({...dataToSubmit, consumableItems})
    const setConsumableMaterials = (consumableMaterials: ConsumableMaterialsState) => {
        setDataToSubmit({...dataToSubmit, consumableMaterials})
    }

    return (
        <Box sx={{width: '100%'}}>
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="tabs">
              <Tab label="Betriebsdaten" {...indexedTabProps(0)} />
              <Tab label="Kulturdaten" {...indexedTabProps(1)} />
              <Tab label="Kulturführung" {...indexedTabProps(2)} />
              <Tab label="Energieverbrauch" {...indexedTabProps(3)} />
              <Tab label="Verbrauchsmittel" {...indexedTabProps(4)} />
              <Tab label="Verbrauchsmaterialien" {...indexedTabProps(5)} />
            </Tabs>

            <TabPanel index={0} value={tab}>
                <CompanyInformationInput paginationProps={paginationProps} provideCompanyInformation={setCompanyInformation} values={dataToSubmit.companyInformation}/>
            </TabPanel>
            <TabPanel index={1} value={tab}>
                <CultureInformationInput paginationProps={paginationProps} provideCultureInformation={setCultureInformation} values={dataToSubmit.cultureInformation}/>
            </TabPanel>
            <TabPanel index={2} value={tab}>
                <CultureManagementInput paginationProps={paginationProps} provideCultureManagement={setCultureManagement} values={dataToSubmit.cultureManagement}/>
            </TabPanel>
            <TabPanel index={3} value={tab}>
                <EnergyConsumptionInput paginationProps={paginationProps} provideEnergyConsumption={setEnergyConsumption} values={dataToSubmit.energyConsumption}/>
            </TabPanel>
            <TabPanel index={4} value={tab}>
                <ConsumableItemsInput paginationProps={paginationProps} provideItems={setConsumableItems} values={dataToSubmit.consumableItems}/>
            </TabPanel>
            <TabPanel index={5} value={tab}>
                <ConsumableMaterialsInput paginationProps={paginationProps} provideConsumables={setConsumableMaterials} values={dataToSubmit.consumableMaterials}/>
            </TabPanel>
        </Box>
    );
}
export default connector(PageInputData)









