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
import React, {ReactNode, useRef, useState} from "react";
import DynamicSelect, {
    DynamicSelectProps,
    DynamicUnitSelect,
    DynamicUnitSelectParentProps,
} from "./DynamicSelect";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DesktopDatePicker, DesktopDatePickerProps, LocalizationProvider} from '@mui/x-date-pickers';
import {
    FormControlLabel, InputAdornment,
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
import {
    findOptionUnitId, isEmptyDynamicInputField,
    parseToFloat,
    showDynamicMeasureInputError,
    showDynamicSelectInputError
} from "../../../helpers/InputHelpers";
import {Option, UnitValues} from "../../../types/reduxTypes";

type InputFieldProps = {
    title: string
    label: string
    optional?: boolean
}
type BaseInputFieldProps = InputFieldProps & {
    children?: ReactNode
}

const optionalColor = "gray"

/**
 * Layout component that acts as a wrapper for input fields
 * @param props - Properties to fill the component
 */
export const BaseInputField = (props: BaseInputFieldProps) => {
    return(
        <Grid item container xs={6} direction="row">
            <Grid sx={{p:1}} item xs={6} component={Paper}>
                {props.optional ?
                    <Typography variant="h6" color={optionalColor}> {props.title} (optional)</Typography> :
                    <Typography variant="h6"> {props.title} </Typography>
                }
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

// datatypes that the elements of the input state can have
export type SelectionValue = {
    selectValue: number | null
    textFieldValue: MeasureValue
    textField2Value?: number | null
}

export type DateValue = {
    value: Date | null
    unit: number | null
}

export type MeasureValue = {
    value: number | null
    unit: number | null
}


export type MeasureInputProps = InputFieldProps & {
    textFieldProps: TextFieldProps,
    unitName?: string | null
}

export const MeasureInputField = (props: MeasureInputProps) => {
    return(
        <BaseInputField title={props.title} label={props.label} optional={props.optional}>
            <TextField
                type="number"
                placeholder='Menge'
                inputProps={{min:1}}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{props.unitName ?? ""}</InputAdornment>,
                }}
                onWheel={(event) => event.currentTarget.querySelector('input')?.blur()}
                {...props.textFieldProps}
                fullWidth
            />
        </BaseInputField>
    )
}


/*--------------------------------------------------------------------------------------------------------------------*/
export type MeasureUnitInputProps = MeasureInputProps & {
    textFieldProps: TextFieldProps,
    selectProps: DynamicSelectProps<any>
}

export const MeasureUnitInputField = (props: MeasureUnitInputProps) => {
    return(
        <BaseInputField title={props.title} label={props.label} optional={props.optional}>
            <TextField
                type="number"
                label='Menge'
                onWheel={(event) => event.currentTarget.querySelector('input')?.blur()}
                {...props.textFieldProps}
                fullWidth
                InputProps={{
                    endAdornment: <InputAdornment position="end">{props.unitName}</InputAdornment>,
                }}
            />
            <FormControl fullWidth sx={{marginTop:3}}>
                <InputLabel id="unit-select-label">Einheit</InputLabel>
                <DynamicSelect labelId="unit-select-label" label="Einheit" {...props.selectProps}/>
            </FormControl>
        </BaseInputField>
    )
}

/*--------------------------------------------------------------------------------------------------------------------*/
export type DateInputProps = InputFieldProps & {
    datePickerProps: DesktopDatePickerProps<any, any>
    showError: boolean
}

export const DateInputField = (props: DateInputProps) => {
    return(
        <BaseInputField title={props.title} label={props.label} optional={props.optional}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    maxDate={new Date()}
                    { ...props.datePickerProps }
                    renderInput={(params) => <TextField {...params} error={props.showError} />}
                />
            </LocalizationProvider>
        </BaseInputField>
    )

}

/*--------------------------------------------------------------------------------------------------------------------*/
type SelectionBaseInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
    children?: ReactNode
}

