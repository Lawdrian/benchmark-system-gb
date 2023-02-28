import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {RatingTableData} from "./RatingTable";

type OptimizationRowData = {
    name: string
    optimal: string
}

export type OptimizationTableData = {
    section: string
    data: OptimizationRowData[]
}

type OptimizationTableProps = {
    tableData: OptimizationTableData[],
    ratingTableData: RatingTableData[]
}

/**
 * This functional component renders an optimization table.
 *
 * It displays resource friendly options for the various aspects, that the greenhouse cultivation consists off.
 *
 * @param tableData - The data to be displayed in the table
 * @param ratingTableData - Ratings, to determine what categories to display
 */
export const OptimizationTable = ({tableData, ratingTableData}: OptimizationTableProps) => {

     ratingTableData = ratingTableData.filter(rating => {
         return rating.rating == 5 // 5 stars
    })

    // delete categories from the tableData, where the user has scored 5 stars
    tableData = tableData.filter(data => {
        return !ratingTableData.some(rating => rating.name == data.section);
    })

    return(
        <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                    <TableHead  sx={{
                                borderBottom: "2px solid black",
                                "& th": {
                                  fontSize: "1.25rem",
                                  color: "rgba(96, 96, 96)"
                                }
                              }}
                    >
                        <TableRow>
                            <TableCell width={500}>Kategorie</TableCell>
                            <TableCell width={500}>Option</TableCell>
                            <TableCell width={500}>optimale Lösung</TableCell>
                        </TableRow>
                    </TableHead>
                    {tableData.map((table) => (
                        <>
                            <TableBody>
                                {table.data.map((row) => (
                                    <TableRow
                                        key={row.name}
                                    >
                                        <TableCell width={500}>{table.section}</TableCell>
                                        <TableCell width={500}>{row.name}</TableCell>
                                        <TableCell width={500}>{row.optimal}</TableCell>
                                    </TableRow>
                              ))}
                            </TableBody>
                        </>
                    ))}
                </Table>
            </TableContainer>
        )

}