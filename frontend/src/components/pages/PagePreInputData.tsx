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
import {Divider, InputLabel} from "@mui/material";
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


    const getGreenhouseName = (greenhouse:string) => {
        return greenhouse.replaceAll("[","").replaceAll("]","").split(",")
   }

    const initialData: DataToSubmit = {
        companyInformation: {
            gewaechshausName: null,
            datum: new Date(Date.now()),
            plz: {value: null, unit: null},
            gwhGesamtFlaeche: {value: null, unit: null},
            einheitlicheWaermeversorgung: null,
            gwhFlaeche: {value: null, unit: null},
            waermeteilungFlaeche: {value: null, unit: null},
            gwhArt: null,
            gwhAlter: {value: null, unit: null},
            bedachungsmaterial: null,
            bedachungsmaterialAlter: {value: null, unit: null},
            stehwandmaterial: null,
            stehwandmaterialAlter: {value: null, unit: null},
            energieschirm: null,
            energieschirmAlter: {value: null, unit: null},
            stehwandhoehe: { value: null, unit: null},
            laenge: {value: null, unit: null},
            breite: {value: null, unit: null},
            kappenbreite: {value: null, unit: null},
            scheibenlaenge: {value: null, unit: null},
            reihenabstand: {value: null, unit: null},
            vorwegbreite: {value: null, unit: null},
            transportsystem: null,
            transportsystemAlter: {value:null,unit: null},
            produktionstyp: null,
            kultursystem: null,
            kultursystemAlter: {value: null, unit: null},
            zusaetzlichesHeizsystem: null,
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
            kulturflaeche: {value: null, unit: null},
            kulturBeginn: {value: null, unit: null},
            kulturEnde: {value: null, unit: null},
            nebenkultur: null,
            nebenkulturBeginn: {value: null, unit: null},
            nebenkulturEnde: {value: null, unit: null},
        },
        cultureManagement: {
            mittlereSolltemperaturTag: {value: null,unit: null},
            mittlereSolltemperaturNacht: {value: null,unit: null},
            entfeuchtung: null,
            luftfeuchte: {value: null,unit: null},
        },
        energyConsumption: {
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
        consumableItems: {
            co2Herkunft: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            duengemittelSimple: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            duengemittelDetail: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            fungizideKg: {value: null, unit: null},
            insektizideKg: {value: null, unit: null},
            fungizideLiter: {value: null, unit: null},
            insektizideLiter: {value: null, unit: null},
            nuetzlinge: [{selectValue: null, textFieldValue: { value: null, unit: null}}]
        },
        consumableMaterials: {
            growbagsKuebel: null,
            growbagsKuebelSubstrat: [{selectValue: null, textFieldValue: { value: null, unit: null}, textField2Value: null}],
            kuebelVolumenProTopf: {value: null, unit: null},
            kuebelJungpflanzenProTopf: {value: null, unit: null},
            kuebelAlter: {value: null, unit: null},
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
            bewaesserArt: null,
            bodenabdeckung: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            jungpflanzenZukauf: null,
            jungpflanzenDistanz: {value: null, unit: null},
            jungpflanzenSubstrat: null,
            verpackungsmaterial: [{selectValue: null, textFieldValue: { value: null, unit: null}}],
            anzahlNutzungenMehrwegsteigen: {value: null, unit: null},
            sonstVerbrauchsmaterialien: [{selectValue: null, textFieldValue: { value: null, unit: null}, textField2Value: null}],
            transportDistanz: {value: null, unit: null},
            zusaetzlicherMaschineneinsatz: [{selectValue: null, textFieldValue: { value: null, unit: null}, textField2Value: null}]
        }
    }

    const [inputFieldData, setInputFieldData] = useState<DataToSubmit>(initialData)



    const parseMeasureTuple = (tuple:string) => {
        const measure = JSON.parse(tuple)
        if(measure[0] == [0.000,0]) {
            return {value: null, unit: null}
        }
        return {value: measure[0], unit: measure[1]}
    }

    const parseSelectionTuple = (tuple:string) => {
        const selection = JSON.parse(tuple)

        if(selection[0][0] == null)
            return null

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
        const today = new Date()
        return {value: new Date(today.getFullYear() - age[0], today.getMonth(), today.getDay()), unit: age[1]}
    }

    // Load the greenhouse dataset
    let lookupGreenhouses: Option[] = []
    if(dataset.successful) {
        const greenhouses = dataset.datasets.map(greenhouse => greenhouse.greenhouse_name)

        greenhouses.forEach((greenhouse, index) => {
            const currentGreenhouse = getGreenhouseName(greenhouse)
            lookupGreenhouses[index] = { id: parseInt(currentGreenhouse[0]), values: currentGreenhouse[1] }
        })


        parseSelectionTuple(dataset.datasets[0].Stromherkunft)
    }

    // Render the Inputpages with already filled out input fields.
    // The data for the input fields comes from the most recent dataset from the selected greenhouse
    const renderFilledInputPages = () => {

        const initialDataset = dataset.datasets.filter(value => parseInt(getGreenhouseName(value.greenhouse_name)[0]) == selectedGreenhouse)[0]

        setInputFieldData( {
            companyInformation: {
                gewaechshausName: getGreenhouseName(initialDataset.greenhouse_name)[1],
                datum: new Date(Date.now()),
                plz: parseMeasureTuple(initialDataset.PLZ),
                gwhGesamtFlaeche: parseMeasureTuple(initialDataset.GWHGesamtflaeche),
                einheitlicheWaermeversorgung: parseSelectionTuple(initialDataset.EinheitlicheWaermeversorgung),
                gwhFlaeche: parseMeasureTuple(initialDataset.GWHFlaeche),
                waermeteilungFlaeche: parseMeasureTuple(initialDataset.WaermeteilungFlaeche),
                gwhArt: parseSelectionTuple(initialDataset.GWHArt),
                gwhAlter: parseDateTuple(initialDataset.GWHAlter),
                bedachungsmaterial: parseSelectionTuple(initialDataset.Bedachungsmaterial),
                bedachungsmaterialAlter: parseDateTuple(initialDataset.AlterBedachungsmaterial),
                stehwandmaterial: parseSelectionTuple(initialDataset.Stehwandmaterial),
                stehwandmaterialAlter: parseDateTuple(initialDataset.AlterStehwandmaterial),
                energieschirm: parseSelectionTuple(initialDataset.Energieschirm),
                energieschirmAlter: parseDateTuple(initialDataset.AlterEnergieschirm),
                stehwandhoehe: parseMeasureTuple(initialDataset.Stehwandhoehe),
                laenge: parseMeasureTuple(initialDataset.Laenge),
                breite: parseMeasureTuple(initialDataset.Breite),
                kappenbreite: parseMeasureTuple(initialDataset.Kappenbreite),
                scheibenlaenge: parseMeasureTuple(initialDataset.Scheibenlaenge),
                reihenabstand: parseMeasureTuple(initialDataset["Reihenabstand(Rinnenabstand)"]),
                vorwegbreite: parseMeasureTuple(initialDataset.Vorwegbreite),
                transportsystem: parseSelectionTuple(initialDataset.Transportsystem),
                transportsystemAlter: parseDateTuple(initialDataset.AlterTransportsystem),
                produktionstyp: parseSelectionTuple(initialDataset.Produktionstyp),
                kultursystem: parseSelectionTuple(initialDataset.Kultursystem),
                kultursystemAlter: parseDateTuple(initialDataset.AlterKultursystem),
                zusaetzlichesHeizsystem: parseSelectionTuple(initialDataset.ZusaetzlichesHeizsystem),
                zusaetzlichesHeizsystemAlter: parseDateTuple(initialDataset.AlterZusaetzlichesHeizsystem),
            },
            cultureInformation: {
                snack: parseSelectionTuple(initialDataset["10-30Gramm(Snack)"]),
                snackReihenanzahl: parseMeasureTuple(initialDataset.SnackReihenanzahl),
                snackPflanzenabstand: parseMeasureTuple(initialDataset.SnackPflanzenabstandInDerReihe),
                snackTriebzahl: parseMeasureTuple(initialDataset.SnackTriebzahl),
                snackErtragJahr: parseMeasureTuple(initialDataset.SnackErtragJahr),
                cocktail: parseSelectionTuple(initialDataset["30-100Gramm(Cocktail)"]),
                cocktailReihenanzahl: parseMeasureTuple(initialDataset.CocktailReihenanzahl),
                cocktailPflanzenabstand: parseMeasureTuple(initialDataset.CocktailPflanzenabstandInDerReihe),
                cocktailTriebzahl: parseMeasureTuple(initialDataset.CocktailTriebzahl),
                cocktailErtragJahr: parseMeasureTuple(initialDataset.CocktailErtragJahr),
                rispen: parseSelectionTuple(initialDataset["100-150Gramm(Rispen)"]),
                rispenReihenanzahl: parseMeasureTuple(initialDataset.RispenReihenanzahl),
                rispenPflanzenabstand: parseMeasureTuple(initialDataset.RispenPflanzenabstandInDerReihe),
                rispenTriebzahl: parseMeasureTuple(initialDataset.RispenTriebzahl),
                rispenErtragJahr: parseMeasureTuple(initialDataset.RispenErtragJahr),
                fleisch: parseSelectionTuple(initialDataset[">150Gramm(Fleisch)"]),
                fleischReihenanzahl: parseMeasureTuple(initialDataset.FleischReihenanzahl),
                fleischPflanzenabstand: parseMeasureTuple(initialDataset.FleischPflanzenabstandInDerReihe),
                fleischTriebzahl: parseMeasureTuple(initialDataset.FleischTriebzahl),
                fleischErtragJahr: parseMeasureTuple(initialDataset.FleischErtragJahr),
                kulturflaeche: parseMeasureTuple(initialDataset.Kulturflaeche),
                kulturBeginn: parseMeasureTuple(initialDataset.KulturBeginn),
                kulturEnde: parseMeasureTuple(initialDataset.KulturEnde),
                nebenkultur: parseSelectionTuple(initialDataset.Nebenkultur),
                nebenkulturBeginn: parseMeasureTuple(initialDataset.NebenkulturBeginn),
                nebenkulturEnde: parseMeasureTuple(initialDataset.NebenkulturEnde),
            },
            cultureManagement: {
                mittlereSolltemperaturTag: parseMeasureTuple(initialDataset.MittlereSolltemperaturTag),
                mittlereSolltemperaturNacht: parseMeasureTuple(initialDataset.MittlereSolltemperaturNacht),
                entfeuchtung: parseSelectionTuple(initialDataset.Entfeuchtung),
                luftfeuchte: parseMeasureTuple(initialDataset.Luftfeuchte),
            },
            energyConsumption: {
                energietraeger: parseSelectionTuple(initialDataset.Energietraeger),
                bhkw: parseSelectionTuple(initialDataset.BHKW),
                bhkwAnteilErdgas: parseMeasureTuple(initialDataset["BHKW:AnteilErdgas"]),
                bhkwAnteilBiomethan: parseMeasureTuple(initialDataset["BHKW:AnteilBiomethan"]),
                stromherkunft: parseSelectionTuple(initialDataset.Stromherkunft),
                zusatzbelichtung: parseSelectionTuple(initialDataset.Zusatzbelichtung),
                belichtungsstrom: parseSelectionTuple(initialDataset.Belichtungsstrom),
                belichtungsstromEinheit: parseSelectionTuple(initialDataset.BelichtungsstromEinheit),
                belichtungsstromStromverbrauch: parseMeasureTuple(initialDataset["Belichtung:Stromverbrauch"]),
                belichtungsstromAnzLampen: parseMeasureTuple(initialDataset["Belichtung:AnzahlLampen"]),
                belichtungsstromAnschlussleistung: parseMeasureTuple(initialDataset["Belichtung:AnschlussleistungProLampe"]),
                belichtungsstromLaufzeitJahr: parseMeasureTuple(initialDataset["Belichtung:LaufzeitProJahr"]),
            },
            consumableItems: {
                co2Herkunft: parseSelectionTuple(initialDataset["CO2-Herkunft"]),
                duengemittelSimple: parseSelectionTuple(initialDataset["Duengemittel:VereinfachteAngabe"]),
                duengemittelDetail: parseSelectionTuple(initialDataset["Duengemittel:DetaillierteAngabe"]),
                fungizideKg:  parseMeasureTuple(initialDataset.FungizideKg),
                insektizideKg:  parseMeasureTuple(initialDataset.InsektizideKg),
                fungizideLiter: {value: null, unit: null},
                insektizideLiter: {value: null, unit: null},
                nuetzlinge: parseSelectionTuple(initialDataset.Nuetzlinge),
            },
            consumableMaterials: {
                growbagsKuebel: parseSelectionTuple(initialDataset.GrowbagsKuebel),
                growbagsKuebelSubstrat: parseSelectionTuple(initialDataset.Substrat),
                kuebelVolumenProTopf: parseMeasureTuple(initialDataset["Kuebel:VolumenProTopf"]),
                kuebelJungpflanzenProTopf: parseMeasureTuple(initialDataset["Kuebel:JungpflanzenProTopf"]),
                kuebelAlter: parseDateTuple(initialDataset["Kuebel:Alter"]),
                schnurMaterial: parseSelectionTuple(initialDataset["SchnuereRankhilfen:Material"]),
                schnurLaengeProTrieb: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Laenge"]),
                schnurWiederverwendung: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Wiederverwendung"]),
                klipse: parseSelectionTuple(initialDataset.Klipse),
                klipseMaterial: parseSelectionTuple(initialDataset["Klipse:Material"]),
                klipseAnzProTrieb: parseMeasureTuple(initialDataset["Klipse:AnzahlProTrieb"]),
                klipseWiederverwendung: parseMeasureTuple(initialDataset["Klipse:Wiederverwendung"]),
                rispenbuegel: parseSelectionTuple(initialDataset.Rispenbuegel),
                rispenbuegelMaterial: parseSelectionTuple(initialDataset["Rispenbuegel:Material"]),
                rispenbuegelAnzProTrieb: parseMeasureTuple(initialDataset["Rispenbuegel:AnzahlProTrieb"]),
                rispenbuegelWiederverwendung: parseMeasureTuple(initialDataset["Rispenbuegel:Wiederverwendung"]),
                bewaesserArt: parseSelectionTuple(initialDataset.Bewaesserungsart),
                bodenabdeckung: parseSelectionTuple(initialDataset.Bodenabdeckung),
                jungpflanzenZukauf: parseSelectionTuple(initialDataset["Jungpflanzen:Zukauf"]),
                jungpflanzenDistanz: parseMeasureTuple(initialDataset["Jungpflanzen:Distanz"]),
                jungpflanzenSubstrat: parseSelectionTuple(initialDataset["Jungpflanzen:Substrat"]),
                verpackungsmaterial: parseSelectionTuple(initialDataset.Verpackungsmaterial),
                anzahlNutzungenMehrwegsteigen: parseMeasureTuple(initialDataset["Verpackungsmaterial:AnzahlMehrwegsteigen"]),
                sonstVerbrauchsmaterialien: parseSelectionTuple(initialDataset.SonstigeVerbrauchsmaterialien),
                transportDistanz: parseMeasureTuple(initialDataset["Transport:Distanz"]),
                zusaetzlicherMaschineneinsatz: parseSelectionTuple(initialDataset.ZusaetzlicherMaschineneinsatz),
            }
        })
        setPageStatus(PageStatus.OldGH)
    }

    const renderEmptyInputPages = () => {
        setPageStatus(PageStatus.NewGH)
    }



    const ghSelectProps: DynamicSelectProps<any> = {
        "lookupValues": lookupGreenhouses,
        value: selectedGreenhouse,
        onChange: event => setSelectedGreenhouse(parseFloat(event.target.value))
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
            )
        },
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
                        <Grid container direction={"row"} xs={12} sx={{pt:8}} alignItems="center" justifyContent="center" >
                            <Grid item container xs={4} alignItems="center" justifyContent="center" sx={{pr:4}} spacing={1}>
                                <Typography component="h1" variant="subtitle2">
                                    Für bestehendes Gewächshaus
                               </Typography>
                                <FormControl fullWidth sx={{mt:2}}>
                                    <InputLabel id="amount-select-label">Gewächshaus</InputLabel>
                                <DynamicSelect label="GWH" {...ghSelectProps} />
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