import React from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement, PointElement,
    Title,
    Tooltip,
    TooltipItem,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {BenchmarkPlot} from "../../types/reduxTypes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
);

/**
 * Returns a Benchmark plot for the given data.
 *
 * @param {string} title The title of the plot
 * @param {string} unit The unit shown in the plot
 * @param {BenchmarkPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */
export default function benchmarkPlot(title: string, unit: string, data: BenchmarkPlot) {
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
                    beforeLabel: function (context: TooltipItem<'bar'>) {

                        return context.dataset.label || ""

                    },
                    label: function (context: TooltipItem<'bar'>) {
                        let label =  " "

                        if (context.parsed.y !== null) {
                            label += Math.round(context.parsed.y) + ' ' + unit + " CO2-Äq.";
                        }
                        return label;
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
                    text: 'CO2-Äquivalente [' + unit + ']',
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
