import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export type AppStore = typeof store;

export type ReduxStateHook = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;