const SelectionBaseInputField = (props: SelectionBaseInputProps) => {
    return(
        <BaseInputField title={props.title} label={props.label} optional={props.optional}>
            <FormControl fullWidth>
                <InputLabel id="amount-select-label">Auswahl</InputLabel>
                <DynamicSelect labelId="amount-select-label" label="Auswahl" {...props.selectProps} />
            </FormControl>
            {props.children}
        </BaseInputField>
    )
}

/*--------------------------------------------------------------------------------------------------------------------*/
export type SelectionInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
}

export const SelectionInputField = (props: SelectionInputProps) => {
   return <SelectionBaseInputField {...props} />
}

/*--------------------------------------------------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------------------*/
export type ConditionalSelectionInputProps = SelectionInputProps & {
    showChildren: (value: any) => boolean
    children?: ReactNode
}

/**
 * This component relies on the SelectionBaseInputField. It always shows the children, if not a specific option has been selected
 *
 * @param {ConditionalSelectionInputProps} props - This Type contains the SelectionInputProps and multiple other ones:
 *       <p><strong>hideChildren:</strong> Function, that determines which selected option will hide the children.</p>
 *      <p><strong>children:</strong>Children, that will be rendered if the wrong selection hasn't been selected.</p>
 * @return {ReactNode} One single show conditional component.
 */
export const ConditionalSelectionInputField = (props: ConditionalSelectionInputProps) => {
    const {showChildren, children, ...SelectionInputProps} = props
    return (
        <Grid item container xs={12} spacing={4}>
                <SelectionBaseInputField {...SelectionInputProps}/>
                {props.showChildren(props.selectProps.value) ?  children : undefined}
        </Grid>
   )
}

/*--------------------------------------------------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------------------*/
export type DynamicInputValue = {
    id: number
    selectValue: number | null
    textFieldValue: MeasureValue
    textField2Value?: number | null
}

type DynamicInputState = DynamicInputValue[]

type BaseDynamicInputProps = InputFieldProps & {
    selectProps: DynamicSelectProps<any>
    textFieldProps: TextFieldProps
    onValueChange: (values: DynamicInputState) => void
    textField2Props?: TextFieldProps
    initValues: SelectionValue[]
    submissionSuccess?: boolean | null
}
export type DynamicInputProps = BaseDynamicInputProps & {
    unitProps: UnitProps
}

type UnitProps = {
    unitName: string,
    unitValues: UnitValues,
    optionGroup: string,
}

