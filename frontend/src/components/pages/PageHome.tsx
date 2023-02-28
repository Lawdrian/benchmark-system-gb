import React from "react";
import {Box, Divider, Grid, Typography} from "@mui/material";

import Overview_Project from '../../assets/overview_project.png'
import OverviewPlotH2O from '../../assets/overview_plot_h2o.png'
import OverviewPlotCO2 from '../../assets/overview_plot_co2.png'
import {RootState} from "../../store";
import {loadDatasets} from "../../actions/dataset";
import {connect, ConnectedProps} from "react-redux";
import {CO2, H2O} from "../../helpers/LayoutHelpers";

type PageHomeProps =  ReduxProps & {}


const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset
});

const mapDispatchToProps = {
    loadDatasets,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>



/**
 * This is the page component for rendering the pre data inputpage.
 *
 * The user gets to this page by clicking on "Dateneingabe" on the left drawer.
 * This page lets the user select one of his greenhouses, or create a new one.
 * The user will then be bought to the input page: PageInputData.tsx
 *
 * @param loadDatasets - Function that requests the datasets from the back end (preload data for pre input page)
 * @param dataset - Redux dataset state
 */
const PageHome = ({loadDatasets, dataset}: PageHomeProps) => {

    // preload datasets for profile page and pre input page
    React.useEffect(() => {
        if (!dataset.successful) {
            loadDatasets()
        }
    }, [])

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center´'
            }}
        >
            <Grid container direction={"row"} xs={12} alignItems="center" justifyContent="center" >
                <Grid item xs={12} >
                    <Typography variant={"h4"}>
                        Willkommen
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 3, bgcolor: "black"  }}/>
                    <br/>
                </Grid>
                <Grid item xs={12} sx={{textAlign:"justify"}}>
                    <p>
                        Der mitteleuropäische Gartenbau steht mit den zunehmenden klimatischen Veränderungen vor großen Herausforderungen. Eine Möglichkeit die Umsetzung von klimapolitischen Maßnahmen auf Erzeugerebene aufzuzeigen, ist ein Vergleichsinstrument, welches den Ursprung von Emissionen aufzeigt und Handlungsempfehlungen gibt.<br/>
                        <br/>
                        Das Benchmark-Tool ermöglicht Ihnen einen schnellen Überblick über Ihren (Unternehmens-) spezifischen {CO2}- und {H2O}-Footprint basierend auf der ISO Norm ISO 14067. Das Tool ist speziell für die Tomatenproduktion unter Glas entwickelt.
                        Mit wenigen Klicks wird Ihnen Ihr Ergebniss sowohl für das aktuelle Jahr, als auch nach Wunsch für historische Daten kalkuliert und mit annonymisierten Daten einer Datenbank im Vergleich präsentiert.
                    </p>
                </Grid>
                <Grid item xs={12}>
                    <img src={Overview_Project} width={1000} alt="Overview Project"/>
                </Grid>
                <Grid sx={{textAlign:"justify"}} item xs={12}>
                    <Typography variant={"h6"}>
                        Dateneingabe
                    </Typography>
                    <p>
                        Sie werden Schritt für Schritt durch den Prozess des Ausfüllens aller Informationen zum Gewächshaus, sowie  zu den Kategorien Betriebsdaten, Kulturdaten, Energieverbauch, Wasserbrauch, Hilfsstoffe und Betriebsstoffe geführt.
                    </p>
                </Grid>
                <Grid  item xs={12}>
                    <Typography sx={{pt:10, pb:5}} variant={"h6"}>
                        {H2O}-Footprint
                    </Typography>
                    <Grid container xs={12} direction={"row"} spacing={1}>
                        <Grid item xs={6}>
                            <img width="100%" src={OverviewPlotH2O} alt="Overview Project"/>
                        </Grid>
                        <Grid sx={{textAlign:"justify"}} item xs={6}>
                            <p>
                                Unter dem Menüpunkt "{H2O}-Footprint" können Sie sich Ihren aktuellen H2O-Footprint visualisieren lassen. Falls Sie mehrere GWH gespeichert haben können Sie zudem zwischen diesen wechseln. Die Kalkulation erfolgt spezifisch für definierte Fruchtgrößen.<br/>
                                <br/>
                                Folgende <b>funktionalen Einheiten</b> können visualisiert  werden: Ertrag, Quadratmeter.<br/>
                                <br/>
                                Als <b>direkter Wasserverbrauch</b> werden die Kategorien: Brunnenwasser, Regenwasser, Stadtwasser und Oberflächenwasser verwendet.<br/>
                                <br/>
                                Unter der Registerkarte Optimierung sehen Sie eine progressive Linie, die <b>Ihre Ressourceneffizienz</b> mit den größten Einflussparametern anzeigt sowie auf Wunsch über Empfehlungen informiert.<br/>
                            </p>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{pt:10, pb:5}} variant={"h6"}>
                        {CO2}-Footprint
                    </Typography>
                    <Grid container xs={12} direction={"row"} spacing={1}>
                        <Grid item xs={6}>
                            <img width="100%" src={OverviewPlotCO2} alt="Overview Project"/>
                        </Grid>
                        <Grid  sx={{textAlign:"justify"}} alignItems={"center"} justifyContent={"center"} item xs={6}>
                            <p>
                                Unter dem Menüpunkt "{CO2}-Footprint" können Sie sich Ihren aktuellen {CO2}-Footprint visualisieren lassen. Falls Sie mehrere GWH gespeichert haben können Sie zudem zwischen diesen wechseln. Die Kalkulation erfolgt spezifisch für definierte Fruchtgrößen.<br/>
                                <br/>
                                Folgende <b>funktionalen Einheiten</b> können visualisiert  werden: Ertrag, Quadratmeter.<br/>
                                <br/>
                                Unter der Registerkarte Benchmark finden Sie Ihren Footprint aufgeschlüsselt nach den wichtigsten Kategorien: GWH Kontruktion, Wärmeträger, Strom, Hilfsstoffe und Betriebsstoffe.<br/>
                                <br/>
                                Unter der Registerkarte Optimierung sehen Sie eine progressive Linie, die <b>Ihre Ressourceneffizienz</b> mit den größten Einflussparametern anzeigt sowie auf Wunsch über Empfehlungen informiert<br/>
                            </p>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
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
    )
}

export default connector(PageHome);