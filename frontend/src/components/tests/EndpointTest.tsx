import React, {useState} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RefreshIcon from '@mui/icons-material/Refresh';
import {loadCO2Footprint} from "../../actions/co2footprint";
import {submitGreenhouseData} from "../../actions/submission";
import {loadWaterBenchmark} from "../../actions/waterbenchmark";
import {loadWeatherData} from "../../actions/weather";
import {resetData} from "../../actions/reset";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {GreenhouseData} from "../../types/reduxTypes";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DoubleArrow from "@mui/icons-material/DoubleArrow";
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";
import {InputMode} from "../pages/PageInputData";
import {loadH2OFootprint} from "../../actions/h2ofootprint";

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    co2: state.co2,
    water: state.h2o,
    benchmark: state.benchmark,
    weather: state.weather,
    submission: state.submission,
    lookup: state.lookup
});

const mapDispatchToProps = {
    loadCO2Footprint,
    loadWaterBenchmark,
    loadH2OFootprint,
    loadWeatherData,
    submitGreenhouseData,
    resetData,
    loadLookupValues,
    loadUnitValues
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type EndpointTestProps = ReduxProps & {}

type EPTest = {
    loading: boolean,
    successful: boolean
}

type AuthEPTest = {
    withAuth: EPTest,
    withoutAuth: EPTest
}

type TestResults = {
    units: AuthEPTest
    lookup: AuthEPTest
    co2: AuthEPTest
    submission: AuthEPTest
}

const initialTestResults: TestResults = {
    co2: {
        withAuth: {loading: false, successful: false},
        withoutAuth: {loading: false, successful: false}
    },
    lookup: {
        withAuth: {loading: false, successful: false},
        withoutAuth: {loading: false, successful: false}
    },
    submission: {
        withAuth: {loading: false, successful: false},
        withoutAuth: {loading: false, successful: false}
    },
    units: {
        withAuth: {loading: false, successful: false},
        withoutAuth: {loading: false, successful: false}
    },
}

const resetTests = (props: EndpointTestProps, setTestResults: Function) => {
    props.resetData();
    setTestResults(JSON.parse(JSON.stringify(initialTestResults)));
}

const performTests = (props: EndpointTestProps, setTestResults: Function) => {
    resetTests(props, setTestResults)

    // Deep copy so initalTestResults do not get modified
    const testResults: TestResults = JSON.parse(JSON.stringify(initialTestResults))

    let weatherInput = {
        postalCode: 82439,
        startDate: new Date("2020-05-20"),
        endDate: new Date("2022-06-20")
    }
    let testData: GreenhouseData = {
        greenhouse_name: "Haus1",
        date: "2019-09-29",
        PLZ: "(90427,1)",
        GWHFlaeche: "(5000,3)",
        Nutzflaeche: "(4800,35)",
        WaermeteilungFlaeche: "(0,0)",
        GWHAlter: "(32,5)",
        AlterBedachungsmaterial: "(32,6)",
        AlterStehwandmaterial: "(12,7)",
        AlterEnergieschirm: "(12,8)",
        Stehwandhoehe: "(5,9)",
        Laenge: "(100,10)",
        Breite: "(50,11)",
        Kappenbreite: "(4,12)",
        Scheibenlaenge: "(2,13)",
        "Reihenabstand(Rinnenabstand)": "(0.85,14)",
        Vorwegbreite: "(4,15)",
        AlterHeizsystem: "(32,16)",
        AlterProduktionssystem: "(12,17)",
        AlterZusaetzlichesHeizsystem: "(32,18)",
        SnackReihenanzahl: "(10,19)",
        SnackPflanzenabstandInDerReihe: "(0.5,20)",
        SnackTriebzahl: "(4,21)",
        SnackErtragJahr: "(8000,0)",
        CocktailReihenanzahl: "(0,0)",
        CocktailPflanzenabstandInDerReihe: "(0,0)",
        CocktailTriebzahl: "(0,0)",
        CocktailErtragJahr: "(0,0)",
        RispenReihenanzahl: "(112,27)",
        RispenPflanzenabstandInDerReihe: "(0.5,28)",
        RispenTriebzahl: "(2,29)",
        RispenErtragJahr: "(3000,30)",
        FleischReihenanzahl: "(0,0)",
        FleischPflanzenabstandInDerReihe: "(0,0)",
        FleischTriebzahl: "(0,0)",
        FleischErtragJahr: "(0,0)",
        KulturBeginn: "(2,36)",
        KulturEnde: "(48,37)",
        NebenkulturBeginn: "(30,0)",
        NebenkulturEnde: "(1,0)",
        "Belichtung:Stromverbrauch": "(10,51)",
        "Belichtung:AnzahlLampen": "(0,0)",
        "Belichtung:AnschlussleistungProLampe": "(0,0)",
        "Belichtung:LaufzeitProJahr": "(0,0)",
        VorlaufmengeGesamt: "(3000,76)",
        Restwasser: "(400,78)",
        FungizideKg: "(3,55)",
        FungizideLiter: "(8,44)",
        InsektizideKg: "(4,57)",
        InsektizideLiter: "(5,45)",
        "Kuebel:VolumenProTopf": "(0,0)",
        "Kuebel:JungpflanzenProTopf": "(0,0)",
        "Kuebel:Alter": "(0,0)",
        "SchnuereRankhilfen:Laenge": "(15,66)",
        "SchnuereRankhilfen:Wiederverwendung": "(1,67)",
        "Klipse:AnzahlProTrieb": "(15,68)",
        "Klipse:Wiederverwendung": "(1,69)",
        "Rispenbuegel:AnzahlProTrieb": "(10,70)",
        "Rispenbuegel:Wiederverwendung": "(3,71)",
        "Jungpflanzen:Distanz": "(88,73)",
        "Verpackungsmaterial:AnzahlMehrwegsteigen": "(6000,74)",
        Waermeversorgung: "[(2)]",
        GWHArt: "[(3)]",
        Land: "[(238)]",
        Region: "[(352)]",
        Bedachungsmaterial: "[(6)]",
        Stehwandmaterial: "[(12)]",
        Energieschirm: "[(173)]",
        EnergieschirmTyp: "[(20)]",
        Heizsystem: "[(23)]",
        Produktionstyp: "[(25)]",
        Produktionssystem: "[(29)]",
        ZusaetzlichesHeizsystem: "[(171)]",
        ZusaetzlichesHeizsystemTyp: "[(30)]",
        "10-30Gramm(Snack)": "[(32)]",
        "30-100Gramm(Cocktail)": "[(35)]",
        "100-150Gramm(Rispen)": "[(36)]",
        ">150Gramm(Fleisch)": "[(39)]",
        Nebenkultur: "[(40)]",
        Energietraeger: "[(44,40000,45),(45,16000,48),(46,700,51)]",
        Stromherkunft: "[(54,20000,63),(55,2400,65),(56,13,67)]",
        Zusatzbelichtung: "[(64)]",
        Belichtungsstrom: "[(67)]",
        VorlaufmengeAnteile: "[(347,200,211),(348,400,213),(349,60,218)]",
        "CO2-Herkunft": "[(68,60,88),(70,50,94)]",
        "Duengemittel:VereinfachteAngabe": "[(71,10,96),(81,8,106),(79,3,104),(76,5,101),(74,4,99),(72,3,97),(77,2,102),(73,1,98),(75,88,100),(80,21,105),(78,2145,103)]",
        "Duengemittel:DetaillierteAngabe": "[(83,3,108),(93,5,118),(87,8,112),(86,4,111),(92,5,117),(94,8,119),(85,5,110),(89,85,114),(90,5,115),(97,8,122),(101,44,126),(103,5,128),(107,8,132),(88,8,113),(84,5,109),(104,54,129),(106,4,131),(105,55,130),(95,8,120),(98,5,123),(99,4,124),(91,4,116),(100,5,125),(96,54,121),(82,4,107)]",
        GrowbagsKuebel: "[(117)]",
        Substrat: "[(124,5,149)]",
        Schnur: "[(175)]",
        "SchnuereRankhilfen:Material": "[(129)]",
        Klipse: "[(163)]",
        "Klipse:Material": "[(133)]",
        Rispenbuegel: "[(165)]",
        "Rispenbuegel:Material": "[(136)]",
        Bewaesserungsart: "[(139)]",
        Bodenabdeckung: "[(167,12,192)]",
        "Jungpflanzen:Zukauf": "[(144)]",
        "Jungpflanzen:Substrat": "[(148)]",
        Verpackungsmaterial: "[(152,350,177),(151,150,176)]",
        SonstigeVerbrauchsmaterialien: "[(157,200,182,20), (153,1000,178,10),(154,8000,179,15),(155,120,180,10),(156,300,181,2),(158,100,183,2)]",
        BelichtungsstromEinheit: "[(160)]"
    }

    // Echte Betriebsdaten: RothenbucherA
    let testData2: GreenhouseData = {
         "10-30Gramm(Snack)": "[(33)]",
        "30-100Gramm(Cocktail)": "[(35)]",
        "100-150Gramm(Rispen)": "[(36)]",
        ">150Gramm(Fleisch)": "[(38)]",
        AlterBedachungsmaterial: "(8,6)",
        AlterEnergieschirm: "(8,8)",
        AlterHeizsystem: "(8,16)",
        AlterProduktionssystem: "(8,17)",
        AlterStehwandmaterial: "(8,7)",
        AlterZusaetzlichesHeizsystem: "(0,0)",
        Bedachungsmaterial: "[(6)]",
        Land: "[(238)]",
        Region: "[(352)]",
        "Belichtung:AnschlussleistungProLampe": "(0,0)",
        "Belichtung:AnzahlLampen": "(0,0)",
        "Belichtung:LaufzeitProJahr": "(0,0)",
        "Belichtung:Stromverbrauch": "(0,0)",
        Belichtungsstrom: "[(66)]",
        BelichtungsstromEinheit: "[(0,)]",
        Bewaesserungsart: "[(139)]",
        Bodenabdeckung: "[(168,5,193),(167,1,192)]",
        Breite: "(176,11)",
        "CO2-Herkunft": "[(68,375926,87)]",
        CocktailErtragJahr: "(0,0)",
        CocktailPflanzenabstandInDerReihe: "(0,0)",
        CocktailReihenanzahl: "(0,0)",
        CocktailTriebzahl: "(0,0)",
        "Duengemittel:DetaillierteAngabe": "[(93,6265,118),(87,1566,112),(86,7832,111),(94,1566,119),(102,1566,127),(85,31,110),(90,313,115),(97,13,122),(101,31,126),(103,19,128),(84,3133,109),(106,1253,131)]",
        "Duengemittel:VereinfachteAngabe": "[(0,)]",
        Energieschirm: "[(173)]",
        EnergieschirmTyp: "[(22)]",
        Energietraeger: "[(44,3000000,44),(52,13000000,61)]",
        FleischErtragJahr: "(434555,34)",
        FleischPflanzenabstandInDerReihe: "(0.5,32)",
        FleischReihenanzahl: "(37,31)",
        FleischTriebzahl: "(3.33,33)",
        FungizideKg: "(15,55)",
        FungizideLiter: "(0,0)",
        GWHAlter: "(8,5)",
        GWHArt: "[(3)]",
        GWHFlaeche: "(24360,3)",
        GrowbagsKuebel: "[(117)]",
        Heizsystem: "[(23)]",
        InsektizideKg: "(19,57)",
        InsektizideLiter: "(0,0)",
        "Jungpflanzen:Distanz": "(540,73)",
        "Jungpflanzen:Substrat": "[(148)]",
        "Jungpflanzen:Zukauf": "[(144)]",
        Kappenbreite: "(4,12)",
        Klipse: "[(163)]",
        "Klipse:AnzahlProTrieb": "(40,68)",
        "Klipse:Material": "[(134)]",
        "Klipse:Wiederverwendung": "(1,69)",
        "Kuebel:Alter": "(0,0)",
        "Kuebel:JungpflanzenProTopf": "(0,0)",
        "Kuebel:VolumenProTopf": "(0,0)",
        KulturBeginn: "(1,36)",
        KulturEnde: "(48,37)",
        Laenge: "(150,10)",
        Nebenkultur: "[(41)]",
        NebenkulturBeginn: "(0,0)",
        NebenkulturEnde: "(0,0)",
        Nutzflaeche: "(23656,35)",
        PLZ: "(74632,1)",
        Produktionssystem: "[(29)]",
        Produktionstyp: "[(25)]",
        "Reihenabstand(Rinnenabstand)": "(1.6,14)",
        RispenErtragJahr: "(630200,30)",
        RispenPflanzenabstandInDerReihe: "(0.5,28)",
        RispenReihenanzahl: "(74,27)",
        RispenTriebzahl: "(3.75,29)",
        Rispenbuegel: "[(165)]",
        "Rispenbuegel:AnzahlProTrieb": "(3,70)",
        "Rispenbuegel:Material": "[(138)]",
        "Rispenbuegel:Wiederverwendung": "(1,71)",
        Scheibenlaenge: "(2.5,13)",
        "SchnuereRankhilfen:Laenge": "(14,66)",
        "SchnuereRankhilfen:Material": "[(130)]",
        "SchnuereRankhilfen:Wiederverwendung": "(1,67)",
        Schnur: "[(175)]",
        SnackErtragJahr: "(0,0)",
        SnackPflanzenabstandInDerReihe: "(0,0)",
        SnackReihenanzahl: "(0,0)",
        SnackTriebzahl: "(0,0)",
        SonstigeVerbrauchsmaterialien: "[(0,)]",
        Stehwandhoehe: "(5,9)",
        VorlaufmengeGesamt: "(3000,76)",
        Restwasser: "(400,78)",
        Stehwandmaterial: "[(15)]",
        Stromherkunft: "[(61,250000,77)]",
        VorlaufmengeAnteile: "[(347,20,211),(348,40000,213),(349,10,217),(350,30000,219)]",
        Substrat: "[(123,1,148)]",
        Verpackungsmaterial: "[(151,50123,176),(152,6265,177)]",
        "Verpackungsmaterial:AnzahlMehrwegsteigen": "(0,0)",
        Vorwegbreite: "(4,15)",
        WaermeteilungFlaeche: "(38880,4)",
        Waermeversorgung: "[(1)]",
        ZusaetzlichesHeizsystem: "[(172)]",
        ZusaetzlichesHeizsystemTyp: "[(0,)]",
        Zusatzbelichtung: "[(64)]",
        date: "2021-01-01",
        greenhouse_name: "Haus"
    }


    const testLoading = (test: EPTest) => { return {...test,  loading: true} }
    const testSuccess = () => { return {successful: true, loading: false} }
    const testFailed = () => { return {successful: false, loading: false} }

    //props.loadWeatherData(weatherInput.postalCode, weatherInput.startDate, weatherInput.endDate);
    props.submitGreenhouseData(testData2,
        () => {
            props.loadCO2Footprint(
                true,
                () => {
                    testResults.co2.withAuth = testLoading(testResults.co2.withAuth)
                    setTestResults(testResults)
                },
                () => {
                    testResults.co2.withAuth = testSuccess()
                    setTestResults(testResults)
                    console.warn("Co2 with auth successful:", testResults)
                },
                () => {
                    testResults.co2.withAuth = testFailed()
                    setTestResults(testResults)
                }
            );
            //props.loadWaterBenchmark(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
            //props.loadWaterFootprint(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
        },
        true,
        () => {
            testResults.submission.withAuth = testLoading(testResults.submission.withAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.submission.withAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.submission.withAuth = testFailed()
            setTestResults(testResults)
        },
        InputMode.create
    );

    props.submitGreenhouseData(testData2,
        () => {
            props.loadCO2Footprint(
                false,
                () => {
                    testResults.co2.withoutAuth = testLoading(testResults.co2.withoutAuth)
                    setTestResults(testResults)
                },
                () => {
                    testResults.co2.withoutAuth = testSuccess()
                    setTestResults(testResults)
                },
                () => {
                    testResults.co2.withoutAuth = testFailed()
                    setTestResults(testResults)
                }
            );
            //props.loadWaterBenchmark(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
            //props.loadWaterFootprint(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
        },
        false,
        () => {
            testResults.submission.withoutAuth = testLoading(testResults.submission.withoutAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.submission.withoutAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.submission.withoutAuth = testFailed()
            setTestResults(testResults)
        },
        InputMode.create
    );

    props.loadLookupValues(
        true,
        () => {
            testResults.lookup.withAuth = testLoading(testResults.lookup.withAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.lookup.withAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.lookup.withAuth = testFailed()
            setTestResults(testResults)
        }
    );

    props.loadLookupValues(
        false,
        () => {
            testResults.lookup.withoutAuth = testLoading(testResults.lookup.withoutAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.lookup.withoutAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.lookup.withoutAuth = testFailed()
            setTestResults(testResults)
        }
    );

    props.loadUnitValues(
        true,
        () => {
            testResults.units.withAuth = testLoading(testResults.units.withAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.units.withAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.units.withAuth = testFailed()
            setTestResults(testResults)
        }
    );

    props.loadUnitValues(
        false,
        () => {
            testResults.units.withoutAuth = testLoading(testResults.units.withoutAuth)
            setTestResults(testResults)
        },
        () => {
            testResults.units.withoutAuth = testSuccess()
            setTestResults(testResults)
        },
        () => {
            testResults.units.withoutAuth = testFailed()
            setTestResults(testResults)
        }
    );
}

const EndpointTest = (props: EndpointTestProps) => {
    // Deep copy so initalTestResults do not get modified
    const [testResults, setTestResults] = useState<TestResults>(JSON.parse(JSON.stringify(initialTestResults)));
    const rows = [
        {
            name: "Load CO2-Footprint Data (Authenticated)",
            loading: testResults.co2.withAuth.loading,
            successful: testResults.co2.withAuth.successful
        }, {
            name: "Load CO2-Footprint Data (Not Authenticated)",
            loading: testResults.co2.withoutAuth.loading,
            successful: testResults.co2.withoutAuth.successful
        },/* {
            name: "Water Footprint",
            loading: dataLoading(props.water),
            successful: dataAvailable(props.water)
        }, {
            name: "Water Benchmark",
            loading: dataLoading(props.benchmark),
            successful: dataAvailable(props.benchmark)
        },*/ {
            name: "Save Greenhouse Data (Authenticated)",
            loading: testResults.submission.withAuth.loading,
            successful: testResults.submission.withAuth.successful
        }, {
            name: "Save Greenhouse Data (Not Authenticated)",
            loading: testResults.submission.withoutAuth.loading,
            successful: testResults.submission.withoutAuth.successful
        }, {
            name: "Load Lookup Values (Authenticated)",
            loading: testResults.lookup.withAuth.loading,
            successful: testResults.lookup.withAuth.successful
        }, {
            name: "Load Lookup Values (Not Authenticated)",
            loading: testResults.lookup.withoutAuth.loading,
            successful: testResults.lookup.withoutAuth.successful
        }, {
            name: "Load Unit Values (Authenticated)",
            loading: testResults.units.withAuth.loading,
            successful: testResults.units.withAuth.successful
        }, {
            name: "Load Unit Values (Not Authenticated)",
            loading: testResults.units.withoutAuth.loading,
            successful: testResults.units.withoutAuth.successful
        }/*,{
            name: "Load Weather Data",
            loading: props.weather.isLoading,
            successful: !!props.weather.weatherData
        },*/
    ]

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button onClick={() => performTests(props, (testResults: TestResults) => setTestResults({...testResults}))} // Shallow copy so react notices changes
                        endIcon={<DoubleArrow/>}
                        variant="outlined"
                        sx={{mr: "10px"}}>Run Tests</Button>
                <Button onClick={() => resetTests(props, setTestResults)}
                        endIcon={<RefreshIcon/>}
                        variant="outlined">Reset</Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Endpunkt</TableCell>
                                <TableCell align="center">Test am
                                    Laufen?</TableCell>
                                <TableCell align="center">Test
                                    erfolgreich?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell
                                        align="center">{row.loading ? "Ja" : "Nein"}
                                    </TableCell>
                                    <TableCell
                                        align="center">{row.successful ? "Ja" : "Nein"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

export default connector(EndpointTest);