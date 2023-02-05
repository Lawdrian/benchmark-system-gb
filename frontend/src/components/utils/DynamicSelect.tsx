import React, {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectProps} from "@mui/material/Select";
import {Option, UnitValues} from "../../reducers/lookup";
import {DynamicInputValue} from "./input/InputFields";

export type DynamicSelectProps<T> = SelectProps<T> & {
    lookupValues: Option[]
}

const DynamicSelect = (props: DynamicSelectProps<any>) => {
    const {lookupValues, ...selectProps} = props
    return (
        <Select {...selectProps}>
            {generateMenuItems(lookupValues)}
        </Select>
    );
}



// These types and the component are only used for DynamicInputField component!
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


export const DynamicUnitSelect = (props: DynamicUnitSelectProps<any>) => {

    // This will call the updateUnits function upon render.(Selected Unit will be shown if one switches tab and back)
    useEffect(() => {
        updateUnits()
    },[])

    const {lookupValues,unitValues,optionGroup, allValues,activeValue, ...selectProps} = props

    const defaultOption:Option[] = [
                {id: 0, values: ""}]

    const [units, setUnits] = useState<Option[]>(defaultOption)

    let idx = allValues.indexOf(activeValue)


    const updateUnits = () => {

        let lookupNameRaw = lookupValues.find((lookupValue) => {
            if (activeValue.selectValue != null) {
                return lookupValue.id==activeValue.selectValue
            }
            })?.values.replaceAll(" ","")
        let lookupName:string = "\"" + lookupNameRaw + "\""
        let activeUnitValues = unitValues.selections[optionGroup as keyof typeof unitValues.selections]

        //console.log("lookupName: " + lookupName)
        //console.log("activeUnitValues: ")
        //console.log(activeUnitValues)
        //console.log(activeUnitValues[lookupName as keyof typeof activeUnitValues])

        Object.entries(activeUnitValues).find(([key, value]) => {
            if(!key.includes("\"")) lookupName=lookupName.replaceAll("\"","")
            if (key == lookupName) {
                //console.log("Funktioniert")
                //console.log(value)
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
