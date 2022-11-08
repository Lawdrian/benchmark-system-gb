import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {connect, ConnectedProps} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {register} from "../../../actions/auth";
import {Dialog, DialogContent, DialogContentText, DialogTitle, InputAdornment} from "@mui/material";
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
}

const PageRegister = ({register, loginUrl}: RegisterProps) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [cPassword, setCPassword] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [tries, setTries] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [emailIsUnique, setEmailIsUnique] = useState<boolean>(true)

    const navigate = useNavigate()

    const handleRegistration = (event: any) => {
        event.preventDefault();
        if (inputValid(company, email, password, cPassword)) {
            register(email, email, password, company, () => setOpenDialog(true), () => setEmailIsUnique(false))
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