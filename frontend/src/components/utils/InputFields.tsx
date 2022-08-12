/**
 * ###############################################################
 * This file contains multiple input fields which are used by the
 * inputpages (for Example CompanyInformation.tsx) These components
 * get their state provided by their parent and also save the input
 * values in the parent component
 *
 **/



import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField, {TextFieldProps} from "@mui/material/TextField";
import React, {ReactNode, useState} from "react";
import DynamicSelect, {DynamicSelectProps} from "./DynamicSelect";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DesktopDatePicker, DesktopDatePickerProps, LocalizationProvider} from '@mui/x-date-pickers';
import {
    FormControlLabel,
    InputLabel,
    Radio,
    RadioGroup,
    RadioGroupProps
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from '@mui/material/FormLabel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from "@mui/material/IconButton";
import {Option} from "../../reducers/lookup";

type InputFieldProps = {
    title: string
    label: string
}
type BaseInputFieldProps = InputFieldProps & {
    children?: ReactNode
}
// BaseInput component
export const BaseInputField = (props: BaseInputFieldProps) => {

    return(
        <Grid item container xs={6} direction="row">
            <Grid sx={{p:1}} item xs={6} component={Paper}>
                <Typography variant="h6"> {props.title} </Typography>
                <Typography paragraph={true}> {props.label} </Typography>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    {props.children}
                </Paper>
            </Grid>
        </Grid>
    )
}

// Datatypes that the elements of the input state can have

export type SelectionValue = {
    selectValue: number | null
    textFieldValue: number | null
    unitFieldValue?: number | null
}


// MeasureInput component
export type MeasureInputProps = InputFieldProps & {
    textFieldProps: TextFieldProps
}


export const MeasureInputField = (props: MeasureInputProps) => {

    return(
        <BaseInputField title={props.title} label={props.label}>
            <TextField
                type="number"
                onWheel={(event) => event.currentTarget.querySelector('input')?.blur()}
                {...props.textFieldProps}
                fullWidth
            />
        </BaseInputField>
    )
}

export type DateInputProps = InputFieldProps & {
    datePickerProps: DesktopDatePickerProps<any, any>
}

export const DateInputField = (props: DateInputProps) => {

    return(
        <BaseInputField title={props.title} label={props.label}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    maxDate={new Date()}
                    { ...props.datePickerProps }
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </BaseInputField>
    )

}


// SelectioBaseInput component
type SelectionBaseInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
    children?: ReactNode
}

const SelectionBaseInputField = (props: SelectionBaseInputProps) => {

    return(
        <BaseInputField title={props.title} label={props.label}>
            <FormControl fullWidth>
                <InputLabel id="amount-select-label">Auswahl</InputLabel>
                <DynamicSelect labelId="amount-select-label" label="Auswahl" {...props.selectProps} />
            </FormControl>
            {props.children}
        </BaseInputField>
    )
}


// SelectionInput component
export type SelectionInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
}

export const SelectionInputField = (props: SelectionInputProps) => {
   return <SelectionBaseInputField {...props} />
}


// SelectionAmountInput component
export type SelectionAmountInputProps = SelectionBaseInputProps & {
    textFieldProps: TextFieldProps
}

export const SelectionAmountInputField = (props: SelectionAmountInputProps) => {
    const {textFieldProps, ...baseInputProps} = props

    return (
        <SelectionBaseInputField {...baseInputProps}>
            <TextField type="number" placeholder="Menge" fullWidth sx={{mt: 2}} {...textFieldProps}/>
        </SelectionBaseInputField>
    )
}


// SelectionAmountUnitInput component
export type SelectionAmountUnitInputProps  = SelectionBaseInputProps & {
    textFieldProps: TextFieldProps,
    unitSelectProps: DynamicSelectProps<any>
}

export const SelectionAmountUnitInputField = (props: SelectionAmountUnitInputProps) => {
    const {textFieldProps, unitSelectProps, ...baseInputProps} = props;

    return (
        <SelectionBaseInputField {...baseInputProps}>
            <Grid container direction="row" marginTop={1} spacing={1}>
                <Grid item xs={6}>
                    <TextField type="number" placeholder="Menge" fullWidth {...textFieldProps} />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="unit-select-label">Einheit</InputLabel>
                        <DynamicSelect labelId="unit-select-label" label="Einheit" fullWidth {...unitSelectProps} />
                    </FormControl>
                </Grid>
            </Grid>
        </SelectionBaseInputField>
    );
}


