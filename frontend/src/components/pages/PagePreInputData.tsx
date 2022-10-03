import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import {RootState} from "../../store";
import {submitGreenhouseData} from "../../actions/submission";
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";
import {connect, ConnectedProps} from "react-redux";
import PageInputData from "./PageInputData";
import {useEffect, useState} from "react";
import {SectionDivider} from "../utils/inputPage/layout";
import {DateInputField, MeasureInputField, SelectionInputField} from "../utils/inputPage/InputFields";
import FormControl from "@mui/material/FormControl";
import {InputLabel} from "@mui/material";
import DynamicSelect, {DynamicSelectProps} from "../utils/DynamicSelect";
import {loadDatasets} from "../../actions/dataset";
import dataset from "../../reducers/dataset";
import {GreenhouseData} from "../../types/reduxTypes";
import {Option} from "../../reducers/lookup";



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
        return greenhouse.replaceAll("(","").replaceAll(")","").split(",")
   }

    let initialData = {
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
            knappenbreite: {value: null, unit: null},
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
            klipseGesamtmenge: {value: null, unit: null},
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



   const parseMeasureTuple = (tuple:string) => {
        const measure = tuple.replaceAll("[","").replaceAll("]","").replaceAll("(","").replaceAll(")","").split(",")
       return {value: measure[0], unit: measure[1]}
   }

    const parseSelectionTuple = (tuple:string) => {
        const selection = JSON.parse(tuple)
        console.log(selection)
        let final: { selectValue: number; textFieldValue: { value: number; unit: number; }; textField2Value: number; }[] = []
        selection.forEach( (value: number[]) => {final.push({selectValue: value[0], textFieldValue: { value: value[1], unit: value[2]}, textField2Value: value[2]})});
        console.log(final)
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

   const ghSelectProps: DynamicSelectProps<any> = {
       "lookupValues": lookupGreenhouses,
       value: selectedGreenhouse,
       onChange: event => setSelectedGreenhouse(parseFloat(event.target.value))
   }




   const renderFilledInputPages = () => {
       console.log(selectedGreenhouse)

       const initialDataset = dataset.datasets.filter(value => parseInt(getGreenhouseName(value.greenhouse_name)[0]) == selectedGreenhouse)[0]
       console.log(initialDataset)

       const initialData2 = {
        companyInformation: {
            gewaechshausName: lookupGreenhouses.forEach((value,index) => {if(value.id == selectedGreenhouse) return value.values }),
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
            knappenbreite: {value: null, unit: null},
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
            klipseGesamtmenge: {value: null, unit: null},
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



       setPageStatus(PageStatus.OldGH)
   }

   const renderEmptyInputPages = () => {
        setPageStatus(PageStatus.NewGH)
   }


   if(pageStatus == PageStatus.PreInput) {

       return (
           <Container component="main" maxWidth="sm">
               <Box
                   sx={{
                       height: '100vh',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                   }}
               >
                   <Grid container direction={"row"} xs={12} >
                       <Grid container item  alignItems="center" justifyContent="center">
                            <Typography component="h1" variant="h5">
                                Neuen Datensatz anlegen
                            </Typography>
                       </Grid>
                       <Grid container direction={"row"} xs={12} sx={{pt:4}} >
                            <Grid item container xs={6} alignItems="center" justifyContent="center" sx={{pr:2}}>
                                <Typography component="h1" variant="subtitle2">
                                    Für bestehendes Gewächshaus
                               </Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="amount-select-label">Gewächshaus</InputLabel>
                                <DynamicSelect label="GWH" {...ghSelectProps} />
                                </FormControl>
                                <Button
                                   onClick={(event) => renderFilledInputPages()}
                                   variant="contained"
                                   color="primary"
                                   fullWidth
                               >
                                   neuer Datensatz
                               </Button>
                            </Grid>
                            <Grid item container xs={6} alignItems="center" justifyContent="center" sx={{pl:2}}>
                                <Typography component="h1" variant="subtitle2">
                                    Für neues Gewächshaus
                               </Typography>
                                   <Button
                                       onClick={(event) => renderEmptyInputPages()}
                                       fullWidth
                                       variant="contained"
                                       color="primary"
                                   >
                                       neuer Datensatz
                                   </Button>
                            </Grid>
                       </Grid>
                   </Grid>
               </Box>
           </Container>
       )



   }
   else if(pageStatus == PageStatus.NewGH) {
       return <PageInputData initialData={initialData}/>
   }
   else if(pageStatus == PageStatus.OldGH) {
       return <PageInputData initialData={initialData}/>
   }
   else
       throw new Error('pageStatus is invalid!')



}
export default connector(PagePreInputData)