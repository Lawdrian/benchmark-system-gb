import {
    FootprintPlot,
    WATERFP_ERROR,
    WATERFP_LOADED,
    WATERFP_LOADING
} from "../types/reduxTypes";
import axios from "axios";
import {AppDispatch, ReduxStateHook} from "../store";

export const loadWaterFootprint = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // User Loading
    dispatch({type: WATERFP_LOADING});

    // Send request
    axios.get('/backend/get-data?userId=' + userID + '&dataType=waterUsageData')
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

export const toWaterFootprintPlot = (responseData: any): FootprintPlot => {
    return responseData;
}