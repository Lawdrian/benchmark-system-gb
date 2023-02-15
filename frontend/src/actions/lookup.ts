/**
 * #############################################################################
 * lookup.ts: Redux action generators to handle lookup values
 *
 *     This file provides the utility to load the available lookup values from
 *     the server into the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING, UNITS_FAILED, UNITS_LOADED, UNITS_LOADING
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";

/**
 * Load the currently available lookup values.
 *
 * This function requests the lookup values used for filling the selection fields on the input page.
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the lookup value request is in progress
 * @param successCB - Function that should be executed, when the lookup value request was a success
 * @param errorCB - Function that should be executed, when an error occurred during the lookup value request
 */
export const loadLookupValues = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    dispatch({type: LOOKUP_LOADING});
    loadingCB();

    // send request
    axios.get('/backend/get-lookup-values', withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            console.log("Lookup Response", response)
            dispatch({
                type: LOOKUP_LOADED,
                payload: response.data
            })
            successCB()
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: LOOKUP_FAILED
            })
            errorCB()
        })
}

/**
 * Load the currently available unit values.
 *
 * This function requests the unit values used for the input fields from the back end.
 *
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the lookup unit request is in progress
 * @param successCB - Function that should be executed, when the lookup unit request was a success
 * @param errorCB - Function that should be executed, when an error occurred during the lookup unit request
 */
export const loadUnitValues = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    dispatch({type: UNITS_LOADING});
    loadingCB();

    // send request
    axios.get('/backend/get-unit-values', withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            console.log("Unit Response", response)
            dispatch({
                type: UNITS_LOADED,
                payload: response.data
            })
            successCB()
        })
        .catch((error) => {
            dispatch({
                type: UNITS_FAILED
            })
            errorCB()
        })
}