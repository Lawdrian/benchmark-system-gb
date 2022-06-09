import {CO2FP_ERROR, CO2FP_LOADED, CO2FP_LOADING, FootprintPlot} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {rawCO2DataMock} from "../components/utils/MockAxiosResponses";

export type RawCO2Dataset = {
    label: Date
    electric_power_co2: number
    heat_consumption_co2: number
    psm_co2: number
    fertilizer_co2: number
}

export type RawCO2Data = RawCO2Dataset[];

export const loadCO2Footprint = (useMock: boolean = false) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // User Loading
    dispatch({type: CO2FP_LOADING});

    if (useMock) {
        dispatch({
            type: CO2FP_LOADED,
            payload: toCO2FootprintPlot(rawCO2DataMock)
        })
    } else {
        console.log("Requesting resources")
        // Send request
        axios.get('/backend/get-data?userId=' + userID + '&dataType=co2FootprintData')
            .then((response) => {
                //console.log("CO2 Response", response)
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
        labels: responseData.map(dataset =>
            dataset.label.getFullYear() == 0 ?
                "Referenz" :
                toFormattedString(dataset.label)),
        datasets: plotDatasets
    };
}

const toFormattedString = (date: Date): string => {
    let output = "";
    switch (date.getMonth()) {
        case 0:
            output = "Januar";
            break;
        case 1:
            output = "Februar";
            break;
        case 2:
            output = "März";
            break;
        case 4:
            output = "April";
            break;
        case 5:
            output = "Mai";
            break;
        case 6:
            output = "Juni";
            break;
        case 7:
            output = "Juli";
            break;
        case 8:
            output = "August";
            break;
        case 9:
            output = "September";
            break;
        case 10:
            output = "Oktober";
            break;
        case 11:
            output = "November";
            break;
        case 12:
            output = "Dezember";
            break;
    }
    output += (" " + date.getFullYear())
    return output
}
