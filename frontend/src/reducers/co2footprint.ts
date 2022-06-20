import {
    CO2FP_ERROR,
    CO2FP_LOADED,
    CO2FP_LOADING,
    GreenhouseFootprint,
    RESET_DATA
} from "../types/reduxTypes";

export type CO2FootprintState = {
    isLoading: boolean
    plotData: GreenhouseFootprint[]
}

const initialState: CO2FootprintState = {
    isLoading: false,
    plotData: []
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
                plotData: []
            };
        case RESET_DATA:
            return initialState
        default:
            return state;
    }
}