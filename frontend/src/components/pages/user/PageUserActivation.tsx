import React, {useEffect} from "react";
import {connect, ConnectedProps} from "react-redux";
import {activate} from "../../../actions/auth";
import {RootState} from "../../../store";
import {UserManagementLayout, UserManagementLayoutProps} from "../../utils/UserManagementLayout";
import {LoadingLayout, LoadingLayoutProps} from "../../utils/LoadingLayout";

const mapStateToProps = (state: RootState) => ({
    isActivated: state.auth.isActivated,
    isLoading: state.auth.isLoading,
});

const connector = connect(mapStateToProps, {activate});

type ReduxProps = ConnectedProps<typeof connector>

type userActivationProps = ReduxProps & {
    loginUrl: string
}

/**
 * This functional component renders the page that will be displayed when a user activated his account.
 *
 * This page either shows the user a success or error message.
 * @param isActivated - Boolean value from the Redux auth state, that determines if a user is activated or not
 * @param isLoading - Boolean value from the Redux auth state, that determines if the activate request to the back end
 * is already done or still loading
 * @param activate - Function that makes a call to the back end to activate a user's account
 * @param loginUrl - Url slug of the login page
 */
const PageUserActivation = ({isActivated, isLoading, activate, loginUrl}: userActivationProps) => {

    // get the encoded user id and the activation token that was sent in the email out of the url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidb64 = urlParams.get('uid')
    const token = urlParams.get('token')

    // use the useEffect hook, so activate gets only called once
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

    // return a loading, error or success page depending on the activate request status
    if(isActivated == true && !isLoading) {
        return <UserManagementLayout {...successProps}/>
    } else if(isActivated == false && !isLoading) {
        return <UserManagementLayout {...errorProps}/>
    } else {
        return <LoadingLayout {...loadingProps}/>
    }
}

export default connector(PageUserActivation);




