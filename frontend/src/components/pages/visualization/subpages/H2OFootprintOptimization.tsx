import {Grid, Typography} from "@mui/material";
import React from "react";
import {OptimizationDataset} from "../../../../types/reduxTypes";
import RatingTable, {
    createRatingTableData,
    createRatingValues,
} from "../../../utils/visualization/RatingTable";
import EfficiencyBar, {calculateEfficiency} from "../../../utils/visualization/EfficiencyBar";

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
        </Grid>
    )
}



