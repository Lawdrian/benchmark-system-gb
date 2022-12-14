import React, {useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../store";
import {loadH2OFootprint} from "../../../actions/h2ofootprint";
import {GreenhouseMenu} from "../../utils/GreenhouseMenu";
import FootprintPlotObject from "../../utils/footprintPages/FootprintPlot";
import {
    CircularProgress, Dialog,
    DialogContent,
    DialogTitle, Grid, Tab, Tabs
} from "@mui/material";
import {indexedTabProps, TabPanel} from "../../../helpers/TabPanel";
import BenchmarkPlotObject from "../../utils/footprintPages/BenchmarkPlot";
import {SectionDivider} from "../../utils/inputPage/layout";
import {FootprintTable} from "../../utils/footprintPages/FootprintTable";
import {createFootprintPageHeader, createFootprintProductionTypeHeader, NormalizedType} from "./PageCO2Footprint";



const mapStateToProps = (state: RootState) => ({
    total: state.h2o.total,
    normalizedkg: state.h2o.normalizedkg,
    normalizedm2: state.h2o.normalizedm2,
    fruitsizekg: state.h2o.fruitsizekg,
    fruitsizem2: state.h2o.fruitsizem2,
    benchmarkkg: state.h2o.benchmarkkg,
    benchmarkm2: state.h2o.benchmarkm2
});
const connector = connect(mapStateToProps, {loadH2OFootprint});
type ReduxProps = ConnectedProps<typeof connector>

/**
 * @type H2OFootprintProps
 */
type H2OFootprintProps = ReduxProps & {}

/**
 * Returns the page showing a Dropdown menu for selecting the greenhouse to
 * show the plots for as well as the h2o-footprint plots.
 *
 * @param {H2OFootprintProps}
 * Divided into plotData (data of multiple greenhouses to be shown in the plot) and
 * loadH2OFootprint (a function to fetch the necessary data from the backend)
 * @return JSX.Element
 */
const PageH2OFootprint = ({total, normalizedkg, normalizedm2, fruitsizekg, fruitsizem2, benchmarkkg, benchmarkm2, loadH2OFootprint}: H2OFootprintProps) => {
    // Load Water-Footprint data
    React.useEffect(() => {
        loadH2OFootprint(true,
            () => setOpenDialog(true),
            () => handleLoadSuccess(),
            () => handleLoadError())
    }, [])

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const [loadSuccess, setLoadSuccess] = useState<boolean>(false)

    const [tab, setTab] = useState<number>(0)
    const [normalizedType, setNormalizedType] = React.useState<NormalizedType>(NormalizedType.kg);

    let greenhouses = total.map(dataset => dataset.greenhouse)

    // The index of the currently selected greenhouse:
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
            <div id="h2o-footprint" className="page">
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
                        title={("H2O-Footprint für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'H2O-Äquivalente [Liter]'}
                        tooltipLabel={"Liter H2O-Äq."}
                        data={total[curGreenHouseIndex].data}
                    />
                    <SectionDivider
                        title={`H2O Daten des Datensatzes aus dem Jahr ${total[curGreenHouseIndex].data.labels[total[curGreenHouseIndex].data.labels.length - 1]}`}
                    />
                    <p>
                        In der Tabelle können Sie die verschiedenen H2O-Fußabdruckfaktoren genauer betrachten.
                    </p>
                    <FootprintTable footprintData={total[curGreenHouseIndex]} unit="Liter H2O Äq"/>
                </TabPanel>
                <TabPanel index={1} value={tab}>
                    <p>
                        Der normierte Fußabdruck lässt sich pro Ertrag (kg) oder pro Quadratmeter anzeigen. Auch hier lässt sich zwischen den hinterlegten Häusern wechseln, sowie Kategorien ausblenden.<br/>
                        Zusätzlich wird hier der normierte Footprint des Bestperformers der gleichen Anbauweise angezeigt.
                    </p>
                    {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                    {createFootprintProductionTypeHeader(normalizedkg, curGreenHouseIndex)}
                    <FootprintPlotObject
                        title={("H2O-Footprint Normiert für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'H2O-Äquivalente [Liter]'}
                        tooltipLabel={"Liter H2O-Äq."}
                        data={selectNormalizedPlotData(normalizedkg, normalizedm2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={2} value={tab}>
                    <p>
                        Hier können Sie die spezifischen Fußabdrücke der einzelnen Tomatengrößen vergleichen, sofern Sie unterschiedliche Sorten in diesem Gewächshaus kultivieren.
                        Auch hier lässt sich zwischen Footprint pro Ertragseinheit oder Quadratmeter unterscheiden, sowie einzelne Kategorien ausblenden.
                    </p>
                     {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                     <FootprintPlotObject
                        title={("H2O-Footprint Klassenspezifisch für " + greenhouses[curGreenHouseIndex])}
                        yLabel={'H2O-Äquivalente [Liter]'}
                        tooltipLabel={"Liter H2O-Äq."}
                        data={selectNormalizedPlotData(fruitsizekg, fruitsizem2, normalizedType)[curGreenHouseIndex].data}
                    />
                </TabPanel>
                <TabPanel index={3} value={tab}>
                    <p>
                        Hier können Sie betrachten, wie der normierte Kategorienfootprint im Wettbewerb einzuordnen ist. Dementsprechend sind hierfür jeweils ein Best- und ein Worst-Performer eingezeichnet.
                    </p>
                    <>
                        {createFootprintPageHeader(normalizedType, greenhouses, curGreenHouseIndex, (value) => setCurGreenHouseIndex(value),(event: React.ChangeEvent<HTMLInputElement>) => handleNormalizedTypeChange(event) )}
                        {createFootprintProductionTypeHeader(normalizedkg, curGreenHouseIndex)}
                        <BenchmarkPlotObject
                            title={"H2O-Benchmark für " + greenhouses[curGreenHouseIndex]}
                            yLabel={'H2O-Äquivalente [Liter]'}
                            tooltipLabel={"Liter H2O-Äq."}
                            data={selectNormalizedPlotData(benchmarkkg, benchmarkm2, normalizedType)[curGreenHouseIndex].data}
                        />
                    </>
                </TabPanel>
            </div>
        )
    }
    else return <></>
}

export default connector(PageH2OFootprint);
