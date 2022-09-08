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
import Typography from '@mui/material/Typography';
import {connect, ConnectedProps} from "react-redux";
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";
import {Option} from "../../reducers/lookup";
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
import {MeasureValue, SelectionValue} from "../utils/InputFields";
import {InputPaginationButtonsProps} from "../utils/InputPaginationButtons";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";

const mapStateToProps = (state: RootState) => ({
  submission: state.submission,
});

const mapDispatchToProps = {
  submitGreenhouseData,
  loadLookupValues,
  loadUnitValues
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type InputDataProps = ReduxProps & {}

export type SubpageProps = {
    paginationProps: InputPaginationButtonsProps
}

type DataToSubmit = {
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
                (value.textFieldValue ?
                    ("," + value.textFieldValue + (value.textField2Value ? "," + value.textField2Value : "")) : "") +
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

    const calcAge = (year: Date) => {
        const today = new Date()
        const age = today.getFullYear() - year.getFullYear()
        if(age > 0) return `(${age},1)`
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
        GWHAlter: companyInformation?.gwhAlter ? calcAge(companyInformation?.gwhAlter) : defaultValue,
        AlterEnergieschirm: companyInformation?.alterEnergieschirm ? calcAge(companyInformation?.alterEnergieschirm) : defaultValue,
        Stehwandhoehe: formatMeasureValue(companyInformation?.stehwandhoehe) ?? defaultValue,
        Laenge: formatMeasureValue(companyInformation?.laenge) ?? defaultValue,
        Breite: formatMeasureValue(companyInformation?.breite) ?? defaultValue,
        Kappenbreite: formatMeasureValue(companyInformation?.knappenbreite) ?? defaultValue,
        "Scheibenlaenge(Bedachung)": formatMeasureValue(companyInformation?.scheibenlaenge) ?? defaultValue,
        AlterdesBedachungsmaterials: companyInformation?.alterdesBedachungsmaterials ? calcAge(companyInformation?.alterdesBedachungsmaterials): defaultValue,
        AlterKultursystem: companyInformation?.alterKultursystem ? calcAge(companyInformation?.alterKultursystem) : defaultValue,
        Reihenabstand: formatMeasureValue(companyInformation?.reihenabstand) ?? defaultValue,
        Kulturflaeche: formatMeasureValue(cultureInformation?.kulturflaeche) ?? defaultValue,
        KulturBeginn: formatMeasureValue(cultureInformation?.kulturBeginn) ?? defaultValue,
        KulturEnde: formatMeasureValue(cultureInformation?.kulturEnde) ?? defaultValue,
        Ertrag: formatMeasureValue(cultureInformation?.ertrag) ?? defaultValue,
        Pflanzdichte: formatMeasureValue(cultureInformation?.pflanzendichte) ?? defaultValue,
        Nebenkulturdauer: formatMeasureValue(cultureInformation?.nebenkulturDauer) ?? defaultValue,
        MittlereSolltemperaturTag: formatMeasureValue(cultureManagement?.mittlereSolltemperaturTag) ?? defaultValue,
        MittlereSolltemperaturNacht: formatMeasureValue(cultureManagement?.mittlereSolltemperaturNacht) ?? defaultValue,
        KulturmassnahmeAusgeizen: formatMeasureValue(cultureManagement?.kulturmassnahmeAusgeizen) ?? defaultValue,
        KulturmassnahmeAusblattenAnzahlMonat: formatMeasureValue(cultureManagement?.kulturmassnahmeAusblattenAnzahlMonat) ?? defaultValue,
        KulturmassnahmeAblassen: formatMeasureValue(cultureManagement?.kulturmassnahmeAblassen) ?? defaultValue,
        Strom: formatMeasureValue(energyConsumption?.strom) ?? defaultValue,
        StromverbrauchBelichtungAnschlussleistung: formatMeasureValue(energyConsumption?.belichtungsstromAnschlussleistung) ?? defaultValue,
        StromverbrauchBelichtungAnzahlLampen: formatMeasureValue(energyConsumption?.belichtungsstromAnzLampen) ?? defaultValue,
        StromverbrauchBelichtungLaufzeitTag: formatMeasureValue(energyConsumption?.belichtungsstromLaufzeitTag) ?? defaultValue,
        "CO2-Zudosierung": formatMeasureValue(consumableItems?.co2Zudosierung) ?? defaultValue,
        Fungizide: formatMeasureValue(consumableItems?.fungizide) ?? defaultValue,
        Insektizide: formatMeasureValue(consumableItems?.insektizide) ?? defaultValue,
        VolumenGrowbags: formatMeasureValue(consumableMaterials?.growbagsVolumen) ?? defaultValue,
        LaengeGrowbags: formatMeasureValue(consumableMaterials?.growbagsLaenge) ?? defaultValue,
        PflanzenproBag: formatMeasureValue(consumableMaterials?.growbagsPflanzenAnz) ?? defaultValue,
        "SchnuereRankhilfen:Laenge": formatMeasureValue(consumableMaterials?.schnurLaenge) ?? defaultValue,
        "SchnuereRankhilfen:Wiederverwendung": formatMeasureValue(consumableMaterials?.schnurWiederverwendung) ?? defaultValue,
        "Klipse:Menge": formatMeasureValue(consumableMaterials?.klipseGesamtmenge) ?? defaultValue,
        "Klipse:Wiederverwendung": formatMeasureValue(consumableMaterials?.klipseWiederverwendung) ?? defaultValue,
        "Rispenbuegel:Menge": formatMeasureValue(consumableMaterials?.rispenbuegelGesamtmenge) ?? defaultValue,
        "Rispenbuegel:Wiederverwendung": formatMeasureValue(consumableMaterials?.rispenbuegelWiederverwendung) ?? defaultValue,
        "SonstigeVerbrauchsmaterialien:Wiederverwendung":
            consumableMaterials?.sonstVerbrauchsmaterialien && consumableMaterials.sonstVerbrauchsmaterialien.length ?
                (formatMeasureValue(consumableMaterials.sonstVerbrauchsmaterialien[0].textFieldValue) ?? defaultValue) : defaultValue,
        BodenfolienVerwendungsdauer: formatMeasureValue(consumableMaterials?.bodenfolienVerwendungsdauer) ?? defaultValue,
        "Verpackungsmaterial:Karton": formatMeasureValue(consumableMaterials?.kartonVerpackung) ?? defaultValue,
        "Verpackungsmaterial:Plastik": formatMeasureValue(consumableMaterials?.plastikVerpackung) ?? defaultValue,
        "TransportderWare:Auslieferungen": formatMeasureValue(consumableMaterials?.transportFrequenz) ?? defaultValue,
        "TransportderWare:Distanz": formatMeasureValue(consumableMaterials?.transportDistanz) ?? defaultValue,
        JungpflanzenDistanz: formatMeasureValue(consumableMaterials?.jungpflanzenDistanz) ?? defaultValue,
        GWHArt: companyInformation?.gwhArt ? formatOptionValues(companyInformation.gwhArt) : "[]",
        Bedachungsmaterial: companyInformation?.bedachungsmaterial ? formatOptionValues(companyInformation.bedachungsmaterial) : "[]",
        ArtdesStehwandmaterial: companyInformation?.artdesStehwandmaterials ? formatOptionValues(companyInformation.artdesStehwandmaterials) : "[]",
        Energieschirm: companyInformation?.energieschirm ? formatOptionValues(companyInformation.energieschirm) : "[]",
        Produktion: companyInformation?.produktion ? formatOptionValues(companyInformation.produktion) : "[]",
        Kultursystem: companyInformation?.kultursystem ? formatOptionValues(companyInformation.kultursystem) : "[]",
        Transportsystem: companyInformation?.transportsystem ? formatOptionValues(companyInformation.transportsystem) : "[]",
        Fruchtgewicht: cultureInformation?.fruchtgewicht ? formatOptionValues(cultureInformation.fruchtgewicht) : "[]",
        Nebenkultur: cultureInformation?.nebenkultur ? formatOptionValues(cultureInformation.nebenkultur) : "[]",
        AnzahlTriebe: cultureManagement?.anzahlTriebe ? formatOptionValues(cultureManagement.anzahlTriebe) : "[]",
        Entfeuchtung: cultureManagement?.entfeuchtung ? formatOptionValues(cultureManagement.entfeuchtung) : "[]",
        KulturmassnahmeAusblattenMenge: formatMeasureValue(cultureManagement.kulturmassnahmeAusblattenMenge) ?? defaultValue,
        Energietraeger: energyConsumption?.energietraeger ? formatOptionValues(energyConsumption.energietraeger) : "[]",
        Stromherkunft: energyConsumption?.stromherkunft ? formatOptionValues(energyConsumption.stromherkunft) : "[]",
        Zusatzbelichtung: energyConsumption?.zusatzbelichtung ? formatOptionValues(energyConsumption.zusatzbelichtung) : defaultOption,
        "CO2-Herkunft": consumableItems?.co2Herkunft ? formatOptionValues(consumableItems.co2Herkunft) : "[]",
        "Duengemittel:DetalierteAngabe": consumableItems?.duengemittelDetail ? formatOptionValues(consumableItems.duengemittelDetail) : "[]",
        "Duengemittel:VereinfachteAngabe": consumableItems?.duengemittelSimple ? formatOptionValues(consumableItems.duengemittelSimple) : "[]",
        Nuetzlinge: consumableItems?.nuetzlinge ? formatOptionValues(consumableItems.nuetzlinge) : "[]",
        Growbags: consumableMaterials?.growbags ? formatOptionValues(consumableMaterials.growbags) : "[]",
        "SchnuereRankhilfen:Material": consumableMaterials?.schnurMaterial ? formatOptionValues(consumableMaterials.schnurMaterial) : "[]",
        "Klipse:Material": consumableMaterials?.klipseMaterial ? formatOptionValues(consumableMaterials.klipseMaterial) : "[]",
        "Rispenbuegel:Material": consumableMaterials?.rispenbuegelMaterial ? formatOptionValues(consumableMaterials.rispenbuegelMaterial) : "[]",
        Bewaesserungsart: consumableMaterials?.bewaesserArt ? formatOptionValues(consumableMaterials.bewaesserArt) : "[]",
        Bodenfolien: consumableMaterials?.bodenfolien ? formatOptionValues(consumableMaterials.bodenfolien) : "[]",
        SonstigeVerbrauchsmaterialien: consumableMaterials?.sonstVerbrauchsmaterialien ? formatOptionValues(consumableMaterials.sonstVerbrauchsmaterialien) : "[]",
        JungpflanzenZukauf: consumableMaterials?.jungpflanzenEinkauf ? formatOptionValues(consumableMaterials.jungpflanzenEinkauf) : "[]",
        //Fields that might be optional due to dependency on conditional fields. Because of that only these fields get the defaultOption,
        // so that the other fields will trigger an error in the frontend validation if they are not filled out:
        Belichtungsstrom: energyConsumption?.belichtungsstrom ? formatOptionValues(energyConsumption.belichtungsstrom) : defaultOption,
        Substrat: consumableMaterials?.growbagsSubstrat && consumableMaterials?.growbagsSubstrat[0].selectValue != null ? formatOptionValues(consumableMaterials.growbagsSubstrat) : defaultOption
    }
    //console.log("SubmissionData:")
    //console.log(submissionData)
    return submissionData
}

const PageInputData = (props: InputDataProps) => {
    useEffect(() => {
        props.loadLookupValues()
        props.loadUnitValues()
    }, [])

    const navigate = useNavigate()

    const [dataToSubmit, setDataToSubmit] = useState<DataToSubmit>({
        companyInformation: {
            gewaechshausName: null,
            datum: new Date(Date.now()),
            plz: null,
            gwhArt: null,
            gwhAlter: new Date(Date.now()),
            bedachungsmaterial: null,
            alterdesBedachungsmaterials: new Date(Date.now()),
            artdesStehwandmaterials: null,
            energieschirm: null,
            alterEnergieschirm: new Date(Date.now()),
            stehwandhoehe: { value: null, unit: 0},
            laenge: null,
            breite: null,
            knappenbreite: null,
            scheibenlaenge: null,
            produktion: null,
            kultursystem: null,
            alterKultursystem: new Date(Date.now()),
            reihenabstand: null,
            transportsystem: null
        },
        cultureInformation: {
            fruchtgewicht: null,
            kulturflaeche: null,
            kulturBeginn: null,
            kulturEnde: null,
            nebenkultur: null,
            nebenkulturDauer: null,
            pflanzendichte: null,
            pflanzendichteAnzProm2: null,
            pflanzendichteReihePflanzabstand: null,
            pflanzendichteReihenabstand: null,
            ertrag: null
        },
        cultureManagement: {
            anzahlTriebe: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            mittlereSolltemperaturTag:  null,
            mittlereSolltemperaturNacht: null,
            entfeuchtung: null,
            relativeFeuchte: null,
            kulturmassnahmeAusgeizen: null,
            kulturmassnahmeAusblattenAnzahlMonat: null,
            kulturmassnahmeAusblattenMenge: null,
            kulturmassnahmeAblassen: null
        },
        energyConsumption: {
            energietraeger: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            strom:  null,
            stromherkunft: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            zusatzbelichtung: null,
            belichtungsstrom: null,
            belichtungsstromAnschlussleistung: null,
            belichtungsstromAnzLampen: null,
            belichtungsstromLaufzeitTag: null,
        },
        consumableItems: {
            co2Zudosierung: null,
            co2Herkunft: null,
            duengemittelDetail: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            duengemittelSimple: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            fungizide: null,
            insektizide: null,
            nuetzlinge: [{selectValue: null, textFieldValue: { value: null, unit: null}}]
        },
        consumableMaterials: {
            growbags: null,
            growbagsVolumen: null,
            growbagsLaenge: null,
            growbagsPflanzenAnz: null,
            growbagsSubstrat: [{selectValue: null, textFieldValue: { value: null, unit: 0}}],
            schnurMaterial: null,
            schnurLaenge: null,
            schnurWiederverwendung: null,
            klipseMaterial: null,
            klipseGesamtmenge: null,
            klipseAnzProTrieb: null,
            klipseWiederverwendung: null,
            rispenbuegelMaterial: null,
            rispenbuegelGesamtmenge: null,
            rispenbuegelAnzProTrieb: null,
            rispenbuegelWiederverwendung: null,
            bewaesserArt: null,
            bodenfolien: null,
            bodenfolienVerwendungsdauer: null,
            sonstVerbrauchsmaterialien: [{selectValue: null, textFieldValue: { value: null, unit: 0}, textField2Value: null}],
            jungpflanzenEinkauf: null,
            jungpflanzenDistanz: null,
            plastikVerpackung: null,
            kartonVerpackung: null,
            transportFrequenz: null,
            transportDistanz: null,
        }
    })
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


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function indexedTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}







