import {
    GreenhouseBenchmark,
    WATERBM_ERROR,
    WATERBM_LOADED,
    WATERBM_LOADING
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";

export const loadWaterBenchmark = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // User Loading
    dispatch({type: WATERBM_LOADING});

    // Send request
    axios.get('/backend/get-calculated-data?userId=' + userID + '&dataType=benchmarkData')
        .then((response) => {
            console.log("Benchmark Response", response)
            dispatch({
                type: WATERBM_LOADED,
                payload: toBenchmarkPlot(response.data)
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: WATERBM_ERROR
            })
        })
}


const toBenchmarkPlot = (responseData: any): GreenhouseBenchmark[] => {
    return responseData;
}