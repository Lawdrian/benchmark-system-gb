import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";

export type OptimisationTableData = {
    name: string
    percentage: number
    value: number
}

type OptimisationTableProps = {
    unit: string
    data: OptimisationTableData[]

}

/**
 * This functional component renders an optimization table.
 * @param props - unit is the name of the unit and data is the data used to display the optimization data
 */
export const OptimizationTable = (props:OptimisationTableProps) => {

    const selectedOption = props.data[0]
    const improvingOptions = props.data.slice(1) // returns all elements of the array apart from the first one

    return(
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
            <Table  aria-label="simple table">
                <TableHead  sx={{borderBottom: "2px solid black", "& th": {fontSize: "1.25rem", color: "rgba(96, 96, 96)"}}}>
                    <TableRow>
                        <TableCell width={300}>{"Auswahl"}</TableCell>
                        <TableCell>{"%"}</TableCell>
                        <TableCell>{props.unit}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={selectedOption.name}>
                        <TableCell width={300}><b>{selectedOption.name}</b></TableCell>
                        <TableCell sx={{ fontSize: "1rem"}}><b>{selectedOption.percentage}</b></TableCell>
                        <TableCell sx={{ fontSize: "1rem"}}><b>{selectedOption.value}</b></TableCell>
                    </TableRow>
                    {improvingOptions.map(option => {
                        return(
                            <TableRow key="Gesamt">
                                <TableCell width={300}>{option.name}</TableCell>
                                <TableCell sx={{ fontSize: "1rem"}}>{option.percentage}</TableCell>
                                <TableCell sx={{ fontSize: "1rem"}}>{option.value}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}