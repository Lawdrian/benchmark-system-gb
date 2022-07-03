/**
 * #############################################################################
 * redux.ts: Redux action generators to reset the redux store
 *
 *     This file provides functions to reset the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {AppDispatch} from "../store";
import {RESET_DATA} from "../types/reduxTypes";

/**
 * Reset the current redux store to the initial state (exept the {@link AuthenticationState})
 */
export const resetData = () => (dispatch: AppDispatch) => {
    dispatch({type: RESET_DATA})
}