import {combineReducers} from "redux";
import auth from "./auth";
import co2 from "./co2footprint";
import water from "./waterfootprint";
import benchmark from "./waterbenchmark";
import weather from "./weather";
import submission from "./submission";

export default combineReducers({
    auth: auth,
    co2: co2,
    water: water,
    benchmark: benchmark,
    weather: weather,
    submission: submission
})