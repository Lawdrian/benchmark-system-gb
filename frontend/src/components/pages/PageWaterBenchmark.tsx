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

/**
 * @type WaterBenchmarkProps
 */
type WaterBenchmarkProps = ReduxProps & {}

/**
 * Returns the page showing a Dropdown menu for selecting the greenhouse to
 * show the plots for as well as the CO2-Footprint plots.
 *
 * @param {C02FootprintProps}
 * Divided into plotData (data of multiple greenhouses to be shown in the plot) and
 * loadWaterBenchmark (a function to fetch the necessary data from the backend)
 * @return JSX.Element
 */
const PageWaterBenchmark = ({plotData, loadWaterBenchmark}: WaterBenchmarkProps) => {
    // Load Water-Benchmark data
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

    // Configurations for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    // Configurations for Tabs:
    const [curTabIndex, setCurTabIndex] = React.useState<number>(0);

    /**
     * @interface TabPanelProps
     *
     * @property {React.ReactNode} children the element to show inside the Tab
     * @property {number} index the index of the Tab
     * @property {number} value the value of the Tab (used for selecting and deselecting)
     */
    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    /**
     * Returns a TabPanel (the area shown/hidden) for Tabbing.
     *
     * @see https://mui.com/material-ui/react-tabs/
     *
     * @param {TabPanelProps} props gets divided into children (the element to show inside the Tab), value and index
     * (for showing/hiding the TabPanels) and other
     * @return JSX.Element
     */
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

    /**
     * Returns the (html) props for Tabs.
     *
     * @see https://mui.com/material-ui/react-tabs/
     *
     * @param {number} index index of the current Tab
     * @return JSX.Element
     */
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    // for Tooltips (hover info for plots)
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
