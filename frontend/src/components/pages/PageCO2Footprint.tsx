import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadCO2Footprint} from "../../actions/co2footprint";
import footprintPlot from "../utils/FootprintPlot";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";


const mapStateToProps = (state: RootState) => ({plotData: state.co2.plotData});
const connector = connect(mapStateToProps, {loadCO2Footprint});
type ReduxProps = ConnectedProps<typeof connector>

type C02FootprintProps = ReduxProps & {}

const PageC02Footprint = ({plotData, loadCO2Footprint}: C02FootprintProps) => {
    let greenhouses = ["GWH 1", "Greenhouse 2", "Beschdes Ding"] // TODO remove mock

    // Load CO2-Footprint data
    React.useEffect(() => {
        loadCO2Footprint(true) // TODO remove mock
    }, [])

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    return (
        <div id="co2-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            {footprintPlot(("CO2-Footprint für " + greenhouses[curGreenHouseIndex]), 'kg', plotData)}
        </div>
    );
}

export default connector(PageC02Footprint);
