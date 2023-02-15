import {GreenhouseFootprint} from "../../../types/reduxTypes";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";

type FootprintTableData = {
    section: string
    total: number
    data: {
        name: string,
        co2: number
    }[]
}

/**
 * This function maps the data of a data set into the correct format to be displayed in a table
 * @param data - Footprint data object
 */
function createFootprintTableData(data: GreenhouseFootprint): FootprintTableData[] {
    return (
        data.data.datasets.map(dataset => (
            {
                section: dataset.label,
                total: +dataset.data[dataset.data.length - 1].toFixed(2),
                data: (
                    dataset.splitData[dataset.splitData.length - 1].map(row => (
                        {
                            name: row.name,
                            co2: row.value
                        }
                    ))
                )
            }
        ))
    )
}

type footprintTableProps = {
    footprintData: GreenhouseFootprint
    unit: string
}

/**
 * This functional component renders a table displaying the calculated co2 footprint for one dataset.
 * It uses the {@link createFootprintTableData} function to map the data into the correct format.
 *
 * @param footprintData - Footprint data object
 * @param unit - The unit of the values displayed
 */
export const FootprintTable = ({footprintData, unit}:footprintTableProps) => {

    const tableData: FootprintTableData[] = createFootprintTableData(footprintData)


    return(
        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
                <Table  aria-label="simple table">
                    {tableData.map((table) => (
                        <>
                            <TableHead  sx={{
                                borderBottom: "2px solid black",
                                "& th": {
                                  fontSize: "1.25rem",
                                  color: "rgba(96, 96, 96)"
                                }
                              }}>
                                <TableRow>
                                    <TableCell>{table.section}</TableCell>
                                    <TableCell >{unit}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key="Gesamt">
                                    <TableCell><b>Gesamt</b></TableCell>
                                    <TableCell sx={{ fontSize: "1rem"}}><b>{table.total}</b></TableCell>
                                </TableRow>
                                {table.data.map((row) => (
                                    <TableRow
                                        key={row.name}
                                    >
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem"}}>{row.co2}</TableCell>
                                    </TableRow>
                              ))}
                            </TableBody>
                        </>
                    ))}
                </Table>
        </TableContainer>
    )
}