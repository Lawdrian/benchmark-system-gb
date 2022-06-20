import React from "react";
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
import {CO2FootprintState} from "../../reducers/co2footprint";
import {WaterBenchmarkState} from "../../reducers/waterbenchmark";
import {WaterFootprintState} from "../../reducers/waterfootprint";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DoubleArrow from "@mui/icons-material/DoubleArrow";

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    co2: state.co2,
    water: state.water,
    benchmark: state.benchmark,
    weather: state.weather,
    submission: state.submission
});

const mapDispatchToProps = {
    loadCO2Footprint,
    loadWaterBenchmark,
    loadWaterFootprint,
    loadWeatherData,
    submitGreenhouseData,
    resetData
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

type EndpointTestProps = ReduxProps & {}

const performTests = (props: EndpointTestProps) => {
    props.resetData();

    let weatherInput = {
        postalCode: 82439,
        startDate: new Date("2020-05-20"),
        endDate: new Date("2022-06-20")
    }

    let testData: GreenhouseData = {
        greenhouse_name: "Testhaus",
        date: "2022-06-17",
        PLZ: 82362,
        AlterEnergieschirm: 1,
        Stehwandhoehe: 2,
        Laenge: 3,
        Breite: 4,
        Kappenbreite: 5,
        "Scheibenlaenge(Bedachung)": 6,
        AlterKultursystem: 7,
        Reihenabstand: 8,
        Kulturflaeche: 9,
        KulturBeginn: 10,
        KulturEnde: 11,
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
        "GWHAlter": "[(5)]",
        "Bedachungsmaterial": "[(9)]",
        "AlterdesBedachungsmaterials": "[(16)]",
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
        "SonstigeVerbrauchsmaterialien": "[(116)]",
        "JungpflanzenZukauf": "[(145)]"
    }

    props.loadWeatherData(weatherInput.postalCode, weatherInput.startDate, weatherInput.endDate);
    props.submitGreenhouseData(testData, () => {
        props.loadCO2Footprint();
        //props.loadWaterBenchmark(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
        //props.loadWaterFootprint(); !!! NOT YET IMPLEMENTED ON BACKEND SIDE !!!
    });
}

const dataAvailable = (
    data: CO2FootprintState | WaterBenchmarkState | WaterFootprintState
): boolean => {
    return (
        data.plotData.length > 0 &&
        data.plotData.length > 0
    );
}

const dataLoading = (
    data: CO2FootprintState | WaterBenchmarkState | WaterFootprintState
): boolean => {
    return data.isLoading
}

const EndpointTest = (props: EndpointTestProps) => {

    const rows = [
        {
            name: "Load CO2-Footprint Data",
            loading: dataLoading(props.co2),
            successful: dataAvailable(props.co2)
        },/* {
            name: "Water Footprint",
            loading: dataLoading(props.water),
            successful: dataAvailable(props.water)
        }, {
            name: "Water Benchmark",
            loading: dataLoading(props.benchmark),
            successful: dataAvailable(props.benchmark)
        },*/ {
            name: "Load Weather Data",
            loading: props.weather.isLoading,
            successful: !!props.weather.weatherData
        }, {
            name: "Save Greenhouse Data",
            loading: props.submission.inProgress,
            successful: !!props.submission.successful
        }
    ]

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button onClick={() => performTests(props)}
                        endIcon={<DoubleArrow/>}
                        variant="outlined"
                        sx={{mr: "10px"}}>Run Tests</Button>
                <Button onClick={() => props.resetData()}
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