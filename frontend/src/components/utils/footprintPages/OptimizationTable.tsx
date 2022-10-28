import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";

export type OptimizationTableData = {
    name: string
    percentage: number
    value: number
}

type OptimizationTableProps = {
    unit: string
    data: OptimizationTableData[]

}

export const OptimizationTable = (props:OptimizationTableProps) => {

    const selectedOption = props.data[0]
    const improvingOptions = props.data.slice(1) // Returns all elements of the array apart from the first one

    return(
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
            <Table  aria-label="simple table">
                <TableHead  sx={{borderBottom: "2px solid black", "& th": {fontSize: "1.25rem", color: "rgba(96, 96, 96)"}}}>
                    <TableRow>
                        <TableCell>{"Auswahl"}</TableCell>
                        <TableCell >{"%"}</TableCell>
                        <TableCell >{props.unit}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={selectedOption.name}>
                        <TableCell><b>{selectedOption.name}</b></TableCell>
                        <TableCell sx={{ fontSize: "1rem"}}><b>{selectedOption.percentage}</b></TableCell>
                        <TableCell sx={{ fontSize: "1rem"}}><b>{selectedOption.value}</b></TableCell>
                    </TableRow>
                    {improvingOptions.map(option => {
                        return(
                            <TableRow key="Gesamt">
                                <TableCell>{option.name}</TableCell>
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