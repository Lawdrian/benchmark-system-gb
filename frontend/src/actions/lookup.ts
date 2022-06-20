import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING
} from "../types/reduxTypes";
import {AppDispatch} from "../store";
import axios from "axios";

//TODO Remove Mock
export const loadLookupValues = () => (dispatch: AppDispatch) => {
    // User Loading
    dispatch({type: LOOKUP_LOADING});

    // Send request
    axios.get('/backend/get-lookup-values')
        .then((response) => {
            console.log("Lookup Response", response)
            dispatch({
                type: LOOKUP_LOADED,
                payload: response.data
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: LOOKUP_FAILED
            })
        })
}