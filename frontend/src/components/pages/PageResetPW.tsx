import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import {resetPW} from "../../actions/auth";
import {UserManagementLayout, UserManagementLayoutProps} from "../utils/UserManagement";
import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {getPasswordHelperText, getPasswordInputProps, passwordsValid} from "../../helpers/UserManagement";
import Button from "@mui/material/Button";
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";


const mapStateToProps = (state: RootState) => ({
    isActivated: state.auth.isActivated
});

const connector = connect(mapStateToProps, {resetPW});

type ReduxProps = ConnectedProps<typeof connector>

type userActivationProps = ReduxProps & {
    loginUrl: string
}

const PageResetPW = ({isActivated, resetPW, loginUrl}: userActivationProps) => {

    const [password, setPassword] = useState<string>("")
    const [cPassword, setCPassword] = useState<string>("")
    const [tries, setTries] = useState<number>(0)
    const [isError, setIsError] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const navigate = useNavigate()

    console.log("UserActivation Page!")

    // Get the encoded user id and the activation token that was sent in the email out of the url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidb64 = urlParams.get('uid')
    const token = urlParams.get('token')

    const hasTried = () => {
        return tries > 0
    }


    const handleResetPW  = () => {
        if (uidb64 != null && token != null) {
            resetPW(uidb64, token, password, () => setOpenDialog(true), () => setIsError(true))
        }
        else return {

        }
    }

    const handleCloseDialog = () => {
        setTries(tries+1)
        setOpenDialog(false)
        navigate(loginUrl)
    }


    const successProps: UserManagementLayoutProps = {
        title: "Geben Sie ein neues Passwort ein!",
        subtitle: "Nachdem Sie Ihr Passwort geändert haben, können Sie sich mit dem neuen Passwort anmelden.",
        buttonText: "Zur Anmeldung",
        navigateTo: loginUrl
    }

    const errorProps: UserManagementLayoutProps = {
        title: "Der Zurücksetzungslink ist ungültig!",
        subtitle: "Versuchen Sie es erneut.",
        buttonText: "Zur Anmeldung",
        navigateTo: loginUrl
    }

    if(!isError) {
        return (
            <UserManagementLayout {...successProps}>
                <>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <>
                                    <DialogTitle>Ihr Passwort wurde erfolgreich geändert</DialogTitle>
                                     <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Sie können sich nun anmelden.
                                        </DialogContentText>
                                    </DialogContent>
                                </>
                    </Dialog>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Passwort"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                            error={hasTried() && !passwordsValid(password, cPassword)}
                            helperText={hasTried() ? getPasswordHelperText(password, cPassword, false) : undefined}
                            InputProps={getPasswordInputProps(password, cPassword)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="password-confirm"
                            label="Passwort bestätigen"
                            type="password"
                            name="passwordConfirm"
                            onChange={(event) => setCPassword(event.target.value)}
                            error={hasTried() && !passwordsValid(password, cPassword)}
                            helperText={hasTried() ? getPasswordHelperText(password, cPassword, true) : undefined}
                            InputProps={getPasswordInputProps(password, cPassword)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleResetPW}
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color="primary"
                            disabled={hasTried() && !passwordsValid(password, cPassword)}
                        >
                            Passwort ändern
                        </Button>
                    </Grid>
                </>
            </UserManagementLayout>
        )
    }
    else {
        return (
            <UserManagementLayout {...errorProps}/>
        )
    }
}

export default connector(PageResetPW);