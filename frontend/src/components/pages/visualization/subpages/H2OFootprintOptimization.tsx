import {Grid, Typography} from "@mui/material";
import React from "react";
import {OptimizationDataset} from "../../../../types/reduxTypes";
import RatingTable, {
    createRatingTableData,
    createRatingValues,
} from "../../../utils/visualization/RatingTable";
import EfficiencyBar, {calculateEfficiency} from "../../../utils/visualization/EfficiencyBar";
import {OptimizationTable} from "../../../utils/visualization/OptimizationTable";
import {optimizationTableData} from "./CO2FootprintOptimization";
import DroughtDevelopmentGif from "../../../../assets/drought_development.gif"

type H2OFootprintOptimizationData = {
    data: OptimizationDataset[]
    normalizedUnit: string
}

/**
 * This component renders the optimization for a data set.
 * @param data
 * @param normalizedUnit
 * @constructor
 */
export const H2OFootprintOptimisation = ({data, normalizedUnit}: H2OFootprintOptimizationData) => {

    const worstPerformer = data[0].data.length - 1
    const bestPerformer = worstPerformer - 1
    const recentDataset = worstPerformer - 2

    const ratingValues = createRatingValues(data, recentDataset, bestPerformer, worstPerformer)
    const ratingTableData = createRatingTableData(data, ratingValues, recentDataset)

    return(
        <Grid container xs={12} direction={"column"} spacing={2}>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Ihre Ressourceneffizienz</Typography>
            </Grid>
            <EfficiencyBar currentEfficiency={calculateEfficiency(ratingValues)}/>
            <Grid item xs={12}>
                Die Effizienz ihres Gewächshauses setzt sich aus folgenden Punkten zusammen:
            </Grid>
            <Grid item xs={12}>
            <RatingTable tableData={ratingTableData} unit={normalizedUnit} useH2OIcon={true}/>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Optimierung</Typography>
            </Grid>
            <Grid item xs={12}>
                Um den H2O Footprint zu minimieren, können Sie mehrere Änderungen an Ihrem Gewächshaus vornehmen. Im folgenden sind ein paar ressourcenshonende Optionen aufgelistet:
            </Grid>
            <Grid item xs={12}>
                <OptimizationTable tableData={optimizationTableData} ratingTableData={ratingTableData}/>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Dürre Entwicklung in Deutschland</Typography>
            </Grid>
            <Grid item xs={12}>
                <img src={DroughtDevelopmentGif} alt={"Dürre entwicklung"}/>
            </Grid>
        </Grid>
    )
}



