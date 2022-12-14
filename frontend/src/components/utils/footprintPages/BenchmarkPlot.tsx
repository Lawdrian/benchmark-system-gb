import React from 'react';
import {Chart as ChartJS, registerables, TooltipItem} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {BenchmarkPlot} from "../../../types/reduxTypes";
import zoomPlugin from 'chartjs-plugin-zoom';
import {Button, Grid} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

ChartJS.register(...registerables, zoomPlugin);

/**
 * Returns a Benchmark plot for the given data.
 *
 * @param {string} title The title of the plot
 * @param {string} yLabel The label shown at the y-axis in the plot
 * @param {string} tooltipLabel The label shown after the amount in the tooltip section.
 * @param {BenchmarkPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */

type props = {
    title: string
    yLabel: string
    tooltipLabel: string
    data: BenchmarkPlot
}

export default function BenchmarkPlotObject({title, yLabel, tooltipLabel, data}:props) {

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
                            label += Math.round(context.parsed.y) + ' ' + tooltipLabel
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
                    text: yLabel,
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

    const borderStyle = {
        bgcolor: 'background.paper',
        m: 1,
        border: 2,
        color: 'primary',
        borderRadius: '16px',
    };

    return (
        <Grid container className="Plot" xs={12} alignItems="center" justifyContent="begin">
            <Grid container item xs={12}>
                <Bar ref={chartRef} options={options} data={data}/>
            </Grid>
            <Grid sx={{...borderStyle}} item container direction={"row"} xs={6} spacing={0.5}>
                <Grid item direction={"row"} container xs={6}>
                    <Grid item xs={2} container>
                        <InfoOutlinedIcon/>
                    </Grid>
                    <Grid item xs={10}>
                        Für eine genauere Ansicht können Sie mit dem Mausrad scollen um in dem Plot hinein zu zoomen
                    </Grid>
                </Grid>
                <Grid item container xs={6} alignItems={"center"} justifyContent={"end"}>
                    <Button onClick={handleResetZoom}>Zoom zurücksetzen</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
