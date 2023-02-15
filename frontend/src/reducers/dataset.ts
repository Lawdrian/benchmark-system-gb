/**
 * #############################################################################
 * dataset.ts: Defines reducers to dispatch actions generated by ../actions/dataset.ts
 * #############################################################################
 */
import {
    DATASET_ERROR,
    DATASET_LOADED,
    DATASET_LOADING, DATASET_RESET, DatasetData,
    RESET_DATA,
} from "../types/reduxTypes";

/**
 * @type DatasetState
 *
 * Contains the status and data of fetching datasets from the database.
 *
 * @property {boolean} inProgress - True, when the dataset fetching is still in progress
 * @property {boolean|null} successful - True, when data was fetched successfully
 * @property datasets - A list of greenhouses and all data sets for each greenhouse
 */

export type DatasetState = {
    inProgress: boolean
    successful: boolean | null
    datasets: DatasetData[] | string
}

// initialize sumbission state
const initialState: DatasetState = {
    inProgress: false,
    successful: null,
    datasets: []
}

/**
 * Dispatches any actions related to the fetching of data.
 *
 * @param state - The current dataset state
 * @param action - The action to dispatch
 * @returns The updated dataset state
 */
export default function (state: DatasetState = initialState, action: any): DatasetState {
    switch (action.type) {
        case DATASET_LOADING:
            return {
                ...state,
                inProgress: true,
                successful: null
            }
        case DATASET_LOADED:
            return {
                ...state,
                inProgress: false,
                successful: true,
                datasets: action.payload
            }
        case DATASET_ERROR:
            return {
                ...state,
                inProgress: false,
                successful: false,
                datasets: []
            }
        case DATASET_RESET:
        case RESET_DATA:
            return initialState
        default:
            return state;
    }
}