/**
 * #############################################################################
 * PageConfig.ts: Defines and configures pages for the complete application
 *
 *     This file mainly consists of two parts which get exported:
 *       - pageConfig: Provides constants shared by {@link AppLayout} and pages
 *       - pageDefinitions: Provides the necessary data to build every page of the app
 * #############################################################################
 */
import React from 'react';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import Co2Icon from '@mui/icons-material/Co2';
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircle from "@mui/icons-material/AccountCircle";
import PageC02Footprint from "../components/pages/visualization/PageCO2Footprint";
import PageProfile from "../components/pages/PageProfile";
import PageLogin from "../components/pages/user/PageLogin";
import PageRegister from "../components/pages/user/PageRegister";
import PageImpressum from "../components/pages/PageImpressum";
import PageAbout from "../components/pages/PageAbout";
import {generatePage} from "../helpers/PageBuilder";
import {Page, PageConfig, Section} from "../types/PageConfigTypes";
import EndpointTest from "../components/tests/EndpointTest";
import PageHome from "../components/pages/PageHome";
import PageUserActivation from "../components/pages/user/PageUserActivation";
import PageForgotPW from "../components/pages/user/PageForgotPW";
import PageResetPW from "../components/pages/user/PageResetPW";
import PagePreInputData from "../components/pages/input/PagePreInputData";
import PageDataInformation from "../components/pages/PageDataInformation";
import PageH2OFootprint from "../components/pages/visualization/PageH2OFootprint";

/**
 * Url slugs used by the web application.
 */
export const pageConfig: PageConfig = {
    loginUrl: "/login",
    registerUrl: "/register",
    userActivationUrl: "/activate",
    forgotPWUrl: "/forgotpw",
    resetPWUrl: "resetpw",
    dataInfoUrl: "/information",
    homeUrl: "/",
}

/**
 * The pages used by the web application are generated here.
 */
const pageDefinitions: Array<Page> = [
    generatePage(<PageHome/>, "/")
        .withHeaderTitle("Process simulation based on plant response - Benchmark Tool für den Tomatenanbau im Gewächshaus")
        .includeInDrawer(<HomeIcon/>, "Startseite ", Section.Home)
        .finalize(),
    generatePage(<PagePreInputData/>, "input-data")
        .withHeaderTitle("Eingabe der Gewächshausdaten")
        .includeInDrawer(<NoteAddIcon/>, "Dateneingabe", Section.Input)
        .finalize(),
    generatePage(<PageH2OFootprint/>, "h2o-footprint")
        .withHeaderTitle("H2O Footprint - Berechnung des Wasserverbrauchs")
        .includeInDrawer(<InvertColorsIcon/>, "H2O Footprint", Section.Diagrams)
        .finalize(),
    generatePage(<PageC02Footprint/>, "co2-footprint")
        .withHeaderTitle("CO2 Footprint - Berechnung des CO2-Verbrauchs")
        .includeInDrawer(<Co2Icon/>, "CO2 Footprint", Section.Diagrams)
        .finalize(),
    generatePage(<PageProfile/>, "profile")
        .withHeaderTitle("Dein Profil")
        .includeInDrawer(<AccountCircle/>, "Profil", Section.Profile)
        .finalize(),
    generatePage(<PageAbout/>, "about")
        .withHeaderTitle("Über uns")
        .includeInDrawer(<InfoIcon/>, "Über uns", Section.FurtherReading)
        .finalize(),
    generatePage(<PageImpressum/>, "impressum")
        .withHeaderTitle("Impressum")
        .includeInDrawer(<GroupsIcon/>, "Impressum", Section.FurtherReading)
        .finalize(),
    generatePage(
        <PageLogin
            loggedInUrl={pageConfig.homeUrl}
            registerUrl={pageConfig.registerUrl}
            forgotPWUrl={pageConfig.forgotPWUrl}
        />, pageConfig.loginUrl, false)
        .finalize(),
    generatePage(
        <PageRegister
            loginUrl={pageConfig.loginUrl}
            dataInfoUrl={pageConfig.dataInfoUrl}
        />, pageConfig.registerUrl, false)
        .finalize(),
    generatePage(
        <PageUserActivation
            loginUrl={pageConfig.loginUrl}
        />, pageConfig.userActivationUrl, false)
    .finalize(),
    generatePage(
        <PageForgotPW
            loginUrl={pageConfig.loginUrl}
        />, pageConfig.forgotPWUrl, false)
    .finalize(),
    generatePage(
        <PageResetPW
            loginUrl={pageConfig.loginUrl}
        />, pageConfig.resetPWUrl, false)
    .finalize(),
    generatePage(
        <PageDataInformation
        />, pageConfig.dataInfoUrl, false)
    .finalize(),
    generatePage(<EndpointTest/>, "ep-test")
        .finalize()
];

export default pageDefinitions;