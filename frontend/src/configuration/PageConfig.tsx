import React from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import Co2Icon from '@mui/icons-material/Co2';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircle from "@mui/icons-material/AccountCircle";
import PageWaterFootprint from "../components/pages/PageWaterFootprint";
import PageWaterBenchmark from "../components/pages/PageWaterBenchmark";
import PageC02Footprint from "../components/pages/PageCO2Footprint";
import PageInputData from "../components/pages/PageInputData";
import PageProfile from "../components/pages/PageProfile";
import PageLogin from "../components/pages/PageLogin";
import PageRegister from "../components/pages/PageRegister";
import PageImpressum from "../components/pages/PageImpressum";
import PageAbout from "../components/pages/PageAbout";
import {generatePage} from "../helpers/PageBuilder";
import {Page, PageConfig, Section} from "../types/PageConfigTypes";
import EndpointTest from "../components/tests/EndpointTest";

export const pageConfig: PageConfig = {
    loginUrl: "/login",
    registerUrl: "/register",
    homeUrl: "/",
    proceedUrl: "", // TODO: Still necessary?!
}

const pageDefinitions: Array<Page> = [
    generatePage(<PageWaterBenchmark/>, "water-benchmark")
        .withHeaderTitle("Water Benchmark - Vergleich mit anderen Gewächshausbetreibern")
        .includeInDrawer(<SpeedIcon/>, "Water Benchmark")
        .finalize(),
    generatePage(<PageWaterFootprint/>, "water-footprint")
        .withHeaderTitle("Water Footprint - Berechnung des Wasserverbrauchs")
        .includeInDrawer(<InvertColorsIcon/>, "Water Footprint")
        .finalize(),
    generatePage(<PageC02Footprint/>, "co2-footprint")
        .withHeaderTitle("CO2 Footprint - Berechnung des CO2-Fußabdrucks")
        .includeInDrawer(<Co2Icon/>, "CO2 Footprint")
        .finalize(),
    generatePage(<PageInputData/>, "input-data")
        .withHeaderTitle("Eingabe der Gewächshausdaten")
        .includeInDrawer(<NoteAddIcon/>, "Dateneingabe", Section.Profile)
        .finalize(),
    generatePage(<PageProfile/>, "profile")
        .withHeaderTitle("Dein Profil")
        .includeInDrawer(<AccountCircle/>, "Profil", Section.Profile)
        .includeInAccountMenu("Profil")
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
        />, pageConfig.loginUrl, false)
        .finalize(),
    generatePage(
        <PageRegister
            registeredUrl={pageConfig.homeUrl}
            loginUrl={pageConfig.loginUrl}
        />, pageConfig.registerUrl, false)
        .finalize(),
    generatePage(<EndpointTest/>, "ep-test")
        .withHeaderTitle("Endpoint Test für Backend-API")
        .finalize()
];

export default pageDefinitions;