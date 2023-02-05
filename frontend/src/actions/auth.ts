/**
 * #############################################################################
 * auth.ts: Redux action generators for authentication purposes
 *
 *     This file defines functions to register a new user, login an existing user
 *     or logout the current user. To check, whether the current user is
 *     authenticated, the backend provides an authentication token, which is
 *     stored in the {@link AuthenticationState}.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    ACTIVATE_FAIL, ACTIVATE_LOADING,
    ACTIVATE_SUCCESS,
    AUTH_ERROR, DELETE_FAIL, DELETE_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS, RESETPW_FAIL, RESETPW_PENDING, RESETPW_SUCCESS, User,
    USER_LOADED,
    USER_LOADING
} from "../types/reduxTypes";
import Cookies from "js-cookie";
import axios, {AxiosRequestConfig, AxiosRequestHeaders} from "axios";
import {AppDispatch, ReduxStateHook} from "../store";

/**
 * Loads the current user as JSON object into the redux store
 */
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

/**
 * Log out the current user and update the redux store accordingly.
 */
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

/**
 * Register a new user.
 *
 * @param username - The new username
 * @param email - The users' email
 * @param password - The password to use
 * @param companyName - The company, the user works at
 * @param callbackSucc - Function that should be executed, when the registration was a success
 * @param callbackErr - Function that should be executed, when an error occurred during registration
 */
export const register = (
    username: string,
    email: string,
    password: string,
    companyName: string,
    callbackSucc: Function = () => {},
    callbackErr: Function = () => {}
) => (dispatch: any) => {
    // Create request headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Create request body for post request
    const body = JSON.stringify({
        username: username,
        email: email,
        password: password,
        profile: {
            company_name: companyName
        }
    });

    // Send the http request
    axios.post('/accounts/auth/register', body, config)
        .then((response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });
            callbackSucc()
        })
        .catch((error) => {
            dispatch({
                type: REGISTER_FAIL,
            });
            callbackErr(error.response.data.Error)
        });
};


/**
 * Activate a newly created account.
 *
 * @param uidb64 - Encoded user id
 * @param token - User-specific activation token
 */
export const activate = (
    uidb64: string,
    token: string
) => (dispatch: any) => {

    // Create request headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const url = `/accounts/auth/activate?uid=${uidb64}&token=${token}`
    console.log("Activate called")
    // Activate Loading
    dispatch({type: ACTIVATE_LOADING});

    axios.patch(url, {}, config)
        .then((response) => {
            dispatch({
                type: ACTIVATE_SUCCESS,
            });
        })
        .catch((error) => {
            dispatch({
                type: ACTIVATE_FAIL,
            });
        });
}


/**
 * Send password change link to user email.
 *
 * @param email - The users' email
 */
export const forgotPW = (
    email: string
) => (dispatch: any) => {


    // Create request headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = {
        email: email
    }

    const url = `/accounts/auth/forgotpw`

    axios.post(url, body, config)
        .then((response) => {
            dispatch({
                type: RESETPW_PENDING,
            });
        })
        .catch((error) => {
            dispatch({
                type: RESETPW_FAIL,
            });
        });
}


/**
 * Reset a users password.
 *
 * @param uidb64 - Encoded user id
 * @param token - User-specific activation token
 * @param password - The new password to use
 * @param callbackSucc - Function that should be executed, when the password change was a success
 * @param callbackErr - Function that should be executed, when an error occurred during password change
 */
export const resetPW = (
    uidb64: string,
    token: string,
    password: string,
    callbackSucc: Function = () => {},
    callbackErr: Function = () => {}
) => (dispatch: any) => {

    // Create request headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = {
        password: password
    }

    const url = `/accounts/auth/resetpw?uid=${uidb64}&token=${token}`

    axios.patch(url, body, config)
        .then((response) => {
            dispatch({
                type: RESETPW_SUCCESS,
            });
            callbackSucc()
        })
        .catch((error) => {
            dispatch({
                type: RESETPW_FAIL,
            });
            callbackErr()
        });
}


/**
 * Delete a users account.
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param callbackSucc - Function that should be executed, when the account deletion was a success
 * @param callbackErr - Function that should be executed, when an error occurred during account deletion
 */
export const deleteUser = (
    withAuth: boolean = true,
    callbackSucc: Function = () => {},
    callbackErr: Function = () => {}
) => (dispatch: any, getState: ReduxStateHook) => {

    // Create request headers
    const config = withAuth ? tokenConfig(getState) : {
        headers: {
            'Content-Type': 'application/json',
        },
    };


    const url = `/accounts/auth/delete`

    axios.delete(url, config)
        .then((response) => {
            dispatch({
                type: DELETE_SUCCESS,
            });
            callbackSucc()
        })
        .catch((error) => {
            dispatch({
                type: DELETE_FAIL,
            });
            callbackErr()
        });
}


/**
 * Login a user using the provided credentials.
 *
 * @param username - The username
 * @param password - The users' password
 * @param onError - Error callback. Gets called if the login process fails.
 */
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

/**
 * Uses the current redux state to generate configure an axios request by adding
 * the crsf-token (necessary for django post requests) and the authentication
 * token (necessary to authenticate the current user on backend endpoints)
 *
 * @param getState - Handle to retrieve the redux state
 */
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