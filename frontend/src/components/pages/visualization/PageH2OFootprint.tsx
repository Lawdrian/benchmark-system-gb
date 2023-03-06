import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../store";
import {loadH2OFootprint} from "../../../actions/h2ofootprint";
import {GreenhouseMenu} from "../../utils/GreenhouseMenu";
import FootprintPlotObject from "../../utils/visualization/FootprintPlot";
import {
    CircularProgress, Dialog,
    DialogContent,
    DialogTitle, Grid, Tab, Tabs
} from "@mui/material";
import {indexedTabProps, TabPanel} from "../../../helpers/TabPanel";
import BenchmarkPlotObject from "../../utils/visualization/BenchmarkPlot";
import {SectionDivider} from "../../utils/input/layout";
import {FootprintTable} from "../../utils/visualization/FootprintTable";
import {
    createFootprintPageHeader,
    createFootprintProductionTypeHeader, handleNormalizedTypeChange,
    NormalizedType,
    selectNormalizedPlotData
} from "../../utils/visualization/FootprintHeader";
import {H2OFootprintOptimisation} from "./subpages/H2OFootprintOptimization";
import {H2O} from "../../../helpers/LayoutHelpers";

const mapStateToProps = (state: RootState) => ({
    total: state.h2o.total,
    normalizedkg: state.h2o.normalizedkg,
    normalizedm2: state.h2o.normalizedm2,
    fruitsizekg: state.h2o.fruitsizekg,
    fruitsizem2: state.h2o.fruitsizem2,
    directWaterkg: state.h2o.directWaterkg,
    directWaterm2: state.h2o.directWaterm2,
    benchmarkkg: state.h2o.benchmarkkg,
    benchmarkm2: state.h2o.benchmarkm2,
    optimizationkg: state.h2o.optimizationkg,
    optimizationm2: state.h2o.optimizationm2,
});

const connector = connect(mapStateToProps, {loadH2OFootprint});

type ReduxProps = ConnectedProps<typeof connector>

/**
 * @type H2OFootprintProps
 */
type H2OFootprintProps = ReduxProps & {}

/**
 * Returns the page that displays the h2o footprint plots for a selected greenhouse. Furthermore, it shows a benchmark
 * plot and the optimization data. A greenhouse can be selected with a dropdown menu.
 * If there is no data, it shows a generic error message.
 *
 * @param {C02FootprintProps} - Divided into plot data and
 * loadH2OFootprint (a function to fetch the necessary data from the backend)
 * @return JSX.Element
 */
