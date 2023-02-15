import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {DATASET_ERROR, DATASET_LOADED, DATASET_LOADING} from "../types/reduxTypes";


/**
 * Load all datasets for every greenhouse, that a user created.
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the account deletion is in progress
 * @param successCB - Function that should be executed, when the account deletion was a success
 * @param errorCB - Function that should be executed, when an error occurred during account deletion
 */
export const loadDatasets = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    dispatch({type: DATASET_LOADING});
    loadingCB();

    // send request
    axios.get('/backend/get-datasets', withAuth ? tokenConfig(getState) : undefined)
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