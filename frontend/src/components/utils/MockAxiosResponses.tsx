import {RawCO2Data} from "../../actions/co2footprint";

export const rawCO2DataMock: RawCO2Data = [
    {
        label: new Date("2019-01-01"),
        electric_power_co2: 20,
        heat_consumption_co2: 105,
        psm_co2: 15,
        fertilizer_co2: 10
    },
    {
        label: new Date("2020-01-01"),
        electric_power_co2: 25,
        heat_consumption_co2: 50,
        psm_co2: 10,
        fertilizer_co2: 10
    },
    {
        label: new Date("2021-01-01"),
        electric_power_co2: 17,
        heat_consumption_co2: 95,
        psm_co2: 9,
        fertilizer_co2: 5
    },
    {
        label: new Date("2022-01-01"),
        electric_power_co2: 30,
        heat_consumption_co2: 80,
        psm_co2: 10,
        fertilizer_co2: 3
    },
    {
        label: new Date("0000-01-01"),
        electric_power_co2: 8,
        heat_consumption_co2: 67,
        psm_co2: 8,
        fertilizer_co2: 5
    }
];
