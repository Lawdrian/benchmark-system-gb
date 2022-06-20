import {GreenhouseData} from "../types/reduxTypes";

export default function validateGreenhouseData(data: GreenhouseData) {
    let tupleRegex = "\\(\\s*\\d+(((\\s*,\\s*\\d+(\\.\\d+)?)?)|(\\s*,\\s*))\\s*\\)";
    let fullRegex = "\\s*\\[\\s*(" + tupleRegex + "\\s*,\\s*)*" + tupleRegex + "\\s*\\]\\s*";
    let validationRegex = new RegExp(fullRegex);
    let fieldsToValidate = [
        "GWHArt",
        "GWHAlter",
        "Bedachungsmaterial",
        "AlterdesBedachungsmaterials",
        "ArtdesStehwandmaterial",
        "Energieschirm",
        "Produktion",
        "Kultursystem",
        "Transportsystem",
        "Fruchtgewicht",
        "Nebenkultur",
        "AnzahlTriebe",
        "Entfeuchtung",
        "Energietraeger",
        "Stromherkunft",
        "Zusatzbelichtung",
        "Belichtungsstrom",
        "CO2-Herkunft",
        "Duengemittel:DetalierteAngabe",
        "Duengemittel:VereinfachteAngabe",
        "Nuetzlinge",
        "Growbags",
        "Substrat",
        "SchnuereRankhilfen:Material",
        "Klipse:Material",
        "Rispenbuegel:Material",
        "Bewaesserungsart",
        "Bodenfolien",
        "SonstigeVerbrauchsmaterialien",
        "JungpflanzenZukauf"
    ]

    for (const field of fieldsToValidate) {
        if (!(field in data)) {
            console.warn("INTERNAL-ISSUE: GreenhouseData has no field'" + field + "'! Please update 'fieldsToValidate' ...");
        } else {
            // @ts-ignore --- Can ignore ts-warning, because we check the presence of the field above
            const isValid = validationRegex.test(data[field])
            if (!isValid) {
                throw new Error(
                    "Field '" + field + "' did not match the required string pattern: " +
                    "[((<int>,<float>)|(<int>,)|(<int>)), ...]"
                );
            }
        }
    }
}