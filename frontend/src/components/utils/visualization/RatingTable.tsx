import {Paper, Rating, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {styled} from "@mui/material/styles";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import React from "react";
import {OptimizationDataset} from "../../../types/reduxTypes";

const WaterIcon = () => {
    return <SvgIcon
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 24 24"
        height="24"
        viewBox="0 0 24 24"
        width="24">
        <rect
            fill="none"
            height="24"
            width="24"/>
        <path
            d="M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M7.83,14 c0.37,0,0.67,0.26,0.74,0.62c0.41,2.22,2.28,2.98,3.64,2.87c0.43-0.02,0.79,0.32,0.79,0.75c0,0.4-0.32,0.73-0.72,0.75 c-2.13,0.13-4.62-1.09-5.19-4.12C7.01,14.42,7.37,14,7.83,14z"/>
    </SvgIcon>
}

export type RatingTableData = {
    name: string
    value: number
    rating: number
}

type ratingTableProps = {
    tableData: RatingTableData[]
    unit: string
    useH2OIcon: boolean
}

export const createRatingValues = (data: OptimizationDataset[], recentDataset: number, bestPerformer: number, worstPerformer: number) => {

    return data.map((dataset) => {
        if(dataset.data[recentDataset] == 0 || dataset.data[recentDataset] < dataset.data[bestPerformer]) {
            return 1.1 // 5 stars
        }
        if(dataset.data[recentDataset] > dataset.data[worstPerformer]) {
            return -0.1 // 0 stars
        }
        console.log("category: " + dataset.label)
        console.log("recentDataset: " + dataset.data[recentDataset])
        console.log("bestPerformer: " + dataset.data[bestPerformer])
        console.log("worstPerformer: " + dataset.data[worstPerformer])
        const result = ((dataset.data[recentDataset] - dataset.data[worstPerformer]) / (dataset.data[bestPerformer] - dataset.data[worstPerformer])) || 0
        console.log("result: " + result)
        return result
    })
}


export const createRatingTableData = (data: OptimizationDataset[], ratingValues: number[], recentDataset: number): RatingTableData[] => {

    const dataLabels = data.map((dataset) => {
        return dataset.label
    })

    return dataLabels.map((label, idx) => {
        return ({
            name: label,
            value: parseFloat(data[idx].data[recentDataset].toFixed(2)),
            rating: calculateRating(ratingValues[idx]),
        })
    })

}


export const calculateRating = (ratingValue: number): number => {
    if (ratingValue != null) {
        switch (true) {
            case (ratingValue <= 0):
                return 0
            case (ratingValue < 0.25):
                return 1
            case (ratingValue < 0.5):
                return 2
            case (ratingValue < 0.75):
                return 3
            case (ratingValue < 1):
                return 4
            default:
                return 5
        }
    }
    return 0
}

/**
 * This functional component renders a table displaying the ratings for several categories of a footprint.
 *
 * @param tableData - Data to be displayed in the table
 * @param unit - Unit to be displayed in the table
 * @param useH2OIcon - Boolean value, that decides if the h2o icon or the co2 icon should be used for the ratings
 */
const RatingTable = ({tableData, unit, useH2OIcon}: ratingTableProps) => {

    let iconColor = '#7ab800'
    if(useH2OIcon) {
        iconColor = '#2884d2'
    }

    const StyledRating = styled(Rating)({
      '& .MuiRating-iconFilled': {
        color: iconColor,
      },
      '& .MuiRating-iconHover': {
        color: iconColor,
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
                                <TableCell>
                                    <StyledRating
                                        icon={useH2OIcon ? <WaterIcon/> : <EnergySavingsLeafIcon/>}
                                        emptyIcon={useH2OIcon ? <WaterIcon/> : <EnergySavingsLeafIcon/>}
                                        value={data.rating}
                                        readOnly
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default RatingTable