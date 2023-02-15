import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {PROFILE_ERROR, PROFILE_LOADED, PROFILE_LOADING, ProfileData} from "../types/reduxTypes";
import {formatLabel} from "./co2footprint";


/**
 * Load the profile data of a user.
 *
 * This data is requested to be displayed on the profile page.
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the profile request is in progress
 * @param successCB - Function that should be executed, when the profile request was a success
 * @param errorCB - Function that should be executed, when an error occurred during the profile request
 */
export const loadProfile = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    dispatch({type: PROFILE_LOADING});
    loadingCB();

    // send request
    axios.get('/backend/get-profile-summary', withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            console.log("Profile response", response)
            if (response.status == 200) {
                dispatch({
                    type: PROFILE_LOADED,
                    payload: mapProfileData(response.data)
                })
                successCB()
            }
            else if (response.status == 204) {
                dispatch({
                    type: PROFILE_ERROR
                })
                errorCB()
            }
            else {
                dispatch({
                    type: PROFILE_ERROR
                })
                errorCB()
            }
        })
        .catch((error) => {
            dispatch({
                type: PROFILE_ERROR
            })
            errorCB()
        })
}


/**
 * Formats the label of every dataset of every greenhouse
 *
 * @param responseData - profile metadata
 */
const mapProfileData = (responseData: ProfileData[]): ProfileData[] => {
    return responseData.map(greenhouse => {
        return {
            greenhouse_name: greenhouse.greenhouse_name,
            data: greenhouse.data.map(dataset => {
                return {
                    greenhouseId: dataset.greenhouseId,
                    datasetId: dataset.datasetId,
                    label: formatLabel(dataset.label ?? ""),
                    co2Footprint: dataset.co2Footprint,
                    h2oFootprint: dataset.h2oFootprint
                }
            })
        }
    })

}