import React, {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectProps} from "@mui/material/Select";
import {DynamicInputValue} from "./InputFields";
import {Option, UnitValues} from "../../../types/reduxTypes";

export type DynamicSelectProps<T> = SelectProps<T> & {
    lookupValues: Option[]
}

/**
 * This functional component creates a drop-down menu input field.
 * @param props - Contains the values used as options for the drop-down menu
 */
const DynamicSelect = (props: DynamicSelectProps<any>) => {
    const {lookupValues, ...selectProps} = props
    return (
        <Select {...selectProps}>
            {generateMenuItems(lookupValues)}
        </Select>
    );
}

// these types and the component are only used for DynamicInputField component!
export type DynamicUnitSelectParentProps<T> = SelectProps<T> & {
    lookupValues: Option[],
    unitValues: UnitValues,
    optionGroup: string,
}

export type DynamicUnitSelectProps<T> = SelectProps<T> & {
    lookupValues: Option[],
    unitValues: UnitValues,
    optionGroup: string,
    allValues: DynamicInputValue[],
    activeValue: DynamicInputValue
}

/**
 * This functional component creates a drop-down menu for selecting a unit.
 * The available options of the drop-down menu depend on the selection of another component of type
 * {@link DynamicSelect}. The selected value of that component is used, to query the unitValues for the options to
 * display in this component.
 * @param props - Properties needed to use the component.
 */
export const DynamicUnitSelect = (props: DynamicUnitSelectProps<any>) => {

    // this will call the updateUnits function upon render. (Selected Unit will be shown if one switches tab and back)
    useEffect(() => {
        updateUnits()
    },[])

    const {lookupValues,unitValues,optionGroup, allValues,activeValue, ...selectProps} = props

    const defaultOption:Option[] = [
                {id: 0, values: ""}]

    const [units, setUnits] = useState<Option[]>(defaultOption)

    let idx = allValues.indexOf(activeValue)


    const updateUnits = () => {
        // find out the name of the selected option
        let lookupNameRaw = lookupValues.find((lookupValue) => {
            if (activeValue.selectValue != null) {
                return lookupValue.id == activeValue.selectValue
            }
            })?.values.replaceAll(" ","")
        let lookupName:string = "\"" + lookupNameRaw + "\""
        let activeUnitValues = unitValues.selections[optionGroup as keyof typeof unitValues.selections]

        // find the units, that belong to the selected option (lookupName)
        Object.entries(activeUnitValues).find(([key, value]) => {
            if(!key.includes("\"")) lookupName=lookupName.replaceAll("\"","")
            if (key == lookupName) {
                setUnits(value)
            }
        })
    }

    return (
        <Select {...selectProps} onOpen={()=>updateUnits()}>
            {generateMenuItems(units)}
        </Select>
    )
}


const generateMenuItems = (options: Option[]) => {
    return options.map(option => <MenuItem value={option.id}>{option.values}</MenuItem>)
}

export default DynamicSelect;
