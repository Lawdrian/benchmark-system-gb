import React from 'react';
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip,} from 'chart.js'; // TODO clean up imports
import {Scatter} from 'react-chartjs-2';
import {benchmarkData} from './MockPlotData' //TODO remove mock data

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

// TODO implement
export default function BenchmarkPlot(title: string, data: any) {
    let options = {
        layout: {
            padding: {
                left: 200,
                right: 200,
            },
        },
        scales: {
            x: {
                min: -5,
                max: 10
            }
        }
    }
    return (
        <div className="Plot">
            <Scatter options={options} data={benchmarkData}/>
            Benchmark Plot test
        </div>
    );
}
