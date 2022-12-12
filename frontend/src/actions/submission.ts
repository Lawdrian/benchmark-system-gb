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
    SUBMISSION_INPROGRESS,
    SUBMISSION_RESET,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {InputMode} from "../components/pages/PageInputData";

/**
 * Submit a dataset of type {@link GreenhouseData} to the server
 *
 * @param data - The data to submit
 * @param callback - Callback, that gets executed when receiving the http-response
 */
export const submitGreenhouseData = (
    data: GreenhouseData,
    callback: Function = () => { /* NOOP */ },
    withAuth: boolean = true,
    inProgressCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ },
    mode: InputMode,
    datasetId?: number
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
        dispatch({type: SUBMISSION_INPROGRESS})
        inProgressCB();

        // Create the request headers
        let config = withAuth ? tokenConfig(getState) : {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let url = "/backend/create-greenhouse-data"
        // If a dataset should be updated instead of creating a new one, then the id of the dataset
        // needs to be sent in the header and a different endpoint needs to be called.
        if (mode == InputMode.update && datasetId) {
            config.headers = {...config.headers, datasetId: datasetId}
            url = "/backend/update-greenhouse-data"
        }
        // Create the request body
        const body = JSON.stringify(data);

        // Send the post request to the server
        axios.post(url, body, config)
            .then((response) => {
                //console.log("CO2 Response", response)
                dispatch({
                    type: SUBMISSION_SUCCESS
                })
                successCB()
                dispatch({
                    type: DATASET_RESET
                })
            })
            .catch((error) => {// TODO: Proper Error handling
                dispatch({
                    type: SUBMISSION_ERROR
                })
                errorCB(error.response.data["Message"])
            })
            .finally(() => callback())
    }

export const resetSubmissionState = () => (dispatch: AppDispatch) =>{
            dispatch({type: SUBMISSION_RESET})
}