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
        greenhouse_name: "Testhaus",
        date: "2022-06-17",
        PLZ: "(82362,1)",
        GWHGesamtflaeche: "(300,2)",
        GWHFlaeche: "(30,3)",
        WaermeteilungFlaeche: "(30,4)",
        GWHAlter: "(15,5)",
        AlterBedachungsmaterial: "(6,6)",
        AlterStehwandmaterial: "(7,7)",
        AlterEnergieschirm: "(4,8)",
        Stehwandhoehe: "(30,9)",
        Laenge: "(50,10)",
        Breite: "(30,11)",
        Kappenbreite: "(2,12)",
        Scheibenlaenge: "(50,13)",
        "Reihenabstand(Rinnenabstand)": "(2,14)",
        Vorwegbreite: "(4,15)",
        AlterTransportsystem: "(3,16)",
        AlterKultursystem: "(3,17)",
        AlterZusaetzlichesHeizsystem: "(8,18)",
        SnackReihenanzahl: "(30,19)",
        SnackPflanzenabstandInDerReihe: "(30,20)",
        SnackTriebzahl: "(30,21)",
        SnackErtragJahr: "(30,22)",
        CocktailReihenanzahl: "(30,23)",
        CocktailPflanzenabstandInDerReihe: "(30,24)",
        CocktailTriebzahl: "(30,25)",
        CocktailErtragJahr: "(30,26)",
        RispenReihenanzahl: "(30,27)",
        RispenPflanzenabstandInDerReihe: "(30,28)",
        RispenTriebzahl: "(30,29)",
        RispenErtragJahr: "(30,30)",
        FleischReihenanzahl: "(30,31)",
        FleischPflanzenabstandInDerReihe: "(30,32)",
        FleischTriebzahl: "(30,33)",
        FleischErtragJahr: "(30,34)",
        Kulturflaeche: "(30,35)",
        KulturBeginn: "(20,36)",
        KulturEnde: "(33,37)",
        NebenkulturBeginn: "(30,38)",
        NebenkulturEnde: "(40,39)",
        MittlereSolltemperaturTag: "(30,40)",
        MittlereSolltemperaturNacht: "(20,41)",
        Luftfeuchte: "(30,42)",
        "BHKW:AnteilErdgas": "(30,45)",
        "BHKW:AnteilBiomethan": "(30,47)",
        GWHStromverbrauch: "(30,49)",
        BetriebStromverbrauch: "(30,50)",
        "Belichtung:Stromverbrauch": "(30,51)",
        "Belichtung:AnzahlLampen": "(30,52)",
        "Belichtung:AnschlussleistungProLampe": "(30,53)",
        "Belichtung:LaufzeitProJahr": "(30,54)",
        FungizideKg: "(30,55)",
        InsektizideKg: "(30,57)",
        "Growbags:Volumen": "(30,59)",
        "Growbags:Laenge": "(30,61)",
        "Growbags:PflanzenproBag": "(30,62)",
        "Kuebel:VolumenProTopf": "(30,63)",
        "Kuebel:JungpflanzenProTopf": "(30,64)",
        "Kuebel:Alter": "(30,65)",
        "SchnuereRankhilfen:Laenge": "(30,66)",
        "SchnuereRankhilfen:Wiederverwendung": "(30,67)",
        "Klipse:AnzahlProTrieb": "(30,68)",
        "Klipse:Wiederverwendung": "(30,69)",
        "Rispenbuegel:AnzahlProTrieb": "(30,70)",
        "Rispenbuegel:Wiederverwendung": "(30,71)",
        "Jungpflanzen:Distanz": "(30,73)",
        "Verpackungsmaterial:AnzahlMehrwegsteigen": "(30,74)",
        "Transport:Distanz": "(30,75)",
        EinheitlicheWaermeversorgung: "[(2)]",
        GWHArt: "[(4)]",
        Bedachungsmaterial: "[(6)]",
        Stehwandmaterial: "[(13)]",
        Energieschirm: "[(19)]",
        Transportsystem: "[(24)]",
        Produktionstyp: "[(25)]",
        Kultursystem: "[(27)]",
        ZusaetzlichesHeizsystem: "[(30)]",
        "10-30Gramm(Snack)": "[(32)]",
        "30-100Gramm(Cocktail)": "[(34)]",
        "100-150Gramm(Rispen)": "[(37)]",
        ">150Gramm(Fleisch)": "[(39)]",
        Nebenkultur: "[(42)]",
        Entfeuchtung: "[(43)]",
        Energietraeger: "[(44,22.5,45),(47,10.5,53),(48,20,56)]",
        BHKW: "[(53)]",
        Stromherkunft: "[(54,100,64)]",
        Zusatzbelichtung: "[(64)]",
        Belichtungsstrom: "[(66)]",
        "CO2-Herkunft": "[(69,100,91)]",
        "Duengemittel:VereinfachteAngabe": "[(74,22.5,99),(75,10.5,100),(77,20,102)]",
        "Duengemittel:DetaillierteAngabe": "[(85,7,110),(83,1.5,108)]",
        Nuetzlinge: "[(113,700,138)]",
        GrowbagsKuebel: "[(117)]",
        Substrat: "[(123,10,148)]",
        "SchnuereRankhilfen:Material": "[(127)]",
        Klipse: "[(163)]",
        "Klipse:Material": "[(134)]",
        Rispenbuegel: "[(165)]",
        "Rispenbuegel:Material": "[(136)]",
        Bewaesserungsart: "[(141)]",
        Bodenabdeckung: "[(167,3,192)]",
        "Jungpflanzen:Zukauf": "[(144)]",
        "Jungpflanzen:Substrat": "[(147)]",
        Verpackungsmaterial: "[(152,20,177)]",
        SonstigeVerbrauchsmaterialien: "[(157,290.5,182,5), (153,11.2,178,7.5)]",
        ZusaetzlicherMaschineneinsatz: "[(159,20.5,184,17)]",
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