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
 * @param {InputPaginationButtonsProps} props - This Type contains 5 functions that are used to change the
 * current tab and submit the data
 */
const InputPaginationButtons = (props:InputPaginationButtonsProps) => {
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("Ein Fehler ist aufgetreten. Bitte Versuchen Sie es erneut!")
    const navigate = useNavigate()
    const scrollComponent = document.getElementById('scroll-box')

    const handleSubmitSuccess = () => {
        setTimeout(function(){
            setOpenDialog(false)
            navigate("../co2-footprint")
        }, 1000);
    }

    const handleSubmitError = (errorMessage: string) => {
        setTimeout(function(){
            if (errorMessage != "") {
                setErrorMessage(errorMessage)
            }
            setOpenDialog(false)
            setShowAlert(true)
        }, 1000);
    }

    const submitErrorAlert = () => {
        return (
            <Grid item xs={12}>
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                    <AlertTitle>Abschicken fehlgeschlagen</AlertTitle>
                    {errorMessage}
                </Alert>
            </Grid>
        );
    }

    const handleNextClick = () => {
        props.next()
        scrollComponent?.scrollTo(0,0)
    }

    const handlePreviousClick = () => {
        props.previous()
        scrollComponent?.scrollTo(0,0)
    }

    return (
        <>
            <Dialog open={openDialog}>
                <>
                    <DialogTitle>Ihr persöhnlicher Footprint wird erstellt</DialogTitle>
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
                    onClick={handlePreviousClick}
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
                        onClick={handleNextClick}
                    >
                        Weiter
                    </Button>
                    :
                    <Button
                        sx={{ml: 2}}
                        size="large"
                        disabled={false}
                        endIcon={<NavigateNext/>}
                        onClick={() => props.submit(() => setOpenDialog(true), () => handleSubmitSuccess(), (errorMessage:string) => handleSubmitError(errorMessage))}
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