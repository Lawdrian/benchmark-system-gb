import React, { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AppHeader from "./AppHeader";
import AppDrawer from "./AppDrawer";
import { LayoutConfig } from "../../types/LayoutConfigTypes";
import { DrawerListItem } from "../../types/SharedLayoutTypes";

type LayoutProps = {
    config: LayoutConfig
    drawerItems: DrawerListItem[]
}

const AppLayout: FunctionComponent<LayoutProps> = (
    {
        config,
        drawerItems
    }
) => {
    const [title, setTitle] = React.useState("Projekt PROSIBUR - Benchmark System für Gewächshausdaten")
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={createTheme()}>
            <Box id="app-layout" sx={{ display: 'flex' }}>
                <CssBaseline />
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
            </Box>
        </ThemeProvider>
    );
}

export default AppLayout;