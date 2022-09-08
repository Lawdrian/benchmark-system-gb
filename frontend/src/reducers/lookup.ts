/**
 * #############################################################################
 * lookup.ts: Defines reducers to dispatch actions generated by ../actions/lookup.ts
 * #############################################################################
 */
import {
    LOOKUP_FAILED,
    LOOKUP_LOADED,
    LOOKUP_LOADING,
    RESET_DATA, UNITS_FAILED, UNITS_LOADED, UNITS_LOADING
} from "../types/reduxTypes";

/**
 * @type Option
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
 * @type UnitValues
 *
 * A type to store the units for every input field in the database
 */
export type UnitValues = {
    measures: {
        "PLZ": Option[]
        "GWHAlter": Option[]
        "AlterEnergieschirm": Option[]
        "Stehwandhoehe": Option[]
        "Laenge": Option[]
        "Breite": Option[]
        "Kappenbreite": Option[]
        "Scheibenlaenge(Bedachung)": Option[]
        "AlterdesBedachungsmaterials": Option[]
        "AlterKultursystem": Option[]
        "Reihenabstand": Option[]
        "Kulturflaeche": Option[]
        "KulturBeginn": Option[]
        "KulturEnde": Option[]
        "Ertrag": Option[]
        "Pflanzdichte": Option[]
        "Nebenkulturdauer":Option[]
        "MittlereSolltemperaturTag": Option[]
        "MittlereSolltemperaturNacht": Option[]
        "KulturmassnahmeAusgeizen": Option[]
        "KulturmassnahmeAusblattenAnzahlMonat": Option[]
        "KulturmassnahmeAblassen": Option[]
        "Strom": Option[]
        "StromverbrauchBelichtungAnschlussleistung": Option[]
        "StromverbrauchBelichtungAnzahlLampen": Option[]
        "StromverbrauchBelichtungLaufzeitTag": Option[]
        "CO2-Zudosierung": Option[]
        "Fungizide": Option[]
        "Insektizide": Option[]
        "VolumenGrowbags": Option[]
        "LaengeGrowbags": Option[]
        "PflanzenproBag": Option[]
        "SchnuereRankhilfen:Laenge": Option[]
        "SchnuereRankhilfen:Wiederverwendung": Option[]
        "Klipse:Menge": Option[]
        "Klipse:Wiederverwendung": Option[]
        "Rispenbuegel:Menge": Option[]
        "Rispenbuegel:Wiederverwendung": Option[]
        "SonstigeVerbrauchsmaterialien:Wiederverwendung": Option[]
        "BodenfolienVerwendungsdauer": Option[]
        "Verpackungsmaterial:Karton": Option[]
        "Verpackungsmaterial:Plastik": Option[]
        "TransportderWare:Auslieferungen": Option[]
        "TransportderWare:Distanz": Option[]
        "JungpflanzenDistanz": Option[]
        "KulturmassnahmeAusblattenMenge": Option[]
    }
    selections: {
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
        ArtdesStehwandmaterial: {
            "Einfachglas": Option[]
            "Doppelglas": Option[]
            "Doppelstegplatte": Option[]
            "Dreifachstegplatte": Option[]
            "Einfachfolie": Option[]
            "Doppelfolie": Option[]
        }
        Energieschirm: {
            "kein": Option[]
            "einfach": Option[]
            "doppelt": Option[]
            "einfach,aluminisiert": Option[]
            "doppelt,aluminisiert": Option[]
        }
        Produktion: {
            "Konventionell": Option[]
            "Biologisch": Option[]
        }
        Kultursystem: {
            "Boden": Option[]
            "Hydroponikoffen": Option[]
            "Hydroponikgeschlossen": Option[]
        }
        Transportsystem: {
            "ja": Option[]
            "nein": Option[]
        }
        Fruchtgewicht: {
            "10-30": Option[]
            "30-100": Option[]
            "100-150": Option[]
            ">150": Option[]
        }
        Nebenkultur: {
            "ja": Option[]
            "nein": Option[]
        }
        AnzahlTriebe: {
            "1-fach": Option[]
            "2-fach": Option[]
            "3-fach": Option[]
            "4-fach": Option[]
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
            "Geothermie": Option[]
            "BHKW": Option[]
        }
        Stromherkunft: {
            "DeutscherStrommix": Option[]
            "Ã–kostrom(DurschnittDeutschland)": Option[]
            "Photovoltaik": Option[]
            "Windenergie(Land)": Option[]
            "Windenergie(See)": Option[]
            "Wasserkraft": Option[]
            "Tiefengeothermie": Option[]
            "Biomethan": Option[]
            "BHKW": Option[]
        }
        Zusatzbelichtung: {
            "ja": Option[]
            "nein": Option[]
        }
        Belichtungsstrom: {
            "ja": Option[]
            "nein": Option[]
        }
        "CO2-Herkunft": {
            "technischesCO2": Option[]
            "eigenesBHKW": Option[]
        }
        "Duengemittel:DetalierteAngabe": {
            "Ammoniumnitrat": Option[]
            "Kaliumnitrat(Kalisalpeter)": Option[]
            "Calciumnitratfluessig(Kalksalpeter)": Option[]
            "Calciumnitratfest": Option[]
            "Kaliumcholird,KCL,muriateofpotash": Option[]
            "Kaliumsulfat": Option[]
            "Monokaliumphosphat(Flory6)": Option[]
            "Borax": Option[]
            "EisenDDTPA3%": Option[]
            "EisenEDDHA6%": Option[]
            "25%CuKupfersulfat": Option[]
            "32%MnMangansulfat": Option[]
            "Natriummolybdat": Option[]
            "Zinksulfat": Option[]
            "Chlorbleichlauge": Option[]
            "Bittersalz": Option[]
            "Phosphorsaeure75%": Option[]
            "Salpetersaeure65%": Option[]
            "Salpetersaeure38%": Option[]
            "Kalksalpeter": Option[]
            "Magnesiumnitrat": Option[]
            "Magnesiumsulfat": Option[]
            "Kalisilikat": Option[]
            "Mangansulfat": Option[]
            "Cupfersulfat": Option[]
            "Ammoniummolybdat": Option[]
        }
        "Duengemittel:VereinfachteAngabe": {
            "A/BBag:Standardduengung": Option[]
            "Vinasse": Option[]
            "Pferdemist": Option[]
            "Kompost": Option[]
            "Hornmehl,-griess,-spaene": Option[]
            "Blutmehl": Option[]
            "Mist": Option[]
            "Gruenduengung": Option[]
            "Knochenmehl": Option[]
            "Pflanzkali": Option[]
            "org.Vollduenger": Option[]
        }
        Nuetzlinge: {
            "Hummeln": Option[]
            "Erzwespe(Encasia,Eretmocerus,odervergleichbares)": Option[]
            "Macrolophus(odervergleichbares)": Option[]
            "Schlupfwespen(Aphidius,Dacnusa,Diglyphus,odervergleichbares)": Option[]
            "Raubmilben(Phytoseiulus,Amblyseius,odervergleichbares)": Option[]
            "Gallmuecken(Aphidoletes,odervergleichbares)": Option[]
            "Florfliegen(Chrysoperla,odervergleichbares)": Option[]
            "FutterfuerMacrolophus(Ephestia-Eier,Sitrotroga-Eier,Artemia,odervergleichbares)": Option[]
        }
        Growbags: {
            "ja": Option[]
            "nein": Option[]
        }
        Substrat: {
            "Standardsubstrat": []
            "Kokos": []
            "Kompost": []
            "Steinwolle": []
            "Perlite": []
        }
        "SchnuereRankhilfen:Material": {
            "Kunststoff": Option[]
            "Jute": Option[]
            "Sisal": Option[]
            "Zellulose": Option[]
            "andereNachhaltige/abbaubareOption": Option[]
            "Bambusstab": Option[]
        }
        "Klipse:Material": {
            "Kunststoff": Option[]
            "Metall": Option[]
            "Nachhaltige/kompostierbareOption": Option[]
        }
        "Rispenbuegel:Material": {
            "Kunststoff": Option[]
            "Metall": Option[]
            "Nachhaltige/kompostierbareOption": Option[]
        }
        Bewaesserungsart: {
            "Tropfschlaeuche": Option[]
            "Bodensprenkler": Option[]
            "Handschlauch": Option[]
        }
        Bodenfolien: {
            "ja": Option[]
            "nein": Option[]
        }
        SonstigeVerbrauchsmaterialien: {
            "Folie": Option[]
            "Eisen": Option[]
            "Alluminium": Option[]
            "Kunststoff": Option[]
            "Holz": Option[]
        }
        JungpflanzenZukauf: {
            "ja": Option[]
            "nein": Option[]
        }
    }

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
    unitValues: UnitValues
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
    },
    unitValues: {
        measures: {
            PLZ: [],
            GWHAlter: [],
            AlterEnergieschirm: [],
            Stehwandhoehe: [],
            Laenge: [],
            Breite: [],
            Kappenbreite: [],
            "Scheibenlaenge(Bedachung)": [],
            AlterdesBedachungsmaterials: [],
            AlterKultursystem: [],
            Reihenabstand: [],
            Kulturflaeche: [],
            KulturBeginn: [],
            KulturEnde: [],
            Ertrag: [],
            Pflanzdichte: [],
            Nebenkulturdauer: [],
            MittlereSolltemperaturTag: [],
            MittlereSolltemperaturNacht: [],
            KulturmassnahmeAusgeizen: [],
            KulturmassnahmeAusblattenAnzahlMonat: [],
            KulturmassnahmeAblassen: [],
            Strom: [],
            StromverbrauchBelichtungAnschlussleistung: [],
            StromverbrauchBelichtungAnzahlLampen: [],
            StromverbrauchBelichtungLaufzeitTag: [],
            "CO2-Zudosierung": [],
            Fungizide: [],
            Insektizide: [],
            VolumenGrowbags: [],
            LaengeGrowbags: [],
            PflanzenproBag: [],
            "SchnuereRankhilfen:Laenge": [],
            "SchnuereRankhilfen:Wiederverwendung": [],
            "Klipse:Menge": [],
            "Klipse:Wiederverwendung": [],
            "Rispenbuegel:Menge": [],
            "Rispenbuegel:Wiederverwendung": [],
            "SonstigeVerbrauchsmaterialien:Wiederverwendung": [],
            BodenfolienVerwendungsdauer: [],
            "Verpackungsmaterial:Karton": [],
            "Verpackungsmaterial:Plastik": [],
            "TransportderWare:Auslieferungen": [],
            "TransportderWare:Distanz": [],
            JungpflanzenDistanz: [],
            KulturmassnahmeAusblattenMenge: [],
        },
        selections: {
        GWHArt: {
            Venlo: [],
            DeutscheNorm: [],
            Folientunnel: [],
        },
        Bedachungsmaterial: {
            Einfachglas: [],
            Doppelglas: [],
            Doppelstegplatte: [],
            Dreifachstegplatte: [],
            Einfachfolie: [],
            Doppelfolie: [],
        },
        ArtdesStehwandmaterial: {
            Einfachglas: [],
            Doppelglas: [],
            Doppelstegplatte: [],
            Dreifachstegplatte: [],
            Einfachfolie: [],
            Doppelfolie: [],
        },
        Energieschirm: {
            kein: [],
            einfach: [],
            doppelt: [],
            "einfach,aluminisiert": [],
            "doppelt,aluminisiert": [],
        },
        Produktion: {
            Konventionell: [],
            Biologisch: [],
        },
        Kultursystem: {
            Boden: [],
            Hydroponikoffen: [],
            Hydroponikgeschlossen: [],
        },
        Transportsystem: {
            ja: [],
            nein: [],
        },
        Fruchtgewicht: {
            "10-30": [],
            "30-100": [],
            "100-150": [],
            ">150": [],
        },
        Nebenkultur: {
            ja: [],
            nein: [],
        },
        AnzahlTriebe: {
            "1-fach": [],
            "2-fach": [],
            "3-fach": [],
            "4-fach": [],
        },
        Entfeuchtung: {
            ja: [],
            nein: [],
        },
        Energietraeger: {
            Erdgas: [],
            Heizoel: [],
            Steinkohle: [],
            Braunkohle: [],
            Hackschnitzel: [],
            Biogas: [],
            Geothermie: [],
            BHKW: [],
        },
        Stromherkunft: {
            DeutscherStrommix: [],
            "Ã–kostrom(DurschnittDeutschland)": [],
            Photovoltaik: [],
            "Windenergie(Land)": [],
            "Windenergie(See)": [],
            Wasserkraft: [],
            Tiefengeothermie: [],
            Biomethan: [],
            BHKW: [],
        },
        Zusatzbelichtung: {
            ja: [],
            nein: [],
        },
        Belichtungsstrom: {
            ja: [],
            nein: [],
        },
        "CO2-Herkunft": {
            technischesCO2: [],
            eigenesBHKW: [],
        },
        "Duengemittel:DetalierteAngabe": {
            Ammoniumnitrat: [],
            "Kaliumnitrat(Kalisalpeter)": [],
            "Calciumnitratfluessig(Kalksalpeter)": [],
            Calciumnitratfest: [],
            "Kaliumcholird,KCL,muriateofpotash": [],
            Kaliumsulfat: [],
            "Monokaliumphosphat(Flory6)": [],
            Borax: [],
            "EisenDDTPA3%": [],
            "EisenEDDHA6%": [],
            "25%CuKupfersulfat": [],
            "32%MnMangansulfat": [],
            "Natriummolybdat": [],
            "Zinksulfat": [],
            "Chlorbleichlauge": [],
            "Bittersalz": [],
            "Phosphorsaeure75%": [],
            "Salpetersaeure65%": [],
            "Salpetersaeure38%": [],
            "Kalksalpeter": [],
            Magnesiumnitrat: [],
            Magnesiumsulfat: [],
            Kalisilikat: [],
            Mangansulfat: [],
            Cupfersulfat: [],
            Ammoniummolybdat: [],
        },
        "Duengemittel:VereinfachteAngabe": {
            "A/BBag:Standardduengung": [],
            Vinasse: [],
            Pferdemist: [],
            Kompost: [],
            "Hornmehl,-griess,-spaene": [],
            Blutmehl: [],
            Mist: [],
            Gruenduengung: [],
            Knochenmehl: [],
            Pflanzkali: [],
            "org.Vollduenger": [],
        },
        Nuetzlinge: {
            Hummeln: [],
            "Erzwespe(Encasia,Eretmocerus,odervergleichbares)": [],
            "Macrolophus(odervergleichbares)": [],
            "Schlupfwespen(Aphidius,Dacnusa,Diglyphus,odervergleichbares)": [],
            "Raubmilben(Phytoseiulus,Amblyseius,odervergleichbares)": [],
            "Gallmuecken(Aphidoletes,odervergleichbares)": [],
            "Florfliegen(Chrysoperla,odervergleichbares)": [],
            "FutterfuerMacrolophus(Ephestia-Eier,Sitrotroga-Eier,Artemia,odervergleichbares)": [],
        },
        Growbags: {
            ja: [],
            nein: [],
        },
        Substrat: {
            Standardsubstrat: [],
            Kokos: [],
            Kompost: [],
            Steinwolle: [],
            Perlite: [],
        },
        "SchnuereRankhilfen:Material": {
            Kunststoff: [],
            Jute: [],
            Sisal: [],
            Zellulose: [],
            "andereNachhaltige/abbaubareOption": [],
            Bambusstab: [],
        },
        "Klipse:Material": {
            Kunststoff: [],
            Metall: [],
            "Nachhaltige/kompostierbareOption": [],
        },
        "Rispenbuegel:Material": {
            Kunststoff: [],
            Metall: [],
            "Nachhaltige/kompostierbareOption": [],
        },
        Bewaesserungsart: {
            Tropfschlaeuche: [],
            Bodensprenkler: [],
            Handschlauch: [],
        },
        Bodenfolien: {
            ja: [],
            nein: [],
        },
        SonstigeVerbrauchsmaterialien: {
            Folie: [],
            Eisen: [],
            Alluminium: [],
            Kunststoff: [],
            Holz: [],
        },
        JungpflanzenZukauf: {
            ja: [],
            nein: [],
        }
    }
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
        case UNITS_LOADING:
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
        case UNITS_LOADED:
            return {
                ...state,
                isLoading: false,
                unitValues: action.payload
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
        case UNITS_FAILED:
        case RESET_DATA:
            return initialState
        default:
            return state
    }
}