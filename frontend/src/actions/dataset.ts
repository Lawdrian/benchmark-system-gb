import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {DATASET_ERROR, DATASET_LOADED, DATASET_LOADING, UNITS_FAILED, UNITS_LOADED} from "../types/reduxTypes";


/**
 * Load the greenhouses that a user created.
 */
export const loadDatasets = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    // User Loading
    dispatch({type: DATASET_LOADING});
    loadingCB();

    // Get the ID of the currently logged in user
    const user = getState().auth.user;
    const userID = user ? user.id : '1';


    // Send request
    axios.get('/backend/get-datasets?userId=' + userID, withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            console.log("Dataset response", response)
            dispatch({
                type: DATASET_LOADED,
                payload: response.data
            })
            successCB()
        })
        .catch((error) => {
            dispatch({
                type: DATASET_ERROR
            })
            errorCB()
        })
}