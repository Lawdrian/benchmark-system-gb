import {DynamicInputValue, MeasureValue} from "../components/utils/inputPage/InputFields";
import {Option, UnitValues} from "../reducers/lookup";
import {GreenhouseData} from "../types/reduxTypes";
import {DataToSubmit} from "../components/pages/PageInputData";


export const parseToFloat = (value: string): number|null => {

    const num = parseFloat(value)
    if (isNaN(num)) return null
    return num
}


// Function that decides if an input field of the dynamic input component should set the error tag or not
export const showDynamicMeasureInputError = (value: MeasureValue, submissionSuccess: boolean|null): boolean => {
    if ((value.value == null || value.value == 0) && submissionSuccess == false) return true
    return false
}

export const showDynamicSelectInputError = (value: number|null, submissionSuccess: boolean|null): boolean => {
        if ((value == null || value == 0) && submissionSuccess == false) return true
        return false
}

export const isEmptyDynamicInputField = (value:DynamicInputValue): boolean => {
    if (value.textFieldValue.value == null &&
        value.textFieldValue.unit == null &&
        value.selectValue == null &&
        value.textField2Value == null
    ) return true
    return false
}

/**
 *  findOptionId()
 *  This function finds the id of an option by using the display name of the option
 * @param lookupValues the lookupValues of one optiongroup
 * @param wantedOptionName the name of the option looked for
 *
 * @return the unit id or null if nothing was found
 */
export const findOptionId = (lookupValues: Option[], wantedOptionName: string): number|null => {
    console.log(wantedOptionName)
    console.log(lookupValues)
    let trueOptions = lookupValues.filter(option => option.values.toUpperCase() == wantedOptionName.toUpperCase());
    if (trueOptions.length > 0) {
        console.log(trueOptions)
        return trueOptions[0].id}
    else return null
}


/**
 *  findOptionUnitId()
 *  This function finds the unit id of an option by using its id
 * @param optionId id of an option
 * @param optionGroup the name of the optiongroup that the option belongs to
 * @param lookupValues the lookupValues of one optiongroup
 * @param unitValues all unitValues
 *
 * @return the unit id or null if nothing was found
 */
export const findOptionUnitId = (optionId: number|null, optionGroup: string, lookupValues: Option[], unitValues: UnitValues): number|null => {
    if (optionId == null) return null
    // Find the name of the option that belongs to the optionId
    let lookupNameRaw = lookupValues.find((lookupValue: Option) => {return lookupValue.id==optionId})?.values.replaceAll(" ","")
    let lookupName:string = "\"" + lookupNameRaw + "\""
    let options = unitValues.selections[optionGroup as keyof typeof unitValues.selections]
    // Search through all options of the optiongroup and find the option with the same name as lookupName
    const selectedOption = Object.entries(options).find(([key, value]) => {
        if (!key.includes("\"")) lookupName = lookupName.replaceAll("\"", "")
        if (key == lookupName) return true
        return null
    })
    if(selectedOption != undefined) {
        return selectedOption[1][0].id
    }
    return null
}

/**
 * This function is used for parsing a measureTuple to the correct data struct
 *
 * @param tuple:string The tuple that needs to be parsed
 *
 * @return {ReactNode} {value: number, unit: number} | {value: null, unit: null}
 */
const parseMeasureTuple = (tuple:string) => {
    const measure = JSON.parse(tuple)
    if(measure[0] == [0.000,0]) {
        return {value: null, unit: null}
    }
    return {value: measure[0], unit: measure[1]}
}

/**
 * This function is used for parsing a selectionTuple to the correct data struct
 *
 * @param tuple:string The tuple that needs to be parsed
 *
 * @return {ReactNode} number | null | {selectValue: number, textFieldValue: {value: number, unit: number}} |
 *                     {selectValue: number, textFieldValue: {value: number, unit: number}, textField2Value: number}
 */
