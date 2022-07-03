/**
 * #############################################################################
 * lookup.ts: Defines reducers to dispatch actions generated by ../actions/lookup.ts
 * #############################################################################
 */
import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING,
    RESET_DATA
} from "../types/reduxTypes";

/**
 * @type Option
 * @property {number} [id] - The option id from the database
 * @property {string} [values] - The option (display) value
 */
type Option = {
    id: number
    values: string
}

/**
 * @type LookupValues
 *
 * A type to store the options for every option-group in the database
 */
export type LookupValues = {
    AlterdesBedachungsmaterials: Option[]
    AnzahlTriebe: Option[]
    ArtdesStehwandmaterial: Option[]
    Bedachungsmaterial: Option[]
    Belichtungsstrom: Option[]
    Bewaesserungsart: Option[]
    Bodenfolien: Option[]
    "CO2-Herkunft": Option[]
    "Duengemittel:DetalierteAngabe": Option[]
    "Duengemittel:VereinfachteAngabe": Option[]
    Energieschirm: Option[]
    Energietraeger: Option[]
    Entfeuchtung: Option[]
    Fruchtgewicht: Option[]
    GWHAlter: Option[]
    GWHArt: Option[]
    Growbags: Option[]
    JungpflanzenZukauf: Option[]
    "Klipse:Material": Option[]
    Kultursystem: Option[]
    Nebenkultur: Option[]
    Nuetzlinge: Option[]
    Produktion: Option[]
    "Rispenbuegel:Material": Option[]
    "SchnuereRankhilfen:Material": Option[]
    SonstigeVerbrauchsmaterialien: Option[]
    Stromherkunft: Option[]
    Substrat: Option[]
    Transportsystem: Option[]
    Zusatzbelichtung: Option[]
}

/**
 * @type LookupState
 *
 * Contains the avaliable lookupvalues e.g. for user input fields.
 *
 * @property {boolean} isLoading - True, while loading the lookup values from the server
 * @property {LookupValues} lookupValues - The available lookup values
 */
export type LookupState = {
    isLoading: boolean,
    lookupValues: LookupValues
}

// Initialize lookup state
const initialState: LookupState = {
    isLoading: false,
    lookupValues: {
        AlterdesBedachungsmaterials: [],
        AnzahlTriebe: [],
        ArtdesStehwandmaterial: [],
        Bedachungsmaterial: [],
        Belichtungsstrom: [],
        Bewaesserungsart: [],
        Bodenfolien: [],
        "CO2-Herkunft": [],
        "Duengemittel:DetalierteAngabe": [],
        "Duengemittel:VereinfachteAngabe": [],
        Energieschirm: [],
        Energietraeger: [],
        Entfeuchtung: [],
        Fruchtgewicht: [],
        GWHAlter: [],
        GWHArt: [],
        Growbags: [],
        JungpflanzenZukauf: [],
        "Klipse:Material": [],
        Kultursystem: [],
        Nebenkultur: [],
        Nuetzlinge: [],
        Produktion: [],
        "Rispenbuegel:Material": [],
        "SchnuereRankhilfen:Material": [],
        SonstigeVerbrauchsmaterialien: [],
        Stromherkunft: [],
        Substrat: [],
        Transportsystem: [],
        Zusatzbelichtung: []
    }
}

/**
 * Dispatches any actions related to the lookup state.
 *
 * @param state - The current lookup state
 * @param action - The action to dispatch
 *
 * @returns The updated lookup state
 */
export default function (state: LookupState = initialState, action: any): LookupState {
    switch (action.type) {
        case LOOKUP_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case LOOKUP_LOADED:
            return {
                ...state,
                isLoading: false,
                lookupValues: action.payload
            }
        case LOOKUP_FAILED:
            return {
                ...state,
                isLoading: false,
                lookupValues: {
                    AlterdesBedachungsmaterials: [],
                    AnzahlTriebe: [],
                    ArtdesStehwandmaterial: [],
                    Bedachungsmaterial: [],
                    Belichtungsstrom: [],
                    Bewaesserungsart: [],
                    Bodenfolien: [],
                    "CO2-Herkunft": [],
                    "Duengemittel:DetalierteAngabe": [],
                    "Duengemittel:VereinfachteAngabe": [],
                    Energieschirm: [],
                    Energietraeger: [],
                    Entfeuchtung: [],
                    Fruchtgewicht: [],
                    GWHAlter: [],
                    GWHArt: [],
                    Growbags: [],
                    JungpflanzenZukauf: [],
                    "Klipse:Material": [],
                    Kultursystem: [],
                    Nebenkultur: [],
                    Nuetzlinge: [],
                    Produktion: [],
                    "Rispenbuegel:Material": [],
                    "SchnuereRankhilfen:Material": [],
                    SonstigeVerbrauchsmaterialien: [],
                    Stromherkunft: [],
                    Substrat: [],
                    Transportsystem: [],
                    Zusatzbelichtung: []
                }
            }
        case RESET_DATA:
            return initialState
        default:
            return state
    }
}