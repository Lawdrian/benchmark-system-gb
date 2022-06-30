import {
    GreenhouseData,
    SUBMISSION_ERROR,
    SUBMISSION_INPROGRESS,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import validateGreenhouseData from "../helpers/dataValidation";
import {tokenConfig} from "./auth";

export const submitGreenhouseData = (
    data: GreenhouseData,
    callback: Function = () => { /* NOOP */ },
    withAuth: boolean = true,
    inProgressCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    validateGreenhouseData(data);

    dispatch({type: SUBMISSION_INPROGRESS})
    inProgressCB();

    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // Headers
    const config = withAuth ? tokenConfig(getState) : {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Request Body
    const body = JSON.stringify(data);

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