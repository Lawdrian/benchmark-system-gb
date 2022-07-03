/**
 * #############################################################################
 * waterfootprint.ts: Redux action generators to handle waterfootprint data
 *
 *     This file provides the utility to load waterfootprint data from the server
 *     into the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    GreenhouseFootprint,
    WATERFP_ERROR,
    WATERFP_LOADED,
    WATERFP_LOADING
} from "../types/reduxTypes";
import axios from "axios";
import {AppDispatch, ReduxStateHook} from "../store";

/**
 * Loads the waterfootprint data for the current user.
 */
export const loadWaterFootprint = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    // Get the ID of the currently logged in user
    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // User Loading
    dispatch({type: WATERFP_LOADING});

    // Send request
    axios.get('/backend/get-calculated-data?userId=' + userID + '&dataType=waterUsageData')
        .then((response) => {
            console.log("Water Response", response)
            dispatch({
                type: WATERFP_LOADED,
                payload: toWaterFootprintPlot(response.data)
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: WATERFP_ERROR
            })
        })
}

export const toWaterFootprintPlot = (responseData: any): GreenhouseFootprint[] => {
    return responseData;
}