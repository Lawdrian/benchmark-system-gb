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
    GreenhouseData,
    SUBMISSION_ERROR,
    SUBMISSION_INPROGRESS,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";

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
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
        dispatch({type: SUBMISSION_INPROGRESS})
        inProgressCB();

        // Get the ID of the currently logged in user
        const user = getState().auth.user;
        const userID = user ? user.id : '1';

        // Create the request headers
        const config = withAuth ? tokenConfig(getState) : {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Create the request body
        const body = JSON.stringify(data);

        // Send the post request to the server
        axios.post("/backend/create-greenhouse-data?userId=" + userID, body, config)
            .then((response) => {
                //console.log("CO2 Response", response)
                dispatch({
                    type: SUBMISSION_SUCCESS
                })
            successCB()
            })
            .catch((error) => {// TODO: Proper Error handling
                dispatch({
                    type: SUBMISSION_ERROR
                })
                errorCB()
            })
            .finally(() => callback())
    }