const parseSelectionTuple = (tuple:string) => {
    const selection = JSON.parse(tuple)

    if(selection[0][0] == null) {
        return null
    }

    if(selection[0].length == 1) {
        return selection[0][0]
    }
    else if(selection[0].length == 3) {
        let parsedSelection: { selectValue: number, textFieldValue: { value: number, unit: number }}[] = []
        selection.forEach( (value: number[]) => {parsedSelection.push({selectValue: value[0], textFieldValue: { value: value[1], unit: value[2]}})});
        return parsedSelection
    }
    else if(selection[0].length == 4) {
        let parsedSelection: { selectValue: number, textFieldValue: { value: number, unit: number }, textField2Value: number }[] = []
        selection.forEach( (value: number[]) => {parsedSelection.push({selectValue: value[0], textFieldValue: { value: value[1], unit: value[2]}, textField2Value: value[3]})});
        return parsedSelection
    }
    else {
        throw new Error("Selection Tuple has the wrong format!")
    }
}

/**
 * This function is used for parsing a dateTuple to the correct data struct
 *
 * @param tuple:string The tuple that needs to be parsed
 *
 * @return {ReactNode} {value: Date, unit: number} | {value: null, unit: null}
 */
const parseDateTuple = (tuple:string) => {
    const age = JSON.parse(tuple)
    if (age[0] == 0) {
        return {value: null, unit: null}
    }
    const today = new Date()
    return {value: new Date(today.getFullYear() - age[0], today.getMonth(), today.getDay()), unit: age[1]}
}


export const parseStringToArray = (greenhouse:string) => {
    return greenhouse.replaceAll("[","").replaceAll("]","").split(",")
}

/**
 * This function receives a GreenhouseData object and maps it to the state object used for input page
 *
 * @param tuple:string object of type GreenhouseData
 *
 * @return {ReactNode} object
 */