const PageH2OFootprint = ({total, normalizedkg, normalizedm2, fruitsizekg, fruitsizem2, directWaterkg, directWaterm2, benchmarkkg, benchmarkm2, optimizationkg, optimizationm2, loadH2OFootprint}: H2OFootprintProps) => {

    // load H2O-Footprint data
    React.useEffect(() => {
        loadH2OFootprint(
            true,
            () => setOpenDialog(true),
            () => handleLoadSuccess(),
            () => handleLoadError(),
            () => handleNoWaterData()
        )
    }, [])

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const [loadSuccess, setLoadSuccess] = useState<boolean>(false)
    const [noWaterData, setNoWaterData] = useState<boolean>(false)

    const [tab, setTab] = useState<number>(0)
    const [normalizedType, setNormalizedType] = React.useState<NormalizedType>(NormalizedType.kg);

    let greenhouses = total.map(dataset => dataset.greenhouse)

    // the index of the currently selected greenhouse
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    const handleLoadSuccess = () => {
        setOpenDialog(false)
        setLoadSuccess(true)
    }

    const handleLoadError = () => {
        setOpenDialog(false)
        setLoadError(true)
    }

    const handleNoWaterData = () => {
        setOpenDialog(false)
        setNoWaterData(true)
    }

    // depending on the result of the loadH2OFootprint request, an error page or the footprints will be rendered
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
            Bitte wechseln Sie auf den Reiter Dateneingabe und geben Sie Daten zu Ihrem Gewächshaus <a
                href="/input-data">hier</a> ein.</p>)
    }
    else if(noWaterData) {
        return (
            <p> Sie haben keine Daten zu Ihrem Wasserverbrauch angegeben. <br/>
                Deswegen können wir Ihnen keinen {H2O}-Footprint anzeigen.
            </p>
        )
    }
    else if(loadSuccess) {
        return (
            <div id="h2o-footprint" className="page">
                <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="tabs">
                    <Tab label="Gesamt" {...indexedTabProps(0)}/>
                    <Tab label="Normiert" {...indexedTabProps(1)}/>
                    <Tab label="Klassenspezifisch" {...indexedTabProps(2)}/>
                    <Tab label="Direkter Wasserverbrauch" {...indexedTabProps(3)}/>
                    <Tab label="Benchmark" {...indexedTabProps(4)}/>
                    <Tab label="Optimierung" {...indexedTabProps(5)}/>
                </Tabs>

                <TabPanel index={0} value={tab}>
                    <Grid container item xs={10} sx={{textAlign:"justify"}}>
                        <p>
                            Der Gesamtfootprint bildet den allgemeinen Footprint der durch die Kultur und das entsprechende Kulturjahr verursacht wurde.
                            Unterteilt ist dieser in unterscheidliche Emittentenkategorien. Zudem besteht die Möglichkeit einzelne Kategorien auszublenden um eine bessere Vergleichbarkeit & Darstellung der Kategorien zu gewährleisten.
                            Dies ist insbesondere interessant, wenn Sie zu dem Haus Daten aus mehreren Jahren hinterlegt haben.
                            Wenn Sie mit der Maus über die Kategorien in den einzelnen Säulen wischen, werden Ihnen weitere Informationen aus den entsprechenden Kategorien angezeigt.
                            Wenn Sie auf den grünen Gewächshausnamen klicken, können Sie die Daten eines anderen Hauses abrufen. (falls hinterlegt)
                        </p>
                    </Grid>
                    <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                                    currentIndex={curGreenHouseIndex}
                    />
                    <FootprintPlotObject
                        title={(`${H2O}-Footprint für ${greenhouses[curGreenHouseIndex]}`)}
                        yLabel={`${H2O}-Äquivalente [Liter]`}
                        tooltipLabel={`Liter ${H2O}-Äq.`}
                        data={total[curGreenHouseIndex].data}
                    />
                    <SectionDivider
                        title={`${H2O} Daten des Datensatzes aus dem Jahr ${total[curGreenHouseIndex].data.labels[total[curGreenHouseIndex].data.labels.length - 1]}`}
                    />
                    <p>
                        In der Tabelle können Sie die verschiedenen {H2O}-Footprintfaktoren genauer betrachten.
                    </p>
                    <FootprintTable footprintData={total[curGreenHouseIndex]} unit={`Liter ${H2O} Äq`}/>
                </TabPanel>
                <TabPanel index={1} value={tab}>
                    <Grid container item xs={10} sx={{textAlign:"justify"}}>
                        <p>
                            Der normierte Footprint lässt sich pro Ertrag (kg) oder pro Quadratmeter anzeigen. Auch hier lässt sich zwischen den hinterlegten Häusern wechseln, sowie Kategorien ausblenden.
                            Zusätzlich wird hier der normierte Footprint des Bestperformers der gleichen Anbauweise angezeigt.
                        </p>
                    </Grid>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event, (type: NormalizedType) => setNormalizedType(type)))}
                    {createFootprintProductionTypeHeader(normalizedType==NormalizedType.kg ? normalizedkg: normalizedm2, curGreenHouseIndex)}
                    <FootprintPlotObject
                        title={(`${H2O}-Footprint Normiert für ${greenhouses[curGreenHouseIndex]}`)}
                        yLabel={`${H2O}-Äquivalente [Liter]`}
                        tooltipLabel={`Liter ${H2O}-Äq.`}
                        data={selectNormalizedPlotData(normalizedkg, normalizedm2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={2} value={tab}>
                    <Grid container item xs={10} sx={{textAlign:"justify"}}>
                        <p>
                            Hier können Sie die spezifischen Footprints der einzelnen Tomatengrößen vergleichen, sofern Sie unterschiedliche Sorten in diesem Gewächshaus kultivieren.
                            Auch hier lässt sich zwischen Footprint pro Ertragseinheit oder Quadratmeter unterscheiden, sowie einzelne Kategorien ausblenden.
                        </p>
                    </Grid>
                     {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event, (type: NormalizedType) => setNormalizedType(type)))}
                     <FootprintPlotObject
                        title={(`${H2O}-Footprint Klassenspezifisch für ${greenhouses[curGreenHouseIndex]}`)}
                        yLabel={`${H2O}-Äquivalente [Liter]`}
                        tooltipLabel={`Liter ${H2O}-Äq.`}
                        data={selectNormalizedPlotData(fruitsizekg, fruitsizem2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={3} value={tab}>
                    <Grid container item xs={10} sx={{textAlign:"justify"}}>
                        <p>
                            Der normierte Footprint lässt sich pro Ertrag (kg) oder pro Quadratmeter anzeigen. Auch hier lässt sich zwischen den hinterlegten Häusern wechseln, sowie Kategorien ausblenden.
                            Zusätzlich wird hier der normierte Footprint des Bestperformers der gleichen Anbauweise angezeigt.
                        </p>
                    </Grid>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event, (type: NormalizedType) => setNormalizedType(type)))}
                    {createFootprintProductionTypeHeader(normalizedType==NormalizedType.kg ? normalizedkg: normalizedm2, curGreenHouseIndex)}
                    <FootprintPlotObject
                        title={(`${H2O}-Footprint direkter Wasserverbrauch für ${greenhouses[curGreenHouseIndex]}`)}
                        yLabel={`${H2O}-Äquivalente [Liter]`}
                        tooltipLabel={`Liter ${H2O}-Äq.`}
                        data={selectNormalizedPlotData(directWaterkg, directWaterm2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={4} value={tab}>
                    <Grid container item xs={10} sx={{textAlign:"justify"}}>
                        <p>
                            Hier können Sie betrachten, wie der normierte Kategorienfootprint im Wettbewerb einzuordnen ist. Dementsprechend sind hierfür jeweils ein Best- und ein Worst-Performer eingezeichnet.
                        </p>
                    </Grid>
                    <>
                        {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event, (type: NormalizedType) => setNormalizedType(type)))}
                        {createFootprintProductionTypeHeader(normalizedType==NormalizedType.kg ? benchmarkkg: benchmarkm2, curGreenHouseIndex)}
                        <BenchmarkPlotObject
                            title={`${H2O}-Benchmark für ${greenhouses[curGreenHouseIndex]}`}
                            yLabel={`${H2O}-Äquivalente [Liter]`}
                            tooltipLabel={`Liter ${H2O}-Äq.`}
                            data={selectNormalizedPlotData(benchmarkkg, benchmarkm2, normalizedType)[curGreenHouseIndex].data}
                        />
                    </>
                </TabPanel>
                <TabPanel index={5} value={tab}>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value), (event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event, (type: NormalizedType) => setNormalizedType(type)))}
                    <H2OFootprintOptimisation data={selectNormalizedPlotData(optimizationkg, optimizationm2, normalizedType)[curGreenHouseIndex].data} normalizedUnit={normalizedType}/>
                </TabPanel>
            </div>
        )
    }
    else return <></>
}

export default connector(PageH2OFootprint);
