import {
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    USER_LOADING
} from "../types/reduxTypes";
import Cookies from "js-cookie";
import axios, {AxiosRequestConfig, AxiosRequestHeaders} from "axios";
import {AppDispatch, ReduxStateHook} from "../store";

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    //console.log("AUTHENTICATION: Loading User")

    // User Loading
    dispatch({type: USER_LOADING});

    // Send request
    axios.get('/accounts/auth/user', tokenConfig(getState))
        .then((response) => {
            console.log("User Response", response)
            dispatch({
                type: USER_LOADED,
                payload: response.data
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: AUTH_ERROR
            })
        })
}

// LOGOUT USER
export const logout = () => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    axios.post('/accounts/auth/logout', null, tokenConfig(getState))
        .then((response) => {
            dispatch({
                type: LOGOUT_SUCCESS,
            })
        })
        .catch((error) => {// TODO: Proper Error handling
            console.log(error)
        })
}

// REGISTER USER
export const register = (
    username: string,
    email: string,
    password: string,
    companyName: string
) => (dispatch: any) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Request Body
    const body = JSON.stringify({
        username: username,
        email: email,
        password: password,
        profile: {
            company_name: companyName
        }
    });

    axios.post('/accounts/auth/register', body, config)
        .then((response) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: response.data,
            });
        })
        .catch((error) => {
            dispatch({// TODO: Proper Error handling
                type: REGISTER_FAIL,
            });
        });
};

// LOGIN USER
export const login = (
    username: string,
    password: string,
    onError: Function = () => { /*NOOP*/ }
) => (dispatch: AppDispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Request Body
    const body = JSON.stringify({
        username: username,
        password: password
    });

    axios.post('/accounts/auth/login', body, config)
        .then((response) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: response.data,
            });
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: LOGIN_FAIL,
            });
            onError();
        });
}

export const tokenConfig = (getState: ReduxStateHook): AxiosRequestConfig => {
    // Get token from state
    const token = getState().auth.token;

    // Create headers
    const headers: AxiosRequestHeaders = {
        'Content-Type': 'application/json'
    }

    // If token, add to header
    if (token) {
        headers['Authorization'] = "Token " + token;
    }

    // Get csrftoken
    const csrftoken = Cookies.get('csrftoken');

    // Append token to header if available
    if (csrftoken) {
        headers['X-CSRFToken'] = csrftoken
    }

    return {
        headers: headers
    }
}