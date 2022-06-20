import {
    GreenhouseFootprint,
    RESET_DATA,
    WATERFP_ERROR,
    WATERFP_LOADED,
    WATERFP_LOADING
} from "../types/reduxTypes";

export type WaterFootprintState = {
    isLoading: boolean
    plotData: GreenhouseFootprint[]
}

const initialState: WaterFootprintState = {
    isLoading: false,
    plotData: []
}

export default function (state: WaterFootprintState = initialState, action: any): WaterFootprintState {
    switch (action.type) {
        case WATERFP_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case WATERFP_LOADED:
            return {
                ...state,
                isLoading: false,
                plotData: action.payload
            };
        case WATERFP_ERROR:
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