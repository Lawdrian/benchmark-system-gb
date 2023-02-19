import React, {useEffect, useState} from "react";
import {Grid, LinearProgress} from "@mui/material";
import { calculateRating } from "./RatingTable";

type efficiencyBarProps = {
    currentEfficiency: number
}

 export const calculateEfficiency = (percentageIncreases: number[]) => {
    if (percentageIncreases != null && percentageIncreases.length != 0) {
        const percentageSum = percentageIncreases.reduce((a, b) => {
            return a + calculateRating(b)
        }, 0)
        const percentageAvg = (percentageSum / percentageIncreases.length)
        return percentageAvg / 5 * 100
        /*
        const percentageSum = percentageIncreases.reduce((a, b) => {return a+b})
        const percentageAvg = (percentageSum / percentageIncreases.length)
        console.log("avg: " + percentageAvg + "; sum: " + percentageSum)
        if (percentageAvg < 100) {
            return Math.min(100 - percentageAvg, 100)
        }
        */
    }
    return 0
}


const EfficiencyBar = ({currentEfficiency}: efficiencyBarProps) => {
    const [progress1, setProgress1] = useState(0)
    const [progress2, setProgress2] = useState(0)
    const [progress3, setProgress3] = useState(0)
    const [progress4, setProgress4] = useState(0)
    const [progressName, setProgressName] = useState("perfekt")
    const [progressColor, setProgressColor] = useState<colorType>("primary")
    type colorType =  "primary" | "inherit" | "secondary" | "error" | "info" | "success" | "warning" | undefined
    useEffect(() => {
        if (currentEfficiency >= 100) {
            setProgress1(100)
            setProgress2(100)
            setProgress3(100)
            setProgress4(100)

        } else if (currentEfficiency <= 25) {
            setProgress1(currentEfficiency * 4)
            setProgress2(0)
            setProgress3(0)
            setProgress4(0)
            setProgressColor("error")
            setProgressName("schlecht")
        } else if (currentEfficiency <= 50) {
            setProgress1(100)
            setProgress2((currentEfficiency - 25) * 4)
            setProgress3(0)
            setProgress4(0)
            setProgressColor("warning")
            setProgressName("ausbaufähig")
        } else if (currentEfficiency <= 75) {
            setProgress1(100)
            setProgress2(100)
            setProgress3((currentEfficiency - 50) * 4)
            setProgress4(0)
            setProgressColor("info")
            setProgressName("gut")
        } else if (currentEfficiency <= 100) {
            setProgress1(100)
            setProgress2(100)
            setProgress3(100)
            setProgress4((currentEfficiency - 75) * 4)
            setProgressColor("success")
            setProgressName("sehr gut")
        }

    }, [currentEfficiency])

    return(
        <Grid item container xs={12} spacing={1}>
            <Grid item container xs={12} direction={"row"} spacing={2}>
                <Grid item xs={3}>
                    <LinearProgress sx={{height: 10}} color={progressColor} variant={"determinate"} value={progress1} />
                </Grid>
                <Grid item xs={3}>
                    <LinearProgress sx={{height: 10}} color={progressColor} variant={"determinate"} value={progress2} />
                </Grid>
                <Grid item xs={3}>
                    <LinearProgress sx={{height: 10}} color={progressColor} variant={"determinate"} value={progress3} />
                </Grid>
                <Grid item xs={3}>
                    <LinearProgress sx={{height: 10}} color={progressColor} variant={"determinate"} value={progress4} />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                Ihre Ressourceneffizienz: <b>{progressName}</b>
            </Grid>
        </Grid>
    )
}

export default EfficiencyBar
