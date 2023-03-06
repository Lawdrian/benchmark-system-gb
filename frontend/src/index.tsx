/**
 * #############################################################################
 * index.tsx: Entry point for the react application
 * #############################################################################
 */
import React from "react";
import App from "./components/App";
import store from "./store";
import layoutConfig from "./configuration/LayoutConfig";
import pageDefinitions, {pageConfig} from "./configuration/PageConfig";
import { createRoot } from 'react-dom/client';
// entry point of the react-application. Requires a div with id equal to "app"
const appDiv = document.getElementById("app");
const root = createRoot(appDiv!);
/**
 * Render the app-component inside the app-div and pass various configuration
 * parameters as well as the redux-store to be used by the react-application.
 */
root.render(
    <App
        store={store}
        layoutConfig={layoutConfig}
        pageDefinitions={pageDefinitions}
        loginPageUrl={pageConfig.loginUrl}
    />
);