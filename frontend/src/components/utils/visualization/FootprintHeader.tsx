import React from "react";
import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography} from "@mui/material";
import {GreenhouseMenu} from "../GreenhouseMenu";
import {GreenhouseBenchmark, GreenhouseFootprint} from "../../../types/reduxTypes";

export const selectNormalizedPlotData = (kgData:any,m2Data:any, normalizedType:NormalizedType) => {
    if(normalizedType == NormalizedType.kg) return kgData
    else if(normalizedType == NormalizedType.m2) return m2Data
    else console.log("ERROR: Could not select NormalizedPlotData")
}

export const handleNormalizedTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setNormalizedType: Function
) => {
    if(event.target.value == NormalizedType.kg) setNormalizedType(NormalizedType.kg)
    else if(event.target.value == NormalizedType.m2) setNormalizedType(NormalizedType.m2)
    else console.log("Error: Toggle didn't work")
}

export enum NormalizedType {
    kg = "kg*a\u207b\u00b9",
    m2 = "m\u00b2*a\u207b\u00b9",
}

/**
 * This functional component creates the header for the footprint and benchmark plots.
 *
 * It contains the dropdown menu to select a greenhouse, as well as the radio buttons to switch the normalization type.
 * @param normalizedType - The currently selected value of the normalization radio button
 * @param greenhouses - The list of greenhouses the user owns
 * @param curGreenHouseIndex - The index of the currently selected greenhouse
 * @param setCurGreenHouseIndex - Function that sets the index of the currently selected greenhouse to a new one
 * @param handleNormalizedTypeChange - Function that is called, when the user changes the normalized type
 */
export const createFootprintPageHeader = (normalizedType:NormalizedType, greenhouses:string[], curGreenHouseIndex: number,  setCurGreenHouseIndex: (value:number) => void, handleNormalizedTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void) => {
    return(
         <Grid container>
                <Grid item xs alignItems={"center"} justifyContent={"center"}>
                    <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                        currentIndex={curGreenHouseIndex}
                    />
                </Grid>
        <Grid item xs alignItems={"flex-end"} justifyContent={"center"}>
                    <FormControl sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                      <FormLabel
                      sx={{
                        pr: 2
                        }}>
                          Normiert nach: </FormLabel>
                      <RadioGroup
                        row
                        value={normalizedType}
                        onChange={handleNormalizedTypeChange}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value={NormalizedType.kg} control={<Radio />} label={NormalizedType.kg} />
                        <FormControlLabel value={NormalizedType.m2} control={<Radio />} label={NormalizedType.m2} />
                      </RadioGroup>
                    </FormControl>
                </Grid>
         </Grid>
    )
}

/**
 * This functional component renders the metadata of a performer. It used by certain plots that display
 * a best or worst performer.
 *
 * If the plot data from a benchmark plot, then the metadata is displayed for both best and worst performer.
 * @param footprintData - Footprint data
 * @param curGreenHouseIndex - The current index of the selected greenhouse
 */
export const createFootprintProductionTypeHeader = (footprintData:GreenhouseFootprint[] | GreenhouseBenchmark[], curGreenHouseIndex: number) => {
    // typeguard
    if((footprintData[curGreenHouseIndex] as GreenhouseBenchmark).worstPerformerDate !== undefined) {
        return(
            <Grid container direction={"row"} xs={12}>
                <Grid item xs={6} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant={"h6"}>Datensatz Performer:</Typography>
                </Grid>
                <Grid item container xs={6} direction={"column"}>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Produktionstyp = <b>{footprintData[curGreenHouseIndex].performerProductionType}</b>
                    </Grid>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Best Performer Jahr = <b>{footprintData[curGreenHouseIndex].bestPerformerDate}</b>
                    </Grid>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Worst Performer Jahr = <b>{(footprintData[curGreenHouseIndex] as GreenhouseBenchmark).worstPerformerDate}</b>
                    </Grid>
                </Grid>
            </Grid>
        )
    } else {
        return(
            <Grid container direction={"row"} xs={12}>
                <Grid item xs={6} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant={"h6"}>Datensatz Performer:</Typography>
                </Grid>
                <Grid item container xs={6} direction={"column"}>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Produktionstyp = <b>{footprintData[curGreenHouseIndex].performerProductionType}</b>
                    </Grid>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Jahr = <b>{footprintData[curGreenHouseIndex].bestPerformerDate}</b>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}