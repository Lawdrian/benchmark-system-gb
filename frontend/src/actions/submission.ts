import {
    GreenhouseData,
    SUBMISSION_ERROR,
    SUBMISSION_INPROGRESS,
    SUBMISSION_SUCCESS
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";

export const submitGreenhouseData = (
    data: GreenhouseData,
    callback: Function = () => {
        //NOOP
    }
) =>
    (dispatch: AppDispatch, getState: ReduxStateHook) => {
        dispatch({type: SUBMISSION_INPROGRESS})

        const user = getState().auth.user;
        const userID = user ? user.id : '1';

        // Headers
        const config = {
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
            })
            .catch((error) => {// TODO: Proper Error handling
                dispatch({
                    type: SUBMISSION_ERROR
                })
            })
            .finally(() => callback())
    }