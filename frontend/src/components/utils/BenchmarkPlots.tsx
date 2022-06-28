import React from 'react';
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip,} from 'chart.js'; // TODO clean up imports
import {BenchmarkPlot} from "../../types/reduxTypes";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

// TODO implement
export function BenchmarkScatter(title: string, data: BenchmarkPlot) {
    return (
        <div className="Plot">
            {/*<Scatter options={options} data={data}/>*/}
            Placeholder for BenchmarkPlot with title {title}
        </div>
    );
}

export function QuadrantPlot(title: string, data: BenchmarkPlot) {
    return (
        <div className="Plot">
            {/*<Scatter options={options} data={data}/>*/}
            Placeholder for QuadrantPlot with title {title}
        </div>
    );
}