/**
 * This component is used for <strong>multi select inputs</strong>. It has one selection field and one text intput field. With a plus
 * button a new input section will be shown and with the minus button it can be deleted.
 *
 * @param {DynamicInputUnitSelectField} props - This Type contains the InputFieldProps and multiple other ones:
 *       <p><strong>selectProps:</strong> lookupValues need to be specified in there for the selection field.</p>
 *      <p><strong>textFieldProps:</strong> No required props, can be included for styling the text input field.</p>
 *      <p><strong>onValueChange:</strong> Save the values of both the selection and text input field in the parent state.</p>
 *      <p><strong>initValues:</strong> Initialize the component with these values from the parent state.</p>
 *      <p><strong>submissionSuccess:</strong> Boolean that shows if the input submission was a success or failure. If this prop is passed, an error will be shown upon submission if the field hasn't been filled out.</p>
 *      <p><strong>unitProps:</strong> Contains required props to display the unit name and find the unit id of the selected option.</p>
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
                        {props.optional ?
                            <Typography variant="h6" color={optionalColor}> {props.title} (optional) </Typography> :
                            <Typography variant="h6"> {props.title} </Typography>
                        }
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
                                    setValues([...values, {id: maxId+1, selectValue: null, textFieldValue: {value: null, unit: null}}])
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
                                                values[idx] = {...value, selectValue: parseInt(event.target.value),textFieldValue:{...value.textFieldValue, unit:findOptionUnitId(
                                                    parseInt(event.target.value),
                                                    props.unitProps.optionGroup,
                                                    props.selectProps.lookupValues,
                                                    props.unitProps.unitValues
                                                )}}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.selectValue}
                                            fullWidth
                                            labelId="amount-select-label"
                                            label="Auswahl"
                                            error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicSelectInputError(value.selectValue, props.submissionSuccess??true)}
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <TextField
                                        label="Menge"
                                        {...props.textFieldProps}
                                        InputProps={{endAdornment: <InputAdornment position="end">{props.unitProps.unitName??""}</InputAdornment>}}
                                        onChange={(event) => {
                                            let idx = values.indexOf(value)
                                            values[idx] = {...value, textFieldValue: {...value.textFieldValue, value: parseToFloat(event.target.value)}}
                                            setValues(values.slice())
                                            props.onValueChange(values.slice())
                                        }}
                                        value={value.textFieldValue.value}
                                        fullWidth
                                        type="number"
                                        error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicMeasureInputError(value.textFieldValue,props.submissionSuccess??true)}
                                    />
                                </Paper>
                            </Grid>
                            {props.textField2Props ?
                                <Grid item xs>
                                    <Paper>
                                        <TextField {...props.textField2Props}
                                            onChange={(event) => {
                                                let idx = values.indexOf(value)
                                                values[idx] = {...value, textField2Value: parseToFloat(event.target.value)}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.textField2Value}
                                            fullWidth
                                            type="number"
                                           error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicSelectInputError(value.textField2Value ?? null, props.submissionSuccess??true)}
                                        />
                                    </Paper>
                                </Grid>
                            : undefined}
                        </Grid>
                    </>
                )
            }
        )}
        </>
    )
}

/*--------------------------------------------------------------------------------------------------------------------*/
export type DynamicInputUnitSelectProps = BaseDynamicInputProps & {
    unitSelectProps: DynamicUnitSelectParentProps<any>
}

/**
 * This component is used for <strong>multi select inputs</strong>. It has one selection field,one text intput field and one select field for unit selection. With a plus
 * button a new input section will be shown and with the minus button it can be deleted.
 *
 * @param {DynamicInputUnitSelectField} props - This Type contains the InputFieldProps and multiple other ones:
 *       <p><strong>selectProps:</strong> lookupValues need to be specified in there for the selection field.</p>
 *      <p><strong>textFieldProps:</strong> No required props, can be included for styling the text input field.</p>
 *      <p><strong>onValueChange:</strong> Save the values of both the selection and text input field in the parent state.</p>
 *      <p><strong>initValues:</strong> Initialize the component with these values from the parent state.</p>
 *      <p><strong>submissionSuccess:</strong> Boolean that shows if the input submission was a success or failure. If this prop is passed, an error will be shown upon submission if the field hasn't been filled out.</p>
 *      <p><strong>unitSelectProps:</strong> Contains the required props to display a unit select field where one can select a unit. For that the optiongroup, the lookupvalues for that group and all unitValues are needed.</p>
 * @return {ReactNode} One dynamic input field.
 */
