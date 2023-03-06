/**
 * #############################################################################
 * h2ofootprint.ts: Redux action generators to handle h2ofootprint data
 *
 *     This file provides the utility to load h2ofootprint data from the server
 *     into the redux store.
 *
 * For further information on action generators see:
 * - https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#action-creators
 * #############################################################################
 */
import {
    GreenhouseBenchmark,
    GreenhouseFootprint,
    H2OFP_ERROR,
    H2OFP_LOADED,
    H2OFP_LOADING, H2OFP_NO_CONTENT, OptimizationData
} from "../types/reduxTypes";
import axios from "axios";
import {AppDispatch, ReduxStateHook} from "../store";
import {tokenConfig} from "./auth";
import {formatLabel} from "./co2footprint";


/**
 * @type RawH2ODataset
 *
 * The structure of a single h2o footprint greenhouse data, that is provided by the server.
 */
type RawGreenhouseH2ODataset = {
    greenhouse_name: string
    performer_productiontype?: string
    best_performer_date?: string
    worst_performer_date?: string
    greenhouse_datasets: RawH2ODataset[]
}

/**
 * @type RawH2ODataset
 *
 * Contains the values, which make up the h2o-footprint, and a label, that
 * gives additional information about the dataset. (The date in this case)
 */
type RawH2ODataset = {
    label: string
    konstruktion_h2o: number
    energieschirm_h2o: number
    bodenabdeckung_h2o: number
    produktionssystem_h2o: number
    heizsystem_h2o: number
    zusaetzliches_heizsystem_h2o: number
    energietraeger_h2o: number
    strom_h2o: number
    brunnenwasser_h2o: number
    regenwasser_h2o: number
    stadtwasser_h2o: number
    oberflaechenwasser_h2o: number
    co2_zudosierung_h2o: number
    duengemittel_h2o: number
    psm_h2o: number
    pflanzenbehaelter_h2o: number
    substrat_h2o: number
    jungpflanzen_substrat_h2o: number
    jungpflanzen_transport_h2o: number
    schnuere_h2o: number
    klipse_h2o: number
    rispenbuegel_h2o: number
    bewaesserung_h2o: number
    verpackung_h2o: number
    sonstige_verbrauchsmaterialien_h2o: number
    transport_h2o: number
}

/**
 * @type RawGreenhouseDirectH2ODataset
 *
 * The structure of a single h2o footprint direct water usage greenhouse data, that is provided by the server.
 */
type RawGreenhouseDirectH2ODataset = {
    greenhouse_name: string
    performer_productiontype?: string
    best_performer_date?: string
    greenhouse_datasets: RawDirectH2ODataset[]
}

/**
 * @type RawDirectH2ODataset
 *
 * Contains the values, which make up the direct water usage h2o-footprint, and a label, that
 * gives additional information about the dataset. (The date in this case)
 */
type RawDirectH2ODataset = {
    label: string
    brunnenwasser_h2o: number
    regenwasser_h2o: number
    stadtwasser_h2o: number
    oberflaechenwasser_h2o: number
}


/**
 * Loads the h2o footprint data for the current user.
 *
 * @param withAuth - User needs to be logged in to use this function
 * @param loadingCB - Function that should be executed, when the h2o footprint request is in progress
 * @param successCB - Function that should be executed, when the h2o footprint request was a success
 * @param errorCB - Function that should be executed, when an error occurred during the h2o footprint request
 * @param noContentCB - Function that should be executed, when there is no h2o footprint
 */
export const loadH2OFootprint = (
    withAuth: boolean = true,
    loadingCB: Function = () => { /* NOOP */ },
    successCB: Function = () => { /* NOOP */ },
    errorCB: Function = () => { /* NOOP */ },
    noContentCB: Function = () => { /* NOOP */ }
) => (dispatch: AppDispatch, getState: ReduxStateHook) => {

    dispatch({type: H2OFP_LOADING });
    loadingCB();

    // send request
    axios.get('/backend/get-h2o-footprint', withAuth ? tokenConfig(getState) : undefined)
        .then((response) => {
            // console.log("H2O Response", response)
            if (response.status == 204) {
                dispatch({type: H2OFP_NO_CONTENT})
                noContentCB()
            }
            else {
                dispatch({
                    type: H2OFP_LOADED,
                    payload1: toH2OFootprintPlot(response.data.total),
                    payload2: toH2OFootprintPlot(response.data.normalizedkg),
                    payload3: toH2OFootprintPlot(response.data.normalizedm2),
                    payload4: toH2OFootprintPlot(response.data.fruitsizekg),
                    payload5: toH2OFootprintPlot(response.data.fruitsizem2),
                    payload6: toDirectH2OFootprintPlot(response.data.directkg),
                    payload7: toDirectH2OFootprintPlot(response.data.directm2),
                    payload8: toH2OBenchmarkPlot(response.data.normalizedkg),
                    payload9: toH2OBenchmarkPlot(response.data.normalizedkg),
                    payload10: toH2OOptimizationData(response.data.normalizedkg),
                    payload11: toH2OOptimizationData(response.data.normalizedm2)
                })
                successCB()
            }
        })
        .catch((error) => {
            dispatch({
                type: H2OFP_ERROR
            })
            errorCB()
        })
}

