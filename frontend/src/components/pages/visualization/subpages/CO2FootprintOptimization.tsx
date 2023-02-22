import {Grid, Typography} from "@mui/material";
import React from "react";
import {OptimizationDataset} from "../../../../types/reduxTypes";
import RatingTable, {
    createRatingTableData, createRatingValues,
} from "../../../utils/visualization/RatingTable";
import EfficiencyBar, {calculateEfficiency} from "../../../utils/visualization/EfficiencyBar";
import {OptimizationTableData, OptimizationTable} from "../../../utils/visualization/OptimizationTable";

type CO2FootprintOptimizationData = {
    data: OptimizationDataset[]
    normalizedUnit: string
}

export const optimizationTableData:OptimizationTableData[] = [
        {
            section: "Gewächshaus Konstruktion",
            data: [
                {
                    name: "Bedachungsmaterial",
                    optimal: "Doppelstegplatte | Dreifachstegplatte"
                }, {
                    name: "Stehwandmaterial",
                    optimal: "Doppelstegplatte | Dreifachstegplatte"
                }, {
                    name: "Bodenabdeckung",
                    optimal: "Bodenfolie"
                }, {
                    name: "Schirmbauart",
                    optimal: "einfach | doppelt"
                }
            ]
        }, {
            section: "Wärmeträger",
            data: [
                {
                    name: "Wärmeträger",
                    optimal: "Tiefengeothermie"
                }
            ]
        }, {
            section: "Strom",
            data: [
                {
                    name: "Strom",
                    optimal: "Wasserkraft"
                }
            ]
        }, {
            section: "Wasserverbrauch",
            data: [
                {
                    name: "Wasserquelle",
                    optimal: "Regenwasser"
                }
            ]
        }, {
            section: "Hilfsstoffe",
            data: [
                {
                    name: "CO2 Zudosierung",
                    optimal: "direkte Gasverbrennung | eigenes BHKW"
                }
            ]
        }, {
            section: "Betriebsstoffe",
            data: [
                {
                    name: "Pflanzenbehälter",
                    optimal: "Kübel | Keine"
                }, {
                    name: "Substrat",
                    optimal: "Nachhaltiges Substrat"
                }, {
                    name: "Schnüre",
                    optimal: "Jute | Sisal | Zellulose"
                }, {
                    name: "Klipse",
                    optimal: "Nachhaltige / kompostierbare Option"
                }, {
                    name: "Rispenbügel",
                    optimal: "Nachhaltige / kompostierbare Option"
                }, {
                    name: "Verpackung",
                    optimal: "Karton"
                }
            ]
        },
    ]


/**
 * This component renders the optimization for a data set.
 * @param data
 * @param normalizedUnit
 * @constructor
 */
export const CO2FootprintOptimisation = ({data, normalizedUnit}: CO2FootprintOptimizationData) => {

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
            <RatingTable tableData={ratingTableData} unit={normalizedUnit} useH2OIcon={false}/>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Optimierung</Typography>
            </Grid>
            <Grid item xs={12}>
                Um den CO2 Footprint zu minimieren, können Sie mehrere Änderungen an Ihrem Gewächshaus vornehmen. Im folgenden sind ein paar ressourcenshonende Optionen aufgelistet:
            </Grid>
            <Grid item xs={12}>
                <OptimizationTable tableData={optimizationTableData} ratingTableData={ratingTableData}/>
            </Grid>
        </Grid>
    )
}
