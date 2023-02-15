/**
 * #############################################################################
 * submission.ts: Redux action generators to submit data.
 *
 *     This file provides utilities to send greenhouse datasets to the server.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    DATASET_RESET,
    GreenhouseData,
    SUBMISSION_ERROR,
    SUBMISSION_LOADING,
    SUBMISSION_RESET,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {InputMode} from "../components/pages/input/PageInputData";

/**
 * Submit a dataset of type {@link GreenhouseData} to the server
 *
 * @param data - The data to submit
 * @param finalCB - Callback, that gets executed after the request is finished
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the submission request is in progress
 * @param successCB - Function that should be executed, when the submission request was a success
 * @param errorCB - Function that should be executed, when an error occurred during the submission request
 * @param mode - Parameter of type {@link InputMode}, decides if a new dataset should be created, or an existing one
 * updated
 * @param datasetId - This parameter is necessary, if the mode is set to update a dataset. This is the id of the to be
 * updated dataset
 */
export const submitGreenhouseData = (
    data: GreenhouseData,
    finalCB: Function = () => { /* NOOP */ },
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ },
    mode: InputMode,
    datasetId?: number
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
        dispatch({type: SUBMISSION_LOADING})
        loadingCB();

        // create the request headers
        let config = withAuth ? tokenConfig(getState) : {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let url = "/backend/create-greenhouse-data"
        // if a dataset should be updated instead of creating a new one, then the id of the dataset
        // needs to be sent in the header and a different endpoint needs to be called.
        if (mode == InputMode.update && datasetId) {
            config.headers = {...config.headers, datasetId: datasetId}
            url = "/backend/update-greenhouse-data"
        }
        // create the request body
        const body = JSON.stringify(data);

        // send the post request to the server
        axios.post(url, body, config)
            .then((response) => {
                dispatch({
                    type: SUBMISSION_SUCCESS
                })
                successCB()
                dispatch({
                    type: DATASET_RESET
                })
            })
            .catch((error) => {
                dispatch({
                    type: SUBMISSION_ERROR
                })
                errorCB(error.response.data["Message"])
            })
            .finally(() => finalCB())
    }

export const resetSubmissionState = () => (dispatch: AppDispatch) =>{
            dispatch({type: SUBMISSION_RESET})
}