/**
 * Takes the raw h2o-footprint data (how it is provided by the server) and
 * transforms it into a data structure, that chart.js can use to create a
 * visualisation of the data.
 *
 * @param responseData - The h2o footprint data provided by the server
 */
export const toH2OFootprintPlot = (responseData: RawGreenhouseH2ODataset[]): GreenhouseFootprint[] => {

     const footprintData = responseData.map(greenhouse => {
        return {...greenhouse,
            greenhouse_datasets: greenhouse.greenhouse_datasets.filter(dataset => {
            return dataset.label != "Worst Performer"
        })}
    })

    return footprintData.map(greenhouse => {
        return {
            greenhouse: greenhouse.greenhouse_name,
            performerProductionType: greenhouse.performer_productiontype ?? "",
            bestPerformerDate: formatLabel(greenhouse.best_performer_date ?? ""),
            data: {
                labels: greenhouse.greenhouse_datasets
                    .map(dataset => dataset.label)
                    .map(label => formatLabel(label)),
                datasets: [{
                    label: "Brunnenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.brunnenwasser_h2o
                    ),
                    backgroundColor: "rgb(040,086,162)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Brunnenwasser", "value": dataset.brunnenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Regenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.regenwasser_h2o
                    ),
                    backgroundColor: "rgb(068,154,191)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Regenwasser", "value": dataset.regenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Stadtwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.stadtwasser_h2o
                    ),
                    backgroundColor: "rgb(135,194,228)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Stadtwasser", "value": dataset.stadtwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Oberflächenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.oberflaechenwasser_h2o
                    ),
                    backgroundColor: "rgb(100,149,237)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Oberflächenwasser", "value": dataset.oberflaechenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Gewächshaus Konstruktion",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                            dataset.konstruktion_h2o +
                            dataset.energieschirm_h2o +
                            dataset.bodenabdeckung_h2o +
                            dataset.produktionssystem_h2o +
                            dataset.bewaesserung_h2o +
                            dataset.heizsystem_h2o +
                            dataset.zusaetzliches_heizsystem_h2o
                    ),
                    backgroundColor: "rgba(24, 24, 24, 0.3)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Konstruktion", "value": dataset.konstruktion_h2o},
                        { "name": "Energieschirm", "value": dataset.energieschirm_h2o},
                        { "name": "Bodenabdeckung", "value": dataset.bodenabdeckung_h2o},
                        { "name": "Produktionssystem", "value": dataset.produktionssystem_h2o},
                        { "name": "Bewässerung", "value": dataset.bewaesserung_h2o},
                        { "name": "Heizsystem", "value": dataset.heizsystem_h2o},
                        { "name": "Zusätzliches Heizsystem", "value": dataset.zusaetzliches_heizsystem_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                },  {
                    label: "Wärmeträger",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset => dataset.energietraeger_h2o),
                    backgroundColor: "rgb(168,023,041)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Wärmeträger", "value": dataset.energietraeger_h2o}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Strom",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset => dataset.strom_h2o),
                    backgroundColor: "rgb(255,221,0)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Strom", "value": dataset.strom_h2o}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Hilfsstoffe",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.co2_zudosierung_h2o +
                        dataset.duengemittel_h2o +
                        dataset.psm_h2o
                    ),
                    backgroundColor: "rgb(122,184,0)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "CO2 Zudosierung", "value": dataset.co2_zudosierung_h2o},
                        { "name": "Düngemittel", "value": dataset.duengemittel_h2o},
                        { "name": "Pflanzenschutzmittel", "value": dataset.psm_h2o}
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Betriebsstoffe",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.pflanzenbehaelter_h2o +
                        dataset.substrat_h2o +
                        dataset.jungpflanzen_substrat_h2o +
                        dataset.jungpflanzen_transport_h2o +
                        dataset.schnuere_h2o +
                        dataset.klipse_h2o +
                        dataset.rispenbuegel_h2o +
                        dataset.verpackung_h2o +
                        dataset.sonstige_verbrauchsmaterialien_h2o
                    ),
                    backgroundColor: "rgb(161,087,103)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        { "name": "Pflanzenbehälter", "value": dataset.pflanzenbehaelter_h2o},
                        { "name": "Substrat", "value": dataset.substrat_h2o},
                        { "name": "Jungpflanzen Substrat", "value": dataset.jungpflanzen_substrat_h2o},
                        { "name": "Jungpflanzen Transport", "value": dataset.jungpflanzen_transport_h2o},
                        { "name": "Schnüre", "value": dataset.schnuere_h2o},
                        { "name": "Klipse", "value": dataset.klipse_h2o},
                        { "name": "Rispenbügel", "value": dataset.rispenbuegel_h2o},
                        { "name": "Verpackung", "value": dataset.verpackung_h2o},
                        { "name": "Sonstige Verbrauchsmaterialien", "value": dataset.sonstige_verbrauchsmaterialien_h2o},
                    ])
                },]
            }
        }
    });
}


