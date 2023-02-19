import {Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme} from "@mui/material";
import {styled} from "@mui/material/styles";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import React from "react";

export type RatingTableData = {
    name: string
    value: number
    rating: number
}

type ratingTableProps = {
    tableData: RatingTableData[]
    unit: string
}

export const calculateRating = (percentageIncrease: number): number => {
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

const RatingTable = ({tableData, unit}: ratingTableProps) => {

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

export default RatingTable