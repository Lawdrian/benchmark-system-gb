import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import {loadWaterFootprint} from "../../actions/waterfootprint";
import footprintPlot from "../utils/FootprintPlot";
import {GreenhouseMenu} from "../utils/GreenhouseMenu";


const mapStateToProps = (state: RootState) => ({plotData: state.water.plotData});
const connector = connect(mapStateToProps, {loadWaterFootprint});
type ReduxProps = ConnectedProps<typeof connector>

type WaterFootprintProps = ReduxProps & {}

const PageWaterFootprint = ({plotData, loadWaterFootprint}: WaterFootprintProps) => {
    let greenhouses = ["GWH 1"] // TODO remove mock

    // Load Water-Footprint data
    React.useEffect(() => {
        loadWaterFootprint()
    }, [])

    // Stuff for Dropdown Menu:
    const [curGreenHouseIndex, setCurGreenHouseIndex] = React.useState<number>(0);

    return (
        <div id="water-footprint" className="page">
            <GreenhouseMenu greenhouses={greenhouses} setIndexCB={setCurGreenHouseIndex}
                            currentIndex={curGreenHouseIndex}/>
            {footprintPlot(("Wasser-Footprint für " + greenhouses[curGreenHouseIndex]), 'kg', plotData)}
        </div>
    );
}

export default connector(PageWaterFootprint);
