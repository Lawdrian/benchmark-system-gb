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
    CO2FP_LOADING, GreenhouseBenchmark,
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
    greenhouse_name: string
    performer_productiontype?: string
    best_performer_date?: string
    worst_performer_date?: string
    greenhouse_datasets: RawCO2Dataset[]
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
    produktionssystem_co2: number
    heizsystem_co2: number
    zusaetzliches_heizsystem_co2: number
    energietraeger_co2: number
    strom_co2: number
    brunnenwasser_co2: number
    regenwasser_co2: number
    stadtwasser_co2: number
    oberflaechenwasser_co2: number
    co2_zudosierung_co2: number
    duengemittel_co2: number
    psm_co2: number
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

    // User Loading
    dispatch({type: CO2FP_LOADING});
    loadingCB();

    // Send request
    axios.get('/backend/get-co2-footprint', withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            console.log("CO2 Response", response)
            dispatch({
                type: CO2FP_LOADED,
                payload1: toCO2FootprintPlot(response.data.total),
                payload2: toCO2FootprintPlot(response.data.normalizedkg),
                payload3: toCO2FootprintPlot(response.data.normalizedm2),
                payload4: toCO2FootprintPlot(response.data.fruitsizekg),
                payload5: toCO2FootprintPlot(response.data.fruitsizem2),
                payload6: toCO2BenchmarkPlot(response.data.benchmarkkg),
                payload7: toCO2BenchmarkPlot(response.data.benchmarkm2)
            })
            successCB()
        })
        .catch((error) => {
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
            performerProductionType: greenhouse.performer_productiontype ?? "",
            bestPerformerDate: formatLabel(greenhouse.best_performer_date ?? "") ,
            data: {
                labels: greenhouse.greenhouse_datasets
                    .map(dataset => dataset.label)
                    .map(label => formatLabel(label)),
                datasets: [{
                    label: "Gewächshaus Konstruktion",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                            dataset.konstruktion_co2 +
                            dataset.energieschirm_co2 +
                            dataset.bodenabdeckung_co2 +
                            dataset.produktionssystem_co2 +
                            dataset.bewaesserung_co2 +
                            dataset.heizsystem_co2 +
                            dataset.zusaetzliches_heizsystem_co2
                    ),
                    backgroundColor: "rgba(24, 24, 24, 0.3)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Konstruktion", "value": dataset.konstruktion_co2},
                        { "name": "Energieschirm", "value": dataset.energieschirm_co2},
                        { "name": "Bodenabdeckung", "value": dataset.bodenabdeckung_co2},
                        { "name": "Produktionssystem", "value": dataset.produktionssystem_co2},
                        { "name": "Bewässerung", "value": dataset.bewaesserung_co2},
                        { "name": "Heizsystem", "value": dataset.heizsystem_co2},
                        { "name": "Zusätzliches Heizsystem", "value": dataset.zusaetzliches_heizsystem_co2},
                    ]),
                    optimization: [],
                    climateData: []
                },  {
                    label: "Wärmeträger",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset => dataset.energietraeger_co2),
                    backgroundColor: "rgb(168,023,041)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Wärmeträger", "value": dataset.energietraeger_co2}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Strom",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset => dataset.strom_co2),
                    backgroundColor: "rgb(255,221,0)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Strom", "value": dataset.strom_co2}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Hilfsstoffe",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.co2_zudosierung_co2 +
                        dataset.duengemittel_co2 +
                        dataset.psm_co2 +
                        dataset.brunnenwasser_co2 +
                        dataset.regenwasser_co2 +
                        dataset.stadtwasser_co2 +
                        dataset.oberflaechenwasser_co2
                    ),
                    backgroundColor: "rgb(122,184,0)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "CO2 Zudosierung", "value": dataset.co2_zudosierung_co2},
                        { "name": "Düngemittel", "value": dataset.duengemittel_co2},
                        { "name": "Pflanzenschutzmittel", "value": dataset.psm_co2},
                        { "name": "Brunnenwasser", "value": dataset.brunnenwasser_co2},
                        { "name": "Regenwasser", "value": dataset.regenwasser_co2},
                        { "name": "Stadtwasser", "value": dataset.stadtwasser_co2},
                        { "name": "Oberflächenwasser", "value": dataset.oberflaechenwasser_co2},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Betriebsstoffe",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.pflanzenbehaelter_co2 +
                        dataset.substrat_co2 +
                        dataset.jungpflanzen_substrat_co2 +
                        dataset.jungpflanzen_transport_co2 +
                        dataset.schnuere_co2 +
                        dataset.klipse_co2 +
                        dataset.rispenbuegel_co2 +
                        dataset.verpackung_co2 +
                        dataset.sonstige_verbrauchsmaterialien_co2
                    ),
                    backgroundColor: "rgb(161,087,103)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Pflanzenbehälter", "value": dataset.pflanzenbehaelter_co2},
                        { "name": "Substrat", "value": dataset.substrat_co2},
                        { "name": "Jungpflanzen Substrat", "value": dataset.jungpflanzen_substrat_co2},
                        { "name": "Jungpflanzen Transport", "value": dataset.jungpflanzen_transport_co2},
                        { "name": "Schnüre", "value": dataset.schnuere_co2},
                        { "name": "Klipse", "value": dataset.klipse_co2},
                        { "name": "Rispenbügel", "value": dataset.rispenbuegel_co2},
                        { "name": "Verpackung", "value": dataset.verpackung_co2},
                        { "name": "Sonstige Verbrauchsmaterialien", "value": dataset.sonstige_verbrauchsmaterialien_co2},
                    ])
                },]
            }
        }
    });
}


