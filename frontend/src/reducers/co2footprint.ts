import {
    CO2FP_ERROR,
    CO2FP_LOADED,
    CO2FP_LOADING,
    FootprintPlot,
    RESET_DATA
} from "../types/reduxTypes";

export type CO2FootprintState = {
    isLoading: boolean
    plotData: FootprintPlot
}

const initialState: CO2FootprintState = {
    isLoading: false,
    plotData: {
        labels: [],
        datasets: []
    }
}

export default function (state: CO2FootprintState = initialState, action: any): CO2FootprintState {
    switch (action.type) {
        case CO2FP_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case CO2FP_LOADED:
            return {
                ...state,
                isLoading: false,
                plotData: action.payload
            };
        case CO2FP_ERROR:
            return {
                ...state,
                isLoading: false,
                plotData: {
                    labels: [],
                    datasets: []
                }
            };
        case RESET_DATA:
            return initialState
        default:
            return state;
    }
}