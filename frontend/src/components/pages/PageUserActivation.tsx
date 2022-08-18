import React, {ReactNode, useEffect, useState} from "react";
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
import {UserManagementLayout, UserManagementLayoutProps} from "../utils/UserManagement";

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

    const successProps: UserManagementLayoutProps = {
        title: "Email wurde erfolgreich bestätigt!",
        subtitle: "Sie können sich jetzt anmelden.",
        buttonText: "Zur Anmeldung",
        navigateTo: loginUrl
    }

    const errorProps: UserManagementLayoutProps = {
        title: "Der Aktivierungslink ist ungültig!",
        subtitle: "Versuchen Sie es erneut.",
        buttonText: "Zur Anmeldung",
        navigateTo: loginUrl
    }

    if(isActivated) {
        return <UserManagementLayout {...successProps}/>
    }
    else {
        return <UserManagementLayout {...errorProps}/>
    }
}

export default connector(PageUserActivation);




