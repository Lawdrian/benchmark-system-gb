import {
    BenchmarkPlot,
    RESET_DATA,
    WATERBM_ERROR,
    WATERBM_LOADED,
    WATERBM_LOADING
} from "../types/reduxTypes";

export type WaterBenchmarkState = {
    isLoading: boolean
    plotData: BenchmarkPlot
}

const initialState: WaterBenchmarkState = {
    isLoading: false,
    plotData: {
        labels: [],
        datasets: []
    }
}

export default function (state: WaterBenchmarkState = initialState, action: any): WaterBenchmarkState {
    switch (action.type) {
        case WATERBM_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case WATERBM_LOADED:
            return {
                ...state,
                isLoading: false,
                plotData: action.payload
            };
        case WATERBM_ERROR:
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