import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {connect, ConnectedProps} from "react-redux";
import {activate, login} from "../../actions/auth";
import {RootState} from "../../store";
import {Alert, AlertTitle} from "@mui/material";

const mapStateToProps = (state: RootState) => ({
    isActivated: state.auth.isActivated
});

const connector = connect(mapStateToProps, {activate});

type ReduxProps = ConnectedProps<typeof connector>

type userActivationProps = ReduxProps & {
    loginUrl: string
}

const PageUserActivation = ({isActivated, activate, loginUrl}: userActivationProps) => {

    console.log("UserActivation Page!")

    // Get the encoded user id and the activation token that was sent in the email out of the url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidb64 = urlParams.get('uid')
    const token = urlParams.get('token')


    if (uidb64!=null && token!=null) {
        activate(uidb64, token)
    }

    if(isActivated) {
        return userActivationLayout(
            "Email wurde erfolgreich bestätigt!",
            "Sie können sich jetzt anmelden.",
            "Zur Anmeldung",
            loginUrl
        )

    }
    else {
        return userActivationLayout(
            "Der Aktivierungslink ist ungültig!",
            "Versuchen Sie es erneut.",
            "Zur Anmeldung",
            loginUrl
        )
    }
}

export default connector(PageUserActivation);



const userActivationLayout = (title:string,subtitle:string, buttonText:string, navigateTo: string) => {

    const navigate = useNavigate()


    const navigateToPage = () => {
        navigate(navigateTo)
    }

    return(
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
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <p>{subtitle}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                color="primary"
                                onClick={navigateToPage}
                            >
                                {buttonText}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    )
}


