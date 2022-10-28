import React, {useState} from 'react'
import Button from "@mui/material/Button";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";
import {Alert, AlertTitle, Box, Grid} from "@mui/material";

export type InputPaginationButtonsProps = {
    hasPrevious: () => boolean
    hasNext: () => boolean
    previous: Function
    next: Function
    submit: Function

}

/**
 * Contains 2 buttons that are used to navigate the tabs on the input data page.
 * On the last tab there will be a submit button that can be used to submit the user data.
 * The user will be redirected to the plotting page
 *
 * @param {InputPaginationButtonsProps} props This Type contains 5 functions that are used to change the current tab and submit the data
 * @return {ReactNode} 2 Buttons to change the current tab. On the last page the next button changes to a submission button.
 */
const InputPaginationButtons = (props:InputPaginationButtonsProps) => {
    const [showAlert, setShowAlert] = useState<boolean>(false)

    const submitErrorAlert = () => {
        return (
            <Grid item xs={12}>
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                    <AlertTitle>Abschicken fehlgeschlagen</AlertTitle>
                    Nicht alle Eingabefelder korrekt ausgefüllt!
                </Alert>
            </Grid>
        );
    }



    return (
        <>
            {showAlert ? submitErrorAlert() : null}
            <Box sx={{display:"flex", justifyContent:"center"}} >
                <>
                <Button
                    size="large"
                    disabled={!props.hasPrevious()}
                    startIcon={<NavigateBefore />}
                    onClick={() => props.previous()}
                >
                    Zurück
                </Button>
                {props.hasNext()
                    ?
                    <Button
                        sx={{ml: 2}}
                        size="large"
                        disabled={!props.hasNext()}
                        endIcon={<NavigateNext/>}
                        onClick={() => props.next()}
                    >
                        Weiter
                    </Button>
                    :
                    <Button
                        sx={{ml: 2}}
                        size="large"
                        disabled={false}
                        endIcon={<NavigateNext/>}
                        onClick={() => props.submit(() => setShowAlert(true))}
                    >
                        Abschicken
                    </Button>
                    }
                </>
            </Box>
        </>
    )
}
export default InputPaginationButtons