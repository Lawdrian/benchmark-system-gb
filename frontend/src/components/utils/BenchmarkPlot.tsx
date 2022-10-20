import React from 'react';
import {Chart as ChartJS, registerables, TooltipItem} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {BenchmarkPlot} from "../../types/reduxTypes";
import zoomPlugin from 'chartjs-plugin-zoom';
import {Button} from "@mui/material";

ChartJS.register(...registerables, zoomPlugin);

/**
 * Returns a Benchmark plot for the given data.
 *
 * @param {string} title The title of the plot
 * @param {string} unit The unit shown in the plot
 * @param {BenchmarkPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */

type props = {
    title: string
    unit: string
    data: BenchmarkPlot
}

export default function BenchmarkPlotObject({title, unit, data}:props) {

    const chartRef = React.useRef<any>(null);

    const handleResetZoom = () => {
        chartRef.current.resetZoom();
    };




    let options = {
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true // SET SCROOL ZOOM TO TRUE
                    },
                },
                pan: {
                    enabled: true,
                }
            },
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
                stacked: false,
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
            <Bar ref={chartRef} options={options} data={data}/>
            <Button onClick={handleResetZoom}>Zoom zurücksetzen</Button>
        </div>
    );
}
