/**
 * #############################################################################
 * reduxTypes.ts: Defines action types to dispatch for redux and other redux
 *                related types that are shared between reducers
 *
 *     The redux action types are string constants, which are used to determine
 *     within the reducers, which action to execute. This happens when redux
 *     dispatches actions.
 * #############################################################################
 */

/**
 * ----------- REDUX ACTION TYPES ---------------
 */
// reset the redux store
export const RESET_DATA = "RESET_DATA";
// set the user-loading flag
export const USER_LOADING = "USER_LOADING";
// loading of the current user has finished
export const USER_LOADED = "USER_LOADED";
// loading of the current user failed due to authentication errors
export const AUTH_ERROR = "AUTH_ERROR";
// login was successful
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
// login has failed
export const LOGIN_FAIL = "LOGIN_FAILED";
// logout was successful
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
// registration of a new user was successful
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
// registration of a new user failed
export const REGISTER_FAIL = "REGISTER_FAIL";
// activation of a new user was successful
export const ACTIVATE_SUCCESS = "ACTIVATE_SUCCESS";
// activation of a new user is loading
export const ACTIVATE_LOADING = "ACTIVATE_LOADING";
// activation of a new user failed
export const ACTIVATE_FAIL = "ACTIVATE_FAIL";
// reset of a user password was successful
export const RESETPW_SUCCESS = "RESETPW_SUCCESS";
// reset password email has been successfully send to the user email, but password hasn't been changed yet
export const RESETPW_PENDING = "RESETPW_PENDING";
// reset of a user password failed
export const RESETPW_FAIL = "RESETPW_FAIL";
// deletion of user account was successful
export const DELETE_SUCCESS = "DELETE_SUCCESS";
// deletion of user account has failed
export const DELETE_FAIL = "DELETE_FAIL";
// set the co2-footprint-loading flag
export const CO2FP_LOADING = "CO2FP_LOADING";
// loading of co2-footprint was successful
export const CO2FP_LOADED = "CO2FP_LOADED";
// loading of co2-footprint failed
export const CO2FP_ERROR = "CO2FP_ERROR";
// set the co2-benchmark-loading flag
export const CO2BM_LOADING = "CO2BM_LOADING";
// loading of co2-benchmark was successful
export const CO2BM_LOADED = "CO2BM_LOADED";
// loading of co2-benchmark failed
export const CO2BM_ERROR = "CO2BM_ERROR";
// set the waterfooprint-loading flag
export const H2OFP_LOADING = "H2OFP_LOADING";
// loading of waterfootprint was successful
export const H2OFP_LOADED = "H2OFP_LOADED";
// loading of waterfootprint failed
export const H2OFP_ERROR = "H2OFP_ERROR";
// waterfootprint loaded, but no content;
export const H2OFP_NO_CONTENT = "H2OFP_NO_CONTENT";
// set the submission-in-progress flag
export const SUBMISSION_LOADING = "SUBMISSION_LOADING";
// submission of data was successful
export const SUBMISSION_SUCCESS = "SUBMISSION_SUCCESS";
// submission of data failed
export const SUBMISSION_ERROR = "SUBMISSION_ERROR";
// reset submission state
export const SUBMISSION_RESET = "SUBMISSION_RESET";
// set the lookup values-loading flag
export const LOOKUP_LOADING = "LOOKUP_LOADING";
// loading of lookup values was successful
export const LOOKUP_LOADED = "LOOKUP_LOADED";
// loading of lookup values failed
export const LOOKUP_FAILED = "LOOKUP_FAILED";
// set the unit values-loading flag
export const UNITS_LOADING = "UNITS_LOADING";
// loading of unit values was successful
export const UNITS_LOADED = "UNITS_LOADED";
// loading of unit values failed
export const UNITS_FAILED = "UNITS_FAILED";
// set the dataset-loading flag
export const DATASET_LOADING = "DATASET_LOADING";
// loading of dataset was successful
export const DATASET_LOADED = "DATASET_LOADED";
// loading of dataset failed
export const DATASET_ERROR = "DATASET_ERROR";
// reset dataset state
export const DATASET_RESET = "DATASET_RESET";
// set the profile-loading flag
export const PROFILE_LOADING = "PROFILE_LOADING";
// loading of profile data was successful
export const PROFILE_LOADED = "PROFILE_LOADED";
// loading of profile data failed
export const PROFILE_ERROR = "PROFILE_ERROR";
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
 * @type ProfileData
 *
 * The Metadata of a users datasets.
 */
export type ProfileData = {
    "greenhouse_name": string,
    "data": DatasetSummary[]
}

