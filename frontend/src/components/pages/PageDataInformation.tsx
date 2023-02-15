import React from "react";
import {Box, Container, Grid, Typography} from "@mui/material";

import Table from '../../assets/table.png'
import Logo from '../../assets/data_information_logo.png'

/**
 * This is the page component for rendering the data information page.
 *
 * The user gets to this page by clicking on the "Datenschutz" link during
 * registration. This page shows the user what kind of data gets saved
 * and for what purpose. It also tells him about his rights.
 */
const PageDataInformation = () => {
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
                    <Grid container item xs={12} alignItems={"center"} justifyContent={"center"}>
                        <img src={Logo} alt={"Logo"}/>
                    </Grid>
                    <Grid container item sx={{mt:3}} xs={12} alignItems={"center"} justifyContent={"center"}>
                        <Typography component="h1" variant="h4">
                            Informationsblatt gemäß Art. 13 & 14 DSGVO
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{mt:1}}>
                        <img width="100%" height="auto"  src={Table} alt={"Informationen"}/>
                    </Grid>
                    <Grid item xs={12}>
                        <p>
                            <b>Wir informieren Sie hiermit darüber, dass</b> Sie gemäß Artikel 15 ff.
                            DSGVO uns gegenüber unter den dort definierten Voraussetzungen das Recht auf <b>Auskunft</b> über die betreffenden personenbezogenen Daten sowie auf <b>Berichtigung</b> oder <b>Löschung</b> oder auf <b>Einschränkung</b> der Verarbeitung, ein <b>Widerspruchsrecht</b> gegen die Verarbeitung sowie das Recht auf <b>Datenübertragbarkeit</b> haben.
                            Auch haben Sie gemäß Artikel 77 DSGVO das Recht der <b>Beschwerde</b> bei einer Datenschutz-Aufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen diese Verordnung verstößt.
                            Wenn die Verarbeitung auf einer Einwilligung Ihrerseits beruht (vgl. Art. 6 Abs. 1 lit. a, Art. 9 Abs. 2 lit. a DSGVO), haben Sie ferner das Recht, die Einwilligung jederzeit zu <b>widerrufen</b>, ohne dass die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.
                        </p>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default PageDataInformation;