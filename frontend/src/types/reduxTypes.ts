/**
 * #############################################################################
 * reduxTypes.ts: Defines action types to dispatch for redux and other redux
 *                related types
 *
 *     The redux action types are string constants, which are used to determine
 *     within the reducers, which action to execute. This happens when redux
 *     dispatches actions.
 * #############################################################################
 */

/**
 * ----------- REDUX ACTION TYPES ---------------
 */
// Reset the redux store
export const RESET_DATA = "RESET_DATA";
// Set the user-loading flag
export const USER_LOADING = "USER_LOADING";
// Loading of the current user has finished
export const USER_LOADED = "USER_LOADED";
// Loading of the current user failed due to authentication errors
export const AUTH_ERROR = "AUTH_ERROR";
// Login was successful
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
// Login has failed
export const LOGIN_FAIL = "LOGIN_FAILED";
// Logout was successful
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
// Registration of a new user was successful
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
// Registration of a new user failed
export const REGISTER_FAIL = "REGISTER_FAIL";
// Activation of a new user was successful
export const ACTIVATE_SUCCESS = "ACTIVATE_SUCCESS";
// Activation of a new user failed
export const ACTIVATE_FAIL = "ACTIVATE_FAIL";
// Reset of a user password was successful
export const RESETPW_SUCCESS = "RESETPW_SUCCESS";
// Reset password email has been successfully send to the user email, but password hasn't been changed yet
export const RESETPW_PENDING = "RESETPW_PENDING";
// Reset of a user password failed
export const RESETPW_FAIL = "RESETPW_FAIL";
// Deletion of user account was successful
export const DELETE_SUCCESS = "DELETE_SUCCESS";
// Deletion of user account has failed
export const DELETE_FAIL = "DELETE_FAIL";
// Set the co2-footprint-loading flag
export const CO2FP_LOADING = "CO2FP_LOADING";
// Loading of co2-footprint was successful
export const CO2FP_LOADED = "CO2FP_LOADED";
// Loading of co2-footprint failed
export const CO2FP_ERROR = "CO2FP_ERROR";
// Set the waterfooprint-loading flag
export const WATERFP_LOADING = "WATERFP_LOADING";
// Loading of waterfootprint was successful
export const WATERFP_LOADED = "WATERFP_LOADED";
// Loading of waterfootprint failed
export const WATERFP_ERROR = "WATERFP_ERROR";
// Set the waterbenchmark-loading flag
export const WATERBM_LOADING = "WATERBM_LOADING";
// Loading of waterbenchmark was successful
export const WATERBM_LOADED = "WATERBM_LOADED";
// Loading of waterbenchmark failed
export const WATERBM_ERROR = "WATERBM_ERROR";
// Set the weaterdata-loading flag
export const WEATHER_LOADING = "WEATHER_LOADING";
// Loading of weatherdata was successful
export const WEATHER_LOADED = "WEATHER_LOADED";
// Loading of weatherdata failed
export const WEATHER_ERROR = "WEATHER_ERROR";
// Set the submission-in-progress flag
export const SUBMISSION_INPROGRESS = "SUBMISSION_INPROGRESS";
// Submission of data was successful
export const SUBMISSION_SUCCESS = "SUBMISSION_SUCCESS";
// Submission of data failed
export const SUBMISSION_ERROR = "SUBMISSION_ERROR";
// Set the lookup values-loading flag
export const LOOKUP_LOADING = "LOOKUP_LOADING";
// Loading of lookup values was successful
export const LOOKUP_LOADED = "LOOKUP_LOADED";
// Loading of lookup values failed
export const LOOKUP_FAILED = "LOOKUP_FAILED";
// Set the unit values-loading flag
export const UNITS_LOADING = "UNITS_LOADING";
// Loading of unit values was successful
export const UNITS_LOADED = "UNITS_LOADED";
// Loading of unit values failed
export const UNITS_FAILED = "UNITS_FAILED";
/**
 * ----------- REDUX RELATED TS-TYPES ---------------
 */
/**
 * @type Profile
 *
 * The Userprofile connected to a specific user
 */
type Profile = {
    company_name?: string
}

/**
 * @type User
 *
 * Represents a registered user.
 */
export type User = {
    id: number,
    username: string,
    email?: string,
    profile: Profile | null
}

/**
 * @type FootprintDataset
 *
 * Represents a single dataset of a footprint plot
 */
type FootprintDataset = {
    label: string
    data: number[]
    backgroundColor: string
    optimization: string[]
    climateData: string[]
}

/**
 * @type BenchmarkDataset
 *
 * Represents a single dataset of a benchmark plot
 */
type BenchmarkDataset = {
    label: string,
    data: { x: number, y: number }[]
    backgroundColor: string
}

/**
 * @type Plot
 *
 * Base type for any plot datatype
 */
type Plot = {
    labels: string[]
}

/**
 * @type FootprintPlot
 *
 * Contains the data for a complete footprint visulization
 */
export type FootprintPlot = Plot & {
    datasets: FootprintDataset[]
}

