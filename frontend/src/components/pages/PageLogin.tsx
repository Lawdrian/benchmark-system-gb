import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Link, Navigate} from "react-router-dom";
import {connect, ConnectedProps} from "react-redux";
import {login} from "../../actions/auth";
import {RootState} from "../../store";
import {Alert, AlertTitle} from "@mui/material";

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated
});

const connector = connect(mapStateToProps, {login});

type ReduxProps = ConnectedProps<typeof connector>

type LoginProps = ReduxProps & {
    loggedInUrl: string
    registerUrl: string
}

const PageLogin = ({login, isAuthenticated, loggedInUrl, registerUrl}: LoginProps) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showAlert, setShowAlert] = useState<boolean>(false)

    const handleLogin = (event: any) => {
        event.preventDefault();
        login(email, password, () => setShowAlert(true));
    }

    const loginErrorAlert = () => {
        return (
            <Grid item xs={12}>
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                    <AlertTitle>Login fehlgeschlagen</AlertTitle>
                    Email und Passwort stimmen nicht überein.
                    Versuchen Sie es erneut!
                </Alert>
            </Grid>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={loggedInUrl}/>
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
                            Anmelden
                        </Typography>
                    </Grid>
                    <Grid item container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Addresse"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(event) => setEmail(event.target.value)}
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
                            />
                        </Grid>
                        {showAlert ? loginErrorAlert() : null}
                        <Grid item xs={12}>
                            <Button
                                onClick={(event) => handleLogin(event)}
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                color="primary"
                            >
                                Anmelden
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <p>
                            Noch kein Konto? <Link
                            to={registerUrl}> Registrieren </Link>
                        </p>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default connector(PageLogin);