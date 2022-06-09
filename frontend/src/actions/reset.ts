import {AppDispatch} from "../store";
import {RESET_DATA} from "../types/reduxTypes";

export const resetData = () => (dispatch: AppDispatch) => {
    dispatch({type: RESET_DATA})
}