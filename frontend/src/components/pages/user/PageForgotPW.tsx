import React, {useState} from 'react'
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import {forgotPW} from "../../../actions/auth";
import {UserManagementLayout} from "../../utils/UserManagementLayout";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {emailValid, getMailHelperText, inputValid} from "../../../helpers/UserManagement";
import Button from "@mui/material/Button";
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";


const mapStateToProps = (state: RootState) => ({
});

const connector = connect(mapStateToProps, {forgotPW});

type ReduxProps = ConnectedProps<typeof connector>

type userActivationProps = ReduxProps & {
    loginUrl: string
}

const PageForgotPW = ({forgotPW, loginUrl}: userActivationProps) => {

    const [email, setEmail] = useState<string>("")
    const [emailIsUnique, setEmailIsUnique] = useState<boolean>(true)
    const [tries, setTries] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const navigate = useNavigate()

    const hasTried = () => {
        return tries > 0
    }

    // Get the encoded user id and the activation token that was sent in the email out of the url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidb64 = urlParams.get('uid')
    const token = urlParams.get('token')


    const props = {
        title: "Passwort zurücksetzen",
        subtitle: "Geben sie Ihre Emailadresse ein",
        buttonText: "Zur Anmeldung",
        navigateTo: loginUrl
    }


    const handleForgotPW = () => {
        setTries(tries+1)
        forgotPW(email)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        navigate(loginUrl)
    }

    return (
        <UserManagementLayout {...props}>
            <Grid item xs={12}>
                <Grid item>
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <>
                                    <DialogTitle>Bestätigungsemail wurde versendet</DialogTitle>
                                     <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Falls ein Account mit dieser Email existiert, wurde eine Email zum Passwort zurücksetzen an diesen Account geschickt. </DialogContentText>
                                    </DialogContent>
                                </>
                            </Dialog>
                    </Grid>
                <TextField
                    required
                    fullWidth
                    label="Email Addresse"
                    name="email"
                    id="email"
                    autoComplete="email"
                    onChange={(event) => {setEmail(event.target.value)}}
                    helperText={hasTried() ? getMailHelperText(email, emailIsUnique) : undefined}
                    error={hasTried() && !emailValid(email)}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    onClick={(event) => handleForgotPW()}
                    fullWidth
                    variant="contained"
                    sx={{mt: 3}}
                    color="primary"
                    disabled={hasTried() && !emailValid(email)}
                >
                    Passwort zurücksetzen
                </Button>
            </Grid>
        </UserManagementLayout>
    )

}

export default connector(PageForgotPW);