import React from "react";
import {Box, Container, Divider, Grid, Typography} from "@mui/material";
import Overview_Project from "../../assets/overview_project.png";
import {CO2, H2O} from "../../helpers/LayoutHelpers";
import SupportImage from "../../assets/support_label.png";

/**
 * This component renders the about page, that displays some information about the project team.
 */
const PageAbout = () => {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center´'
            }}
        >
            <Grid container sx={{pb:5}} direction={"row"} xs={12} alignItems="center" justifyContent="center" >
                <Grid item xs={12} >
                <Typography variant={"h4"}>
                    Über uns
                </Typography>
                <Divider sx={{ borderBottomWidth: 3, bgcolor: "black"  }}/>
                <br/>
                </Grid>
                <Grid item xs={12} sx={{textAlign:"justify"}}>
                    <p>
                        Die Realisierung der Website Benchmark System für Gewächshausdaten wurde im Rahmen des Forschungsprojekts PROSIBOR (Process Simulation based on Plant Responce) an der Hochschule Weihenstephan-Triesdorf entwickelt.
                        Das Projekt wurde durch das Bundesministerium für Ernährung und Landwirtschaft im Förderprogramm „BLE-Programm zur Innovationsförderung“ gefördert. Wir danken explizit dem Projektpartner Neber Gemüse für die Unterstützung.
                        Weitere Projektpartner waren die Humboldt-Universität zu Berlin, die Firma RAM Mess- und Regeltechnik, Biogärtnerei Watzkendorf.
                    </p>
                </Grid>
                <Grid item xs={12}>
                    <img src={SupportImage} width={350} alt="government support"/>
                </Grid>

            </Grid>
        </Box>
    )
}

export default PageAbout;