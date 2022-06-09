import {
    WEATHER_ERROR,
    WEATHER_LOADED,
    WEATHER_LOADING,
    WeatherData
} from "../types/reduxTypes";
import {AppDispatch} from "../store";
import axios from "axios";

export const loadWeatherData = (postalCode: number, startDate: Date, endDate: Date) =>
    (dispatch: AppDispatch) => {
        const startDateString = startDate.toISOString().substring(0, 10);
        const endDateString = endDate.toISOString().substring(0, 10);

        // User Loading
        dispatch({type: WEATHER_LOADING});

        // Send request
        axios.get('/backend/get-weather?postalCode=' + postalCode + '&startDate=' + startDateString + '&endDate=' + endDateString)
            .then((response) => {
                //console.log("CO2 Response", response)
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