import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import store from "./store";
import layoutConfig from "./configuration/LayoutConfig";
import pageDefinitions, {pageConfig} from "./configuration/PageConfig";

const appDiv = document.getElementById("app");
render(
    <App
        store={store}
        layoutConfig={layoutConfig}
        pageDefinitions={pageDefinitions}
        loginPageUrl={pageConfig.loginUrl}
    />, appDiv
);