// SelectionRadioInput component
export type SelectionRadioInputProps = InputFieldProps & {
    radioProps: RadioGroupProps
    children?: ReactNode
}

export const SelectionRadioInputField = (props: SelectionRadioInputProps) => {
    const {radioProps, ...baseInputProps} = props

    return (
        <BaseInputField {...baseInputProps}>
            <FormControl sx={{pl:1.5}}>
                <FormLabel id="radio-buttons-group-label">Auswahl</FormLabel>
                <RadioGroup row aria-labelledby="radio-buttons-group-label" {...radioProps}>
                    {props.children}
                </RadioGroup>
            </FormControl>
        </BaseInputField>
    )
}


// DynamicInput component
type DynamicInputValue = {
    id: number
    selectValue: number | null
    textFieldValue: number | null
    unitFieldValue?: number | null
}

type DynamicInputState = DynamicInputValue[]

export type DynamicInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
    textFieldProps: TextFieldProps
    onValueChange: (values: DynamicInputState) => void
    unitSelectProps?: DynamicSelectProps<any>
    initValues: SelectionValue[]
}

/**
 * This component is used for <strong>multi select inputs</strong>. It has one selection field and one text intput field. With a plus
 * button a new input section will be shown and with the minus button it can be deleted.
 *
 * @param {DynamicInputField} props This Type contains the InputFieldProps and multiple other ones:
 *       <p><strong>selectProps:</strong> lookupValues need to be specified in there for the selection field.</p>
 *      <p><strong>textFieldProps:</strong> No required props, can be included for styling the text input field.</p>
 *      <p><strong>onValueChange:</strong> Save the values of both the selection and text input field in the parent state.</p>
 *      <p><strong>initValues:</strong> Initialize the component with these values from the parent state.</p>
 * @return {ReactNode} One dynamic input field.
 */
