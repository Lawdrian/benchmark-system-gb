import React from "react";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import {loadWaterBenchmark} from "../../actions/waterbenchmark";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import {Box, Tab, Tabs, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import {styled} from "@mui/material/styles";

const mapStateToProps = (state: RootState) => ({plotData: state.benchmark.plotData});
const connector = connect(mapStateToProps, {loadWaterBenchmark});
type ReduxProps = ConnectedProps<typeof connector>

type WaterBenchmarkProps = ReduxProps & {}

const PageWaterBenchmark = ({plotData, loadWaterBenchmark}: WaterBenchmarkProps) => {
    // Load data
    React.useEffect(() => {
        loadWaterBenchmark() // TODO remove mock
    }, [])

    let greenhouses = ["GWH 1", "Greenhouse 2", "Beschdes Ding"] // TODO remove mock
    //let greenhouses = ["GWH 1"] // TODO remove mock

    // for dropdown menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);
    // for Tabs:
    const [curTabIndex, setCurTabIndex] = React.useState<number>(0);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tab-panel"
                hidden={value !== index}
                id={`bench-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{p: 3}}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurTabIndex(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    // for Tooltips:
    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(16),
            border: '1px solid #dadde9',
        },
    }));

    return (
        <div id="co2-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={curTabIndex} onChange={handleChange} aria-label="bench-tabs">
                        <Tab label={
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        {"Here's the explanation for the first Plot. "}<b>{'The normal one'}</b>
                                    </React.Fragment>
                                }
                            >
                                <span>Plot one</span>
                            </HtmlTooltip>}
                             {...a11yProps(0)} />
                        <Tab label={
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        {"Here's the explanation for the second Plot."}
                                    </React.Fragment>
                                }
                            >
                                <span>Plot two</span>
                            </HtmlTooltip>}
                             {...a11yProps(1)} />
                        <Tab label={
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        {"Here's the explanation for the third Plot."}
                                    </React.Fragment>
                                }
                            >
                                <span>Plot three</span>
                            </HtmlTooltip>}
                             {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={curTabIndex} index={0}>
                    {/*BenchmarkPlot(("Benchmark für " + greenhouses[curGreenHouseIndex]), plotData)*/}
                    {greenhouses[curGreenHouseIndex]}
                </TabPanel>
                <TabPanel value={curTabIndex} index={1}>
                    {/*TODO remove mock*/}
                    Plot Two
                    <img
                        src="https://www.researchgate.net/profile/Mark_Moll/publication/260691259/figure/download/fig4/AS:667639860953089@1536189155872/Figure-S1-A-sample-box-plot-generated-by-OMPLs-benchmark-script.png"
                        alt="Plot 2">
                    </img>
                </TabPanel>
                <TabPanel value={curTabIndex} index={2}>
                    {/*TODO remove mock*/}
                    <img
                        src="https://mlr.mlr-org.com/articles/tutorial/benchmark_experiments_files/figure-html/unnamed-chunk-23-1.png"
                        alt="Plot 3" width="666" height="518">
                    </img>
                    Plot Three
                </TabPanel>
            </Box>
        </div>
    );
}

export default connector(PageWaterBenchmark);
