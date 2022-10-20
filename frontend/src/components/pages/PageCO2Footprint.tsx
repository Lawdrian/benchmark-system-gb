import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadCO2Footprint} from "../../actions/co2footprint";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import {
    FormControl, FormControlLabel, FormLabel, Grid,
    Paper, Radio, RadioGroup, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs, Typography,
} from "@mui/material";
import {GreenhouseBenchmark, GreenhouseFootprint} from "../../types/reduxTypes";
import {SectionDivider} from "../utils/inputPage/layout";
import {indexedTabProps, TabPanel} from "../../helpers/TabPanel";
import BenchmarkPlotObject from "../utils/BenchmarkPlot";
import FootprintPlotObject from "../utils/FootprintPlot";


const mapStateToProps = (state: RootState) => ({
    total: state.co2.total,
    normalizedkg: state.co2.normalizedkg,
    normalizedm2: state.co2.normalizedm2,
    fruitsizekg: state.co2.fruitsizekg,
    fruitsizem2: state.co2.fruitsizem2,
    benchmarkkg: state.co2.benchmarkkg,
    benchmarkm2: state.co2.benchmarkm2
});
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
const PageC02Footprint = ({total, normalizedkg, normalizedm2, fruitsizekg, fruitsizem2, benchmarkkg, benchmarkm2, loadCO2Footprint}: C02FootprintProps) => {
    // Load CO2-Footprint data
    React.useEffect(() => {
        loadCO2Footprint()
    }, [])

    enum NormalizedType {
        kg = "kg",
        m2 = "m2",
    }

    const [tab, setTab] = useState<number>(0)
    const [normalizedType, setNormalizedType] = React.useState<NormalizedType>(NormalizedType.kg);

    let greenhouses = total.map(dataset => dataset.greenhouse)

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    // Return info message if data isn't loaded or no data entered yet:
    if (total.length == 0) {
        return (<p> Bisher wurden noch keine Daten erfasst oder geladen. <br/>
            Bitte warten Sie einen Moment oder geben Sie Daten zu Ihren Gewächshäusern <a
                href="/input-data">hier</a> ein.</p>)
    }


    function createTableData(data: GreenhouseFootprint): tableData[] {

        return (
            data.data.datasets.map(dataset => (
                {
                    section: dataset.label,
                    total: +dataset.data[dataset.data.length -1].toFixed(2),
                    data: (
                        dataset.splitData[dataset.splitData.length -1].map( row => (
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
        total: number
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

    const createFootprintPageHeader = () => {
        return(
             <Grid container>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}
                        />
                    </Grid>
            <Grid item xs alignItems={"flex-end"} justifyContent={"center"}>
                        <FormControl sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                          <FormLabel
                          sx={{
                            pr: 2
                            }}>
                              Normiert nach: </FormLabel>
                          <RadioGroup
                            row
                            value={normalizedType}
                            onChange={handleNormalizedTypeChange}
                            name="radio-buttons-group"
                          >
                            <FormControlLabel value={NormalizedType.kg} control={<Radio />} label="kg" />
                            <FormControlLabel value={NormalizedType.m2} control={<Radio />} label="m2" />
                          </RadioGroup>
                        </FormControl>
                    </Grid>
             </Grid>
        )
    }

    const createFootprintProductionTypeHeader = (footprintData:GreenhouseFootprint[] | GreenhouseBenchmark[]) => {
        return(
            <Grid container direction={"row"} xs={12}>
                <Grid item xs={6} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant={"h6"}>Datensatz Performer:</Typography>
                </Grid>
                <Grid item container xs={6} direction={"column"}>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Produktionstyp = <b>{footprintData[curGreenHouseIndex].performerProductionType}</b>
                    </Grid>
                    <Grid item xs alignItems={"center"} justifyContent={"center"}>
                        Jahr = <b>{footprintData[curGreenHouseIndex].performerDate}</b>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const selectNormalizedPlotData = (kgData:any,m2Data:any, normalizedType:NormalizedType) => {
        if(normalizedType == NormalizedType.kg) return kgData
        else if(normalizedType == NormalizedType.m2) return m2Data
        else console.log("ERROR: Could not select NormalizedPlotData")

    }

    const handleNormalizedTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if(event.target.value == "kg") setNormalizedType(NormalizedType.kg)
        else if(event.target.value == "m2") setNormalizedType(NormalizedType.m2)
        else console.log("Error: Toggle didn't work")
    }


    return (
        <div id="co2-footprint" className="page">
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="tabs">
              <Tab label="Gesamt" {...indexedTabProps(0)} />
              <Tab label="Normiert" {...indexedTabProps(1)} />
              <Tab label="Klassenspezifisch" {...indexedTabProps(2)} />
              <Tab label="Benchmark" {...indexedTabProps(3)} />
              <Tab label="Optimierung" {...indexedTabProps(4)} />
            </Tabs>

            <TabPanel index={0} value={tab}>
                <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                        currentIndex={curGreenHouseIndex}
                />
                <FootprintPlotObject
                    title={("CO2-Footprint für " + greenhouses[curGreenHouseIndex])}
                    unit={'kg'}
                    data={total[curGreenHouseIndex].data}
                />
                <SectionDivider
                    title={`CO2 Daten des Datensatzes aus dem Jahr ${total[curGreenHouseIndex].data.labels[total[curGreenHouseIndex].data.labels.length -1]}`}
                />
                {DataTable(createTableData(total[curGreenHouseIndex]))}</TabPanel>
            <TabPanel index={1} value={tab}>
                {createFootprintPageHeader()}
                {createFootprintProductionTypeHeader(normalizedkg)}
                <FootprintPlotObject
                    title={("CO2-Footprint Normiert für " + greenhouses[curGreenHouseIndex])}
                    unit={'kg'}
                    data={selectNormalizedPlotData(normalizedkg, normalizedm2, normalizedType)[curGreenHouseIndex].data}
                />
            </TabPanel>
            <TabPanel index={2} value={tab}>
                {createFootprintPageHeader()}
                <FootprintPlotObject
                    title={("CO2-Footprint Klassenspezifisch für " + greenhouses[curGreenHouseIndex])}
                    unit={'kg'}
                    data={selectNormalizedPlotData(fruitsizekg, fruitsizem2, normalizedType)[curGreenHouseIndex].data}
                />
            </TabPanel>
            <TabPanel index={3} value={tab}>
                <>
                {createFootprintPageHeader()}
                <BenchmarkPlotObject
                    title={"CO2-Benchmark für " + greenhouses[curGreenHouseIndex]}
                    unit={'kg'}
                    data={selectNormalizedPlotData(benchmarkkg, benchmarkm2, normalizedType)[curGreenHouseIndex].data}
                />
                {createFootprintProductionTypeHeader(benchmarkkg)}
                </>
            </TabPanel>
            <TabPanel index={4} value={tab}>
                <h1>{tab}</h1>
            </TabPanel>
        </div>
    );
}

export default connector(PageC02Footprint);
