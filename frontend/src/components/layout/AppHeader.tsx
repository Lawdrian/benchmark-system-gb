import React, { FunctionComponent } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Search from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { SharedDrawerProps } from "../../types/SharedLayoutTypes";
import StyledAppBar from "../styled/StyledAppBar";

type HeaderProps = SharedDrawerProps & {
    title?: String
}

const AppHeader: FunctionComponent<HeaderProps> = (
    {
        open,
        toggleDrawer,
        drawerWidth,
        title = "AppHeader: title missing!"
    }
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
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </StyledAppBar>
    );
}

export default AppHeader;