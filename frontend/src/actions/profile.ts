import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {PROFILE_ERROR, PROFILE_LOADED, PROFILE_LOADING, ProfileData} from "../types/reduxTypes";
import {formatLabel} from "./co2footprint";


/**
 * Load the profile data of a user.
 */
export const loadProfile = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    console.log("loadProfileData started")
    // User Loading
    dispatch({type: PROFILE_LOADING});
    loadingCB();

    // Send request
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
 * Takes the raw co2-footprint data (how it is provided by the server) and
 * transforms it into a data structre, that chart.js can use to create a
 * visualisation of the data.
 *
 * @param responseData - The co2-footprint data provided by the server
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