export const fillInputState = (initialDataset: GreenhouseData) => {

    return({
        companyInformation: {
            gewaechshausName: parseStringToArray(initialDataset.greenhouse_name)[0],
            datum: new Date(Date.now()),
            plz: parseMeasureTuple(initialDataset.PLZ),
            land: parseSelectionTuple(initialDataset.Land) ?? null,
            region: parseSelectionTuple(initialDataset.Region) ?? null,
            gwhFlaeche: parseMeasureTuple(initialDataset.GWHFlaeche),
            nutzflaeche: parseMeasureTuple(initialDataset.Nutzflaeche),
            gwhArt: parseSelectionTuple(initialDataset.GWHArt) ?? null,
            gwhAlter: parseDateTuple(initialDataset.GWHAlter),
            bedachungsmaterial: parseSelectionTuple(initialDataset.Bedachungsmaterial) ?? null,
            bedachungsmaterialAlter: parseDateTuple(initialDataset.AlterBedachungsmaterial),
            stehwandmaterial: parseSelectionTuple(initialDataset.Stehwandmaterial) ?? null,
            stehwandmaterialAlter: parseDateTuple(initialDataset.AlterStehwandmaterial),
            energieschirm: parseSelectionTuple(initialDataset.Energieschirm) ?? null,
            energieschirmTyp: parseSelectionTuple(initialDataset.EnergieschirmTyp) ?? null,
            energieschirmAlter: parseDateTuple(initialDataset.AlterEnergieschirm),
            stehwandhoehe: parseMeasureTuple(initialDataset.Stehwandhoehe),
            laenge: parseMeasureTuple(initialDataset.Laenge),
            breite: parseMeasureTuple(initialDataset.Breite),
            kappenbreite: parseMeasureTuple(initialDataset.Kappenbreite),
            scheibenlaenge: parseMeasureTuple(initialDataset.Scheibenlaenge),
            reihenabstand: parseMeasureTuple(initialDataset["Reihenabstand(Rinnenabstand)"]),
            vorwegbreite: parseMeasureTuple(initialDataset.Vorwegbreite),
            bodenabdeckung: parseSelectionTuple(initialDataset.Bodenabdeckung) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            heizsystem: parseSelectionTuple(initialDataset.Heizsystem) ?? null,
            heizsystemAlter: parseDateTuple(initialDataset.AlterHeizsystem),
            produktionsweise: parseSelectionTuple(initialDataset.Produktionstyp) ?? null,
            produktionssystem: parseSelectionTuple(initialDataset.Produktionssystem) ?? null,
            produktionssystemAlter: parseDateTuple(initialDataset.AlterProduktionssystem),
            bewaesserArt: parseSelectionTuple(initialDataset.Bewaesserungsart) ?? null,
            zusaetzlichesHeizsystem: parseSelectionTuple(initialDataset.ZusaetzlichesHeizsystem) ?? null,
            zusaetzlichesHeizsystemTyp: parseSelectionTuple(initialDataset.ZusaetzlichesHeizsystemTyp) ?? null,
            zusaetzlichesHeizsystemAlter: parseDateTuple(initialDataset.AlterZusaetzlichesHeizsystem),
        },
        cultureInformation: {
            snack: parseSelectionTuple(initialDataset["10-30Gramm(Snack)"]) ?? null,
            snackReihenanzahl: parseMeasureTuple(initialDataset.SnackReihenanzahl),
            snackPflanzenabstand: parseMeasureTuple(initialDataset.SnackPflanzenabstandInDerReihe),
            snackTriebzahl: parseMeasureTuple(initialDataset.SnackTriebzahl),
            snackErtragJahr: parseMeasureTuple(initialDataset.SnackErtragJahr),
            cocktail: parseSelectionTuple(initialDataset["30-100Gramm(Cocktail)"]) ?? null,
            cocktailReihenanzahl: parseMeasureTuple(initialDataset.CocktailReihenanzahl),
            cocktailPflanzenabstand: parseMeasureTuple(initialDataset.CocktailPflanzenabstandInDerReihe),
            cocktailTriebzahl: parseMeasureTuple(initialDataset.CocktailTriebzahl),
            cocktailErtragJahr: parseMeasureTuple(initialDataset.CocktailErtragJahr),
            rispen: parseSelectionTuple(initialDataset["100-150Gramm(Rispen)"]) ?? null,
            rispenReihenanzahl: parseMeasureTuple(initialDataset.RispenReihenanzahl),
            rispenPflanzenabstand: parseMeasureTuple(initialDataset.RispenPflanzenabstandInDerReihe),
            rispenTriebzahl: parseMeasureTuple(initialDataset.RispenTriebzahl),
            rispenErtragJahr: parseMeasureTuple(initialDataset.RispenErtragJahr),
            fleisch: parseSelectionTuple(initialDataset[">150Gramm(Fleisch)"]) ?? null,
            fleischReihenanzahl: parseMeasureTuple(initialDataset.FleischReihenanzahl),
            fleischPflanzenabstand: parseMeasureTuple(initialDataset.FleischPflanzenabstandInDerReihe),
            fleischTriebzahl: parseMeasureTuple(initialDataset.FleischTriebzahl),
            fleischErtragJahr: parseMeasureTuple(initialDataset.FleischErtragJahr),
            kulturBeginn: parseMeasureTuple(initialDataset.KulturBeginn),
            kulturEnde: parseMeasureTuple(initialDataset.KulturEnde),
            nebenkultur: parseSelectionTuple(initialDataset.Nebenkultur) ?? null,
            nebenkulturBeginn: parseMeasureTuple(initialDataset.NebenkulturBeginn),
            nebenkulturEnde: parseMeasureTuple(initialDataset.NebenkulturEnde),
        },
        energyConsumption: {
            waermeversorgung: parseSelectionTuple(initialDataset.Waermeversorgung) ?? null,
            waermeteilungFlaeche: parseMeasureTuple(initialDataset.WaermeteilungFlaeche),
            energietraeger: parseSelectionTuple(initialDataset.Energietraeger) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            stromherkunft: parseSelectionTuple(initialDataset.Stromherkunft) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            zusatzbelichtung: parseSelectionTuple(initialDataset.Zusatzbelichtung) ?? null,
            belichtungsstrom: parseSelectionTuple(initialDataset.Belichtungsstrom) ?? null,
            belichtungsstromEinheit: parseSelectionTuple(initialDataset.BelichtungsstromEinheit) ?? null,
            belichtungsstromStromverbrauch: parseMeasureTuple(initialDataset["Belichtung:Stromverbrauch"]),
            belichtungsstromAnzLampen: parseMeasureTuple(initialDataset["Belichtung:AnzahlLampen"]),
            belichtungsstromAnschlussleistung: parseMeasureTuple(initialDataset["Belichtung:AnschlussleistungProLampe"]),
            belichtungsstromLaufzeitJahr: parseMeasureTuple(initialDataset["Belichtung:LaufzeitProJahr"]),
        },
        waterUsage: {
            vorlaufmengeGesamt: parseMeasureTuple(initialDataset.VorlaufmengeGesamt),
            vorlaufmengeAnteile: parseSelectionTuple(initialDataset.VorlaufmengeAnteile) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            restwasser: parseMeasureTuple(initialDataset.Restwasser)
        },
        helpingMaterials: {
            co2Herkunft: parseSelectionTuple(initialDataset["CO2-Herkunft"]) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            duengemittelSimple: parseSelectionTuple(initialDataset["Duengemittel:VereinfachteAngabe"]) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            duengemittelDetail: parseSelectionTuple(initialDataset["Duengemittel:DetaillierteAngabe"]) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            fungizideKg: parseMeasureTuple(initialDataset.FungizideKg),
            fungizideLiter: parseMeasureTuple(initialDataset.FungizideLiter),
            insektizideKg: parseMeasureTuple(initialDataset.InsektizideKg),
            insektizideLiter: parseMeasureTuple(initialDataset.InsektizideLiter),
        },
        companyMaterials: {
            growbagsKuebel: parseSelectionTuple(initialDataset.GrowbagsKuebel) ?? null,
            growbagsKuebelSubstrat: parseSelectionTuple(initialDataset.Substrat) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            kuebelVolumenProTopf: parseMeasureTuple(initialDataset["Kuebel:VolumenProTopf"]),
            kuebelJungpflanzenProTopf: parseMeasureTuple(initialDataset["Kuebel:JungpflanzenProTopf"]),
            kuebelAlter: parseMeasureTuple(initialDataset["Kuebel:Alter"]),
            schnur: parseSelectionTuple(initialDataset.Schnur) ?? null,
            schnurMaterial: parseSelectionTuple(initialDataset["SchnuereRankhilfen:Material"]) ?? null,
            schnurLaengeProTrieb: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Laenge"]),
            schnurWiederverwendung: parseMeasureTuple(initialDataset["SchnuereRankhilfen:Wiederverwendung"]),
            klipse: parseSelectionTuple(initialDataset.Klipse) ?? null,
            klipseMaterial: parseSelectionTuple(initialDataset["Klipse:Material"]) ?? null,
            klipseAnzProTrieb: parseMeasureTuple(initialDataset["Klipse:AnzahlProTrieb"]),
            klipseWiederverwendung: parseMeasureTuple(initialDataset["Klipse:Wiederverwendung"]),
            rispenbuegel: parseSelectionTuple(initialDataset.Rispenbuegel) ?? null,
            rispenbuegelMaterial: parseSelectionTuple(initialDataset["Rispenbuegel:Material"]) ?? null,
            rispenbuegelAnzProTrieb: parseMeasureTuple(initialDataset["Rispenbuegel:AnzahlProTrieb"]),
            rispenbuegelWiederverwendung: parseMeasureTuple(initialDataset["Rispenbuegel:Wiederverwendung"]),
            jungpflanzenZukauf: parseSelectionTuple(initialDataset["Jungpflanzen:Zukauf"]) ?? null,
            jungpflanzenDistanz: parseMeasureTuple(initialDataset["Jungpflanzen:Distanz"]),
            jungpflanzenSubstrat: parseSelectionTuple(initialDataset["Jungpflanzen:Substrat"]) ?? null,
            verpackungsmaterial: parseSelectionTuple(initialDataset.Verpackungsmaterial) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            anzahlNutzungenMehrwegsteigen: parseMeasureTuple(initialDataset["Verpackungsmaterial:AnzahlMehrwegsteigen"]),
            sonstVerbrauchsmaterialien: parseSelectionTuple(initialDataset.SonstigeVerbrauchsmaterialien) ?? [{selectValue: null, textFieldValue: {value: null, unit: null}, textField2Value: null}],
        }
    })
}

