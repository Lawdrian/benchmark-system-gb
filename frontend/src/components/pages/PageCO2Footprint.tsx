import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadCO2Footprint} from "../../actions/co2footprint";
import footprintPlot from "../utils/FootprintPlot";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {GreenhouseFootprint} from "../../types/reduxTypes";
import {SectionDivider} from "../utils/inputPage/layout";


const mapStateToProps = (state: RootState) => ({plotData: state.co2.plotData});
const connector = connect(mapStateToProps, {loadCO2Footprint});
type ReduxProps = ConnectedProps<typeof connector>

/**
 * @type C02FootprintProps
 */
type C02FootprintProps = ReduxProps & {}

/**
 * Returns the page showing a Dropdown menu for selecting the greenhouse to
 * show the plots for as well as the CO2-Footprint plots.
 *
 * @param {C02FootprintProps}
 * Divided into plotData (data of multiple greenhouses to be shown in the plot) and
 * loadCO2Footprint (a function to fetch the necessary data from the backend)
 * @return JSX.Element
 */
const PageC02Footprint = ({plotData, loadCO2Footprint}: C02FootprintProps) => {
    // Load CO2-Footprint data
    React.useEffect(() => {
        loadCO2Footprint()
    }, [])

    let greenhouses = plotData
        .map(dataset => dataset.greenhouse)

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    // Return info message if data isn't loaded or no data entered yet:
    if (plotData.length == 0) {
        return (<p> Bisher wurden noch keine Daten erfasst oder geladen. <br/>
            Bitte warten Sie einen Moment oder geben Sie Daten zu Ihren Gewächshäusern <a
                href="/input-data">hier</a> ein.</p>)
    }


    function createTableData(data: GreenhouseFootprint): tableData[] {

        return (
            data.data.datasets.map(dataset => (
                {
                    section: dataset.label,
                    data: (
                        dataset.splitData[dataset.splitData.length -2].map( row => (
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

    type tableData = {
        section: string
        data: {
            name: string,
            co2: number
        }[]
    }

    const DataTable = (tableData:tableData[]) => {
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
                                        <TableCell >kg Co2 Äq</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.data.map((row) => (
                                        <TableRow
                                            key={row.name}
                                        >
                                        <TableCell>
                                            {row.name}
                                        </TableCell>
                                        <TableCell >{row.co2}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                            </>
                        ))}
                    </Table>
            </TableContainer>
        )
    }



    return (
        <div id="co2-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            {footprintPlot(
                ("CO2-Footprint für " + greenhouses[curGreenHouseIndex]),
                'kg',
                plotData[curGreenHouseIndex].data)}
            <SectionDivider
                title={`CO2 Daten des Datensatzes aus dem Jahr ${plotData[curGreenHouseIndex].data.labels[plotData[curGreenHouseIndex].data.labels.length -2]}`}
            />
            {DataTable(createTableData(plotData[curGreenHouseIndex]))}

        </div>
    );
}

export default connector(PageC02Footprint);
