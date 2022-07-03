/**
 * #############################################################################
 * store.tsx: Initializes the redux store for this application
 *
 *    For further information on how to initialize redux, see:
 *    - https://redux.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
 * #############################################################################
 */
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

// Configure the redux store
const initialState = {};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

// Define types of redux utils to be used across the application
export type AppStore = typeof store;

export type ReduxStateHook = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;