import React, {useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {connect, ConnectedProps} from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {register} from "../../actions/auth";
import {Dialog, DialogContent, DialogContentText, DialogTitle, InputAdornment} from "@mui/material";
import {RootState} from "../../store";

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
})

const connector = connect(mapStateToProps, {register});

type ReduxProps = ConnectedProps<typeof connector>

type RegisterProps = ReduxProps & {
    registeredUrl: string
    loginUrl: string
}

const PageRegister = ({isAuthenticated, register, loginUrl, registeredUrl}: RegisterProps) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [cPassword, setCPassword] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [tries, setTries] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleRegistration = (event: any) => {
        event.preventDefault();
        if (inputValid(company, email, password, cPassword)) {
            register(email, email, password, company)
            setOpenDialog(true)
        } else {
            setTries(tries + 1)
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        navigate('/login')
    }

    const hasTried = () => {
        return tries > 0
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
                                onChange={(event) => setEmail(event.target.value)}
                                helperText={hasTried() ? getMailHelperText(email) : undefined}
                                error={hasTried() && !emailValid(email)}
                            />
                        </Grid>
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
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={(event) => handleRegistration(event)}
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color="primary"
                            disabled={hasTried() && !inputValid(company, email, password, cPassword)}
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

const isEmpty = (value: string) => {
    return value.length <= 0;
}

const passwordsPresent = (password: string, cPassword: string): boolean => {
    return !isEmpty(password) && !isEmpty(cPassword);
}

const passwordsEqual = (password: string, cPassword: string): boolean => {
    return password == cPassword
}

const passwordsValid = (password: string, cPassword: string): boolean => {
    return passwordsPresent(password, cPassword) && passwordsEqual(password, cPassword)
}

const companyValid = (company: string): boolean => {
    return company.length > 0 && company.length <= 100
}

const emailValid = (email: string): boolean => {
    return email.length > 0 && email.includes("@")
}

const inputValid = (company: string, email: string, password: string, cPassword: string): boolean => {
    return passwordsValid(password, cPassword) && companyValid(company) && emailValid(email)
}

const getPasswordInputProps = (password: string, cPassword: string) => {
    if (passwordsValid(password, cPassword)) {
        return {
            endAdornment: (
                <InputAdornment position="end">
                    <CheckIcon color="success"/>
                </InputAdornment>
            )
        }
    } else if (!passwordsPresent(password, cPassword)) {
        return
    } else {
        return {
            endAdornment: (
                <InputAdornment position="end">
                    <CloseIcon color="error"/>
                </InputAdornment>
            )
        }
    }
}

const getRequiredHelperText = () => {
    return "Bitte füllen sie dieses Feld aus!"
}

const getCompanyHelperText = (company: string) => {
    if (isEmpty(company)) {
        return getRequiredHelperText()
    } else if (!companyValid(company)) {
        return "Bitte geben sie einen kürzeren Betriebsnamen an!"
    } else {
        return
    }
}

const getMailHelperText = (email: string) => {
    if (isEmpty(email)) {
        return getRequiredHelperText()
    } else if (!emailValid(email)) {
        return "Bitte geben Sie eine gültige Email-Adresse an!"
    } else {
        return
    }
}

const getPasswordHelperText = (password: string, cPassword: string, confirm: boolean) => {
    if ((isEmpty(password) && !confirm) || (isEmpty(cPassword) && confirm)) {
        return getRequiredHelperText()
    } else if (!passwordsPresent(password, cPassword)) {
        return
    } else if (!passwordsValid(password, cPassword)) {
        return "Passwörter stimmen nicht überein!"
    } else {
        return
    }
}

export default connector(PageRegister);