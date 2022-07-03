import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadWaterFootprint} from "../../actions/waterfootprint";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";
import footprintPlot from "../utils/FootprintPlot";


const mapStateToProps = (state: RootState) => ({plotData: state.water.plotData});
const connector = connect(mapStateToProps, {loadWaterFootprint});
type ReduxProps = ConnectedProps<typeof connector>

/**
 * @type WaterFootprintProps
 */
type WaterFootprintProps = ReduxProps & {}

/**
 * Returns the page showing a Dropdown menu for selecting the greenhouse to
 * show the plots for as well as the Water-Footprint plots.
 *
 * @param {WaterFootprintProps}
 * Divided into plotData (data of multiple greenhouses to be shown in the plot) and
 * loadWaterFootprint (a function to fetch the necessary data from the backend)
 * @return JSX.Element
 */
const PageWaterFootprint = ({plotData, loadWaterFootprint}: WaterFootprintProps) => {
    // Load Water-Footprint data
    React.useEffect(() => {
        loadWaterFootprint()
    }, [])

    let greenhouses = plotData
        .map(dataset => dataset.greenhouse)

    // Configurations for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    // Return info message if data isn't loaded or no data entered yet:
    if (plotData.length == 0) {
        return (<p> Bisher wurden noch keine Daten erfasst oder geladen. <br/>
            Bitte warten Sie einen Moment oder geben Sie Daten zu Ihren Gewächshäusern <a
                href="/input-data">hier</a> ein.</p>)
    }

    return (
        <div id="water-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            {footprintPlot(
                ("Wasser-Footprint für " + greenhouses[curGreenHouseIndex]),
                'kg',
                plotData[curGreenHouseIndex].data)}
        </div>
    );
}

export default connector(PageWaterFootprint);
