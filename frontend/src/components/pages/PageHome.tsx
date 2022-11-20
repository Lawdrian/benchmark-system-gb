import React from "react";
import {Box, Container, Grid, Typography} from "@mui/material";

import Overview_Project from '../../images/overview_project.png'
import Overview_Plot from '../../images/overview_plot2.png'

type HomepageProps = {

}

/**
 * #####################################################################
 * This is the page component for rendering the pre data inputpage. The
 * user gets to this page by clicking on "Dateneingabe" on the left
 * drawer. This page lets the user select one of his greenhouses, or
 * create a new one. The user will then be bought to the input page:
 * PageInputData.tsx
 *######################################################################
 */
const PageHome = (props: HomepageProps) => {


    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center´'
                }}
            >
                <Grid container sx={{pt:5, pb:5}} direction={"row"} xs={12} alignItems="center" justifyContent="center" >
                    <Grid item xs={12} >
                        <Typography component="h1" variant="h5">
                            Willkommen im Benchmark-Tool,
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <p>
                            wir helfen Ihnen dabei einen Überblick über Ihre CO2- und H2O-Footprints zu schaffen, diese im Wettbewerbsvergleich zu betrachten und Optimierungsmaßnahmen durchzuführen.
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <img src={Overview_Project} alt="Overview Project"/>
                    </Grid>
                    <Grid item xs={12}>
                        <p>
                            Unsere Seite ist untergliedert in die folgenden Menüpunkte:
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Dateneingabe
                        </Typography>
                        <p>
                            Im Menüpunkt Dateneingabe können Sie die CO2 und H2O Daten eines neuen Datensatzes eingeben. Dort werden Sie Schritt für Schritt durch den Prozess geführt.
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            CO2-Footprint
                        </Typography>
                        <Grid container xs={12} direction={"row"} spacing={1}>
                            <Grid item xs={7}>
                                <img width="100%" src={Overview_Plot} alt="Overview Project"/>
                            </Grid>
                            <Grid item xs={5}>
                                <p>
                                    Im Menüpunkt „CO2-Footprint” können Sie sich ihre neusten CO2-Fußabdruck anzeigen lassen. So können Sie auch zwischen den einzelnen Gewächshäusern wechseln, falls Sie mehrere hinterlegt haben.
                                    Zudem lässt sich der Fußabdruck spezifisch nach <b>Ertrag</b>, <b>Quadratmeter</b>, oder den einzelnen <b>Tomatengrößen</b> betrachten.
                                    Unter dem Reiter <b>Benchmark</b> finden Sie dort Ihren in einzelne Kategorien aufgeschlüsselten Fußabdruck im Vergleich zu Ihren Wettbewerbern.
                                    Unter dem Reiter <b>Optimierung</b> zeigen wir Ihnen spezifische Optimierungsmaßnahmen, die helfen könnten den CO2-Fußabdruck zu minimieren.
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            H20-Footprint
                        </Typography>
                        <Grid container xs={12}>
                            <p>
                                Der Menüpunkt „H2O-Footprint“ beinhaltet, vergleichbar zum CO2-Footprint, auch Ihren neusten H2O-Fußabdruck. <br/>
                                <br/>
                                Unter dem Reiter <b>Benchmark</b> finden Sie dort Ihren in einzelne Kategorien aufgeschlüsselten Fußabdruck im Vergleich zu Ihren Wettbewerbern.<br/>
                                <br/>
                                Unter dem Reiter <b>Optimierung</b> zeigen wir Ihnen spezifische Optimierungsmaßnahmen, die helfen könnten den CO2-Fußabdruck zu minimieren.<br/>
                            </p>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Profil
                        </Typography>
                        <Grid container xs={12}>
                            <p>
                                Der Bereich „Profil“ beinhaltet nicht nur Ihre Betriebsinformationen, sondern können Sie sich hier zusätzlich einen Überblick über alle hinterlegten Footprint-Datensätze machen.<br/>
                                Weiterführend ist gibt es hier die Option Ihren Account, sowie die hinterlegten Daten zu löschen.
                            </p>
                        </Grid>
                        <Grid container xs={12}>
                            <p>
                                Wir wünschen viel Erfolg bei der Dateneingabe und Analyse Ihrer Footprints.<br/>
                                <br/>
                                Mit freundlichen Grüßen,<br/>
                                Ihr Benchmark-Team
                            </p>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default PageHome;