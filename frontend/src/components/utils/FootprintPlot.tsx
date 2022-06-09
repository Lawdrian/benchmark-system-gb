import React from 'react';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, TooltipItem,} from 'chart.js'; // TODO clean up imports
import {Bar} from 'react-chartjs-2';
//import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FootprintPlot} from "../../types/reduxTypes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export default function footprintPlot(title: string, unit: string, data: FootprintPlot) {
    let options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        size: 16,
                    }
                },
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 24,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'bar'>) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': '
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' ' + unit;
                        }
                        return label;
                    },
                    footer: function (context: TooltipItem<'bar'>[]) {
                        let footer = '';
                        let j = context[0].dataIndex;

                        // @ts-ignore
                        if (context[0].dataset.optimization[j]) {
                            // @ts-ignore
                            footer += "Einsparmöglichkeiten: \n" + context[0].dataset.optimization[j] + "\n";
                        }

                        // @ts-ignore
                        if (context[0].dataset.climateData[j]) {
                            // @ts-ignore
                            footer += "Klimadaten: \n" + context[0].dataset.climateData[j];
                        }
                        return footer;
                    }
                },
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 14,
                },
                footerFont: {
                    size: 14,
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    font: {
                        size: 16,
                    },
                },
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'CO2-Äquivalente [kg]',
                    font: {
                        size: 16,
                    },
                },
                ticks: {
                    font: {
                        size: 16,
                    },
                },
            },
        },
    };

    return (
        <div className="Plot">
            <Bar options={options} data={data}/>
        </div>
    );
}
