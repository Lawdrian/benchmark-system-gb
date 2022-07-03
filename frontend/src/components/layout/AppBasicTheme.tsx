import React, {ReactNode} from "react";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import {Box} from "@mui/material";

type BasicThemeProps = {
    children?: ReactNode
}

const AppBasicTheme = ({ children }: BasicThemeProps) => {
    return (
        <ThemeProvider theme={createTheme({palette: {primary: {main: '#7ab800', contrastText: '#f3f3f3'}}})}>
            <Box id="app-layout" sx={{ display: 'flex' }}>
                <CssBaseline />
                { children }
            </Box>
        </ThemeProvider>
    );
}

export default AppBasicTheme;