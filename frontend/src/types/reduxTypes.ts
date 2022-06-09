export const RESET_DATA = "RESET_DATA";
export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAILED";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const CO2FP_LOADING = "CO2FP_LOADING";
export const CO2FP_LOADED = "CO2FP_LOADED";
export const CO2FP_ERROR = "CO2FP_ERROR";
export const WATERFP_LOADING = "WATERFP_LOADING";
export const WATERFP_LOADED = "WATERFP_LOADED";
export const WATERFP_ERROR = "WATERFP_ERROR";
export const WATERBM_LOADING = "WATERBM_LOADING";
export const WATERBM_LOADED = "WATERBM_LOADED";
export const WATERBM_ERROR = "WATERBM_ERROR";
export const WEATHER_LOADING = "WEATHER_LOADING";
export const WEATHER_LOADED = "WEATHER_LOADED";
export const WEATHER_ERROR = "WEATHER_ERROR";
export const SUBMISSION_INPROGRESS = "SUBMISSION_INPROGRESS";
export const SUBMISSION_SUCCESS = "SUBMISSION_SUCCESS";
export const SUBMISSION_ERROR = "SUBMISSION_ERROR";

type Profile = {
    company_name?: string
}

export type User = {
    id: number,
    username: string,
    email?: string,
    profile: Profile | null
}

export type FootprintDataset = {
    label: string
    data: number[]
    backgroundColor: string
    optimization: string[]
    climateData: string[]
}

export type BenchmarkDataset = {
    label: string,
    data: { x: number, y: number }[]
    backgroundColor: string
}

type Plot = {
    labels: string[]
}

export type FootprintPlot = Plot & {
    datasets: FootprintDataset[]
}

export type GreenhouseFootprint = {
    greenhouse: string
    data: FootprintPlot
}

export type GreenhouseFootprints = GreenhouseFootprint[]

export type BenchmarkPlot = Plot & {
    datasets: BenchmarkDataset[]
}

export type GreenhouseBenchmark = {
    greenhouse: string
    data: BenchmarkPlot
}

export type GreenhouseBenchmarks = GreenhouseBenchmark[]

export type WeatherData = {
    precipitation_height: string
    temperature_air_mean_200: string
    sunshine_duration: string
}

export type GreenhouseData = {
    greenhouse_operator: number
    greenhouse_name: number
    construction_type: number
    production_type: number
    cultivation_type: number
    fruit_weight: number
    energysource_type: number
    roofing_material: number
    energy_screen_brand: number
    powerusage_lighting_type: number
    powermix_type: number
    fertilizer_type: number
    pesticide_type: number
    used_materials_substrate_type: number
    used_materials_cord_type: number
    used_materials_clip_type: number
    post_harvest_packaging_type: number
    datetime: string | null
    session_key: number | null
    location: number
    greenhouse_age: number
    standing_wall_height: number
    total_area: number
    closing_time_begin: string
    closing_time_end: string
    drop_per_bag: number
    greenhouse_area: number
    plantation_begin: string
    plantation_duration: number
    planting_density: number
    harvest: number
    energy_usage: number
    lighting_power: number
    lighting_runtime_per_day: number
    powerusage_total_without_lighting: number
    co2_consumption: number
    fertilizer_amount: number
    pesticide_amount: number
    used_materials_substrate_plantsperbag: number
    used_materials_substrate_bagpersqm: number
    used_materials_gutter_count: number
    used_materials_gutter_length: number
    used_materials_foils_area: number
    youngplants_travelling_distance: number
    post_harvest_packaging_amount: number
    post_harvest_transport_distance: number
    culture_type: number
    youngplants_number: number
}
