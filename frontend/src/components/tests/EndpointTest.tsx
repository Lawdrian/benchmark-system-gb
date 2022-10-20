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
import {loadWaterFootprint} from "../../actions/waterfootprint";
import {loadWeatherData} from "../../actions/weather";
import {resetData} from "../../actions/reset";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {GreenhouseData} from "../../types/reduxTypes";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DoubleArrow from "@mui/icons-material/DoubleArrow";
import {loadLookupValues, loadUnitValues} from "../../actions/lookup";

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    co2: state.co2,
    water: state.water,
    benchmark: state.benchmark,
    weather: state.weather,
    submission: state.submission,
    lookup: state.lookup
});

const mapDispatchToProps = {
    loadCO2Footprint,
    loadWaterBenchmark,
    loadWaterFootprint,
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
        greenhouse_name: "Rottner Gemüse",
        date: "2022-09-29",
        PLZ: "(90427,1)",
        GWHGesamtflaeche: "(8000,2)",
        GWHFlaeche: "(5000,3)",
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
        AlterTransportsystem: "(32,16)",
        AlterKultursystem: "(12,17)",
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
        Kulturflaeche: "(4800,35)",
        KulturBeginn: "(2,36)",
        KulturEnde: "(48,37)",
        NebenkulturBeginn: "(30,0)",
        NebenkulturEnde: "(1,0)",
        MittlereSolltemperaturTag: "(22.5,40)",
        MittlereSolltemperaturNacht: "(16,41)",
        Luftfeuchte: "(30,42)",
        "BHKW:AnteilErdgas": "(0,0)",
        "BHKW:AnteilBiomethan": "(0,0)",
        "Belichtung:Stromverbrauch": "(10,51)",
        "Belichtung:AnzahlLampen": "(0,0)",
        "Belichtung:AnschlussleistungProLampe": "(0,0)",
        "Belichtung:LaufzeitProJahr": "(0,0)",
        FungizideKg: "(803,55)",
        InsektizideKg: "(504,57)",
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
        EinheitlicheWaermeversorgung: "[(1)]",
        GWHArt: "[(3)]",
        Bedachungsmaterial: "[(6)]",
        Stehwandmaterial: "[(12)]",
        Energieschirm: "[(20)]",
        Transportsystem: "[(23)]",
        Produktionstyp: "[(25)]",
        Kultursystem: "[(29)]",
        ZusaetzlichesHeizsystem: "[(30)]",
        "10-30Gramm(Snack)": "[(32)]",
        "30-100Gramm(Cocktail)": "[(35)]",
        "100-150Gramm(Rispen)": "[(36)]",
        ">150Gramm(Fleisch)": "[(39)]",
        Nebenkultur: "[(40)]",
        Entfeuchtung: "[(42)]",
        Energietraeger: "[(44,1300,45),(45,1600,48),(46,700,51)]",
        BHKW: "[(53)]",
        Stromherkunft: "[(54,20,63),(55,24,65),(56,13,67)]",
        Zusatzbelichtung: "[(64)]",
        Belichtungsstrom: "[(67)]",
        "CO2-Herkunft": "[(68,60,88),(70,50,94)]",
        "Duengemittel:VereinfachteAngabe": "[(71,10,96),(72,8,97),(73,3,98),(74,5,99),(75,4,100),(76,3,101),(77,2,102),(78,1,103),(79,88,104),(80,21,105),(81,2145,106)]",
        "Duengemittel:DetaillierteAngabe": "[(82,3,107),(83,5,108),(84,8,109),(85,4,110),(86,5,111),(87,8,112),(89,5,114),(90,85,115),(91,5,116),(92,8,117),(93,44,118),(94,5,119),(95,8,120),(96,8,121),(97,5,122),(98,54,123),(99,4,124),(100,55,125),(101,8,126),(102,5,127),(103,4,128),(104,4,129),(105,5,130),(106,54,131),(107,4,132)]",
        Nuetzlinge: "[(115,92,140),(108,12,133),(109,10,134),(110,11,135),(111,13,136),(112,14,137),(113,55,138),(114,2,139)]",
        GrowbagsKuebel: "[(117)]",
        Substrat: "[(124,1,149)]",
        "SchnuereRankhilfen:Material": "[(129)]",
        Klipse: "[(163)]",
        "Klipse:Material": "[(133)]",
        Rispenbuegel: "[(165)]",
        "Rispenbuegel:Material": "[(136)]",
        Bewaesserungsart: "[(139)]",
        Bodenabdeckung: "[(167,12,192)]",
        "Jungpflanzen:Zukauf": "[(144)]",
        "Jungpflanzen:Substrat": "[(148)]",
        Verpackungsmaterial: "[(152,3500,177),(151,1500,176)]",
        SonstigeVerbrauchsmaterialien: "[(157,200,182,20), (153,1000,178,10),(154,8000,179,15),(155,120,180,10),(156,300,181,2),(158,100,183,2)]",
        ZusaetzlicherMaschineneinsatz: "[(159,3,184,322)]",
        BelichtungsstromEinheit: "[(160)]"
    }

    const testLoading = (test: EPTest) => { return {...test,  loading: true} }
    const testSuccess = () => { return {successful: true, loading: false} }
    const testFailed = () => { return {successful: false, loading: false} }

    props.loadWeatherData(weatherInput.postalCode, weatherInput.startDate, weatherInput.endDate);
    props.submitGreenhouseData(testData,
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
        }
    );

    props.submitGreenhouseData(testData,
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
        }
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
        },{
            name: "Load Weather Data",
            loading: props.weather.isLoading,
            successful: !!props.weather.weatherData
        },
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