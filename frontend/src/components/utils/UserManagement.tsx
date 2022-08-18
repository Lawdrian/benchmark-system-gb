import React, {ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export type UserManagementLayoutProps = {
    title: string
    subtitle: string
    buttonText: string
    navigateTo: string
    children?: ReactNode
}


export const UserManagementLayout: React.FC<UserManagementLayoutProps> = ({title, subtitle, buttonText, navigateTo, children}) => {

    const navigate = useNavigate()


    const navigateToPage = () => {
        navigate(navigateTo)
    }

    return(
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>
                            <Typography component="h1" variant="h5">
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <p>{subtitle}</p>
                        </Grid>
                        {children}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                color="primary"
                                onClick={navigateToPage}
                            >
                                {buttonText}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    )
}