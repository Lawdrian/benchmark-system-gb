import React, { FunctionComponent } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {connect, ConnectedProps} from "react-redux";
import { SharedDrawerProps } from "../../types/SharedLayoutTypes";
import StyledAppBar from "../styled/StyledAppBar";
import { AuthenticationState } from "../../reducers/auth";
import { logout } from "../../actions/auth";
import {Button} from "@mui/material";

const mapStateToProps = (state: { auth: AuthenticationState }) => ({
    auth: state.auth
})
const connector = connect(mapStateToProps, {logout});

type ReduxProps = ConnectedProps<typeof connector>

type HeaderProps = SharedDrawerProps & ReduxProps & {
    title?: String
}

/**
 * This component renders the header bar of the web application. The header consists of a title and a logout button.
 * @param open - Boolean if the app bar should be visible or not
 * @param toggleDrawer - Function that will be called, when the icon button at the top of the drawer is clicked
 * @param drawerWidth - Determines the width of the drawer
 * @param title - Title that should be displayed on the header
 * @param logout - Function that should be called, when the logout button is pressed
 * @constructor
 */
const AppHeader = (
    {
        open,
        toggleDrawer,
        drawerWidth,
        title = "AppHeader: title missing!",
        logout
    }: HeaderProps
) => {
    return (
        <StyledAppBar position="absolute" open={open} drawerWidth={drawerWidth}>
            <Toolbar
                sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    {title}
                </Typography>
                <Button color="inherit" onClick={logout}>
                    Ausloggen
                </Button>
            </Toolbar>
        </StyledAppBar>
    );
}

export default connector(AppHeader);