/**
 * @type GreenhouseFootprint
 *
 * Represents a {@link FootprintPlot} that is related to a single greenhouse
 */
export type GreenhouseFootprint = {
    greenhouse: string
    data: FootprintPlot
}

/**
 * @type BenchmarkPlot
 *
 * Contains the data for a complete benchmark visualization.
 */
export type BenchmarkPlot = Plot & {
    datasets: BenchmarkDataset[]
}

/**
 * @type GreenhouseBenchmark
 *
 * Represents a {@link BenchmarkPlot}, that is related to a single greenhouse
 */
export type GreenhouseBenchmark = {
    greenhouse: string
    data: BenchmarkPlot
}

/**
 * @type WeatherData
 *
 * Container type for the weather data, that is fetched from the server
 */
export type WeatherData = {
    precipitation_height: string
    temperature_air_mean_200: string
    sunshine_duration: string
}

/**
 * @type GreenhouseData
 *
 * Defines all fields the backend expects when submitting a new dataset for any
 * greenhouse. (NOT FINAL - SUBJECT TO CHANGE!!!)
 */
export type GreenhouseData = {
    greenhouse_name: string
    date: string
    PLZ: string
    GWHGesamtflaeche: string
    GWHFlaeche: string
    WaermeteilungFlaeche: string
    GWHAlter: string
    AlterBedachungsmaterial: string
    AlterStehwandmaterial: string
    AlterEnergieschirm: string
    Stehwandhoehe: string
    Laenge: string
    Breite: string
    Kappenbreite: string
    Scheibenlaenge: string
    "Reihenabstand(Rinnenabstand)": string
    Vorwegbreite: string
    AlterTransportsystem: string
    AlterKultursystem: string
    AlterZusaetzlichesHeizsystem: string
    SnackReihenanzahl: string
    SnackPflanzenabstandInDerReihe: string
    SnackTriebzahl: string
    SnackErtragJahr: string
    CocktailReihenanzahl: string
    CocktailPflanzenabstandInDerReihe: string
    CocktailTriebzahl: string
    CocktailErtragJahr: string
    RispenReihenanzahl: string
    RispenPflanzenabstandInDerReihe: string
    RispenTriebzahl: string
    RispenErtragJahr: string
    FleischReihenanzahl: string
    FleischPflanzenabstandInDerReihe: string
    FleischTriebzahl: string
    FleischErtragJahr: string
    Kulturflaeche: string
    KulturBeginn: string
    KulturEnde: string
    NebenkulturBeginn: string
    NebenkulturEnde: string
    MittlereSolltemperaturTag: string
    MittlereSolltemperaturNacht: string
    Luftfeuchte: string
    "BHKW:AnteilErdgas": string
    "BHKW:AnteilBiomethan": string
    "Belichtung:Stromverbrauch": string
    "Belichtung:AnzahlLampen": string
    "Belichtung:AnschlussleistungProLampe": string
    "Belichtung:LaufzeitProJahr": string
    FungizideKg: string
    InsektizideKg: string
    "Kuebel:VolumenProTopf": string
    "Kuebel:JungpflanzenProTopf": string
    "Kuebel:Alter": string
    "SchnuereRankhilfen:Laenge": string
    "SchnuereRankhilfen:Wiederverwendung": string
    "Klipse:AnzahlProTrieb": string
    "Klipse:Wiederverwendung": string
    "Rispenbuegel:AnzahlProTrieb": string
    "Rispenbuegel:Wiederverwendung": string
    "Jungpflanzen:Distanz": string
    "Verpackungsmaterial:AnzahlMehrwegsteigen": string
    "Transport:Distanz": string
    EinheitlicheWaermeversorgung: string
    GWHArt: string
    Bedachungsmaterial: string
    Stehwandmaterial: string
    Energieschirm: string
    Transportsystem: string
    Produktionstyp: string
    Kultursystem: string
    ZusaetzlichesHeizsystem: string
    "10-30Gramm(Snack)": string
    "30-100Gramm(Cocktail)": string
    "100-150Gramm(Rispen)": string
    ">150Gramm(Fleisch)": string
    Nebenkultur: string
    Entfeuchtung: string
    Energietraeger: string
    BHKW: string
    Stromherkunft: string
    Zusatzbelichtung: string
    Belichtungsstrom: string
    "CO2-Herkunft": string
    "Duengemittel:VereinfachteAngabe": string
    "Duengemittel:DetaillierteAngabe": string
    Nuetzlinge: string
    GrowbagsKuebel: string
    Substrat: string
    "SchnuereRankhilfen:Material": string
    Klipse: string
    "Klipse:Material": string
    Rispenbuegel: string
    "Rispenbuegel:Material": string
    Bewaesserungsart: string
    Bodenabdeckung: string
    "Jungpflanzen:Zukauf": string
    "Jungpflanzen:Substrat": string
    Verpackungsmaterial: string
    SonstigeVerbrauchsmaterialien: string
    ZusaetzlicherMaschineneinsatz: string
    BelichtungsstromEinheit: string
}
