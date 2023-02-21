import {
    Paper,
    Rating,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme
} from "@mui/material";
import {styled} from "@mui/material/styles";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import React from "react";

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