/**
 * Takes the raw h2o-footprint data (how it is provided by the server) and
 * transforms it into a data structure, that chart.js can use to create a
 * visualisation of the data.
 *
 * @param responseData - The h2o footprint data provided by the server
 */
export const toDirectH2OFootprintPlot = (responseData: RawGreenhouseDirectH2ODataset[]): GreenhouseFootprint[] => {
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
                    label: "Brunnenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.brunnenwasser_h2o
                    ),
                    backgroundColor: "rgb(040,086,162)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Brunnenwasser", "value": dataset.brunnenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Regenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.regenwasser_h2o
                    ),
                    backgroundColor: "rgb(068,154,191)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Regenwasser", "value": dataset.regenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Stadtwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.stadtwasser_h2o
                    ),
                    backgroundColor: "rgb(135,194,228)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Stadtwasser", "value": dataset.stadtwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }, {
                    label: "Oberflächenwasser",
                    type: 'bar' as const,
                    data: greenhouse.greenhouse_datasets.map(dataset =>
                        dataset.oberflaechenwasser_h2o
                    ),
                    backgroundColor: "rgb(100,149,237)",
                    splitData: greenhouse.greenhouse_datasets.map(dataset => [
                        {"name": "Oberflächenwasser", "value": dataset.oberflaechenwasser_h2o},
                    ]),
                    optimization: [],
                    climateData: []
                }
            ]}
        }
    });
}


/**
 * Takes the raw h2o-benchmark data (how it is provided by the server) and
 * transforms it into a data structure, that chart.js can use to create a
 * visualisation of the data. Every bar represents the categories(e.g. Wärmeenergie).
 * The h2o footprint of the best and worst performer split up into its categories,
 * is displayed in addition to the user's co2 footprint.
 *
 * @param responseData - The h2o-benchmark data provided by the server
 */
