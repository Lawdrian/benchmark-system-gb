import React from "react";
import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AppHeader from "./AppHeader";
import AppDrawer from "./AppDrawer";
import {DrawerListItem, LayoutConfig} from "../../types/SharedLayoutTypes";
import AppBasicTheme from "./AppBasicTheme";

type LayoutProps = {
    config: LayoutConfig
    drawerItems: DrawerListItem[]
}

/**
 * This component combines the {@link AppDrawer} and {@link AppHeader} components and renders them together with a
 * color theme designed in the {@link AppBasicTheme} component.
 *
 * @param config - Type {@link LayoutConfig} that contains the drawerWidth
 * @param drawerItems - List, containing all drawer items
 */
const AppLayout = (
    {
        config,
        drawerItems
    }: LayoutProps
) => {
    const [title, setTitle] = React.useState("Default Header Layout")
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <AppBasicTheme>
            <AppHeader
                open={open}
                toggleDrawer={toggleDrawer}
                drawerWidth={config.drawerWidth}
                title = {title}
            />
            <AppDrawer
                open={open}
                toggleDrawer={toggleDrawer}
                drawerWidth={config.drawerWidth}
                listItems={drawerItems}
            />
            <Box
                component="main"
                id="scroll-box"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Outlet context={ { setTitle } }/>
                </Container>
            </Box>
        </AppBasicTheme>
    );
}

export default AppLayout;