import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

type StartingOption = {
    url: string
    title: string
}

export type StartingOptionsProps = {
    loginOption: StartingOption
    registerOption: StartingOption
    proceedOption: StartingOption
    asGridItem?: boolean
    gridSx?: any
}

const StartingOptions = ({
    loginOption,
    registerOption,
    proceedOption,
    asGridItem,
    gridSx
}: StartingOptionsProps) => {
    return (
        <Grid
            container={true}
            justifyContent="center"
            alignItems="center"
            xs={12}
            spacing={1}
            item={asGridItem}
            sx={gridSx}
        >
            <Grid item >
                <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    to={registerOption.url} component={Link}
                >
                    {registerOption.title}
                </Button>
            </Grid>
            <Grid item >
                <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    to={loginOption.url} component={Link}
                >
                    {loginOption.title}
                </Button>
            </Grid>
            <Grid item >
                <Button
                    disableElevation
                    variant="contained"
                    color="secondary"
                    to={proceedOption.url} component={Link}
                >
                    {proceedOption.title}
                </Button>
            </Grid>
        </Grid>
    );
}

export default StartingOptions;