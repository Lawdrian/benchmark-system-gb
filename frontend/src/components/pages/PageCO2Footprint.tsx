import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadCO2Footprint} from "../../actions/co2footprint";
import footprintPlot from "../utils/FootprintPlot";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import {
    Paper, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs,
} from "@mui/material";
import {GreenhouseFootprint} from "../../types/reduxTypes";
import {SectionDivider} from "../utils/inputPage/layout";
import {indexedTabProps, TabPanel} from "../utils/TabPanel";


const mapStateToProps = (state: RootState) => ({plotData1: state.co2.plotData1, plotData2: state.co2.plotData2});
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
const PageC02Footprint = ({plotData1, plotData2, loadCO2Footprint}: C02FootprintProps) => {
    // Load CO2-Footprint data
    React.useEffect(() => {
        loadCO2Footprint()
    }, [])

    const [tab, setTab] = useState<number>(0)
    let greenhouses = plotData1
        .map(dataset => dataset.greenhouse)

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    // Return info message if data isn't loaded or no data entered yet:
    if (plotData1.length == 0) {
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
                        // -2 so that the most recent dataset gets selected. -1 is the best performer
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
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="tabs">
              <Tab label="Gesamt" {...indexedTabProps(0)} />
              <Tab label="Normiert" {...indexedTabProps(1)} />
              <Tab label="Sortenspezifisch" {...indexedTabProps(2)} />
              <Tab label="Benchmark" {...indexedTabProps(3)} />
            </Tabs>

            <TabPanel index={0} value={tab}>
                <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
                {footprintPlot(
                    ("CO2-Footprint für " + greenhouses[curGreenHouseIndex]),
                    'kg',
                    plotData1[curGreenHouseIndex].data)}
                <SectionDivider
                    // -2 so that the most recent dataset gets selected. -1 is the best performer
                    title={`CO2 Daten des Datensatzes aus dem Jahr ${plotData1[curGreenHouseIndex].data.labels[plotData1[curGreenHouseIndex].data.labels.length -2]}`}
                />
                {DataTable(createTableData(plotData1[curGreenHouseIndex]))}</TabPanel>
            <TabPanel index={1} value={tab}>
                <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
                {footprintPlot(
                    ("CO2-Footprint / kg Ertrag für " + greenhouses[curGreenHouseIndex]),
                    'kg',
                    plotData2[curGreenHouseIndex].data)}
            </TabPanel>
            <TabPanel index={2} value={tab}>
                <h1>{tab}</h1>
            </TabPanel>
            <TabPanel index={3} value={tab}>
                <h1>{tab}</h1>
            </TabPanel>


        </div>
    );
}

export default connector(PageC02Footprint);
