/**
 * #############################################################################
 * co2footprint.ts: Defines reducers to dispatch actions generated by ../actions/co2footprint.ts
 * #############################################################################
 */
import {
    CO2FP_ERROR,
    CO2FP_LOADED,
    CO2FP_LOADING,
    GreenhouseFootprint,
    RESET_DATA
} from "../types/reduxTypes";

/**
 * @type CO2FootprintState
 *
 * Contains the necessary data to visualize the co2-footprint.
 *
 * @property {boolean} [isLoading] - True, while the data is loaded from the server
 * @property {GreenhouseFootprint[]} [plotData] - The data to create the plot
 */
export type CO2FootprintState = {
    isLoading: boolean
    plotData: GreenhouseFootprint[]
}

// Initialize the co2-footprint state
const initialState: CO2FootprintState = {
    isLoading: false,
    plotData: []
}

/**
 * Dispatches any actions related to the co2-footprint state.
 *
 * @param state - The current co2-footprint state
 * @param action - The action to dispatch
 *
 * @returns The updated co2-footprint state
 */
export default function (state: CO2FootprintState = initialState, action: any): CO2FootprintState {
    switch (action.type) {
        case CO2FP_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case CO2FP_LOADED:
            console.log("CO2-Plot Data:", action.payload)
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