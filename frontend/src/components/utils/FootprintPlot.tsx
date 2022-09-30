import React from 'react';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, TooltipItem,} from 'chart.js'; // TODO clean up imports
import {Bar} from 'react-chartjs-2';
import {FootprintPlot} from "../../types/reduxTypes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

/**
 * Returns a Footprint plot for the given data.
 *
 * @param {string} title The title of the plot
 * @param {string} unit The unit shown in the plot
 * @param {FootprintPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */
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
                    beforeLabel: function (context: TooltipItem<'bar'>) {

                        return context.dataset.label || ""

                    },
                    label: function (context: TooltipItem<'bar'>) {
                        let label =  " "

                        if (context.parsed.y !== null) {
                            label += Math.round(context.parsed.y) + ' ' + unit + " CO2-Äq.";
                        }
                        return label;
                    },
                    afterBody: function (context: TooltipItem<'bar'>[]) {
                        let body = ""
                        let j = context[0].dataIndex;

                        // @ts-ignore
                        if (context[0].dataset.splitData[j]) {
                            const total_co2 = data.datasets.map(dataset => dataset.data[j])
                                .reduce((partialSum, a) =>  partialSum + a, 0)
                            body += "\n" + "𝐀𝐧𝐭𝐞𝐢𝐥 𝐚𝐦 𝐅𝐮ß𝐚𝐛𝐝𝐫𝐮𝐜𝐤: " + (context[0].dataset.data[j]/total_co2*100).toFixed(0) + "%\n"
                            // @ts-ignore
                            body += "\n" +"𝐙𝐮𝐬𝐚𝐦𝐦𝐞𝐧𝐬𝐞𝐭𝐳𝐮𝐧𝐠: \n" + context[0].dataset.splitData[j].map( singleData =>
                            { return singleData.name + ": " + (singleData.value/context[0].dataset.data[j]*100).toFixed(2) + "%\n"})
                        }
                        body = body.replaceAll(",", "") // For some reason commas are automatically added, so they need to be removed.
                        return body
                    },
                    footer: function (context: TooltipItem<'bar'>[]) {
                        let footer = '';
                        let j = context[0].dataIndex;


                        // @ts-ignore
                        if (context[0].dataset.optimization[j]) {
                            // @ts-ignore
                            footer += "Einsparmöglichkeiten: \n" + context[0].dataset.optimization[j] + "\n";
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
