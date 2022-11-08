import React, {useEffect} from "react";
import {connect, ConnectedProps} from "react-redux";
import {activate} from "../../../actions/auth";
import {RootState} from "../../../store";
import {UserManagementLayout, UserManagementLayoutProps} from "../../utils/UserManagementLayout";
import {LoadingLayout, LoadingLayoutProps} from "../../utils/LoadingLayout";

const mapStateToProps = (state: RootState) => ({
    isActivated: state.auth.isActivated,
    isLoading: state.auth.isLoading
});

const connector = connect(mapStateToProps, {activate});

type ReduxProps = ConnectedProps<typeof connector>

type userActivationProps = ReduxProps & {
    loginUrl: string
}

const PageUserActivation = ({isActivated, isLoading, activate, loginUrl}: userActivationProps) => {

    console.log("UserActivation Page!")

    // Get the encoded user id and the activation token that was sent in the email out of the url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidb64 = urlParams.get('uid')
    const token = urlParams.get('token')

    // Use useEffect so activate gets only called once
    useEffect(() => {
        if (uidb64!=null && token!=null) {
            activate(uidb64, token)
        }
    },[])


    const loadingProps: LoadingLayoutProps = {
        title: "Email wird verifiziert",
        subtitle: "Haben Sie einen Moment Gedult."
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
    if(isLoading && !isActivated) {
        return <LoadingLayout {...loadingProps}/>
    }
    else if(isActivated && !isLoading) {
        return <UserManagementLayout {...successProps}/>
    }
    else {
        return <UserManagementLayout {...errorProps}/>
    }
}

export default connector(PageUserActivation);