/**
 * @type DatasetSummary
 *
 * The Metadata of one dataset.
 */
export type DatasetSummary = {
    "greenhouseId": number
    "datasetId": number
    "label": string,
    "co2Footprint": number,
    "h2oFootprint": number
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
 * @type FootprintCategory
 *
 * Represents a single category of a footprint plot.
 */
type FootprintCategory = {
    label: string
    data: number[]
    backgroundColor: string
    splitData: {name: string, value: number}[][]
}

/**
 * @type BenchmarkDataset
 *
 * Represents a single dataset of a benchmark plot.
 */
type BenchmarkDataset = {
    label: string
    data: number[]
    backgroundColor: string

}/**
 * @type OptimizationDataset
 *
 * Represents a single category for the optimization.
 */
export type OptimizationDataset = {
    label: string
    data: number[]
}

/**
 * @type OptimizationData
 *
 * Represents a single category for the optimization.
 */
export type OptimizationData = {
    greenhouse: string
    data: OptimizationDataset[]
}

/**
 * @type Plot
 *
 * Base type for any plot datatype.
 */
type Plot = {
    labels: string[]
}

/**
 * @type FootprintPlot
 *
 * Contains the data for a complete footprint visualization.
 */
export type FootprintPlot = Plot & {
    datasets: FootprintCategory[]
}

/**
 * @type GreenhouseFootprint
 *
 * Represents a {@link FootprintPlot} that is related to a single greenhouse.
 */
export type GreenhouseFootprint = {
    greenhouse: string
    performerProductionType: string
    bestPerformerDate: string
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
 * Represents a {@link BenchmarkPlot}, that is related to a single greenhouse.
 */
export type GreenhouseBenchmark = {
    greenhouse: string
    performerProductionType: string
    bestPerformerDate: string
    worstPerformerDate: string
    data: BenchmarkPlot
}

export type DatasetData = {
    greenhouse_specs: string
    greenhouse_datasets: GreenhouseDataId[]
}

export type GreenhouseDataId = GreenhouseData & {
    greenhouse_data_id: string
}

/**
 * @type GreenhouseData
 *
 * Defines all fields the backend expects when submitting a new dataset for any
 * greenhouse.
 */
export type GreenhouseData = {
    greenhouse_name: string
    date: string
    Land: string
    Region: string
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
    AlterHeizsystem: string
    AlterProduktionssystem: string
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
    Nutzflaeche: string
    KulturBeginn: string
    KulturEnde: string
    NebenkulturBeginn: string
    NebenkulturEnde: string
    "Belichtung:Stromverbrauch": string
    "Belichtung:AnzahlLampen": string
    "Belichtung:AnschlussleistungProLampe": string
    "Belichtung:LaufzeitProJahr": string
    FungizideKg: string
    FungizideLiter: string
    InsektizideKg: string
    InsektizideLiter: string
    "Kuebel:VolumenProTopf": string
    "Kuebel:JungpflanzenProTopf": string
    "Kuebel:Alter": string
    Schnur: string
    "SchnuereRankhilfen:Laenge": string
    "SchnuereRankhilfen:Wiederverwendung": string
    "Klipse:AnzahlProTrieb": string
    "Klipse:Wiederverwendung": string
    "Rispenbuegel:AnzahlProTrieb": string
    "Rispenbuegel:Wiederverwendung": string
    "Jungpflanzen:Distanz": string
    "Verpackungsmaterial:AnzahlMehrwegsteigen": string
    Waermeversorgung: string
    GWHArt: string
    Bedachungsmaterial: string
    Stehwandmaterial: string
    Energieschirm: string
    EnergieschirmTyp: string
    Heizsystem: string
    Produktionstyp: string
    Produktionssystem: string
    ZusaetzlichesHeizsystem: string
    ZusaetzlichesHeizsystemTyp: string
    "10-30Gramm(Snack)": string
    "30-100Gramm(Cocktail)": string
    "100-150Gramm(Rispen)": string
    ">150Gramm(Fleisch)": string
    Nebenkultur: string
    Energietraeger: string
    Stromherkunft: string
    Zusatzbelichtung: string
    Belichtungsstrom: string
    WasserVerbrauch: string
    VorlaufmengeGesamt: string
    VorlaufmengeAnteile: string
    Restwasser: string
    "CO2-Herkunft": string
    "Duengemittel:VereinfachteAngabe": string
    "Duengemittel:DetaillierteAngabe": string
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
    BelichtungsstromEinheit: string
}

/**
 * @type Option
 *
 * @property {number} [id] - The option id from the database
 * @property {string} [values] - The option (display) value
 */
export type Option = {
    id: number
    values: string
}

/**
 * @type LookupValues
 *
 * A type to store the options for every option-group from the database.
 */
export type LookupValues = {
    Waermeversorgung: Option[]
    GWHArt: Option[]
    Land: Option[]
    Region: Option[]
    Bedachungsmaterial: Option[]
    Stehwandmaterial: Option[]
    AlterdesBedachungsmaterials: Option[]
    Energieschirm: Option[]
    EnergieschirmTyp: Option[]
    Heizsystem: Option[]
    Produktionstyp: Option[]
    Produktionssystem: Option[]
    AnzahlTriebe: Option[]
    ZusaetzlichesHeizsystem: Option[]
    ZusaetzlichesHeizsystemTyp: Option[]
    "10-30Gramm(Snack)": Option[]
    "30-100Gramm(Cocktail)": Option[]
    "100-150Gramm(Rispen)": Option[]
    ">150Gramm(Fleisch)": Option[]
    Nebenkultur: Option[]
    Entfeuchtung: Option[]
    Energietraeger: Option[]
    BHKW: Option[]
    Stromherkunft: Option[]
    Zusatzbelichtung: Option[]
    Belichtungsstrom: Option[]
    WasserVerbrauch: Option[]
    VorlaufmengeAnteile: Option[]
    Restwasser: Option[]
    "CO2-Herkunft": Option[]
    "Duengemittel:VereinfachteAngabe": Option[]
    "Duengemittel:DetaillierteAngabe": Option[]
    Nuetzlinge: Option[]
    GrowbagsKuebel: Option[]
    Substrat: Option[]
    Schnur: Option[]
    "SchnuereRankhilfen:Material": Option[]
    Klipse: Option[]
    "Klipse:Material": Option[]
    Rispenbuegel: Option[]
    "Rispenbuegel:Material": Option[]
    Bewaesserungsart: Option[]
    Bodenabdeckung: Option[]
    "Jungpflanzen:Zukauf": Option[]
    "Jungpflanzen:Substrat": Option[]
    Verpackungsmaterial: Option[]
    SonstigeVerbrauchsmaterialien: Option[]
    ZusaetzlicherMaschineneinsatz: Option[]
    BelichtungsstromEinheit: Option[]
}

/**
 * @type UnitValues
 *
 * A type to store the units for every input field from the database.
 */
export type UnitValues = {
    measures: {
        GWHFlaeche: Option[]
        WaermeteilungFlaeche: Option[]
        GWHAlter: Option[]
        AlterBedachungsmaterial: Option[]
        AlterStehwandmaterial: Option[]
        AlterEnergieschirm: Option[]
        Stehwandhoehe: Option[]
        Laenge: Option[]
        Breite: Option[]
        Kappenbreite: Option[]
        Scheibenlaenge: Option[]
        "Reihenabstand(Rinnenabstand)": Option[]
        Vorwegbreite: Option[]
        AlterHeizsystem: Option[]
        AlterProduktionssystem: Option[]
        AlterZusaetzlichesHeizsystem: Option[]
        "SnackReihenanzahl": Option[]
        "SnackPflanzenabstandInDerReihe": Option[]
        "SnackTriebzahl": Option[]
        "SnackErtragJahr": Option[]
        "CocktailReihenanzahl": Option[]
        "CocktailPflanzenabstandInDerReihe": Option[]
        "CocktailTriebzahl": Option[]
        "CocktailErtragJahr": Option[]
        "RispenReihenanzahl": Option[]
        "RispenPflanzenabstandInDerReihe": Option[]
        "RispenTriebzahl": Option[]
        "RispenErtragJahr": Option[]
        "FleischReihenanzahl": Option[]
        "FleischPflanzenabstandInDerReihe": Option[]
        "FleischTriebzahl": Option[]
        "FleischErtragJahr": Option[]
        Nutzflaeche: Option[]
        KulturBeginn: Option[]
        KulturEnde: Option[]
        NebenkulturBeginn: Option[]
        NebenkulturEnde: Option[]
        MittlereSolltemperaturTag: Option[]
        MittlereSolltemperaturNacht: Option[]
        Luftfeuchte: Option[]
        "Belichtung:Stromverbrauch": Option[]
        "Belichtung:AnzahlLampen": Option[]
        "Belichtung:AnschlussleistungProLampe": Option[]
        "Belichtung:LaufzeitProJahr": Option[]
        VorlaufmengeGesamt: Option[]
        Restwasser: Option[]
        FungizideKg: Option[]
        FungizideLiter: Option[]
        InsektizideKg: Option[]
        InsektizideLiter: Option[]
        "Kuebel:VolumenProTopf": Option[]
        "Kuebel:JungpflanzenProTopf": Option[]
        "Kuebel:Alter": Option[]
        "SchnuereRankhilfen:Laenge": Option[]
        "SchnuereRankhilfen:Wiederverwendung": Option[]
        "Klipse:AnzahlProTrieb": Option[]
        "Klipse:Wiederverwendung": Option[]
        "Rispenbuegel:AnzahlProTrieb": Option[]
        "Rispenbuegel:Wiederverwendung": Option[]
        "Bodenabdeckung:Wiederverwendung": Option[]
        "Jungpflanzen:Distanz": Option[]
        "Verpackungsmaterial:AnzahlMehrwegsteigen": Option[]
        "Transport:Distanz": Option[]
    }
    selections: {
        Waermeversorgung: {
            ja: Option[]
            nein: Option[]
        }
        GWHArt: {
            "Venlo": Option[]
            "DeutscheNorm": Option[]
            "Folientunnel": Option[]
        }
        Bedachungsmaterial: {
            "Einfachglas": Option[]
            "Doppelglas": Option[]
            "Doppelstegplatte": Option[]
            "Dreifachstegplatte": Option[]
            "Einfachfolie": Option[]
            "Doppelfolie": Option[]
        }
        Stehwandmaterial: {
            "Einfachglas": Option[]
            "Doppelglas": Option[]
            "Doppelstegplatte": Option[]
            "Dreifachstegplatte": Option[]
            "Einfachfolie": Option[]
            "Doppelfolie": Option[]
        }
        Energieschirm: {
            "ja": Option[]
            "nein": Option[]
        }
        EnergieschirmTyp: {
            "kein": Option[]
            "einfach": Option[]
            "doppelt": Option[]
            "einfach,aluminisiert": Option[]
            "doppelt,aluminisiert": Option[]
        }
        Heizsystem: {
            "ja": Option[]
            "nein": Option[]
        }
        Produktionssystem: {
            "Boden": Option[]
            "Hydroponikoffen": Option[]
            "Hydroponikgeschlossen": Option[]
        }
        ZusaetzlichesHeizsystem: {
            ja: Option[]
            nein: Option[]
        }
        ZusaetzlichesHeizsystemTyp: {
            Vegetationsheizung: Option[]
            Konvektionsheizung: Option[]
            keines: Option[]
        }
        "10-30Gramm(Snack)": {
            ja: Option[]
            nein: Option[]
        }
        "30-100Gramm(Cocktail)": {
            ja: Option[]
            nein: Option[]
        }
        "100-150Gramm(Rispen)": {
            ja: Option[]
            nein: Option[]
        }
        ">150Gramm(Fleisch)": {
            ja: Option[]
            nein: Option[]
        }
        Nebenkultur: {
            "ja": Option[]
            "nein": Option[]
        }
         Entfeuchtung: {
            "ja": Option[]
            "nein": Option[]
        }
        Energietraeger: {
            "Erdgas": Option[]
            "Heizoel": Option[]
            "Steinkohle": Option[]
            "Braunkohle": Option[]
            "Hackschnitzel": Option[]
            "Biogas": Option[]
            "Geothermie(oberflaechennah)": Option[]
            Tiefengheothermie: Option[]
        }
        Stromherkunft: {
            "DeutscherStrommix": Option[]
            "Oekostrom(DurschnittDeutschland)": Option[]
            "Photovoltaik": Option[]
            "Windenergie(Land)": Option[]
            "Windenergie(See)": Option[]
            "Wasserkraft": Option[]
            "Tiefengeothermie": Option[]
            "Biomethan": Option[]
            "BHKW Biomethan": Option[]
            "BHKW Erdgas": Option[]
            Diesel: Option[]
        }
        Zusatzbelichtung: {
            "ja": Option[]
            "nein": Option[]
        }
        Belichtungsstrom: {
            "ja": Option[]
            "nein": Option[]
        }
        VorlaufmengeAnteile: {
            "Brunnenwasser": Option[]
            "Regenwasser": Option[]
            "Stadtwasser": Option[]
            "Oberflaechenwasser": Option[]
        }
        "CO2-Herkunft": {
            "technisches CO2": Option[]
            "direkte Gasverbrennung": Option[]
            "eigenes BHKW": Option[]
        }
        "Duengemittel:VereinfachteAngabe": {
            "A/B Bag: Standardduengung": Option[]
            "Vinasse": Option[]
            "Pferdemist": Option[]
            "Kompost": Option[]
            "Hornmehl, -griess, -spaene": Option[]
            "Blutmehl": Option[]
            "Mist": Option[]
            "Gruenduengung": Option[]
            "Knochenmehl": Option[]
            "Pflanzkali": Option[]
            "org. Vollduenger": Option[]
        }
        "Duengemittel:DetaillierteAngabe": {
            "Ammoniumnitrat": Option[]
            "Kaliumnitrat (Kalisalpeter)": Option[]
            "Calciumnitrat fluessig (Kalksalpeter)": Option[]
            "Calciumnitrat fest": Option[]
            "Kaliumcholird, KCL, muriate of potash": Option[]
            "Kaliumsulfat": Option[]
            "Monokaliumphosphat (Flory6)": Option[]
            "Borax": Option[]
            "Eisen DDTPA 3%": Option[]
            "Eisen EDDHA 6 %": Option[]
            "25 % Cu Kupfersulfat": Option[]
            "32 % Mn Mangansulfat": Option[]
            "Natriummolybdat": Option[]
            "Zinksulfat": Option[]
            "Chlorbleichlauge": Option[]
            "Bittersalz": Option[]
            "Phosphorsaeure 75%": Option[]
            "Salpetersaeure 65%": Option[]
            "Salpetersaeure 38%": Option[]
            "Kalksalpeter": Option[]
            "Magnesiumnitrat": Option[]
            "Magnesiumsulfat": Option[]
            "Kalisilikat": Option[]
            "Mangansulfat": Option[]
            "Cupfersulfat": Option[]
            "Ammoniummolybdat": Option[]
        }
        Nuetzlinge: {
            "Erzwespe (Encasia, Eretmocerus, oder vergleichbares)": Option[]
            "Macrolophus (oder vergleichbares)": Option[]
            "Schlupfwespen (Aphidius, Dacnusa, Diglyphus, oder vergleichbares)": Option[]
            "Raubmilben (Phytoseiulus, Amblyseius, oder vergleichbares)": Option[]
            "Gallmuecken (Aphidoletes, oder vergleichbares)": Option[]
            "Florfliegen (Chrysoperla, oder vergleichbares)": Option[]
            "Futter fuer Macrolophus (Ephestia-Eier, Sitrotroga-Eier, Artemia, oder vergleichbares)": Option[]
            "Hummeln": Option[]
            "Andere": Option[]
        }
        GrowbagsKuebel: {
            "Growbags": Option[]
            "Kuebel": Option[]
            "nichts": Option[]
        }
        Substrat: {
            "Standardsubstrat": Option[]
            "Kokos": Option[]
            "Kompost": Option[]
            "Steinwolle": Option[]
            "Perlite": Option[]
            "Nachhaltiges Substrat": Option[]
        }
        Schnur: {
            "ja": Option[]
            "nein": Option[]
        }
        "SchnuereRankhilfen:Material": {
            "Kunststoff": Option[]
            "Jute": Option[]
            "Sisal": Option[]
            "Zellulose": Option[]
            "andere Nachhaltige/abbaubare Option": Option[]
            "Bambusstab": Option[]
            "Edelstahl": Option[]
        }
        Klipse: {
            "ja": Option[]
            "nein": Option[]
        }
        "Klipse:Material": {
            "Kunststoff": Option[]
            "Metall": Option[]
            "Nachhaltige / kompostierbare Option": Option[]
        }
        Rispenbuegel: {
            "ja": Option[]
            "nein": Option[]
        }
        "Rispenbuegel:Material": {
            "Kunststoff": Option[]
            "Metall": Option[]
            "Nachhaltige / kompostierbare Option": Option[]
        }
        Bewaesserungsart: {
            "Tropfschlaeuche": Option[]
            "Bodensprenkler": Option[]
            "Handschlauch": Option[]
        }
        Bodenabdeckung: {
            "Bodenfolie": Option[]
            "Bodengewebe": Option[]
            "Beton": Option[]
        }
        "Jungpflanzen:Zukauf": {
            "ja": Option[]
            "nein": Option[]
        }
        "Jungpflanzen:Substrat": {
            Standardsubstrat: Option[]
            Kokos: Option[]
            Steinwolle: Option[]
            Perlite: Option[]
            "Nachhaltiges Substrat": Option[]
        }
        Verpackungsmaterial: {
            Karton: Option[]
            Plastik: Option[]
        }
        SonstigeVerbrauchsmaterialien: {
            "Folie": Option[]
            "Eisen": Option[]
            "Alluminium": Option[]
            "Kunststoff": Option[]
            "Holz": Option[]
            "Pappe": Option[]
        }
        ZusaetzlicherMaschineneinsatz: {
            Gabelstapler: Option[]
        }
        BelichtungsstromEinheit: {
            kWh: Option[]
            Angaben: Option[]
        }
    }
}