export const DynamicInputField = (props: DynamicInputProps) => {
    let dynInitValues = [];
    for (let i = 0; i < props.initValues.length; i++) {
        dynInitValues.push({...props.initValues[i], id: i})
    }
    const [values, setValues] = useState<DynamicInputState>(dynInitValues)

    return(
            <>
                <Grid container item direction="column" xs={12}>
                    <Grid sx={{p:1}} item xs={12} component={Paper}>
                        <Typography variant="h6"> {props.title} </Typography>
                        <Typography paragraph={true}> {props.label} </Typography>
                    </Grid>
                </Grid>
                {values.map(value => {
                return (
                    <>
                        <Grid container item xs={12} spacing={8}>
                            <Grid item xs={2}>
                                <IconButton onClick={event => {
                                    const maxId = Math.max(...values.map(value => value.id))
                                    setValues([...values, {id: maxId+1, selectValue: null, textFieldValue: null}])
                                    props.onValueChange(values.slice())
                                }} size="large" color="primary" >
                                    <AddIcon />
                                </IconButton>
                                <IconButton onClick={(event) => {
                                        let idx = values.indexOf(value)
                                        values.splice(idx,1)
                                        setValues(values.slice())
                                        props.onValueChange(values.slice())
                                    }}
                                    disabled={values.length <= 1}
                                    size="large" color="primary"
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <FormControl fullWidth>
                                        <InputLabel id="amount-select-label">Auswahl</InputLabel>
                                        <DynamicSelect {...props.selectProps}
                                            onChange={(event) => {
                                                let idx = values.indexOf(value)
                                                values[idx] = {...value, selectValue: parseInt(event.target.value)}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.selectValue}
                                            fullWidth
                                            labelId="amount-select-label"
                                            label="Auswahl"
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <TextField {...props.textFieldProps}
                                        onChange={(event) => {
                                            let idx = values.indexOf(value)
                                            values[idx] = {...value, textFieldValue: parseInt(event.target.value)}
                                            setValues(values.slice())
                                            props.onValueChange(values.slice())
                                        }}
                                        value={value.textFieldValue}
                                        fullWidth
                                        type="number"
                                        placeholder="Menge"
                                    />
                                </Paper>
                            </Grid>
                            {props.unitSelectProps ?
                                <Grid item xs>
                                <Paper>
                                    <FormControl fullWidth>
                                        <InputLabel id="unit-select-label">Einheit</InputLabel>
                                        <DynamicSelect {...props.unitSelectProps}
                                            onChange={(event) => {
                                                let idx = values.indexOf(value)
                                                values[idx] = {...value, unitFieldValue: parseInt(event.target.value)}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.unitFieldValue}
                                            fullWidth
                                            labelId="unit-select-label"
                                            label="Einheit"
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid> : undefined}
                        </Grid>
                    </>
                )
            }
        )}
        </>
    )
}


// ConditionalRadio component
type ConditionalRadioBaseInputProps = InputFieldProps & {
    radioGroupProps: RadioGroupProps
    radioButtonValues: Option[]
    children?: ReactNode
}


/**
 * This component is used for <strong>conditional field inputs</strong>. This component has a title, label, radio button and will render its children below the header.
 * This is just the base component and will not be directly used. It is used by other components that implement further logic.
 *
 * @param {ConditionalRadioBaseInputProps} props This Type contains the InputFieldProps and multiple other ones:
 *       <p><strong>radioGroupProps:</strong> value contains the value of the currently selected radioButton . The onChange function is needed for updating
 *       the parents state.</p>
 *      <p><strong>radioButtonValues:</strong> Contains the lookupValues for the RadioButtons.</p>
 *      <p><strong>children:</strong>The children, that can be passed down to this component</p>
 * @return {ReactNode} One base conditional component.
 */
const ConditionalRadioBaseInputField = (props:ConditionalRadioBaseInputProps) => {

    return (
        <>
            <Grid container item direction="row" xs={12}>

                <Grid item container alignItems={"center"} xs={6}>
                    <Grid sx={{p:1}} item xs={6} component={Paper}>
                        <Typography variant="h6"> {props.title} </Typography>
                        <Typography paragraph={true}> {props.label} </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <RadioGroup sx={{ml: 8}} row={true} {...props.radioGroupProps}>
                            {props.radioButtonValues.map(option => {
                                return <FormControlLabel
                                    value={option.id}
                                    control={<Radio/>}
                                    label={option.values}
                                />
                            })}
                        </RadioGroup>
                    </Grid>
                </Grid>
            </Grid>
            {props.children}
        </>
    )
}

// ConditionalRadio component
export type SingleShowConditionalRadioInputProps = ConditionalRadioBaseInputProps & {
    showChildren: (value: any) => boolean
    children?: ReactNode
}

/**
 * This component relies on the ConditionalRadioBaseInputField. It only shows the child component, if the correct radio button
 * has been pressed.
 *
 * @param {SingleShowConditionalRadioInputProps} props This Type contains the ConditionalRadioBaseInputProps and multiple other ones:
 *       <p><strong>showChildren:</strong> Function, that determines which radio button is the correct one that will show the children.</p>
 *      <p><strong>children:</strong>Children, that will be rendered if the correct button has been selected.</p>
 * @return {ReactNode} One single show conditional component.
 */
export const SingleShowConditionalRadioInputField = (props: SingleShowConditionalRadioInputProps) => {
    const {showChildren, ...conditionalRadioBaseInputProps} = props
    return(
        <ConditionalRadioBaseInputField {...conditionalRadioBaseInputProps}>
            { props.showChildren(props.radioGroupProps.value) ? props.children : undefined }
        </ConditionalRadioBaseInputField>
    )
}

// ConditionalRadio component
export type SelectShowConditionalRadioInputProps = ConditionalRadioBaseInputProps & {
    showFirstChildren: (value: any) => boolean
    firstChildren:  ReactNode
    secondChildren: ReactNode
}

/**
 * This component relies on the ConditionalRadioBaseInputField. It either shows one or another child component, depending on which
 * radio button has been selected.
 *
 * @param {SingleShowConditionalRadioInputProps} props This Type contains the ConditionalRadioBaseInputProps and multiple other ones:
 *       <p><strong>showFirstChildren:</strong> Function, that determines which radio button will render which children.</p>
 *      <p><strong>firstChildren:</strong>Children, that will be rendered if the correct button has been selected.</p>
 *      <p><strong>secondChildren:</strong>Children, that will be rendered if the correct button has been selected.</p>
 * @return {ReactNode} One select show conditional component.
 */
export const SelectShowConditionalRadioInputField = (props: SelectShowConditionalRadioInputProps) => {
    const {firstChildren, secondChildren, ...conditionalRadioBaseInputProps} = props
    return(
        <ConditionalRadioBaseInputField {...conditionalRadioBaseInputProps}>
            { props.showFirstChildren(props.radioGroupProps.value) ? props.firstChildren : props.secondChildren }
        </ConditionalRadioBaseInputField>
    )
}