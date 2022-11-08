import {Grid, Typography} from "@mui/material";
import React from "react";
import {OptimizationTable, OptimizationTableData} from "./OptimizationTable";


type CO2FootprintOptimizationData = {

}


export const CO2FootprintOptimization = () => {

    const simpleWärmeträgerTableData:OptimizationTableData[] = [
        {
            name: "Braunkohle",
            value: 2000,
            percentage: 100
        },        {
            name: "Erdgas",
            value: 1800,
            percentage: 90
        },        {
            name: "Tiefengeothermie",
            value: 1000,
            percentage: 50
        },
    ]

    const simpleStromTableData:OptimizationTableData[] = [
        {
            name: "Diesel",
            value: 2000,
            percentage: 100
        },        {
            name: "Deutscher Strommix",
            value: 1600,
            percentage: 80
        },        {
            name: "Wasserkraft",
            value: 500,
            percentage: 25
        },
    ]

    return(
        <Grid container xs={12} direction={"column"} spacing={2}>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>GWH Konstruktion</Typography>
            </Grid>
            <Grid item xs={12}>
                Die Gewächshauskonstruktion ist entscheidend für eine effiziente Produktion. Hier ist es als relevant einzuschätzen, zum einen die Konstruktionsmaterialien möglichst gering zu halten, aber zum anderen eine optimale energetische Effizienz zu gewährleisten.
                <br/>
                <br/>
                Achten Sie zudem auf die thermische Dichte des Gewächshauses um ungewollten Luftwechsel zu vermeiden.
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Energieverbrauch</Typography>
            </Grid>
            <Grid item xs={12}>
                Der Energieverbrauch ist ein entscheidender Faktor bezüglich des CO2-Fußabdrucks und stellt somit eine Stellschraube für mögliche langfristige Optimierungsmaßnahmen. Hierbei birgt eine Umstellung auf nachhaltigere Wärmeträger, sowie Stromquellen zusätzlich noch potentielle Kostenvorteile.
            </Grid>
            <Grid container item xs={12} direction={"row"}>
                <Grid item container xs={6} alignItems={"start"} justifyContent={"center"}>
                    <Grid item container xs={12} sx={{mr: 2}}>
                        <Typography variant={"h4"}>Wärmeverbrauch</Typography>
                        Sie verwenden für die Wärmeproduktion hauptsächlich Braunkohle und prduzieren dadurch 2000 kg CO2 jährlich. Das entspricht dem jährlichen Verbrauch von 2 Haushalten. Wenn sie auf eine umweltfreundlichere Alternative wechseln, können Sie bis zu 50 % einsparen.
                    </Grid>
                </Grid>
                <Grid container item direction={"column"} xs={6}>
                    <OptimizationTable
                        unit={"kg CO2"}
                        data={simpleWärmeträgerTableData}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={12} direction={"row"}>
                <Grid item container xs={6} alignItems={"start"} justifyContent={"center"}>
                    <Grid item container xs={12} sx={{mr: 2}}>
                        <Typography variant={"h4"}>Strom</Typography>
                        Sie verwenden als für die Stromproduktion blabla und prduzieren dadurch 2000 kg CO2 jährlich. Das entspricht dem jährlichen Verbrauch von 1 Haushalt. Wenn sie auf eine umweltfreundlichere Alternative wechseln, können Sie bis zu 75 % einsparen.
                    </Grid>
                </Grid>
                <Grid container item direction={"column"} xs={6}>
                    <OptimizationTable unit={"kg CO2"} data={simpleStromTableData}/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Verbrauchsmittel</Typography>
            </Grid>
            <Grid item xs={12}>
                Weniger Dünger nutzen ist gut. Dies ist durch ein Rezirkulierendes System gut erreichbar.
            </Grid>
        </Grid>
    )
}