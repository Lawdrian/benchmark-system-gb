export const RESET_DATA = "RESET_DATA";
export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAILED";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const CO2FP_LOADING = "CO2FP_LOADING";
export const CO2FP_LOADED = "CO2FP_LOADED";
export const CO2FP_ERROR = "CO2FP_ERROR";
export const WATERFP_LOADING = "WATERFP_LOADING";
export const WATERFP_LOADED = "WATERFP_LOADED";
export const WATERFP_ERROR = "WATERFP_ERROR";
export const WATERBM_LOADING = "WATERBM_LOADING";
export const WATERBM_LOADED = "WATERBM_LOADED";
export const WATERBM_ERROR = "WATERBM_ERROR";
export const WEATHER_LOADING = "WEATHER_LOADING";
export const WEATHER_LOADED = "WEATHER_LOADED";
export const WEATHER_ERROR = "WEATHER_ERROR";
export const SUBMISSION_INPROGRESS = "SUBMISSION_INPROGRESS";
export const SUBMISSION_SUCCESS = "SUBMISSION_SUCCESS";
export const SUBMISSION_ERROR = "SUBMISSION_ERROR";
export const LOOKUP_LOADING = "LOOKUP_LOADING";
export const LOOKUP_LOADED = "LOOKUP_LOADED";
export const LOOKUP_FAILED = "LOOKUP_FAILED";

type Profile = {
    company_name?: string
}

export type User = {
    id: number,
    username: string,
    email?: string,
    profile: Profile | null
}

type FootprintDataset = {
    label: string
    data: number[]
    backgroundColor: string
    optimization: string[]
    climateData: string[]
}

type BenchmarkDataset = {
    label: string,
    data: { x: number, y: number }[]
    backgroundColor: string
}

type Plot = {
    labels: string[]
}

export type FootprintPlot = Plot & {
    datasets: FootprintDataset[]
}

export type GreenhouseFootprint = {
    greenhouse: string
    data: FootprintPlot
}

type BenchmarkPlot = Plot & {
    datasets: BenchmarkDataset[]
}

export type GreenhouseBenchmark = {
    greenhouse: string
    data: BenchmarkPlot
}

export type WeatherData = {
    precipitation_height: string
    temperature_air_mean_200: string
    sunshine_duration: string
}

export type GreenhouseData = {
    greenhouse_name: string
    date: string
    PLZ: number
    AlterEnergieschirm: number
    Stehwandhoehe: number
    Laenge: number
    Breite: number
    Kappenbreite: number
    "Scheibenlaenge(Bedachung)": number
    AlterKultursystem: number
    Reihenabstand: number
    Kulturflaeche: number
    KulturBeginn: number
    KulturEnde: number
    Ertrag: number
    Pflanzdichte: number
    MittlereSolltemperaturTag: number
    MittlereSolltemperaturNacht: number
    KulturmassnahmeAusgeizen: number
    KulturmassnahmeAusblattenAnzahlMonat: number
    KulturmassnahmeAblassen: number
    Strom: number
    StromverbrauchBelichtungAnschlussleistung: number
    StromverbrauchBelichtungAnzahlLampen: number
    StromverbrauchBelichtungLaufzeitTag: number
    "CO2-Zudosierung": number
    Fungizide: number
    Insektizide: number
    VolumenGrowbags: number
    LaengeGrowbags: number
    PflanzenproBag: number
    "SchnuereRankhilfen:Laenge": number
    "SchnuereRankhilfen:Wiederverwendung": number
    "Klipse:Menge": number
    "Klipse:Wiederverwendung": number
    "Rispenbuegel:Menge": number
    "Rispenbuegel:Wiederverwendung": number
    "SonstigeVerbrauchsmaterialien:Wiederverwendung": number
    "Verpackungsmaterial:Karton": number
    "Verpackungsmaterial:Plastik": number
    "TransportderWare:Auslieferungen": number
    "TransportderWare:Distanz": number
    GWHArt: string
    GWHAlter: string
    Bedachungsmaterial: string
    AlterdesBedachungsmaterials: string
    ArtdesStehwandmaterial: string
    Energieschirm: string
    Produktion: string
    Kultursystem: string
    Transportsystem: string
    Fruchtgewicht: string
    Nebenkultur: string
    AnzahlTriebe: string
    Entfeuchtung: string
    KulturmassnahmeAusblattenMenge: number
    Energietraeger: string
    Stromherkunft: string
    Zusatzbelichtung: string
    Belichtungsstrom: string
    "CO2-Herkunft": string
    "Duengemittel:DetalierteAngabe": string
    "Duengemittel:VereinfachteAngabe": string
    Nuetzlinge: string
    Growbags: string
    Substrat: string
    "SchnuereRankhilfen:Material": string
    "Klipse:Material": string
    "Rispenbuegel:Material": string
    Bewaesserungsart: string
    Bodenfolien: string
    SonstigeVerbrauchsmaterialien: string
    JungpflanzenZukauf: string
}