import {Grid, Typography} from "@mui/material";
import React from "react";
import {OptimizationTable, OptimisationTableData} from "../../../utils/visualization/OptimizationTable";
import {FootprintPlot} from "../../../../types/reduxTypes";
import RatingTable, {calculateRating, RatingTableData} from "../../../utils/visualization/RatingTable";
import EfficiencyBar, {calculateEfficiency} from "../../../utils/visualization/EfficiencyBar";

type CO2FootprintOptimizationData = {
    data: FootprintPlot
    normalizedUnit: string
}

/**
 * This component renders the optimization for a data set.
 * @param data
 * @param normalizedUnit
 * @constructor
 */
export const H2OFootprintOptimisation = ({data, normalizedUnit}: CO2FootprintOptimizationData) => {

    const bestPerformer = data.datasets[0].data.length-1
    const recentDataset = bestPerformer -1

    const dataLabels = data.datasets.map( (dataset) => {
        return dataset.label
    })

    const percentageIncreases = data.datasets.map( (dataset) => {
        return (dataset.data[recentDataset] - dataset.data[bestPerformer]) / dataset.data[bestPerformer] * 100 || 0
    })

    const ratingTableData: RatingTableData[] =
        dataLabels.map( (label, idx) => {
            return({
                name: label,
                value: parseFloat(data.datasets[idx].data[recentDataset].toFixed(2)),
                rating: calculateRating(percentageIncreases[idx]),
            })
        })

    return(
        <Grid container xs={12} direction={"column"} spacing={2}>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Ihre Ressourceneffizienz</Typography>
            </Grid>
            <EfficiencyBar currentEfficiency={calculateEfficiency(percentageIncreases)}/>
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



