import {CO2FP_ERROR, CO2FP_LOADED, CO2FP_LOADING, GreenhouseFootprint} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";

type RawGreenhouseCO2Dataset = {
    greenhouse_name: string,
    greenhouseDatasets: RawCO2Dataset[]
}

type RawCO2Dataset = {
    label: string
    gwh_konstruktion: number
    energietraeger: number
    strom: number
    co2_zudosierung: number
    duengemittel: number
    psm_insgesamt: number
    verbrauchsmaterialien: number
    jungpflanzen: number
    verpackung: number
    transport: number
}

type RawCO2Data = RawGreenhouseCO2Dataset[];

export const loadCO2Footprint = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    const user = getState().auth.user;
    const userID = user ? user.id : '1';
    console.log(user);
    // User Loading
    dispatch({type: CO2FP_LOADING});

    // Send request
    axios.get('/backend/get-calculated-data?userId=' + userID + '&dataType=co2FootprintData')
        .then((response) => {
            console.log("CO2 Response", response)
            dispatch({
                type: CO2FP_LOADED,
                payload: toCO2FootprintPlot(response.data)
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: CO2FP_ERROR
            })
        })
}

export const toCO2FootprintPlot = (responseData: RawCO2Data): GreenhouseFootprint[] => {
    return responseData.map(greenhouse => {
        return {
            greenhouse: greenhouse.greenhouse_name,
            data: {
                labels: greenhouse.greenhouseDatasets
                    .map(dataset => dataset.label.substring(0, 10))
                    .map(label => new Date(label).getFullYear() == 0 ? "Referenz" : label),
                datasets: [{
                    label: "Gewächshaus Konstruktion",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.gwh_konstruktion),
                    backgroundColor: "rgba(53, 162, 235,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Energieträger",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.energietraeger),
                    backgroundColor: "rgba(235,53,162,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Strom",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.strom),
                    backgroundColor: "rgba(255,251,0,0.68)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "CO2 Zudosierung",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.co2_zudosierung),
                    backgroundColor: "rgba(239,131,6,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Düngemittel",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.duengemittel),
                    backgroundColor: "rgba(37,239,6,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Pflanzenschutzmittel",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.psm_insgesamt),
                    backgroundColor: "rgba(6,239,220,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Verbrauchsmaterialien",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.verbrauchsmaterialien),
                    backgroundColor: "rgba(91,6,239,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Jungpflanzen",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.jungpflanzen),
                    backgroundColor: "rgba(239,6,6,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Verpackung",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.verpackung),
                    backgroundColor: "rgba(148,140,140,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Transport",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.transport),
                    backgroundColor: "rgba(0,0,0,0.68)",
                    optimization: [],
                    climateData: []
                }]
            }
        }
    });
}
