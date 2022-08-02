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
import {loadLookupValues} from "../../actions/lookup";
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
import {SelectionValue} from "../utils/InputFields";
import {InputPaginationButtonsProps} from "../utils/InputPaginationButtons";
import {useNavigate} from "react-router-dom";
//import {format} from "date-fns";

const mapStateToProps = (state: RootState) => ({
  submission: state.submission,
});

const mapDispatchToProps = {
  submitGreenhouseData,
  loadLookupValues
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

const formatOptionValues = (values: SelectionValue[]): string => {
    let formattedString = "["

    for (let i = 0; i < values.length; i++) {
        let value = values[i]
        let tupleString = "(" + value.selectValue + (value.textFieldValue ? "," + value.textFieldValue : "") + ")"
        formattedString = formattedString + tupleString
        if (i < values.length - 1) {
            formattedString = formattedString + ","
        }
    }

    formattedString = formattedString + "]"

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

    // TODO: Implement a proper default value concept. Maybe get default value object from server?
    //submittionData maps the data from the dataToSubmit state so it can be used in the post request
    const submissionData: GreenhouseData = {
        greenhouse_name: companyInformation?.gewaechshausName ? companyInformation.gewaechshausName : "Standardhaus",
        date: new Date().toISOString().substring(0, 10),
        PLZ: companyInformation?.plz ? companyInformation.plz : 0,
        AlterEnergieschirm: companyInformation?.alterEnergieschirm ? companyInformation.alterEnergieschirm : 0,
        Stehwandhoehe: companyInformation?.stehwandhoehe ? companyInformation.stehwandhoehe : 0,
        Laenge: companyInformation?.laenge ? companyInformation.laenge : 0,
        Breite: companyInformation?.breite ? companyInformation.breite : 0,
        Kappenbreite: companyInformation?.knappenbreite ? companyInformation.knappenbreite : 0,
        "Scheibenlaenge(Bedachung)": companyInformation?.scheibenlaenge ? companyInformation.scheibenlaenge : 0,
        AlterKultursystem: companyInformation?.alterKultursystem ? companyInformation.alterKultursystem : 0,
        Reihenabstand: companyInformation?.reihenabstand ? companyInformation.reihenabstand : 0,
        Kulturflaeche: cultureInformation?.kulturflaeche ? cultureInformation.kulturflaeche : 0,
        KulturBeginn: cultureInformation?.kulturBeginn ? cultureInformation.kulturBeginn : 1,
        KulturEnde: cultureInformation?.kulturEnde ? cultureInformation.kulturEnde : 1,
        Ertrag: cultureInformation?.ertrag ? cultureInformation.ertrag : 0,
        Pflanzdichte: cultureInformation?.pflanzendichte ? cultureInformation.pflanzendichte : 0,
        MittlereSolltemperaturTag: cultureManagement?.mittlereSolltemperaturTag ? cultureManagement.mittlereSolltemperaturTag : 0,
        MittlereSolltemperaturNacht: cultureManagement?.mittlereSolltemperaturNacht ? cultureManagement.mittlereSolltemperaturNacht : 0,
        KulturmassnahmeAusgeizen: cultureManagement?.kulturmassnahmeAusgeizen ? cultureManagement.kulturmassnahmeAusgeizen : 0,
        KulturmassnahmeAusblattenAnzahlMonat: cultureManagement?.kulturmassnahmeAusblattenAnzahlMonat ? cultureManagement.kulturmassnahmeAusblattenAnzahlMonat : 0,
        KulturmassnahmeAblassen: cultureManagement?.kulturmassnahmeAblassen ? cultureManagement.kulturmassnahmeAblassen : 0,
        Strom: energyConsumption?.strom ? energyConsumption.strom : 0,
        StromverbrauchBelichtungAnschlussleistung: energyConsumption?.belichtungsstromAnschlussleistung ? energyConsumption.belichtungsstromAnschlussleistung : 0,
        StromverbrauchBelichtungAnzahlLampen: energyConsumption?.belichtungsstromAnzLampen ? energyConsumption.belichtungsstromAnzLampen : 0,
        StromverbrauchBelichtungLaufzeitTag: energyConsumption?.belichtungsstromLaufzeitTag ? energyConsumption.belichtungsstromLaufzeitTag : 0,
        "CO2-Zudosierung": consumableItems?.co2Zudosierung ? consumableItems.co2Zudosierung : 0,
        Fungizide: consumableItems?.fungizide ? consumableItems.fungizide : 0,
        Insektizide: consumableItems?.insektizide ? consumableItems.insektizide : 0,
        VolumenGrowbags: consumableMaterials?.growbagsVolumen ? consumableMaterials.growbagsVolumen : 0,
        LaengeGrowbags: consumableMaterials?.growbagsLaenge ? consumableMaterials.growbagsLaenge : 0,
        PflanzenproBag: consumableMaterials?.growbagsPflanzenAnz ? consumableMaterials.growbagsPflanzenAnz : 0,
        "SchnuereRankhilfen:Laenge": consumableMaterials?.schnurLaenge ? consumableMaterials.schnurLaenge: 0,
        "SchnuereRankhilfen:Wiederverwendung": consumableMaterials?.schnurWiederverwendung ? consumableMaterials.schnurWiederverwendung : 0,
        "Klipse:Menge": consumableMaterials?.klipseGesamtmenge ? consumableMaterials.klipseGesamtmenge : 0,
        "Klipse:Wiederverwendung": consumableMaterials?.klipseWiederverwendung ? consumableMaterials.klipseWiederverwendung : 0,
        "Rispenbuegel:Menge": consumableMaterials?.rispenbuegelGesamtmenge ? consumableMaterials.rispenbuegelGesamtmenge : 0,
        "Rispenbuegel:Wiederverwendung": consumableMaterials?.rispenbuegelWiederverwendung ? consumableMaterials.rispenbuegelWiederverwendung : 0,
        "SonstigeVerbrauchsmaterialien:Wiederverwendung":
            consumableMaterials?.sonstVerbrauchsmaterialien && consumableMaterials.sonstVerbrauchsmaterialien.length ?
                (consumableMaterials.sonstVerbrauchsmaterialien[0].textFieldValue ? consumableMaterials.sonstVerbrauchsmaterialien[0].textFieldValue : 0) : 0,
        "Verpackungsmaterial:Karton": consumableMaterials?.kartonVerpackung ? consumableMaterials.kartonVerpackung : 0,
        "Verpackungsmaterial:Plastik": consumableMaterials?.plastikVerpackung ? consumableMaterials.plastikVerpackung : 0,
        "TransportderWare:Auslieferungen": consumableMaterials?.transportFrequenz ? consumableMaterials.transportFrequenz : 0,
        "TransportderWare:Distanz": consumableMaterials?.transportDistanz ? consumableMaterials.transportDistanz : 0,
        GWHArt: companyInformation?.gwhArt ? formatOptionValues([{selectValue: companyInformation.gwhArt, textFieldValue: null}]) : "[]",
        GWHAlter: companyInformation?.gwhAlter ? formatOptionValues([{selectValue: companyInformation.gwhAlter,textFieldValue: null}]) : "[]",
        Bedachungsmaterial: companyInformation?.bedachungsmaterial ? formatOptionValues([{selectValue: companyInformation.bedachungsmaterial,  textFieldValue: null}]) : "[]",
        AlterdesBedachungsmaterials: companyInformation?.alterdesBedachungsmaterials ? formatOptionValues([{selectValue: companyInformation.alterdesBedachungsmaterials, textFieldValue: null}]) : "[]",
        ArtdesStehwandmaterial: companyInformation?.artdesStehwandmaterials ? formatOptionValues([{selectValue: companyInformation.artdesStehwandmaterials, textFieldValue: null}]) : "[]",
        Energieschirm: companyInformation?.energieschirm ? formatOptionValues([{selectValue: companyInformation.energieschirm, textFieldValue: null}]) : "[]",
        Produktion: companyInformation?.produktion ? formatOptionValues([{selectValue: companyInformation.produktion, textFieldValue: null}]) : "[]",
        Kultursystem: companyInformation?.kultursystem ? formatOptionValues([{selectValue: companyInformation.kultursystem, textFieldValue: null}]) : "[]",
        Transportsystem: companyInformation?.transportsystem ? formatOptionValues([{selectValue: companyInformation.transportsystem, textFieldValue: null}]) : "[]",
        Fruchtgewicht: cultureInformation?.fruchtgewicht ? formatOptionValues([{selectValue: cultureInformation.fruchtgewicht, textFieldValue: null}]) : "[]",
        Nebenkultur: cultureInformation?.nebenkultur ? formatOptionValues([{selectValue: cultureInformation.nebenkultur, textFieldValue: null}]) : "[]",
        AnzahlTriebe: cultureManagement?.anzahlTriebe ? formatOptionValues(cultureManagement.anzahlTriebe) : "[]",
        Entfeuchtung: cultureManagement?.entfeuchtung ? formatOptionValues([{selectValue: cultureManagement.entfeuchtung, textFieldValue: null}]) : "[]",
        KulturmassnahmeAusblattenMenge: cultureManagement?.kulturmassnahmeAusblattenMenge ? cultureManagement.kulturmassnahmeAusblattenMenge : 0,
        Energietraeger: energyConsumption?.energietraeger ? formatOptionValues(energyConsumption.energietraeger) : "[]",
        Stromherkunft: energyConsumption?.stromherkunft ? formatOptionValues(energyConsumption.stromherkunft) : "[]",
        Zusatzbelichtung: energyConsumption?.zusatzbelichtung ? formatOptionValues([{selectValue: energyConsumption.zusatzbelichtung, textFieldValue: null}]) : "[]",
        Belichtungsstrom: energyConsumption?.belichtungsstrom ? formatOptionValues([{selectValue: energyConsumption.belichtungsstrom, textFieldValue: null}]) : "[]",
        "CO2-Herkunft": consumableItems?.co2Herkunft ? formatOptionValues([{selectValue: consumableItems.co2Herkunft, textFieldValue: null}]) : "[]",
        "Duengemittel:DetalierteAngabe": consumableItems?.duengemittelDetail ? formatOptionValues(consumableItems.duengemittelDetail) : "[]",
        "Duengemittel:VereinfachteAngabe": consumableItems?.duengemittelSimple ? formatOptionValues(consumableItems.duengemittelSimple) : "[]",
        Nuetzlinge: consumableItems?.nuetzlinge ? formatOptionValues(consumableItems.nuetzlinge) : "[]",
        Growbags: consumableMaterials?.growbags ? formatOptionValues([{selectValue: consumableMaterials.growbags,textFieldValue: null}]) : "[]",
        Substrat: consumableMaterials?.growbagsSubstrat ? formatOptionValues(consumableMaterials.growbagsSubstrat) : "[]",
        "SchnuereRankhilfen:Material": consumableMaterials?.schnurMaterial ? formatOptionValues([{selectValue: consumableMaterials.schnurMaterial,textFieldValue: null}]) : "[]",
        "Klipse:Material": consumableMaterials?.klipseMaterial ? formatOptionValues([{selectValue: consumableMaterials.klipseMaterial,textFieldValue: null}]) : "[]",
        "Rispenbuegel:Material": consumableMaterials?.rispenbuegelMaterial ? formatOptionValues([{selectValue: consumableMaterials.rispenbuegelMaterial,textFieldValue: null}]) : "[]",
        Bewaesserungsart: consumableMaterials?.bewaesserArt ? formatOptionValues([{selectValue: consumableMaterials.bewaesserArt,textFieldValue: null}]) : "[]",
        Bodenfolien: consumableMaterials?.bodenfolien ? formatOptionValues([{selectValue: consumableMaterials.bodenfolien,textFieldValue: null}]) : "[]",
        SonstigeVerbrauchsmaterialien: consumableMaterials?.sonstVerbrauchsmaterialien ? formatOptionValues(consumableMaterials.sonstVerbrauchsmaterialien) : "[]",
        JungpflanzenZukauf: consumableMaterials?.jungpflanzenEinkauf ? formatOptionValues([{selectValue: consumableMaterials.jungpflanzenEinkauf,textFieldValue: null}]) : "[]",
    }

    return submissionData
}

const PageInputData = (props: InputDataProps) => {
    useEffect(() => {
        props.loadLookupValues()
    }, [])

    const [dataToSubmit, setDataToSubmit] = useState<DataToSubmit>({
        companyInformation: {
            gewaechshausName: null,
            datum: new Date(Date.now()),
            plz: null,
            gwhArt: null,
            gwhAlter: null,
            bedachungsmaterial: null,
            alterdesBedachungsmaterials: null,
            artdesStehwandmaterials: null,
            energieschirm: null,
            alterEnergieschirm: null,
            stehwandhoehe: null,
            laenge: null,
            breite: null,
            knappenbreite: null,
            scheibenlaenge: null,
            produktion: null,
            kultursystem: null,
            alterKultursystem: null,
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
            anzahlTriebe: [{selectValue: null, textFieldValue: null}],
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
            energietraeger: [{selectValue: null, textFieldValue: null}],
            strom:  null,
            stromherkunft: [{selectValue: null, textFieldValue: null}],
            zusatzbelichtung: null,
            belichtungsstrom: null,
            belichtungsstromAnschlussleistung: null,
            belichtungsstromAnzLampen: null,
            belichtungsstromLaufzeitTag: null,
        },
        consumableItems: {
            co2Zudosierung: null,
            co2Herkunft: null,
            duengemittelDetail: [{selectValue: null, textFieldValue: null}],
            duengemittelSimple: [{selectValue: null, textFieldValue: null}],
            fungizide: null,
            insektizide: null,
            nuetzlinge: [{selectValue: null, textFieldValue: null}]
        },
        consumableMaterials: {
            growbags: null,
            growbagsVolumen: null,
            growbagsLaenge: null,
            growbagsPflanzenAnz: null,
            growbagsSubstrat: [{selectValue: null, textFieldValue: null}],
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
            sonstVerbrauchsmaterialien: [{selectValue: null, textFieldValue: null}],
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
        submit: () => {
            props.submitGreenhouseData(processDataToSubmit(dataToSubmit), () => {
                useNavigate()("../co2-footprint")
            })
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







