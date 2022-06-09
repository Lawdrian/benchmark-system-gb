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
        closing_time_begin: "08:00:00",
        closing_time_end: "20:00:00",
        co2_consumption: 5.000,
        construction_type: 1,
        cultivation_type: 1,
        datetime: "2022-06-25",
        drop_per_bag: 4.000,
        energy_screen_brand: 1,
        energy_usage: 34.000,
        energysource_type: 1,
        fertilizer_amount: 12.000,
        fertilizer_type: 1,
        fruit_weight: 1,
        greenhouse_age: 4,
        greenhouse_area: 9.000,
        greenhouse_name: 1,
        greenhouse_operator: props.isAuthenticated && props.user ? props.user.id : 1,
        harvest: 45.000,
        lighting_power: 493.000,
        lighting_runtime_per_day: 4.000,
        location: 82439,
        pesticide_amount: 9.000,
        pesticide_type: 1,
        plantation_begin: "2020-10-25",
        plantation_duration: 3.00,
        planting_density: 5.000,
        post_harvest_packaging_amount: 23.000,
        post_harvest_packaging_type: 1,
        post_harvest_transport_distance: 25.000,
        powermix_type: 1,
        powerusage_lighting_type: 1,
        powerusage_total_without_lighting: 56.000,
        production_type: 1,
        roofing_material: 1,
        session_key: null,
        standing_wall_height: 4.000,
        total_area: 34.000,
        used_materials_clip_type: 1,
        used_materials_cord_type: 1,
        used_materials_foils_area: 34.000,
        used_materials_gutter_count: 12.000,
        used_materials_gutter_length: 5.000,
        used_materials_substrate_bagpersqm: 34.000,
        used_materials_substrate_plantsperbag: 12.000,
        used_materials_substrate_type: 1,
        youngplants_travelling_distance: 456.000,
        culture_type: 4,
        youngplants_number: 6
    }

    props.loadWeatherData(weatherInput.postalCode, weatherInput.startDate, weatherInput.endDate);
    props.submitGreenhouseData(testData, () => {
        props.loadCO2Footprint();
        props.loadWaterBenchmark();
        props.loadWaterFootprint();
    });
}

const dataAvailable = (
    data: CO2FootprintState | WaterBenchmarkState | WaterFootprintState
): boolean => {
    return (
        data.plotData.labels.length > 0 &&
        data.plotData.datasets.length > 0
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