export const DynamicInputUnitSelectField = (props: DynamicInputUnitSelectProps) => {
    let dynInitValues = [];
    for (let i = 0; i < props.initValues.length; i++) {
        dynInitValues.push({...props.initValues[i], id: i})
    }
    const [values, setValues] = useState<DynamicInputState>(dynInitValues)
    return(
            <>
                <Grid container item direction="column" xs={12}>
                    <Grid sx={{p:1}} item xs={12} component={Paper}>
                        {props.optional ?
                            <Typography variant="h6" color={optionalColor}> {props.title} (optional) </Typography> :
                            <Typography variant="h6"> {props.title} </Typography>
                        }
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
                                    setValues([...values, {id: maxId+1, selectValue: null, textFieldValue: {value: null, unit: null}}])
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
                                                values[idx] = {...value, selectValue: parseInt(event.target.value),textFieldValue:{...value.textFieldValue, unit:null}}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.selectValue}
                                            fullWidth
                                            labelId="amount-select-label"
                                            label="Auswahl"
                                            error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicSelectInputError(value.selectValue, props.submissionSuccess??true)}
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <TextField
                                        label="Menge"
                                        {...props.textFieldProps}
                                        onChange={(event) => {
                                            let idx = values.indexOf(value)
                                            values[idx] = {...value, textFieldValue: {...value.textFieldValue, value: parseToFloat(event.target.value)}}
                                            setValues(values.slice())
                                            props.onValueChange(values.slice())
                                        }}
                                        value={value.textFieldValue.value}
                                        fullWidth
                                        type="number"
                                        error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicMeasureInputError(value.textFieldValue,props.submissionSuccess??true)}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <FormControl fullWidth>
                                        <InputLabel id="unit-select-label">Einheit</InputLabel>
                                        <DynamicUnitSelect {...props.unitSelectProps} allValues={values} activeValue={value}
                                            onChange={(event) => {
                                                let idx = values.indexOf(value)
                                                values[idx] = {...value, textFieldValue: {...value.textFieldValue, unit: parseInt(event.target.value)}}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.textFieldValue.unit}
                                            fullWidth
                                            labelId="unit-select-label"
                                            label="Einheit"
                                            error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicSelectInputError(value.textFieldValue.unit, props.submissionSuccess??true)}
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid>
                            {props.textField2Props ?
                                <Grid item xs>
                                    <Paper>
                                        <TextField {...props.textField2Props}
                                            onChange={(event) => {
                                                let idx = values.indexOf(value)
                                                values[idx] = {...value, textField2Value: parseToFloat(event.target.value)}
                                                setValues(values.slice())
                                                props.onValueChange(values.slice())
                                            }}
                                            value={value.textField2Value}
                                            fullWidth
                                            type="number"
                                           error={(props.optional && isEmptyDynamicInputField(values[0])) ? false: showDynamicSelectInputError(value.textField2Value ?? null, props.submissionSuccess??true)}
                                        />
                                    </Paper>
                                </Grid>
                            : undefined}
                        </Grid>
                    </>
                )
            }
        )}
        </>
    )
}

/*--------------------------------------------------------------------------------------------------------------------*/
type ConditionalRadioBaseInputProps = InputFieldProps & {
    radioGroupProps: RadioGroupProps
    radioButtonValues: Option[]
    children?: ReactNode
}

/**
 * This component is used for <strong>conditional field inputs</strong>. This component has a title, label, radio button and will render its children below the header.
 * This is just the base component and will not be directly used. It is used by other components that implement further logic.
 *
 * @param {ConditionalRadioBaseInputProps} props - This Type contains the InputFieldProps and multiple other ones:
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

/*--------------------------------------------------------------------------------------------------------------------*/
export type SingleShowConditionalRadioInputProps = ConditionalRadioBaseInputProps & {
    showChildren: (value: any) => boolean
    children?: ReactNode
}

/**
 * This component relies on the ConditionalRadioBaseInputField. It only shows the child component,
 * if the correct radio button has been pressed.
 *
 * @param {SingleShowConditionalRadioInputProps} props - This Type contains the ConditionalRadioBaseInputProps
 * and multiple other ones:
 * <p><strong>showChildren:</strong> Function, that determines which radio button is the correct one that will
 * show the children.</p>
 * <p><strong>children:</strong>Children, that will be rendered if the correct button has been selected.</p>
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

/*--------------------------------------------------------------------------------------------------------------------*/
export type SelectShowConditionalRadioInputProps = ConditionalRadioBaseInputProps & {
    showFirstChildren: (value: any) => boolean
    showSecondChildren: (value: any) => boolean
    firstChildren:  ReactNode
    secondChildren: ReactNode
}

/**
 * This component relies on the ConditionalRadioBaseInputField. It either shows one or another child component,
 * depending on which radio button has been selected.
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
            {
                props.showFirstChildren(props.radioGroupProps.value) ?
                props.firstChildren :
                (props.showSecondChildren(props.radioGroupProps.value) ? props.secondChildren: undefined)
            }
        </ConditionalRadioBaseInputField>
    )
}