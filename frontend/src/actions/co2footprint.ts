/**
 * #############################################################################
 * co2footprint.ts: Redux action generators to handle co2-footprint data
 *
 *     This file provides the utility to load co2-footprint data from the server
 *     into the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    CO2FP_ERROR,
    CO2FP_LOADED,
    CO2FP_LOADING,
    GreenhouseFootprint
} from "../types/reduxTypes";
import {AppDispatch, ReduxStateHook} from "../store";
import axios from "axios";
import {tokenConfig} from "./auth";
import {format} from "date-fns";

/**
 * @type RawCO2Dataset
 *
 * The structure of a single co2-footprint dataset, that is provided by the server.
 */
type RawGreenhouseCO2Dataset = {
    greenhouse_name: string,
    greenhouseDatasets: RawCO2Dataset[]
}

/**
 * @type RawCO2Dataset
 *
 * Contains the values, which make up the co2-footprint, and a label, that
 * gives additional information about the dataset. (The Data in this case)
 */
type RawCO2Dataset = {
    label: string
    gwh_konstruktion_co2: number
    energietraeger_co2: number
    strom_co2: number
    co2_zudosierung_co2: number
    duengemittel_co2: number
    psm_co2: number
    nuetzlinge_co2: number
    pflanzenbehaelter_co2: number
    substrat_co2: number
    jungpflanzen_substrat_co2: number
    jungpflanzen_transport_co2: number
    schnuere_co2: number
    klipse_co2: number
    rispenbuegel_co2: number
    bewaesserung_co2: number
    verpackung_co2: number
    sonstige_verbrauchsmaterialien_co2: number
    transport_co2: number
    zusaetzlicher_machineneinsatz_co2: number
}

/**
 * @type RawCO2Data
 *
 * The structure of the http-response data, when fetching the co2-footprint data.
 */
type RawCO2Data = RawGreenhouseCO2Dataset[];

/**
 * Load all co2-footprint datasets for the current user.
 */
export const loadCO2Footprint = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {
    // Get the ID of the currently logged in user
    const user = getState().auth.user;
    const userID = user ? user.id : '1';

    // User Loading
    dispatch({type: CO2FP_LOADING});
    loadingCB();

    // Send request
    axios.get(
        '/backend/get-calculated-data?userId=' + userID + '&dataType=co2FootprintData',
        withAuth ? tokenConfig(getState) : undefined
    ).then((response) => {
            console.log("CO2 Response", response)
            dispatch({
                type: CO2FP_LOADED,
                payload: toCO2FootprintPlot(response.data)
            })
            successCB()
        })
        .catch((error) => {// TODO: Proper Error handling
            dispatch({
                type: CO2FP_ERROR
            })
            errorCB()
        })
}

/**
 * Takes the raw co2-footprint data (how it is provided by the server) and
 * transforms it into a data structre, that chart.js can use to create a
 * visualisation of the data.
 *
 * @param responseData - The co2-footprint data provided by the server
 */
export const toCO2FootprintPlot = (responseData: RawCO2Data): GreenhouseFootprint[] => {
    return responseData.map(greenhouse => {
        return {
            greenhouse: greenhouse.greenhouse_name,
            data: {
                labels: greenhouse.greenhouseDatasets
                    .map(dataset => dataset.label.substring(0, 10))
                    .map(label => new Date(label).getFullYear() == 0 ? "Referenz" : format(new Date(label), 'dd/MM/yyyy')),
                datasets: [{
                    label: "Gewächshaus Konstruktion",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.gwh_konstruktion_co2),
                    backgroundColor: "rgba(53, 162, 235,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Energieträger",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.energietraeger_co2),
                    backgroundColor: "rgba(235,53,162,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Strom",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.strom_co2),
                    backgroundColor: "rgba(255,251,0,0.68)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "CO2 Zudosierung",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.co2_zudosierung_co2),
                    backgroundColor: "rgba(239,131,6,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Düngemittel",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.duengemittel_co2),
                    backgroundColor: "rgba(37,239,6,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Pflanzenschutzmittel",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.psm_co2),
                    backgroundColor: "rgba(6,239,220,0.7)",
                    optimization: [],
                    climateData: []
                }, {
                    label: "Verbrauchsmaterialien",
                    data: greenhouse.greenhouseDatasets.map(dataset =>
                        dataset.pflanzenbehaelter_co2 +
                        dataset.substrat_co2 +
                        dataset.jungpflanzen_substrat_co2 +
                        dataset.jungpflanzen_transport_co2 +
                        dataset.schnuere_co2 +
                        dataset.klipse_co2 +
                        dataset.rispenbuegel_co2 +
                        dataset.bewaesserung_co2 +
                        dataset.verpackung_co2 +
                        dataset.sonstige_verbrauchsmaterialien_co2 +
                        dataset.transport_co2 +
                        dataset.zusaetzlicher_machineneinsatz_co2
                    ),
                    backgroundColor: "rgba(91,6,239,0.7)",
                    optimization: [],
                    climateData: []
                }]
            }
        }
    });
}