export const toH2OBenchmarkPlot = (responseData: RawGreenhouseH2ODataset[]): GreenhouseBenchmark[] => {

     const benchmarkData = responseData.map(greenhouse => {
        return {...greenhouse,
            greenhouse_datasets: greenhouse.greenhouse_datasets.filter((dataset, i, datasets) => {
            return !(i < datasets.length - 3)
        })}
    })

    return benchmarkData.map(greenhouse => {
        let konstruktion: number[] = []
        let waermetraeger: number[] = []
        let strom: number[] = []
        let wasserverbrauch: number[] = []
        let hilfsstoffe: number[] = []
        let betriebsstoffe: number[] = []
        for (let i in greenhouse.greenhouse_datasets) {
            konstruktion[i] = greenhouse.greenhouse_datasets[i].konstruktion_h2o +
                greenhouse.greenhouse_datasets[i].energieschirm_h2o +
                greenhouse.greenhouse_datasets[i].bodenabdeckung_h2o +
                greenhouse.greenhouse_datasets[i].produktionssystem_h2o +
                greenhouse.greenhouse_datasets[i].bewaesserung_h2o +
                greenhouse.greenhouse_datasets[i].heizsystem_h2o +
                greenhouse.greenhouse_datasets[i].zusaetzliches_heizsystem_h2o

            waermetraeger[i] = greenhouse.greenhouse_datasets[i].energietraeger_h2o
            strom[i] = greenhouse.greenhouse_datasets[i].strom_h2o
            wasserverbrauch[i] = greenhouse.greenhouse_datasets[i].brunnenwasser_h2o +
                greenhouse.greenhouse_datasets[i].regenwasser_h2o +
                greenhouse.greenhouse_datasets[i].stadtwasser_h2o +
                greenhouse.greenhouse_datasets[i].oberflaechenwasser_h2o
            hilfsstoffe[i] = greenhouse.greenhouse_datasets[i].co2_zudosierung_h2o +
                greenhouse.greenhouse_datasets[i].duengemittel_h2o +
                greenhouse.greenhouse_datasets[i].psm_h2o
            betriebsstoffe[i] = greenhouse.greenhouse_datasets[i].pflanzenbehaelter_h2o +
                greenhouse.greenhouse_datasets[i].substrat_h2o +
                greenhouse.greenhouse_datasets[i].jungpflanzen_substrat_h2o +
                greenhouse.greenhouse_datasets[i].jungpflanzen_transport_h2o +
                greenhouse.greenhouse_datasets[i].schnuere_h2o +
                greenhouse.greenhouse_datasets[i].klipse_h2o +
                greenhouse.greenhouse_datasets[i].rispenbuegel_h2o +
                greenhouse.greenhouse_datasets[i].verpackung_h2o +
                greenhouse.greenhouse_datasets[i].sonstige_verbrauchsmaterialien_h2o
        }


        return {
            greenhouse: greenhouse.greenhouse_name,
            performerProductionType: greenhouse.performer_productiontype ?? "",
            bestPerformerDate: formatLabel(greenhouse.best_performer_date ?? "") ,
            worstPerformerDate: formatLabel(greenhouse.worst_performer_date ?? "") ,
            data: {
                labels: ["Gwh Konstruktion", "Wärmeträger", "Strom", "Wasserverbrauch", "Hilfsstoffe", "Betriebsstoffe"],
                datasets: [
                    {
                        label: formatLabel(greenhouse.greenhouse_datasets[1].label),
                        type: 'scatter' as const,
                        data: [konstruktion[1], waermetraeger[1], strom[1], wasserverbrauch[1], hilfsstoffe[1], betriebsstoffe[1]],
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
                        data: [konstruktion[2], waermetraeger[2], strom[2], wasserverbrauch[2], hilfsstoffe[2], betriebsstoffe[2]],
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
                        data: [konstruktion[0], waermetraeger[0], strom[0], wasserverbrauch[0], hilfsstoffe[0], betriebsstoffe[0]],
                        backgroundColor: "rgba(187, 181, 184, 0.8)"
                    }
                ]
            }
        }
    });
}


/**
 * Takes the raw h2o-footprint data (how it is provided by the server) and
 * transforms it into a data structure, that can be used to create a rating table and efficiency bar
 *
 * @param responseData - The h2o footprint data provided by the server
 */
export const toH2OOptimizationData = (responseData: RawGreenhouseH2ODataset[]): OptimizationData[] => {

    // only use the data from most recent data set, best performer, and worst performer
     const optimizationData = responseData.map(greenhouse => {
        return {...greenhouse,
            greenhouse_datasets: greenhouse.greenhouse_datasets.filter((dataset, i, datasets) => {
            return !(i < datasets.length - 3)
        })}
    })

    const response = optimizationData.map(greenhouse => {
        return {
            greenhouse: greenhouse.greenhouse_name,
            data: [
                {
                    label: "Wasserverbrauch",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((
                        dataset.brunnenwasser_h2o +
                        dataset.regenwasser_h2o +
                        dataset.stadtwasser_h2o +
                        dataset.oberflaechenwasser_h2o
                    ).toFixed(2))),
                }, {
                    label: "Gewächshaus Konstruktion",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((
                            dataset.konstruktion_h2o +
                            dataset.energieschirm_h2o +
                            dataset.bodenabdeckung_h2o +
                            dataset.produktionssystem_h2o +
                            dataset.bewaesserung_h2o +
                            dataset.heizsystem_h2o +
                            dataset.zusaetzliches_heizsystem_h2o
                    ).toFixed(2))),
                },  {
                    label: "Wärmeträger",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((dataset.energietraeger_h2o).toFixed(2))),
                }, {
                    label: "Strom",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((dataset.strom_h2o).toFixed(2))),
                }, {
                    label: "Hilfsstoffe",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((
                        dataset.co2_zudosierung_h2o +
                        dataset.duengemittel_h2o +
                        dataset.psm_h2o
                    ).toFixed(2))),
                }, {
                    label: "Betriebsstoffe",
                    data: greenhouse.greenhouse_datasets.map(dataset => parseFloat((
                        dataset.pflanzenbehaelter_h2o +
                        dataset.substrat_h2o +
                        dataset.jungpflanzen_substrat_h2o +
                        dataset.jungpflanzen_transport_h2o +
                        dataset.schnuere_h2o +
                        dataset.klipse_h2o +
                        dataset.rispenbuegel_h2o +
                        dataset.verpackung_h2o +
                        dataset.sonstige_verbrauchsmaterialien_h2o
                    ).toFixed(2))),
                }
            ]
        }
    });
    return response
}

