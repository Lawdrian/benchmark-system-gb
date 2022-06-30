import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";

//TODO Remove Mock
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