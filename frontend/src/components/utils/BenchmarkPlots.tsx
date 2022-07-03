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

/**
 * Returns a ("classical") Benchmark plot for the given data.
 *
 * @todo implement
 *
 * @param {string} title The title of the plot
 * @param {BenchmarkPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */
export function BenchmarkScatter(title: string, data: BenchmarkPlot) {
    return (
        <div className="Plot">
            {/*<Scatter options={options} data={data}/>*/}
            Placeholder for BenchmarkPlot with title {title}
        </div>
    );
}

/**
 * Returns a ("Vierfelder"-)Benchmark plot for the given data.
 *
 * @todo implement
 *
 * @param {string} title The title of the plot
 * @param {BenchmarkPlot} data Data to be shown in the plot. (see reduxTypes)
 * @return JSX.Element
 */
export function QuadrantPlot(title: string, data: BenchmarkPlot) {
    return (
        <div className="Plot">
            {/*<Scatter options={options} data={data}/>*/}
            Placeholder for QuadrantPlot with title {title}
        </div>
    );
}