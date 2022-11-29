import {DynamicInputValue, MeasureValue} from "../components/utils/inputPage/InputFields";
import {Option, UnitValues} from "../reducers/lookup";


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

