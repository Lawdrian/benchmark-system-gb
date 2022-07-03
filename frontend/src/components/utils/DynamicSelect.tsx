import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectProps} from "@mui/material/Select";
import {Option} from "../../reducers/lookup";

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

const generateMenuItems = (options: Option[]) => {
    return options.map(option => <MenuItem value={option.id}>{option.values}</MenuItem>)
}

export default DynamicSelect;
