import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../store";
import {loadCO2Footprint} from "../../../actions/co2footprint";
import {GreenhouseMenu} from "../../utils/GreenhouseMenu";
import {
    CircularProgress, Dialog,
    DialogContent,
    DialogTitle,
    FormControl, FormControlLabel, FormLabel, Grid,
    Radio, RadioGroup, Tab, Tabs, Typography,
} from "@mui/material";
import {GreenhouseBenchmark, GreenhouseFootprint} from "../../../types/reduxTypes";
import {SectionDivider} from "../../utils/inputPage/layout";
import {indexedTabProps, TabPanel} from "../../../helpers/TabPanel";
import BenchmarkPlotObject from "../../utils/footprintPages/BenchmarkPlot";
import FootprintPlotObject from "../../utils/footprintPages/FootprintPlot";
import {FootprintTable} from "../../utils/footprintPages/FootprintTable";


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
        loadCO2Footprint(
            true,
            () => setOpenDialog(true),
            () => handleLoadSuccess(),
            () => handleLoadError()
        )
    }, [])

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const [loadSuccess, setLoadSuccess] = useState<boolean>(false)

    const [tab, setTab] = useState<number>(0)
    const [normalizedType, setNormalizedType] = React.useState<NormalizedType>(NormalizedType.kg);

    let greenhouses = total.map(dataset => dataset.greenhouse)

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);


    const handleLoadSuccess = () => {
        setOpenDialog(false)
        setLoadSuccess(true)
    }

    const handleLoadError = () => {
        setOpenDialog(false)
        setLoadError(true)
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


    if(openDialog) {
        return(
            <Dialog open={openDialog}>
                <>
                    <DialogTitle>Ihre persöhnlichen Plots werden generiert</DialogTitle>
                    <DialogContent sx={{display: "flex"}}>
                        <Grid container item xs={12} alignItems={"center"} justifyContent={"center"}>
                            <CircularProgress/>
                        </Grid>
                    </DialogContent>
                </>
            </Dialog>
        )
    }
    else if(loadError) {
        return (<p> Bisher wurden noch keine Daten erfasst. <br/>
            Bitte wechseln Sie auf den Reiter Dateneingabe und geben Sie Daten zu Ihrem Gewächshaus ein. <a
                href="/input-data">hier</a> ein.</p>)
    }
    else if(loadSuccess) {
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
                </Tabs>

                <TabPanel index={0} value={tab}>
                    <p>
                        Der Gesamtfußabdruck bildet den allgemeinen Fußabdruck der durch die Kultur und das entsprechende Kulturjahr verursacht wurde.
                        Unterteilt ist dieser in unterscheidliche Emittentenkategorien. Zudem besteht die Möglichkeit einzelne Kategorien auszublenden um eine bessere Vergleichbarkeit & Darstellung der Kategorien zu gewährleisten.
                        Dies ist insbesondere interessant, wenn Sie zu dem Haus Daten aus mehreren Jahren hinterlegt haben.
                        Wenn Sie mit der Maus über die Kategorien in den einzelnen Säulen wischen, werden Ihnen weitere Informationen aus den entsprechenden Kategorien angezeigt.<br/>
                        Wenn Sie auf den grünen Gewächshausnamen klicken, können Sie die Daten eines anderen Hauses abrufen. (falls hinterlegt)
                    </p>
                    <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                                    currentIndex={curGreenHouseIndex}
                    />
                    <FootprintPlotObject
                        title={("CO2-Footprint für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'CO2-Äquivalente [kg]'}
                        tooltipLabel={"kg CO2-Äq."}
                        data={total[curGreenHouseIndex].data}
                    />
                    <SectionDivider
                        title={`CO2 Daten des Datensatzes aus dem Jahr ${total[curGreenHouseIndex].data.labels[total[curGreenHouseIndex].data.labels.length - 1]}`}
                    />
                    <p>
                        In der Tabelle können Sie die verschiedenen CO2-Fußabdruckfaktoren genauer betrachten.
                    </p>
                    <FootprintTable footprintData={total[curGreenHouseIndex]} unit="kg CO2 Äq"/>
                </TabPanel>
                <TabPanel index={1} value={tab}>
                    <p>
                        Der normierte Fußabdruck lässt sich pro Ertrag (kg) oder pro Quadratmeter anzeigen. Auch hier lässt sich zwischen den hinterlegten Häusern wechseln, sowie Kategorien ausblenden.<br/>
                        Zusätzlich wird hier der normierte Footprint des Bestperformers der gleichen Anbauweise angezeigt.
                    </p>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                    {createFootprintProductionTypeHeader(normalizedType==NormalizedType.kg ? normalizedkg: normalizedm2, curGreenHouseIndex)}
                    <FootprintPlotObject
                        title={("CO2-Footprint Normiert für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'CO2-Äquivalente [kg]'}
                        tooltipLabel={"kg CO2-Äq."}
                        data={selectNormalizedPlotData(normalizedkg, normalizedm2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={2} value={tab}>
                    <p>
                        Hier können Sie die spezifischen Fußabdrücke der einzelnen Tomatengrößen vergleichen, sofern Sie unterschiedliche Sorten in diesem Gewächshaus kultivieren.
                        Auch hier lässt sich zwischen Footprint pro Ertragseinheit oder Quadratmeter unterscheiden, sowie einzelne Kategorien ausblenden.
                    </p>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value), (event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                    <FootprintPlotObject
                        title={("CO2-Footprint Klassenspezifisch für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'CO2-Äquivalente [kg]'}
                        tooltipLabel={"kg CO2-Äq."}
                        data={selectNormalizedPlotData(fruitsizekg, fruitsizem2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={3} value={tab}>
                    <p>
                        Hier können Sie betrachten, wie der normierte Kategorienfootprint im Wettbewerb einzuordnen ist. Dementsprechend sind hierfür jeweils ein Best- und ein Worst-Performer eingezeichnet.
                    </p>
                    <>
                        {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value), (event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                        {createFootprintProductionTypeHeader(normalizedType==NormalizedType.kg ? normalizedkg: normalizedm2, curGreenHouseIndex)}
                        <BenchmarkPlotObject
                            title={"CO2-Benchmark für " + greenhouses[curGreenHouseIndex]}
                            yLabel={'CO2-Äquivalente [kg]'}
                            tooltipLabel={"kg CO2-Äq."}
                            data={selectNormalizedPlotData(benchmarkkg, benchmarkm2, normalizedType)[curGreenHouseIndex].data}
                        />
                    </>
                </TabPanel>
            </div>
        )
    }
    else return <></>
}

export default connector(PageC02Footprint);


    export enum NormalizedType {
        kg = "kg",
        m2 = "m2",
    }

    export const createFootprintPageHeader = (normalizedType:NormalizedType, greenhouses:string[], curGreenHouseIndex: number,  setCurGreenHouseIndex: (value:number) => void, handleNormalizedTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void) => {
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

    export const createFootprintProductionTypeHeader = (footprintData:GreenhouseFootprint[] | GreenhouseBenchmark[], curGreenHouseIndex: number) => {
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