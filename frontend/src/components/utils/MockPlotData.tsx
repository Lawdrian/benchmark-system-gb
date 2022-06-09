import {ChartArea} from "chart.js";

const labels = ['2020', '2021', 'Reference'];

export const benchmarkData = {
    labels,
    datasets: [
        {
            label: 'Your Farm',
            data: [
                {y: 7.8, x: 5},
                {y: 7.0, x: 5},
                {y: 5.4, x: 5},
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Reference Farms',
            data: [
                {y: 10.8, x: 0},
                {y: 6.8, x: 0},
                {y: 5.0, x: 0},
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

export const footprintData = {
    labels,
    datasets: [
        {
            label: 'Elektrische Energie',
            data: [20, 25, 17],
            backgroundColor: 'rgba(53, 162, 235,0.7)',
            optimization: ['opt-e-1', 'opt-e-2', 'opt-e-3'],
            climateData: ['clim-e-1', 'clim-e-2', 'clim-e-3'],
        },
        {
            label: 'Wärmeenergie',
            data: [105, 95, 80],
            backgroundColor: 'rgba(235,53,162,0.7)',
            optimization: ['\u2022 Gewächshaus besser isolieren \n' +
            '\u2022 Auf Nahwärme umstellen', '\u2022 Auf Nahwärme umstellen', ''],
            climateData: ['clim-w-1', 'clim-w-2', 'clim-w-3'],
        },
        {
            label: 'Pflanzenschutzmittel',
            data: [15, 10, 10],
            backgroundColor: 'rgba(191,246,24,0.7)',
            optimization: ['\u2022 Weniger Pflanzenschutzmittel verwenden', 'opt-p-2', 'opt-p-3'],
            climateData: ['clim-p-1', 'clim-p-2', 'clim-p-3'],
        },
        {
            label: 'Düngemittel',
            data: [10, 10, 5],
            backgroundColor: 'rgba(239,131,6,0.7)',
            optimization: ['opt-d-1', 'opt-d-2', 'opt-d-3'],
            climateData: ['clim-d-1', 'clim-d-2', 'clim-d-3'],
        },
    ]
}

export function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
    const colorStart = 'rgb(255,0,0)';
    const colorMid = 'rgb(225,174,4)';
    const colorEnd = 'rgb(70,176,0)';

    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);

    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.5, colorMid);
    gradient.addColorStop(1, colorEnd);

    return gradient;
}
