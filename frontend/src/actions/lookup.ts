/**
 * #############################################################################
 * lookup.ts: Redux action generators to handle lookup values
 *
 *     This file provides the utility to load the avaliable lookup values from
 *     the server into the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";

/**
 * Load the currently available lookup values.
 */
export const loadLookupValues = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    // User Loading
    dispatch({type: LOOKUP_LOADING});
    loadingCB();

    // Send request
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