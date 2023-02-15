import {
    Grid,
    LinearProgress,
    Paper, Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography, useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {OptimisationTable, OptimisationTableData} from "./OptimisationTable";
import {FootprintPlot} from "../../../types/reduxTypes";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import {styled} from "@mui/material/styles";

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
export const CO2FootprintOptimisation = ({data, normalizedUnit}: CO2FootprintOptimizationData) => {

    const bestPerformer = data.datasets[0].data.length-1
    const recentDataset = bestPerformer -1

    const dataLabels = data.datasets.map( (dataset) => {
        return dataset.label
    })

    const percentageIncreases = data.datasets.map( (dataset) => {
        return (dataset.data[recentDataset] - dataset.data[bestPerformer]) / dataset.data[bestPerformer] * 100 || 0
    })

    const calculateRating = (percentageIncrease: number): number => {
        if (percentageIncrease != null) {
            switch (true) {
                case (percentageIncrease < 10):
                    return 5
                case (percentageIncrease < 50):
                    return 4
                case (percentageIncrease < 100):
                    return 3
                case (percentageIncrease < 200):
                    return 2
                default:
                    return 1
            }
        }
        return 1

    }

    const calculateEfficiency = (percentageIncreases: number[]) => {
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

    const ratingTableData: RatingTableData[] =
        dataLabels.map( (label, idx) => {
            return({
                name: label,
                value: parseFloat(data.datasets[idx].data[recentDataset].toFixed(2)),
                rating: calculateRating(percentageIncreases[idx]),
            })
        })

    const simpleWaermetraegerTableData:OptimisationTableData[] = [
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

    const simpleStromTableData:OptimisationTableData[] = [
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
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Ihre Ressourceneffizienz</Typography>
            </Grid>
            <EfficiencyBar currentEfficiency={calculateEfficiency(percentageIncreases)}/>
            <Grid item xs={12}>
                Die Effizienz ihres Gewächshauses setzt sich aus folgenden Punkten zusammen:
            </Grid>
            <Grid item xs={12}>
            <RatingTable tableData={ratingTableData} unit={normalizedUnit}/>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h3"}>Optimierung</Typography>
            </Grid>
            <Grid item xs={12}>
                Um den CO2 und H2O Footprint zu minimieren, können Sie mehrere Änderungen an Ihrem Gewächshaus vornehmen. Im folgenden sind ein paar Vorschläge und deren Auswirkung aufgelistet:
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h4"}>GWH Konstruktion</Typography>
            </Grid>
            <Grid item xs={12}>
                Die Gewächshauskonstruktion ist entscheidend für eine effiziente Produktion. Hier ist es als relevant einzuschätzen, zum einen die Konstruktionsmaterialien möglichst gering zu halten, aber zum anderen eine optimale energetische Effizienz zu gewährleisten.
                <br/>
                <br/>
                Achten Sie zudem auf die thermische Dichte des Gewächshauses um ungewollten Luftwechsel zu vermeiden.
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h4"}>Energieverbrauch</Typography>
            </Grid>
            <Grid item xs={12}>
                Der Energieverbrauch ist ein entscheidender Faktor bezüglich des CO2-Fußabdrucks und stellt somit eine Stellschraube für mögliche langfristige Optimierungsmaßnahmen. Hierbei birgt eine Umstellung auf nachhaltigere Wärmeträger, sowie Stromquellen zusätzlich noch potentielle Kostenvorteile.
            </Grid>
            <Grid container item xs={12} direction={"row"}>
                <Grid item container xs={6} alignItems={"start"} justifyContent={"center"}>
                    <Grid item container xs={12} sx={{mr: 2}}>
                        <Typography variant={"h5"}>Wärmeverbrauch</Typography>
                        Sie verwenden für die Wärmeproduktion hauptsächlich Braunkohle und prduzieren dadurch 2000 kg CO2 jährlich. Das entspricht dem jährlichen Verbrauch von 2 Haushalten. Wenn sie auf eine umweltfreundlichere Alternative wechseln, können Sie bis zu 50 % einsparen.
                    </Grid>
                </Grid>
                <Grid container item direction={"column"} xs={6}>
                    <OptimisationTable
                        unit={"kg CO2"}
                        data={simpleWaermetraegerTableData}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={12} direction={"row"}>
                <Grid item container xs={6} alignItems={"start"} justifyContent={"center"}>
                    <Grid item container xs={12} sx={{mr: 2}}>
                        <Typography variant={"h5"}>Strom</Typography>
                        Sie verwenden als für die Stromproduktion blabla und prduzieren dadurch 2000 kg CO2 jährlich. Das entspricht dem jährlichen Verbrauch von 1 Haushalt. Wenn sie auf eine umweltfreundlichere Alternative wechseln, können Sie bis zu 75 % einsparen.
                    </Grid>
                </Grid>
                <Grid container item direction={"column"} xs={6}>
                    <OptimisationTable unit={"kg CO2"} data={simpleStromTableData}/>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{textDecoration: 'underline'}} display={"inline"} variant={"h4"}>Verbrauchsmittel</Typography>
            </Grid>
            <Grid item xs={12}>
                Weniger Dünger nutzen ist gut. Dies ist durch ein Rezirkulierendes System gut erreichbar.
            </Grid>
        </Grid>
    )
}

type efficiencyBarProps = {
    currentEfficiency: number
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

export type RatingTableData = {
    name: string
    value: number
    rating: number
}

type ratingTableProps = {
    tableData: RatingTableData[]
    unit: string
}

const RatingTable = ({tableData, unit}: ratingTableProps) => {

    const theme = useTheme()

    const StyledRating = styled(Rating)({
      '& .MuiRating-iconFilled': {
        color: "#7ab800",
      },
      '& .MuiRating-iconHover': {
        color: "#7ab800",
      },
    });



    return (
        <TableContainer component={Paper}>
            <Table  aria-label="simple table">
                <TableHead  sx={{borderBottom: "2px solid black", "& th": {fontSize: "1.25rem", color: "rgba(96, 96, 96)"}}}>
                    <TableRow>
                        <TableCell width={300}>{"Kategorie"}</TableCell>
                        <TableCell width={300}>{unit}</TableCell>
                        <TableCell>{"Rating"}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((data, index) => {
                        return(
                            <TableRow key={index}>
                                <TableCell width={300}>{data.name}</TableCell>
                                <TableCell width={300} sx={{ fontSize: "1rem"}}>{data.value}</TableCell>
                                <TableCell><StyledRating icon={<EnergySavingsLeafIcon/>} emptyIcon={<EnergySavingsLeafIcon/>} value={data.rating} readOnly/></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}