/**
 * Takes the raw co2-benchmark data (how it is provided by the server) and
 * transforms it into a data structre, that chart.js can use to create a
 * visualisation of the data. Every bar represents the categories(e.g. Wärmeenergie).
 * These bars will have dots on them showing how the best performer and worst performer are doing
 *
 * @param responseData - The co2-benchmark data provided by the server
 */
export const toCO2BenchmarkPlot = (responseData: RawCO2Data): GreenhouseBenchmark[] => {


    return responseData.map(greenhouse => {
        let konstruktion:number[] = []
        let waermetraeger:number[] = []
        let strom:number[] = []
        let hilfsstoffe:number[] = []
        let betriebsstoffe:number[] = []
        for (let i in greenhouse.greenhouse_datasets) {
            konstruktion[i] = greenhouse.greenhouse_datasets[i].konstruktion_co2 +
                greenhouse.greenhouse_datasets[i].energieschirm_co2 +
                greenhouse.greenhouse_datasets[i].bodenabdeckung_co2 +
                greenhouse.greenhouse_datasets[i].produktionssystem_co2 +
                greenhouse.greenhouse_datasets[i].bewaesserung_co2 +
                greenhouse.greenhouse_datasets[i].heizsystem_co2 +
                greenhouse.greenhouse_datasets[i].zusaetzliches_heizsystem_co2

            waermetraeger[i] = greenhouse.greenhouse_datasets[i].energietraeger_co2
            strom[i] = greenhouse.greenhouse_datasets[i].strom_co2
            hilfsstoffe[i] = greenhouse.greenhouse_datasets[i].co2_zudosierung_co2 +
                greenhouse.greenhouse_datasets[i].duengemittel_co2 +
                greenhouse.greenhouse_datasets[i].psm_co2
            betriebsstoffe[i] = greenhouse.greenhouse_datasets[i].pflanzenbehaelter_co2 +
                greenhouse.greenhouse_datasets[i].substrat_co2 +
                greenhouse.greenhouse_datasets[i].jungpflanzen_substrat_co2 +
                greenhouse.greenhouse_datasets[i].jungpflanzen_transport_co2 +
                greenhouse.greenhouse_datasets[i].schnuere_co2 +
                greenhouse.greenhouse_datasets[i].klipse_co2 +
                greenhouse.greenhouse_datasets[i].rispenbuegel_co2 +
                greenhouse.greenhouse_datasets[i].verpackung_co2 +
                greenhouse.greenhouse_datasets[i].sonstige_verbrauchsmaterialien_co2
        }


        return {
            greenhouse: greenhouse.greenhouse_name,
            performerProductionType: greenhouse.performer_productiontype ?? "",
            bestPerformerDate: formatLabel(greenhouse.best_performer_date ?? "") ,
            worstPerformerDate: formatLabel(greenhouse.worst_performer_date ?? "") ,
            data: {
                labels: ["Gwh Konstruktion", "Wärmeträger", "Strom", "Hilfsstoffe", "Betriebsstoffe"],
                datasets: [
                    {
                        label: formatLabel(greenhouse.greenhouse_datasets[1].label),
                        type: 'scatter' as const,
                        data: [konstruktion[1], waermetraeger[1], strom[1], hilfsstoffe[1], betriebsstoffe[1]],
                        backgroundColor: "rgba(11,156,49,0.6)",
                        pointStyle: "cross",
                        borderColor: "rgba(11,156,49,0.6)",
                        borderWidth: 3,
                        radius: 10,
                        hitRadius: 5,
                        hoverRadius: 10,
                        hoverBorderWidth: 3
                    },
                    {
                        label: formatLabel(greenhouse.greenhouse_datasets[2].label),
                        type: 'scatter' as const,
                        data: [konstruktion[2], waermetraeger[2], strom[2], hilfsstoffe[2], betriebsstoffe[2]],
                        backgroundColor: "rgba(255,0,0,0.8)",
                        pointStyle: "cross",
                        borderColor: "rgba(255,0,0,0.8)",
                        borderWidth: 3,
                        radius: 10,
                        hitRadius: 5,
                        hoverRadius: 10,
                        hoverBorderWidth: 3
                    },
                    {
                        label: formatLabel(greenhouse.greenhouse_datasets[0].label),
                        type: 'bar' as const,
                        data: [konstruktion[0], waermetraeger[0], strom[0], hilfsstoffe[0], betriebsstoffe[0]],
                        backgroundColor: "rgba(187, 181, 184, 0.8)"
                    }
                ]
            }
        }
    });
}

export function formatLabel(label: string):string {
        try {
            return format(new Date(label), 'yyyy')
        }
        catch(e) {
            return label
        }
}
