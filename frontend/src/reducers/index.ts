/**
 * #############################################################################
 * index.ts: Combines all reducers from ../reducers into a single reducer
 * #############################################################################
 */
import {combineReducers} from "redux";
import auth from "./auth";
import co2 from "./co2footprint";
import h2o from "./h2ofootprint";
import submission from "./submission";
import lookup from "./lookup"
import dataset from "./dataset";
import profile from "./profile";

/**
 * Combine different specialized reducers to one global reducer.
 * This will result in the following state of the redux store:
 *
 *  AppState: {
 *     auth: AuthenticationState,
 *     co2: CO2FootprintState,
 *     water: WaterFootprintState,
 *     benchmark: WaterBenchmarkState,
 *     submission: SubmissionState,
 *     lookup: LookupState
 * }
 *
 * See react-redux documenatation:
 * - https://redux.js.org/api/combinereducers
 * - https://redux.js.org/usage/structuring-reducers/using-combinereducers
 */
export default combineReducers({
    auth: auth,
    co2: co2,
    h2o: h2o,
    submission: submission,
    lookup: lookup,
    dataset: dataset,
    profile: profile,
})