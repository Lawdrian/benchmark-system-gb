import {
    CO2FP_ERROR,
    CO2FP_LOADED,
    CO2FP_LOADING,
    FootprintPlot
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";

type RawCO2Dataset = {
    label: string
    electric_power_co2: number
    heat_consumption_co2: number
    psm_co2: number
    fertilizer_co2: number
}

type RawCO2Data = RawCO2Dataset[];

export const loadCO2Footprint = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    const user = getState().auth.user;
    const userID = user ? user.id : '1';
    console.log(user);
    // User Loading
    dispatch({type: CO2FP_LOADING});

    // Send request
    axios.get('/backend/get-data?userId=' + userID + '&dataType=co2FootprintData')
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

export const toCO2FootprintPlot = (responseData: RawCO2Data): FootprintPlot => {
    let plotDatasets = [{
        label: "Elektrische Energie",
        data: responseData.map(dataset => dataset.electric_power_co2),
        backgroundColor: "rgba(53, 162, 235,0.7)",
        optimization: [],
        climateData: []
    }, {
        label: "Wärmeenergie",
        data: responseData.map(dataset => dataset.heat_consumption_co2),
        backgroundColor: "rgba(235,53,162,0.7)",
        optimization: [],
        climateData: []
    }, {
        label: "Pflanzenschutzmittel",
        data: responseData.map(dataset => dataset.psm_co2),
        backgroundColor: "rgba(191,246,24,0.7)",
        optimization: [],
        climateData: []
    }, {
        label: "Düngemittel",
        data: responseData.map(dataset => dataset.fertilizer_co2),
        backgroundColor: "rgba(239,131,6,0.7)",
        optimization: [],
        climateData: []
    }]

    return {
        labels: responseData.map(dataset => dataset.label),
        datasets: plotDatasets
    };
}