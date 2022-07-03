/**
 * #############################################################################
 * index.tsx: Entry point for the react application
 * #############################################################################
 */
import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import store from "./store";
import layoutConfig from "./configuration/LayoutConfig";
import pageDefinitions, {pageConfig} from "./configuration/PageConfig";

// Entry point of the react-application. Requires a div with id equal to "app"
const appDiv = document.getElementById("app");

/**
 * Render the app-component inside the app-div and pass various configuration
 * parameters as well as the redux-store to be used by the react-application.
 */
render(
    <App
        store={store}
        layoutConfig={layoutConfig}
        pageDefinitions={pageDefinitions}
        loginPageUrl={pageConfig.loginUrl}
    />, appDiv
);