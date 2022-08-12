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
import {loadLookupValues} from "../../actions/lookup";

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
    loadLookupValues
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
        PLZ: 82362,
        GWHAlter: 20,
        AlterEnergieschirm: 8,
        Stehwandhoehe: 2,
        Laenge: 3,
        Breite: 4,
        Kappenbreite: 5,
        "Scheibenlaenge(Bedachung)": 6,
        AlterdesBedachungsmaterials: 8,
        AlterKultursystem: 7,
        Reihenabstand: 8,
        Kulturflaeche: 9,
        KulturBeginn: 10,
        KulturEnde: 11,
        Nebenkulturdauer: 7,
        BodenfolienVerwendungsdauer: 2,
        JungpflanzenDistanz: 80,
        Ertrag: 20,
        Pflanzdichte: 4,
        MittlereSolltemperaturTag: 12,
        MittlereSolltemperaturNacht: 13,
        KulturmassnahmeAusgeizen: 14,
        KulturmassnahmeAusblattenAnzahlMonat: 15,
        KulturmassnahmeAblassen: 16,
        Strom: 200,
        StromverbrauchBelichtungAnschlussleistung: 180,
        StromverbrauchBelichtungAnzahlLampen: 50,
        StromverbrauchBelichtungLaufzeitTag: 8,
        "CO2-Zudosierung": 300,
        Fungizide: 20,
        Insektizide: 12,
        VolumenGrowbags: 20,
        LaengeGrowbags: 1,
        PflanzenproBag: 3,
        "SchnuereRankhilfen:Laenge": 0.3,
        "SchnuereRankhilfen:Wiederverwendung": 2,
        "Klipse:Menge": 200,
        "Klipse:Wiederverwendung": 12,
        "Rispenbuegel:Menge": 200,
        "Rispenbuegel:Wiederverwendung": 12,
        "SonstigeVerbrauchsmaterialien:Wiederverwendung": 20,
        "Verpackungsmaterial:Karton": 12,
        "Verpackungsmaterial:Plastik": 22,
        "TransportderWare:Auslieferungen": 5,
        "TransportderWare:Distanz": 50,
        "GWHArt": "[(1)]",
        "Bedachungsmaterial": "[(9)]",
        "ArtdesStehwandmaterial": "[(20)]",
        "Energieschirm": "[(25)]",
        "Produktion": "[(30)]",
        "Kultursystem": "[(32)]",
        "Transportsystem": "[(131)]",
        "Fruchtgewicht": "[(34)]",
        "Nebenkultur": "[(134)]",
        "AnzahlTriebe": "[(40)]",
        "Entfeuchtung": "[(135, 20.3)]",
        "KulturmassnahmeAusblattenMenge": 50,
        "Energietraeger": "[(42,22.5),(44,50)]",
        "Stromherkunft": "[(50,40),(51,60)]",
        "Zusatzbelichtung": "[(137)]",
        "Belichtungsstrom": "[(140)]",
        "CO2-Herkunft": "[(59)]",
        "Duengemittel:DetalierteAngabe": "[(62,22.5),(64,10.5),(67,20)]",
        "Duengemittel:VereinfachteAngabe": "[(72,22.5),(78,10.5),(97,20)]",
        "Nuetzlinge": "[(123),(125)]",
        "Growbags": "[(141)]",
        "Substrat": "[(98,22.5),(99,10.5)]",
        "SchnuereRankhilfen:Material": "[(105),(106)]",
        "Klipse:Material": "[(110),(111)]",
        "Rispenbuegel:Material": "[(112),(114)]",
        "Bewaesserungsart": "[(120),(122)]",
        "Bodenfolien": "[(143)]",
        "SonstigeVerbrauchsmaterialien": "[(116,20.5,17), (118,11.2,2)]",
        "JungpflanzenZukauf": "[(145)]"
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