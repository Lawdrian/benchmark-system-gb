import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {CircularProgress} from "@mui/material";

export type LoadingLayoutProps = {
    title: string
    subtitle: string
}


export const LoadingLayout: React.FC<LoadingLayoutProps> = ({title, subtitle}) => {

    return(
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        direction={"row"}
                        spacing={1}
                    >
                        <Grid item container xs={12} justifyContent="center" alignItems="center">
                            <Typography component="h1" variant="h5">
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} justifyContent="center" alignItems="center">
                            <p>{subtitle}</p>
                        </Grid>
                        <Grid item container xs={12} justifyContent="center" alignItems="center">
                            <CircularProgress size={60} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    )
}