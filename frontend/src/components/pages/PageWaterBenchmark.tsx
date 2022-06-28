import React from "react";
import {RootState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import {loadWaterBenchmark} from "../../actions/waterbenchmark";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import {Box, Tab, Tabs, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import {styled} from "@mui/material/styles";
import {BenchmarkScatter, QuadrantPlot} from "../utils/BenchmarkPlots";

const mapStateToProps = (state: RootState) => ({plotData: state.benchmark.plotData});
const connector = connect(mapStateToProps, {loadWaterBenchmark});
type ReduxProps = ConnectedProps<typeof connector>

type WaterBenchmarkProps = ReduxProps & {}

const PageWaterBenchmark = ({plotData, loadWaterBenchmark}: WaterBenchmarkProps) => {
    // Load data
    React.useEffect(() => {
        loadWaterBenchmark()
    }, [])

    let greenhouses = plotData
        .map(dataset => dataset.greenhouse)

    // Return info message if data isn't loaded or no data entered yet:
    if (plotData.length == 0) {
        return (<p> Bisher wurden noch keine Daten erfasst oder geladen. <br/>
            Bitte warten Sie einen Moment oder geben Sie Daten zu Ihren Gewächshäusern <a
                href="/input-data">hier</a> ein.</p>)
    }

    // Stuff for Dropdown Menu:
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
                                        {"Here's the explanation for the first Plot. "}
                                    </React.Fragment>
                                }
                            >
                                <span>Benchmark-Plot</span>
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
                                <span>Vierfelder-Plot</span>
                            </HtmlTooltip>}
                             {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={curTabIndex} index={0}>
                    {BenchmarkScatter(("Benchmark für " + greenhouses[curGreenHouseIndex]), plotData[curGreenHouseIndex].data)}
                    {greenhouses[curGreenHouseIndex]}
                </TabPanel>
                <TabPanel value={curTabIndex} index={1}>
                    {QuadrantPlot(("Benchmark für " + greenhouses[curGreenHouseIndex]), plotData[curGreenHouseIndex].data)}
                </TabPanel>
            </Box>
        </div>
    );
}

export default connector(PageWaterBenchmark);
