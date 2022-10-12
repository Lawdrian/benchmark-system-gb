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
    konstruktion_co2: number
    energieschirm_co2: number
    bodenabdeckung_co2: number
    kultursystem_co2: number
    transportsystem_co2: number
    zusaetzliches_heizsystem_co2: number
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
                payload: toCO2FootprintPlot(response.data.total),
                payload2: toCO2FootprintPlot(response.data.normalized),
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
                    .map(dataset => dataset.label)
                    .map(label => label == "Best Performer" ? "Best Performer" : format(new Date(label), 'yyyy')),
                datasets: [{
                    label: "Gewächshaus Konstruktion",
                    data: greenhouse.greenhouseDatasets.map(dataset =>
                            dataset.konstruktion_co2 +
                            dataset.energieschirm_co2 +
                            dataset.bodenabdeckung_co2 +
                            dataset.kultursystem_co2 +
                            dataset.transportsystem_co2 +
                            dataset.zusaetzliches_heizsystem_co2
                    ),
                    backgroundColor: "rgba(53, 162, 235,0.7)",
                    splitData: greenhouse.greenhouseDatasets.map(dataset => [
                        { "name": "Konstruktion", "value": dataset.konstruktion_co2},
                        { "name": "Energieschirm", "value": dataset.energieschirm_co2},
                        { "name": "Bodenabdeckung", "value": dataset.bodenabdeckung_co2},
                        { "name": "Kultursystem", "value": dataset.kultursystem_co2},
                        { "name": "Transportsystem", "value": dataset.transportsystem_co2},
                        { "name": "Zusätzliches Heizsystem", "value": dataset.zusaetzliches_heizsystem_co2},
                    ]),
                    optimization: [],
                    climateData: []
                },  {
                    label: "Wärmeträger",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.energietraeger_co2),
                    backgroundColor: "rgba(235,53,162,0.7)",
                    splitData: greenhouse.greenhouseDatasets.map(dataset => [
                        { "name": "Wärmeträger", "value": dataset.energietraeger_co2}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Strom",
                    data: greenhouse.greenhouseDatasets.map(dataset => dataset.strom_co2),
                    backgroundColor: "rgba(255,251,0,0.68)",
                    splitData: greenhouse.greenhouseDatasets.map(dataset => [
                        { "name": "Strom", "value": dataset.strom_co2}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Verbrauchsmittel",
                    data: greenhouse.greenhouseDatasets.map(dataset =>
                        dataset.co2_zudosierung_co2 +
                        dataset.duengemittel_co2 +
                        dataset.psm_co2 +
                        dataset.nuetzlinge_co2
                    ),
                    backgroundColor: "rgba(37,239,6,0.7)",
                    splitData: greenhouse.greenhouseDatasets.map(dataset => [
                        { "name": "CO2 Zudosierung", "value": dataset.co2_zudosierung_co2},
                        { "name": "Düngemittel", "value": dataset.duengemittel_co2},
                        { "name": "Pflanzenschutzmittel", "value": dataset.psm_co2},
                        { "name": "Nützlinge", "value": dataset.nuetzlinge_co2},
                    ]),
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
                    splitData: greenhouse.greenhouseDatasets.map(dataset => [
                        { "name": "Pflanzenbehälter", "value": dataset.pflanzenbehaelter_co2},
                        { "name": "Substrat", "value": dataset.substrat_co2},
                        { "name": "Jungpflanzen Substrat", "value": dataset.jungpflanzen_substrat_co2},
                        { "name": "Jungpflanzen Transport", "value": dataset.jungpflanzen_transport_co2},
                        { "name": "Schnüre", "value": dataset.schnuere_co2},
                        { "name": "Klipse", "value": dataset.klipse_co2},
                        { "name": "Rispenbügel", "value": dataset.rispenbuegel_co2},
                        { "name": "Bewässerung", "value": dataset.bewaesserung_co2},
                        { "name": "Verpackung", "value": dataset.verpackung_co2},
                        { "name": "Sonstige Verbrauchsmaterialien", "value": dataset.sonstige_verbrauchsmaterialien_co2},
                        { "name": "Transport", "value": dataset.transport_co2},
                        { "name": "Produktion", "value": dataset.zusaetzlicher_machineneinsatz_co2}
                    ])
                }]
            }
        }
    });
}
