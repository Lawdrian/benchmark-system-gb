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

const PageHelper = ({
                        children,
                        pageTitle,
                        isPrivate,
                        auth,
                        loginUrl
                    }: PageHelperProps) => {
    useLayoutOutletContext().setTitle(pageTitle);

    if (isPrivate) {
        //console.log("PRIVATE PAGE: Before Authentication")
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