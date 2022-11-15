import React, {useState} from 'react'
import Button from "@mui/material/Button";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";
import {
    Alert,
    AlertTitle,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid
} from "@mui/material";
import {useNavigate} from "react-router-dom";

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
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleSubmitSuccess = () => {
        setTimeout(function(){
            setOpenDialog(false)
            navigate("../co2-footprint")
        }, 2000);
    }

    const handleSubmitError = () => {
        setTimeout(function(){
            setOpenDialog(false)
            setShowAlert(true)
        }, 2000);
    }

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
            <Dialog open={openDialog}>
                <>
                    <DialogTitle>Ihr persöhnlicher Fußabdruck wird erstellt</DialogTitle>
                     <DialogContent sx={{display: "flex"}}>
                         <Grid container item xs={12} alignItems={"center"} justifyContent={"center"}>
                            <CircularProgress/>
                         </Grid>
                    </DialogContent>
                </>
            </Dialog>
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
                        onClick={() => props.submit(() => setOpenDialog(true), () => handleSubmitSuccess(), () => handleSubmitError())}
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