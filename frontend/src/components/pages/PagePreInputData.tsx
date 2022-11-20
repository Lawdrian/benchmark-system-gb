/**
 * #####################################################################
 * This is the page component for rendering the pre data inputpage. The
 * user gets to this page by clicking on "Dateneingabe" on the left
 * drawer. This page lets the user select one of his greenhouses, or
 * create a new one. The user will then be bought to the input page:
 * PageInputData.tsx
 *######################################################################
 */


import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import PageInputData, {DataToSubmit} from "./PageInputData";
import {useEffect, useState} from "react";
import FormControl from "@mui/material/FormControl";
import {Divider, FormHelperText, InputLabel} from "@mui/material";
import DynamicSelect, {DynamicSelectProps} from "../utils/DynamicSelect";
import {loadDatasets} from "../../actions/dataset";
import {Option} from "../../reducers/lookup";
import TextField, {TextFieldProps} from "@mui/material/TextField";



const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset
});

const mapDispatchToProps = {
    loadDatasets
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type PreInputDataProps = ReduxProps & {
}

const PagePreInputData = ({loadDatasets, dataset}: PreInputDataProps) => {
    useEffect(() => {
        loadDatasets()
    }, [])

    const [selectedGreenhouse, setSelectedGreenhouse] = useState<number | null>(null)


    enum PageStatus {
        PreInput = "PreInput",
        NewGH = "NewGH",
        OldGH = "OldGH",
    }
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.PreInput)
    const [nameTries, setNameTries] = useState<number>(0)
    const [selectTries, setSelectTries] = useState<number>(0)

    const getGreenhouseName = (greenhouse:string) => {
        return greenhouse.replaceAll("[","").replaceAll("]","").split(",")
   }

    const initialData: DataToSubmit = {
        companyInformation: {
            gewaechshausName: null,
            datum: new Date(Date.now()),
            plz: {value: null, unit: null},
            gwhFlaeche: {value: null, unit: null},
            nutzflaeche: {value: null, unit: null},
            gwhArt: null,
            gwhAlter: {value: null, unit: null},
            bedachungsmaterial: null,
            bedachungsmaterialAlter: {value: null, unit: null},
            stehwandmaterial: null,
            stehwandmaterialAlter: {value: null, unit: null},
            energieschirm: null,
            energieschirmTyp: null,
            energieschirmAlter: {value: null, unit: null},
            stehwandhoehe: { value: null, unit: null},
            laenge: {value: null, unit: null},
            breite: {value: null, unit: null},
            kappenbreite: {value: null, unit: null},
            scheibenlaenge: {value: null, unit: null},
            reihenabstand: {value: null, unit: null},
            vorwegbreite: {value: null, unit: null},
            bodenabdeckung: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            heizsystem: null,
            heizsystemAlter: {value:null,unit: null},
            produktionsweise: null,
            produktionssystem: null,
            produktionssystemAlter: {value: null, unit: null},
            bewaesserArt: null,
            zusaetzlichesHeizsystem: null,
            zusaetzlichesHeizsystemTyp: null,
            zusaetzlichesHeizsystemAlter: {value: null,unit: null},
        },
        cultureInformation: {
            snack: null,
            snackReihenanzahl: {value: null, unit: null},
            snackPflanzenabstand: {value: null, unit: null},
            snackTriebzahl: {value: null, unit: null},
            snackErtragJahr: {value: null, unit: null},
            cocktail: null,
            cocktailReihenanzahl: {value: null, unit: null},
            cocktailPflanzenabstand: {value: null, unit: null},
            cocktailTriebzahl: {value: null, unit: null},
            cocktailErtragJahr: {value: null, unit: null},
            rispen: null,
            rispenReihenanzahl: {value: null, unit: null},
            rispenPflanzenabstand: {value: null, unit: null},
            rispenTriebzahl: {value: null, unit: null},
            rispenErtragJahr: {value: null, unit: null},
            fleisch: null,
            fleischReihenanzahl: {value: null, unit: null},
            fleischPflanzenabstand: {value: null, unit: null},
            fleischTriebzahl: {value: null, unit: null},
            fleischErtragJahr: {value: null, unit: null},
            kulturBeginn: {value: null, unit: null},
            kulturEnde: {value: null, unit: null},
            nebenkultur: null,
            nebenkulturBeginn: {value: null, unit: null},
            nebenkulturEnde: {value: null, unit: null},
        },
        energyConsumption: {
            waermeversorgung: null,
            waermeteilungFlaeche: {value: null, unit: null},
            energietraeger: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            bhkw: null,
            bhkwAnteilErdgas: {value: null, unit: null},
            bhkwAnteilBiomethan: {value: null, unit: null},
            stromherkunft: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            zusatzbelichtung: null,
            belichtungsstrom: null,
            belichtungsstromEinheit: null,
            belichtungsstromStromverbrauch: {value: null, unit: null},
            belichtungsstromAnzLampen: {value: null, unit: null},
            belichtungsstromAnschlussleistung: {value: null, unit: null},
            belichtungsstromLaufzeitJahr: {value: null, unit: null},
        },
        helpingMaterials: {
            co2Herkunft: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            duengemittelSimple: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            duengemittelDetail: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            fungizideKg: {value: null, unit: null},
            insektizideKg: {value: null, unit: null},
            fungizideLiter: {value: null, unit: null},
            insektizideLiter: {value: null, unit: null},
        },
        companyMaterials: {
            growbagsKuebel: null,
            growbagsKuebelSubstrat: [{selectValue: null, textFieldValue: { value: null, unit: null}, textField2Value: null}],
            kuebelVolumenProTopf: {value: null, unit: null},
            kuebelJungpflanzenProTopf: {value: null, unit: null},
            kuebelAlter: {value: null, unit: null},
            schnur: null,
            schnurMaterial: null,
            schnurLaengeProTrieb: {value: null, unit: null},
            schnurWiederverwendung: {value: null, unit: null},
            klipse: null,
            klipseMaterial: null,
            klipseAnzProTrieb: {value: null, unit: null},
            klipseWiederverwendung: {value: null, unit: null},
            rispenbuegel: null,
            rispenbuegelMaterial: null,
            rispenbuegelAnzProTrieb: {value: null, unit: null},
            rispenbuegelWiederverwendung: {value: null, unit: null},
            jungpflanzenZukauf: null,
            jungpflanzenDistanz: {value: null, unit: null},
            jungpflanzenSubstrat: null,
            verpackungsmaterial: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            anzahlNutzungenMehrwegsteigen: {value: null, unit: null},
            sonstVerbrauchsmaterialien: [{selectValue: null, textFieldValue: { value: null, unit: null}, textField2Value: null}],
        }
    }

    const [inputFieldData, setInputFieldData] = useState<DataToSubmit>(initialData)


    const hasNameTried = () => {
        return nameTries > 0
    }

    const hasSelectTried = () => {
        return selectTries > 0
    }


    const parseMeasureTuple = (tuple:string) => {
        const measure = JSON.parse(tuple)
        if(measure[0] == [0.000,0]) {
            return {value: null, unit: null}
        }
        return {value: measure[0], unit: measure[1]}
    }

    /**
     * This function is used for parsing a selectionTuple to the correct data struct
     *
     * @param tuple:string The tuple that needs to be parsed
     *
     * @return {ReactNode} datastruct
     */
    const parseSelectionTuple = (tuple:string) => {
        const selection = JSON.parse(tuple)

        if(selection[0][0] == null) {
            return null
        }

        if(selection[0].length == 1) {
            let parsedSelection = selection[0][0]
            return parsedSelection
        }
        else if(selection[0].length == 3) {
            let parsedSelection: { selectValue: number, textFieldValue: { value: number, unit: number }}[] = []
            selection.forEach( (value: number[]) => {parsedSelection.push({selectValue: value[0], textFieldValue: { value: value[1], unit: value[2]}})});
            return parsedSelection
        }
        else if(selection[0].length == 4) {
            let parsedSelection: { selectValue: number, textFieldValue: { value: number, unit: number }, textField2Value: number }[] = []
            selection.forEach( (value: number[]) => {parsedSelection.push({selectValue: value[0], textFieldValue: { value: value[1], unit: value[2]}, textField2Value: value[3]})});
            return parsedSelection
        }
        else {
            throw new Error("Selection Tuple has the wrong format!")
        }
    }

    const parseDateTuple = (tuple:string) => {
        const age = JSON.parse(tuple)
        if (age[0] == 0) {
            return {value: null, unit: null}
        }
        const today = new Date()
        return {value: new Date(today.getFullYear() - age[0], today.getMonth(), today.getDay()), unit: age[1]}
    }

    // Load the greenhouse dataset
    let lookupGreenhouses: Option[] = []
    if(dataset.successful) {
        if(dataset.datasets != "" && typeof dataset.datasets != "string") {
            const greenhouses = dataset.datasets.map(greenhouse => greenhouse.greenhouse_name)

            greenhouses.forEach((greenhouse, index) => {
                const currentGreenhouse = getGreenhouseName(greenhouse)
                lookupGreenhouses[index] = {id: parseInt(currentGreenhouse[0]), values: currentGreenhouse[1]}
            })
        }
        else if(dataset.datasets == "") {
            console.log("Dataset corrupted")
        }

    }

    // Render the Inputpages with already filled out input fields.
    // The data for the input fields comes from the most recent dataset from the selected greenhouse
    const renderFilledInputPages = () => {

        if(selectedGreenhouse != null && dataset.datasets != "" && typeof dataset.datasets != "string") {
            const initialDataset = dataset.datasets.filter(value => parseInt(getGreenhouseName(value.greenhouse_name)[0]) == selectedGreenhouse)[0]

            setInputFieldData({
                companyInformation: {
                    gewaechshausName: getGreenhouseName(initialDataset.greenhouse_name)[1],
                    datum: new Date(Date.now()),
                    plz: parseMeasureTuple(initialDataset.PLZ),
                    gwhFlaeche: parseMeasureTuple(initialDataset.GWHFlaeche),
                    nutzflaeche: parseMeasureTuple(initialDataset.Nutzflaeche),
                    gwhArt: parseSelectionTuple(initialDataset.GWHArt) ?? inputFieldData.companyInformation.gwhArt,
                    gwhAlter: parseDateTuple(initialDataset.GWHAlter),
                    bedachungsmaterial: parseSelectionTuple(initialDataset.Bedachungsmaterial) ?? inputFieldData.companyInformation.bedachungsmaterial,
                    bedachungsmaterialAlter: parseDateTuple(initialDataset.AlterBedachungsmaterial),
                    stehwandmaterial: parseSelectionTuple(initialDataset.Stehwandmaterial) ?? inputFieldData.companyInformation.stehwandmaterial,
                    stehwandmaterialAlter: parseDateTuple(initialDataset.AlterStehwandmaterial),
                    energieschirm: parseSelectionTuple(initialDataset.Energieschirm) ?? inputFieldData.companyInformation.energieschirm,
                    energieschirmTyp: parseSelectionTuple(initialDataset.EnergieschirmTyp) ?? inputFieldData.companyInformation.energieschirmTyp,
                    energieschirmAlter: parseDateTuple(initialDataset.AlterEnergieschirm),
                    stehwandhoehe: parseMeasureTuple(initialDataset.Stehwandhoehe),
                    laenge: parseMeasureTuple(initialDataset.Laenge),
                    breite: parseMeasureTuple(initialDataset.Breite),
                    kappenbreite: parseMeasureTuple(initialDataset.Kappenbreite),
                    scheibenlaenge: parseMeasureTuple(initialDataset.Scheibenlaenge),
                    reihenabstand: parseMeasureTuple(initialDataset["Reihenabstand(Rinnenabstand)"]),
                    vorwegbreite: parseMeasureTuple(initialDataset.Vorwegbreite),
                    bodenabdeckung: parseSelectionTuple(initialDataset.Bodenabdeckung) ?? inputFieldData.companyInformation.bodenabdeckung,
                    heizsystem: parseSelectionTuple(initialDataset.Heizsystem) ?? inputFieldData.companyInformation.heizsystem,
                    heizsystemAlter: parseDateTuple(initialDataset.AlterHeizsystem),
                    produktionsweise: parseSelectionTuple(initialDataset.Produktionstyp) ?? inputFieldData.companyInformation.produktionsweise,
                    produktionssystem: parseSelectionTuple(initialDataset.Produktionssystem) ?? inputFieldData.companyInformation.produktionssystem,
                    produktionssystemAlter: parseDateTuple(initialDataset.AlterProduktionssystem),
                    bewaesserArt: parseSelectionTuple(initialDataset.Bewaesserungsart) ?? inputFieldData.companyInformation.bewaesserArt,
                    zusaetzlichesHeizsystem: parseSelectionTuple(initialDataset.ZusaetzlichesHeizsystem) ?? inputFieldData.companyInformation.zusaetzlichesHeizsystem,
                    zusaetzlichesHeizsystemTyp: parseSelectionTuple(initialDataset.ZusaetzlichesHeizsystemTyp) ?? inputFieldData.companyInformation.zusaetzlichesHeizsystemTyp,
                    zusaetzlichesHeizsystemAlter: parseDateTuple(initialDataset.AlterZusaetzlichesHeizsystem),
                },
                cultureInformation: {
                    snack: parseSelectionTuple(initialDataset["10-30Gramm(Snack)"]) ?? inputFieldData.cultureInformation.snack,
                    snackReihenanzahl: parseMeasureTuple(initialDataset.SnackReihenanzahl),
                    snackPflanzenabstand: parseMeasureTuple(initialDataset.SnackPflanzenabstandInDerReihe),
                    snackTriebzahl: parseMeasureTuple(initialDataset.SnackTriebzahl),
                    snackErtragJahr: parseMeasureTuple(initialDataset.SnackErtragJahr),
                    cocktail: parseSelectionTuple(initialDataset["30-100Gramm(Cocktail)"]) ?? inputFieldData.cultureInformation.cocktail,
                    cocktailReihenanzahl: parseMeasureTuple(initialDataset.CocktailReihenanzahl),
                    cocktailPflanzenabstand: parseMeasureTuple(initialDataset.CocktailPflanzenabstandInDerReihe),
                    cocktailTriebzahl: parseMeasureTuple(initialDataset.CocktailTriebzahl),
                    cocktailErtragJahr: parseMeasureTuple(initialDataset.CocktailErtragJahr),
                    rispen: parseSelectionTuple(initialDataset["100-150Gramm(Rispen)"]) ?? inputFieldData.cultureInformation.rispen,
                    rispenReihenanzahl: parseMeasureTuple(initialDataset.RispenReihenanzahl),
                    rispenPflanzenabstand: parseMeasureTuple(initialDataset.RispenPflanzenabstandInDerReihe),
                    rispenTriebzahl: parseMeasureTuple(initialDataset.RispenTriebzahl),
                    rispenErtragJahr: parseMeasureTuple(initialDataset.RispenErtragJahr),
                    fleisch: parseSelectionTuple(initialDataset[">150Gramm(Fleisch)"]) ?? inputFieldData.cultureInformation.fleisch,
                    fleischReihenanzahl: parseMeasureTuple(initialDataset.FleischReihenanzahl),
                    fleischPflanzenabstand: parseMeasureTuple(initialDataset.FleischPflanzenabstandInDerReihe),
                    fleischTriebzahl: parseMeasureTuple(initialDataset.FleischTriebzahl),
                    fleischErtragJahr: parseMeasureTuple(initialDataset.FleischErtragJahr),
                    kulturBeginn: parseMeasureTuple(initialDataset.KulturBeginn),
                    kulturEnde: parseMeasureTuple(initialDataset.KulturEnde),
                    nebenkultur: parseSelectionTuple(initialDataset.Nebenkultur) ?? inputFieldData.cultureInformation.nebenkultur,
                    nebenkulturBeginn: parseMeasureTuple(initialDataset.NebenkulturBeginn),
                    nebenkulturEnde: parseMeasureTuple(initialDataset.NebenkulturEnde),
                },
                energyConsumption: {
                    waermeversorgung: parseSelectionTuple(initialDataset.Waermeversorgung) ?? inputFieldData.energyConsumption.waermeversorgung,
                    waermeteilungFlaeche: parseMeasureTuple(initialDataset.WaermeteilungFlaeche),
                    energietraeger: parseSelectionTuple(initialDataset.Energietraeger) ?? inputFieldData.energyConsumption.energietraeger,
                    bhkw: parseSelectionTuple(initialDataset.BHKW) ?? inputFieldData.energyConsumption.bhkw,
                    bhkwAnteilErdgas: parseMeasureTuple(initialDataset["BHKW:AnteilErdgas"]),
                    bhkwAnteilBiomethan: parseMeasureTuple(initialDataset["BHKW:AnteilBiomethan"]),
                    stromherkunft: parseSelectionTuple(initialDataset.Stromherkunft) ?? inputFieldData.energyConsumption.stromherkunft,
                    zusatzbelichtung: parseSelectionTuple(initialDataset.Zusatzbelichtung) ?? inputFieldData.energyConsumption.zusatzbelichtung,
                    belichtungsstrom: parseSelectionTuple(initialDataset.Belichtungsstrom) ?? inputFieldData.energyConsumption.belichtungsstrom,
                    belichtungsstromEinheit: parseSelectionTuple(initialDataset.BelichtungsstromEinheit) ?? inputFieldData.energyConsumption.belichtungsstromEinheit,
                    belichtungsstromStromverbrauch: parseMeasureTuple(initialDataset["Belichtung:Stromverbrauch"]),
                    belichtungsstromAnzLampen: parseMeasureTuple(initialDataset["Belichtung:AnzahlLampen"]),
                    belichtungsstromAnschlussleistung: parseMeasureTuple(initialDataset["Belichtung:AnschlussleistungProLampe"]),
                    belichtungsstromLaufzeitJahr: parseMeasureTuple(initialDataset["Belichtung:LaufzeitProJahr"]),
                },
                helpingMaterials: {
                    co2Herkunft: parseSelectionTuple(initialDataset["CO2-Herkunft"]) ?? inputFieldData.helpingMaterials.co2Herkunft,
                    duengemittelSimple: parseSelectionTuple(initialDataset["Duengemittel:VereinfachteAngabe"]) ?? inputFieldData.helpingMaterials.duengemittelSimple,
                    duengemittelDetail: parseSelectionTuple(initialDataset["Duengemittel:DetaillierteAngabe"]) ?? inputFieldData.helpingMaterials.duengemittelDetail,
                    fungizideKg: parseMeasureTuple(initialDataset.FungizideKg),
                    insektizideKg: parseMeasureTuple(initialDataset.InsektizideKg),
                    fungizideLiter: {value: null, unit: null},
                    insektizideLiter: {value: null, unit: null},
                },
                companyMaterials: {
                    growbagsKuebel: parseSelectionTuple(initialDataset.GrowbagsKuebel) ?? inputFieldData.companyMaterials.growbagsKuebel,
                    growbagsKuebelSubstrat: parseSelectionTuple(initialDataset.Substrat) ?? inputFieldData.companyMaterials.growbagsKuebelSubstrat,
                    kuebelVolumenProTopf: parseMeasureTuple(initialDataset["Kuebel:VolumenProTopf"]),
                    kuebelJungpflanzenProTopf: parseMeasureTuple(initialDataset["Kuebel:JungpflanzenProTopf"]),
                    kuebelAlter: parseMeasureTuple(initialDataset["Kuebel:Alter"]),
                    schnur: parseSelectionTuple(initialDataset.Schnur) ?? inputFieldData.companyMaterials.schnur,
                    schnurMaterial: parseSelectionTuple(initialDataset["SchnuereRankhilfen:Material"]) ?? inputFieldData.companyMaterials.schnurMaterial,
                    schnurLaengeProTrieb: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Laenge"]),
                    schnurWiederverwendung: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Wiederverwendung"]),
                    klipse: parseSelectionTuple(initialDataset.Klipse) ?? inputFieldData.companyMaterials.klipse,
                    klipseMaterial: parseSelectionTuple(initialDataset["Klipse:Material"]) ?? inputFieldData.companyMaterials.klipseMaterial,
                    klipseAnzProTrieb: parseMeasureTuple(initialDataset["Klipse:AnzahlProTrieb"]),
                    klipseWiederverwendung: parseMeasureTuple(initialDataset["Klipse:Wiederverwendung"]),
                    rispenbuegel: parseSelectionTuple(initialDataset.Rispenbuegel) ?? inputFieldData.companyMaterials.rispenbuegel,
                    rispenbuegelMaterial: parseSelectionTuple(initialDataset["Rispenbuegel:Material"]) ?? inputFieldData.companyMaterials.rispenbuegelMaterial,
                    rispenbuegelAnzProTrieb: parseMeasureTuple(initialDataset["Rispenbuegel:AnzahlProTrieb"]),
                    rispenbuegelWiederverwendung: parseMeasureTuple(initialDataset["Rispenbuegel:Wiederverwendung"]),
                    jungpflanzenZukauf: parseSelectionTuple(initialDataset["Jungpflanzen:Zukauf"]) ?? inputFieldData.companyMaterials.jungpflanzenZukauf,
                    jungpflanzenDistanz: parseMeasureTuple(initialDataset["Jungpflanzen:Distanz"]),
                    jungpflanzenSubstrat: parseSelectionTuple(initialDataset["Jungpflanzen:Substrat"]) ?? inputFieldData.companyMaterials.jungpflanzenSubstrat,
                    verpackungsmaterial: parseSelectionTuple(initialDataset.Verpackungsmaterial) ?? inputFieldData.companyMaterials.verpackungsmaterial,
                    anzahlNutzungenMehrwegsteigen: parseMeasureTuple(initialDataset["Verpackungsmaterial:AnzahlMehrwegsteigen"]),
                    sonstVerbrauchsmaterialien: parseSelectionTuple(initialDataset.SonstigeVerbrauchsmaterialien) ?? inputFieldData.companyMaterials.sonstVerbrauchsmaterialien,
                }
            })
            setPageStatus(PageStatus.OldGH)
        }
        setSelectTries(selectTries+1)
    }

    const renderEmptyInputPages = () => {
        if(inputFieldData.companyInformation.gewaechshausName != null && inputFieldData.companyInformation.gewaechshausName != "") {
            setPageStatus(PageStatus.NewGH)
        }
        setNameTries(nameTries+1)
    }



    const ghSelectProps: DynamicSelectProps<any> = {
        "lookupValues": lookupGreenhouses,
        value: selectedGreenhouse,
        onChange: event => {
            setSelectedGreenhouse(parseFloat(event.target.value))
            setSelectTries(0)
        },
        error: hasSelectTried()
    }


    // Properties of the input fields
    const gewaechshausNameProps: TextFieldProps = {
        label: "Gewächshaus Name",
        value: inputFieldData.companyInformation.gewaechshausName,
        onChange: event => {
            setInputFieldData({
                ...inputFieldData,
                    companyInformation: {
                    ...inputFieldData.companyInformation,
                        gewaechshausName: event.target.value
                }}
            ),
            setNameTries(0)
        },
        error: hasNameTried(),
        helperText: hasNameTried() ? "Bitte geben Sie einen Namen für Ihr Gewächshaus ein": undefined,
        type:"text",
        placeholder:"Name",
    }


    if(pageStatus == PageStatus.PreInput) {

        return (
            <Container component="main" maxWidth="lg">
                <Box
                    sx={{
                        height: '50vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center´'
                    }}
                >
                    <Grid container direction={"row"} xs={12} >
                        <Grid container item  alignItems="center" justifyContent="center">
                            <Typography component="h1" variant="h5">
                                Neuen Datensatz anlegen
                            </Typography>
                        </Grid>
                        <Grid container item alignItems={"center"} justifyContent={"center"}  xs={12}>
                            <Grid item xs={8}>
                                <p>
                                    Sie haben den ersten Schritt getätigt um einen neuen Datensatz anzulegen. Nun haben Sie zwei Optionen zur Auswahl.
                                    Entweder Sie legen einen komplett neuen Datensatz an (bei Erstnutzung oder Hinzufügen eines weiteren Gewächshauses), oder Sie wählen ein bestehendes/ bereits hinterlegtes Haus aus und nehmen Änderungen am Datensatz vor.
                                    Dies ist besonders sinnvoll, wenn Sie für ein bestehendes Haus ein weiteres Kulturjahr hinterlegen wollen um die Veränderungen der Fußabdrücke über die Jahre betrachten zu wollen.
                                    In diesem Fall ändern Sie im Datensatz bspw. das Kulturjahr, bauliche Änderungen, Erträge, Verbräuche und so weiter.
                                </p>
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} xs={12} sx={{pt:8}} alignItems="center" justifyContent="center" >
                            <Grid item container xs={4} alignItems="center" justifyContent="center" sx={{pr:4}} spacing={1}>
                                <Typography component="h1" variant="subtitle2">
                                    Für bestehendes Gewächshaus
                               </Typography>
                                <FormControl fullWidth sx={{mt:2}}>
                                    <InputLabel id="amount-select-label">Gewächshaus</InputLabel>
                                <DynamicSelect label="GWH" {...ghSelectProps} />
                                    <FormHelperText error>{hasSelectTried() ? "Bitte wählen Sie eines Ihrer Gewächshäuser aus": ""}</FormHelperText>
                                </FormControl>
                                <Button
                                    sx={{mt:2}}
                                    onClick={(event) => renderFilledInputPages()}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    anlegen
                                </Button>
                            </Grid>
                            <Divider orientation="vertical" flexItem> oder </Divider>
                            <Grid item container xs={4} alignItems="center" justifyContent="center" sx={{pl:4}} spacing={1}>
                                <Typography component="h1" variant="subtitle2" >
                                    Für neues Gewächshaus
                                </Typography>
                                <TextField
                                    sx={{mt:2}}
                                    placeholder='Gewächshaus Name'
                                    onWheel={(event) => event.currentTarget.querySelector('input')?.blur()}
                                    {...gewaechshausNameProps}
                                    fullWidth
                                />
                                <Button
                                    sx={{mt:2}}
                                    onClick={(event) => renderEmptyInputPages()}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    erstellen
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        )
    }
    else if(pageStatus == PageStatus.NewGH) {
        console.log("NEW initialData:")
        console.log(inputFieldData)
        return <PageInputData initialData={inputFieldData}/>
    }
    else if(pageStatus == PageStatus.OldGH) {
        console.log("OLD initialData:")
        console.log(inputFieldData)
        return <PageInputData initialData={inputFieldData}/>
    }
    else
        throw new Error('pageStatus is invalid!')



}
export default connector(PagePreInputData)