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

const mapStateToProps = (state: { auth: AuthenticationState }) => ({
    auth: state.auth
})
const connector = connect(mapStateToProps, {logout});

type ReduxProps = ConnectedProps<typeof connector>

type HeaderProps = SharedDrawerProps & ReduxProps & {
    title?: String
}

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
                <IconButton color="inherit" onClick={logout}>
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </StyledAppBar>
    );
}

export default connector(AppHeader);