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
import {format} from "date-fns";

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

    const calcAge = (year: Date) => {
        const today = new Date()
        return today.getFullYear() - year.getFullYear()
    }

    const defaultValue = 0
    const defaultOption = "[(0,)]"

    // TODO: Implement a proper default value concept. Maybe get default value object from server?
    //submittionData maps the data from the dataToSubmit state so it can be used in the post request
    let submissionData: GreenhouseData = {
        greenhouse_name: companyInformation?.gewaechshausName ??  "Standardhaus",
        date: companyInformation.datum ? format(companyInformation.datum, 'yyyy-MM-dd') : new Date().toISOString().substring(0, 10),
        PLZ: companyInformation?.plz ?? defaultValue,
        GWHAlter: companyInformation?.gwhAlter ? calcAge(companyInformation?.gwhAlter) : defaultValue,
        AlterEnergieschirm: companyInformation?.alterEnergieschirm ? calcAge(companyInformation?.alterEnergieschirm) : defaultValue,
        Stehwandhoehe: companyInformation?.stehwandhoehe ?? defaultValue,
        Laenge: companyInformation?.laenge ?? defaultValue,
        Breite: companyInformation?.breite ?? defaultValue,
        Kappenbreite: companyInformation?.knappenbreite ?? defaultValue,
        "Scheibenlaenge(Bedachung)": companyInformation?.scheibenlaenge ?? defaultValue,
        AlterdesBedachungsmaterials: companyInformation?.alterdesBedachungsmaterials ? calcAge(companyInformation?.alterdesBedachungsmaterials): defaultValue,
        AlterKultursystem: companyInformation?.alterKultursystem ? calcAge(companyInformation?.alterKultursystem) : defaultValue,
        Reihenabstand: companyInformation?.reihenabstand ?? defaultValue,
        Kulturflaeche: cultureInformation?.kulturflaeche ?? defaultValue,
        KulturBeginn: cultureInformation?.kulturBeginn ?? defaultValue,
        KulturEnde: cultureInformation?.kulturEnde ?? defaultValue,
        Ertrag: cultureInformation?.ertrag ?? defaultValue,
        Pflanzdichte: cultureInformation?.pflanzendichte ?? defaultValue,
        Nebenkulturdauer: cultureInformation?.nebenkulturDauer ?? defaultValue,
        MittlereSolltemperaturTag: cultureManagement?.mittlereSolltemperaturTag ?? defaultValue,
        MittlereSolltemperaturNacht: cultureManagement?.mittlereSolltemperaturNacht ?? defaultValue,
        KulturmassnahmeAusgeizen: cultureManagement?.kulturmassnahmeAusgeizen ?? defaultValue,
        KulturmassnahmeAusblattenAnzahlMonat: cultureManagement?.kulturmassnahmeAusblattenAnzahlMonat ?? defaultValue,
        KulturmassnahmeAblassen: cultureManagement?.kulturmassnahmeAblassen ?? defaultValue,
        Strom: energyConsumption?.strom ?? defaultValue,
        StromverbrauchBelichtungAnschlussleistung: energyConsumption?.belichtungsstromAnschlussleistung ?? defaultValue,
        StromverbrauchBelichtungAnzahlLampen: energyConsumption?.belichtungsstromAnzLampen ?? defaultValue,
        StromverbrauchBelichtungLaufzeitTag: energyConsumption?.belichtungsstromLaufzeitTag ?? defaultValue,
        "CO2-Zudosierung": consumableItems?.co2Zudosierung ?? defaultValue,
        Fungizide: consumableItems?.fungizide ?? defaultValue,
        Insektizide: consumableItems?.insektizide ?? defaultValue,
        VolumenGrowbags: consumableMaterials?.growbagsVolumen ?? defaultValue,
        LaengeGrowbags: consumableMaterials?.growbagsLaenge ?? defaultValue,
        PflanzenproBag: consumableMaterials?.growbagsPflanzenAnz ?? defaultValue,
        "SchnuereRankhilfen:Laenge": consumableMaterials?.schnurLaenge ?? defaultValue,
        "SchnuereRankhilfen:Wiederverwendung": consumableMaterials?.schnurWiederverwendung ?? 0,
        "Klipse:Menge": consumableMaterials?.klipseGesamtmenge ?? defaultValue,
        "Klipse:Wiederverwendung": consumableMaterials?.klipseWiederverwendung ?? defaultValue,
        "Rispenbuegel:Menge": consumableMaterials?.rispenbuegelGesamtmenge ?? defaultValue,
        "Rispenbuegel:Wiederverwendung": consumableMaterials?.rispenbuegelWiederverwendung ?? defaultValue,
        "SonstigeVerbrauchsmaterialien:Wiederverwendung":
            consumableMaterials?.sonstVerbrauchsmaterialien && consumableMaterials.sonstVerbrauchsmaterialien.length ?
                (consumableMaterials.sonstVerbrauchsmaterialien[0].textFieldValue ? consumableMaterials.sonstVerbrauchsmaterialien[0].textFieldValue : defaultValue) : defaultValue,
        BodenfolienVerwendungsdauer: consumableMaterials?.bodenfolienVerwendungsdauer ?? defaultValue,
        "Verpackungsmaterial:Karton": consumableMaterials?.kartonVerpackung ?? defaultValue,
        "Verpackungsmaterial:Plastik": consumableMaterials?.plastikVerpackung ?? defaultValue,
        "TransportderWare:Auslieferungen": consumableMaterials?.transportFrequenz ?? defaultValue,
        "TransportderWare:Distanz": consumableMaterials?.transportDistanz ?? defaultValue,
        JungpflanzenDistanz: consumableMaterials?.jungpflanzenDistanz ?? defaultValue,
        GWHArt: companyInformation?.gwhArt ? formatOptionValues([{selectValue: companyInformation.gwhArt, textFieldValue: null}]) : "[]",
        Bedachungsmaterial: companyInformation?.bedachungsmaterial ? formatOptionValues([{selectValue: companyInformation.bedachungsmaterial,  textFieldValue: null}]) : "[]",
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
        Zusatzbelichtung: energyConsumption?.zusatzbelichtung ? formatOptionValues([{selectValue: energyConsumption.zusatzbelichtung, textFieldValue: null}]) : defaultOption,
        "CO2-Herkunft": consumableItems?.co2Herkunft ? formatOptionValues([{selectValue: consumableItems.co2Herkunft, textFieldValue: null}]) : "[]",
        "Duengemittel:DetalierteAngabe": consumableItems?.duengemittelDetail ? formatOptionValues(consumableItems.duengemittelDetail) : "[]",
        "Duengemittel:VereinfachteAngabe": consumableItems?.duengemittelSimple ? formatOptionValues(consumableItems.duengemittelSimple) : "[]",
        Nuetzlinge: consumableItems?.nuetzlinge ? formatOptionValues(consumableItems.nuetzlinge) : "[]",
        Growbags: consumableMaterials?.growbags ? formatOptionValues([{selectValue: consumableMaterials.growbags,textFieldValue: null}]) : "[]",
        "SchnuereRankhilfen:Material": consumableMaterials?.schnurMaterial ? formatOptionValues([{selectValue: consumableMaterials.schnurMaterial,textFieldValue: null}]) : "[]",
        "Klipse:Material": consumableMaterials?.klipseMaterial ? formatOptionValues([{selectValue: consumableMaterials.klipseMaterial,textFieldValue: null}]) : "[]",
        "Rispenbuegel:Material": consumableMaterials?.rispenbuegelMaterial ? formatOptionValues([{selectValue: consumableMaterials.rispenbuegelMaterial,textFieldValue: null}]) : "[]",
        Bewaesserungsart: consumableMaterials?.bewaesserArt ? formatOptionValues([{selectValue: consumableMaterials.bewaesserArt,textFieldValue: null}]) : "[]",
        Bodenfolien: consumableMaterials?.bodenfolien ? formatOptionValues([{selectValue: consumableMaterials.bodenfolien,textFieldValue: null}]) : "[]",
        SonstigeVerbrauchsmaterialien: consumableMaterials?.sonstVerbrauchsmaterialien ? formatOptionValues(consumableMaterials.sonstVerbrauchsmaterialien) : "[]",
        JungpflanzenZukauf: consumableMaterials?.jungpflanzenEinkauf ? formatOptionValues([{selectValue: consumableMaterials.jungpflanzenEinkauf,textFieldValue: null}]) : "[]",
        //Fields that might be optional due to dependency on conditional fields. Because of that only these fields get the defaultOption,
        // so that the other fields will trigger an error in the frontend validation if they are not filled out:
        Belichtungsstrom: energyConsumption?.belichtungsstrom ? formatOptionValues([{selectValue: energyConsumption.belichtungsstrom, textFieldValue: null}]) : defaultOption,
        Substrat: consumableMaterials?.growbagsSubstrat && consumableMaterials?.growbagsSubstrat[0].selectValue != null ? formatOptionValues(consumableMaterials.growbagsSubstrat) : defaultOption
    }
    console.log("SubmissionData:")
    console.log(submissionData)
    return submissionData
}

const PageInputData = (props: InputDataProps) => {
    useEffect(() => {
        props.loadLookupValues()
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
            stehwandhoehe: null,
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
            sonstVerbrauchsmaterialien: [{selectValue: null, textFieldValue: null, textField2Value: null}],
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







