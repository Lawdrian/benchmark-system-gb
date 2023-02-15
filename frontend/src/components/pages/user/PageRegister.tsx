import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {connect, ConnectedProps} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {register} from "../../../actions/auth";
import {
    Alert, AlertTitle,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
} from "@mui/material";
import {RootState} from "../../../store";
import {
    companyValid,
    emailValid, getCompanyHelperText,
    getMailHelperText,
    getPasswordHelperText,
    getPasswordInputProps,
    inputValid,
    passwordsValid
} from "../../../helpers/UserManagement";

const mapStateToProps = (state: RootState) => ({
})

const connector = connect(mapStateToProps, {register});

type ReduxProps = ConnectedProps<typeof connector>

type RegisterProps = ReduxProps & {
    loginUrl: string
    dataInfoUrl: string
}

/**
 * This functional component represents the register page.
 * @param register - Function that calls the back end to register a new user
 * @param loginUrl - Url slug of the page, where a user can log in.
 * @param dataInfoUrl - Url slug of the page, where the data information is displayed to the user
 */
const PageRegister = ({register, loginUrl, dataInfoUrl}: RegisterProps) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [cPassword, setCPassword] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [tries, setTries] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openCookieSnackBar, setOpenCookieSnackBar] = useState<boolean>(true)
    const [cookieConsent, setCookieConsent] = useState<boolean>(false)
    const [emailIsUnique, setEmailIsUnique] = useState<boolean>(true)
    const [showCookieAlert, setShowCookieAlert] = useState<boolean>(false)
    const [showGeneralAlert, setShowGeneralAlert] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleRegistration = (event: any) => {
        event.preventDefault();
        if (inputValid(company, email, password, cPassword)) {
            if (cookieConsent) {
                register(email, email, password, company, () => setOpenDialog(true), (error: string) => handleRegistrationError(error))
            }
            else {
                setShowCookieAlert(true)
            }
        }
        setTries(tries + 1)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        navigate(loginUrl)
    }

    const handleEmailChange = (value:string) => {
        setEmail(value)
        setEmailIsUnique(true)
    }

    const hasTried = () => {
        return tries > 0
    }

    const handleCookieClick = () => {
        setCookieConsent(true)
        setOpenCookieSnackBar(false)
        setShowCookieAlert(false)
    }

    const cookieErrorAlert = (
        <Grid item xs={12}>
            <Alert severity="error" onClose={() => setShowCookieAlert(false)}>
                <AlertTitle>Registrierung fehlgeschlagen</AlertTitle>
                Sie müssen den Cookies zustimmen um das Benchmark-Tool verwenden zu können.
            </Alert>
        </Grid>
    )

    const generalAlert = (
        <Grid item xs={12}>
            <Alert severity="error" onClose={() => setShowGeneralAlert(false)}>
                <AlertTitle>Registrierung fehlgeschlagen</AlertTitle>
                Es ist ein Fehler bei der Registrierung aufgetreten. Verwenden Sie nicht erlaubte Symbole?
            </Alert>
        </Grid>
    )

    const handleRegistrationError = (error: string) => {
        if (error == "Email in use") {
            setEmailIsUnique(false)
        } else {
            setShowGeneralAlert(true)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <Typography component="h1" variant="h5">
                            Registrieren
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Snackbar
                            open={openCookieSnackBar}
                            anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
                            onClose={() =>{}}
                            message={"Es werden technisch notwendige Cookies verwendet."}
                            action={<Button onClick={handleCookieClick}>Verstanden</Button>}
                        />
                    </Grid>
                    <Grid item>
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <>
                                    <DialogTitle>Aktivieren Sie Ihren Account</DialogTitle>
                                     <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Eine Bestätigungsemail wurde an Ihre Emailadresse gesendet.
                                        </DialogContentText>
                                    </DialogContent>
                                </>
                            </Dialog>
                    </Grid>
                    <Grid item container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="company-name"
                                label="Betriebsname"
                                name="companyName"
                                autoFocus
                                onChange={(event) => setCompany(event.target.value)}
                                helperText={hasTried() ? getCompanyHelperText(company) : undefined}
                                error={hasTried() && !companyValid(company)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email Addresse"
                                name="email"
                                id="email"
                                autoComplete="email"
                                onChange={(event) => handleEmailChange(event.target.value)}
                                helperText={hasTried() ? getMailHelperText(email, emailIsUnique) : undefined}
                                error={hasTried() && (!emailValid(email) || !emailIsUnique)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Passwort (mind 8. Zeichen)"
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
                    </Grid>
                    <Grid item xs={12}>
                        <p>
                            Wir verarbeiten Ihre Daten entsprechend unserer <Link to={dataInfoUrl}>Datenschutzhinweise</Link>
                        </p>
                    </Grid>
                    {showCookieAlert ? cookieErrorAlert : null}
                    {showGeneralAlert ? generalAlert : null}
                    <Grid item xs={12}>
                        <Button
                            onClick={(event) => handleRegistration(event)}
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={hasTried() && (!inputValid(company, email, password, cPassword) || !emailIsUnique)}
                        >
                            Registrieren
                        </Button>
                    </Grid>
                    <Grid item>
                        <p>
                            Bereits registriert? <Link
                            to={loginUrl}> Anmelden </Link>
                        </p>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default connector(PageRegister);