import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING,
    RESET_DATA
} from "../types/reduxTypes";

type Option = {
    id: number
    values: string
}

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

export type LookupState = {
    isLoading: boolean,
    lookupValues: LookupValues
}

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