export const emptyDataset: DataToSubmit = {
        companyInformation: {
            gewaechshausName: null,
            datum: null,
            plz: {value: null, unit: null},
            land: null,
            region: null,
            gwhFlaeche: {value: null, unit: null},
            nutzflaeche: {value: null, unit: null},
            gwhArt: null,
            gwhAlter: {value: null, unit: null},
            bedachungsmaterial: null,
            bedachungsmaterialAlter: {value: null, unit: null},
            stehwandmaterial: null,
            stehwandmaterialAlter: {value: null, unit: null},
            energieschirm: null,
            energieschirmTyp: null,
            energieschirmAlter: {value: null, unit: null},
            stehwandhoehe: {value: null, unit: null},
            laenge: {value: null, unit: null},
            breite: {value: null, unit: null},
            kappenbreite: {value: null, unit: null},
            scheibenlaenge: {value: null, unit: null},
            reihenabstand: {value: null, unit: null},
            vorwegbreite: {value: null, unit: null},
            bodenabdeckung: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            heizsystem: null,
            heizsystemAlter: {value: null, unit: null},
            produktionsweise: null,
            produktionssystem: null,
            produktionssystemAlter: {value: null, unit: null},
            bewaesserArt: null,
            zusaetzlichesHeizsystem: null,
            zusaetzlichesHeizsystemTyp: null,
            zusaetzlichesHeizsystemAlter: {value: null, unit: null},
        },
        cultureInformation: {
            snack: null,
            snackReihenanzahl: {value: null, unit: null},
            snackPflanzenabstand: {value: null, unit: null},
            snackTriebzahl: {value: null, unit: null},
            snackErtragJahr: {value: null, unit: null},
            cocktail: null,
            cocktailReihenanzahl: {value: null, unit: null},
            cocktailPflanzenabstand: {value: null, unit: null},
            cocktailTriebzahl: {value: null, unit: null},
            cocktailErtragJahr: {value: null, unit: null},
            rispen: null,
            rispenReihenanzahl: {value: null, unit: null},
            rispenPflanzenabstand: {value: null, unit: null},
            rispenTriebzahl: {value: null, unit: null},
            rispenErtragJahr: {value: null, unit: null},
            fleisch: null,
            fleischReihenanzahl: {value: null, unit: null},
            fleischPflanzenabstand: {value: null, unit: null},
            fleischTriebzahl: {value: null, unit: null},
            fleischErtragJahr: {value: null, unit: null},
            kulturBeginn: {value: null, unit: null},
            kulturEnde: {value: null, unit: null},
            nebenkultur: null,
            nebenkulturBeginn: {value: null, unit: null},
            nebenkulturEnde: {value: null, unit: null},
        },
        energyConsumption: {
            waermeversorgung: null,
            waermeteilungFlaeche: {value: null, unit: null},
            energietraeger: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            stromherkunft: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            zusatzbelichtung: null,
            belichtungsstrom: null,
            belichtungsstromEinheit: null,
            belichtungsstromStromverbrauch: {value: null, unit: null},
            belichtungsstromAnzLampen: {value: null, unit: null},
            belichtungsstromAnschlussleistung: {value: null, unit: null},
            belichtungsstromLaufzeitJahr: {value: null, unit: null},
        },
        waterUsage: {
            vorlaufmengeGesamt: {value: null, unit: null},
            vorlaufmengeAnteile: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            restwasser: {value: null, unit: null},
        },
        helpingMaterials: {
            co2Herkunft: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            duengemittelSimple: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            duengemittelDetail: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            fungizideKg: {value: null, unit: null},
            fungizideLiter: {value: null, unit: null},
            insektizideKg: {value: null, unit: null},
            insektizideLiter: {value: null, unit: null},
        },
        companyMaterials: {
            growbagsKuebel: null,
            growbagsKuebelSubstrat: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            kuebelVolumenProTopf: {value: null, unit: null},
            kuebelJungpflanzenProTopf: {value: null, unit: null},
            kuebelAlter: {value: null, unit: null},
            schnur: null,
            schnurMaterial: null,
            schnurLaengeProTrieb: {value: null, unit: null},
            schnurWiederverwendung: {value: null, unit: null},
            klipse: null,
            klipseMaterial: null,
            klipseAnzProTrieb: {value: null, unit: null},
            klipseWiederverwendung: {value: null, unit: null},
            rispenbuegel: null,
            rispenbuegelMaterial: null,
            rispenbuegelAnzProTrieb: {value: null, unit: null},
            rispenbuegelWiederverwendung: {value: null, unit: null},
            jungpflanzenZukauf: null,
            jungpflanzenDistanz: {value: null, unit: null},
            jungpflanzenSubstrat: null,
            verpackungsmaterial: [{selectValue: null, textFieldValue: {value: null, unit: null}}],
            anzahlNutzungenMehrwegsteigen: {value: null, unit: null},
            sonstVerbrauchsmaterialien: [{
                selectValue: null,
                textFieldValue: {value: null, unit: null},
                textField2Value: null
            }],
        }
    }
