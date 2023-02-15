import React from "react";
import {useLayoutOutletContext} from "../../helpers/LayoutHelpers";
import {AuthenticationState} from "../../reducers/auth";
import {connect, ConnectedProps} from "react-redux";
import {Navigate} from "react-router-dom";

const mapStateToProps = (state: { auth: AuthenticationState }) => ({
    auth: state.auth
})
const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

type PageHelperProps = ReduxProps & {
    loginUrl: string
    children?: JSX.Element
    pageTitle?: string
    isPrivate?: boolean
}

/**
 * This function checks with the {@link checkAuthentication} function, if a page should
 * be only visible for logged-in users.
 * @param children - Page that wants to be accessed
 * @param pageTitle - Title of the page that wants to be accessed
 * @param isPrivate - Boolean value that determines, if the page is only accessible for logged-in users
 * @param auth - Authentication Redux state
 * @param loginUrl - Url of the login page that the user gets redirected to, if he is not authenticated
 */
const PageHelper = ({
                        children,
                        pageTitle,
                        isPrivate,
                        auth,
                        loginUrl
                    }: PageHelperProps) => {
    useLayoutOutletContext().setTitle(pageTitle);

    if (isPrivate) {
        return checkAuthentication(loginUrl, children, auth)
    } else {
        return <>{children}</>
    }
}

const checkAuthentication = (redirectUrl: string, element?: JSX.Element, auth?: AuthenticationState) => {
    if (auth && auth.isLoading) {
        return <h2> Loading... </h2>
    } else if (auth && !auth.isAuthenticated) {
        return <Navigate to={redirectUrl}/>
    } else {
        return <>{element}</>
    }
}

export default connector(PageHelper);