import {GreenhouseData} from "../types/reduxTypes";

/**
 * Checks, if a given GreenhouseData object is valid.
 *
 * The object is valid, if all necessary fields follow the pattern:
 *
 * [((<int>,<float>,<float>)|(<int>,<float>)|(<int>,)|(<int>)), ...]
 *
 * If the object is invalid an error is thrown, else this function is a noop.
 *
 * @param data The data to validate
 */
export default function validateGreenhouseData(data: GreenhouseData) {
    // Define the regular expression to validate the necessary fields
    let tupleRegex = "\\(\\s*\\d+((((\\s*,\\s*\\d+(\\.\\d+)?){2,3})?)|(\\s*,\\s*))\\s*\\)"
    let fullRegex = "\\s*\\[\\s*(" + tupleRegex + "\\s*,\\s*)*" + tupleRegex + "\\s*\\]\\s*";
    let validationRegex = new RegExp(fullRegex);

    let fieldsToValidate = [
        "EinheitlicheWaermeversorgung",
        "GWHArt",
        "Bedachungsmaterial",
        "Stehwandmaterial",
        "Energieschirm",
        "EnergieschirmTyp",
        "Transportsystem",
        "Produktionstyp",
        "Kultursystem",
        "ZusaetzlichesHeizsystem",
        "ZusaetzlichesHeizsystemTyp",
        "10-30Gramm(Snack)",
        "30-100Gramm(Cocktail)",
        "100-150Gramm(Rispen)",
        ">150Gramm(Fleisch)",
        "Nebenkultur",
        "Entfeuchtung",
        "Energietraeger",
        "BHKW",
        "Stromherkunft",
        "Zusatzbelichtung",
        "Belichtungsstrom",
        "CO2-Herkunft",
        "Duengemittel:VereinfachteAngabe",
        "Duengemittel:DetaillierteAngabe",
        "Nuetzlinge",
        "GrowbagsKuebel",
        "Substrat",
        "SchnuereRankhilfen:Material",
        "Klipse:Material",
        "Rispenbuegel:Material",
        "Bewaesserungsart",
        "Bodenabdeckung",
        "Jungpflanzen:Zukauf",
        "Jungpflanzen:Substrat",
        "Verpackungsmaterial",
        "SonstigeVerbrauchsmaterialien",
        "ZusaetzlicherMaschineneinsatz",
        "BelichtungsstromEinheit",
        "Klipse",
        "Rispenbuegel"
    ]

    // Check every necessary field for a valid value
    for (const field of fieldsToValidate) {
        if (!(field in data)) {
            console.warn("INTERNAL-ISSUE: GreenhouseData has no field'" + field + "'! Please update 'fieldsToValidate' ...");
        } else {
            // @ts-ignore --- Can ignore ts-warning, because we check the presence of the field above
            const isValid = validationRegex.test(data[field])
            if (!isValid) {
                throw new Error(
                    "Field '" + field + "' did not match the required string pattern: " +
                    "[((<int>,<float>,<float>)|(<int>,<float>)|(<int>,)|(<int>)), ...]"
                );
            }
        }
    }
}