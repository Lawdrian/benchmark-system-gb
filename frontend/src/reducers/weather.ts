import {
    RESET_DATA,
    WEATHER_ERROR,
    WEATHER_LOADED,
    WEATHER_LOADING,
    WeatherData,
} from "../types/reduxTypes";

export type WeatherState = {
    isLoading: boolean
    weatherData: WeatherData | null
}

const initialState: WeatherState = {
    isLoading: false,
    weatherData: null
}

export default function (state: WeatherState = initialState, action: any): WeatherState {
    switch (action.type) {
        case WEATHER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case WEATHER_LOADED:
            return {
                ...state,
                isLoading: false,
                weatherData: action.payload
            };
        case WEATHER_ERROR:
            return {
                ...state,
                isLoading: false,
                weatherData: null
            };
        case RESET_DATA:
            return initialState
        default:
            return state;
    }
}