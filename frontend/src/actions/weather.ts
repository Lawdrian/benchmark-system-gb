/**
 * #############################################################################
 * weather.ts: Redux action generators to fetch weather data.
 *
 *     This file provides utilities to fetch weather data using the backend
 *     integration of the DWD weather-api.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    WEATHER_ERROR,
    WEATHER_LOADED,
    WEATHER_LOADING,
    WeatherData
} from "../types/reduxTypes";
import {AppDispatch} from "../store";
import axios from "axios";

/**
 * Loads weather data from the dwd (Deutcher Wetterdienst)
 *
 * @param postalCode - The place to get weather data for
 * @param startDate - The min date, for which weather data is fetched
 * @param endDate - The max data, for which weather data is fetched
 */
export const loadWeatherData = (postalCode: number, startDate: Date, endDate: Date) =>
    (dispatch: AppDispatch) => {
        const startDateString = startDate.toISOString().substring(0, 10);
        const endDateString = endDate.toISOString().substring(0, 10);

        // weather Loading
        dispatch({type: WEATHER_LOADING});

        // send request
        axios.get('/backend/get-weather?postalCode=' + postalCode + '&startDate=' + startDateString + '&endDate=' + endDateString)
            .then((response) => {
                dispatch({
                    type: WEATHER_LOADED,
                    payload: toWeatherData(response.data)
                })
            })
            .catch((error) => {// TODO: Proper Error handling
                dispatch({
                    type: WEATHER_ERROR
                })
            })
    }

const toWeatherData = (responseData: any): WeatherData => {
    return responseData;
}