import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadCO2Footprint} from "../../actions/co2footprint";
import footprintPlot from "../utils/FootprintPlot";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";


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

    return (
        <div id="co2-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            {footprintPlot(
                ("CO2-Footprint für " + greenhouses[curGreenHouseIndex]),
                'kg',
                plotData[curGreenHouseIndex].data)}
        </div>
    );
}

export default connector(PageC02Footprint);
