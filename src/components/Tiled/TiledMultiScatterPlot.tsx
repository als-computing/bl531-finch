import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import PlotlyScatter from "../PlotlyScatter";
import { PlotData } from "plotly.js";

import { getTableDataAsJson } from "@blueskyproject/tiled";
import { TiledPlotlyTrace } from "./types/tiledPlotTypes";

type TiledMultiScatterPlotProps = {
    /** Trace descriptor mapping Plotly fields to table column names for x and y axes. */
    tiledTrace: TiledPlotlyTrace;
    /** Tiled paths to table nodes. `null` entries are skipped and show a waiting message. */
    paths: (string | null)[];
    /** Table partition index to fetch. Defaults to `0`. */
    partition?: number;
    /** Base URL of the Tiled server. Falls back to the library default when omitted. */
    tiledBaseUrl?: string;
    /** When `true`, refetches data at the interval set by `pollingIntervalMs`. */
    pollingIntervalMs?: number;
    /** Additional class names applied to the outer container element. */
    className?: string;
    /** Additional class names applied to the `PlotlyScatter` element. */
    plotClassName?: string;
    /** Title */
    title?: string;
    /** When `true`, uses only the first 4 characters of each path as the trace name. Ignored when `traceNames` is provided. */
    shortPathNames?: boolean;
    /** Explicit names for each trace, parallel to `paths`. Overrides `shortPathNames` when provided. */
    traceNames?: string[];
    /** Message to display that overrides all other displays from the component, use for higher level errors */
    popupMessage?: string;
}

export default function TiledMultiScatterPlot({ tiledTrace, paths, partition = 0, tiledBaseUrl, pollingIntervalMs = 1000, className, plotClassName, title, shortPathNames = false, traceNames, popupMessage }: TiledMultiScatterPlotProps) {
    const results = useQueries({
        queries: paths.map((path) => ({
            queryKey: ['tiled', 'table', path ?? ''],
            queryFn: () => getTableDataAsJson(path!, partition, tiledBaseUrl),
            enabled: path !== null,
        })),
    });

    const xName = tiledTrace.x;
    const yName = tiledTrace.y;

    const isLoading = results.some((r) => r.isLoading);
    const errors = results.filter((r) => r.error).map((r) => (r.error as Error).message);

    const getStatusText = () => {
        if (paths.every((p) => p === null)) {
            return 'No data paths provided - waiting for data';
        }
        if (isLoading) {
            return 'Loading data...';
        }
        if (errors.length > 0) {
            return `Error loading data: ${errors[0]}`;
        }
        const totalPoints = results.reduce((sum, r) => sum + (r.data?.[xName]?.length ?? 0), 0);
        return `Scatter plot data: ${totalPoints} points`;
    };

    const plotData: Partial<PlotData>[] = results.flatMap((r, i) => {
        const data = r.data;
        if (!data || !data[xName] || !data[yName]) return [];
        return [{
            ...tiledTrace,
            x: data[xName],
            y: data[yName],
            name: traceNames?.[i] ?? (shortPathNames ? (paths[i] ?? `trace ${i}`).slice(0, 4) : (paths[i] ?? `trace ${i}`)),
        } as Partial<PlotData>];
    });

    return (
        <div className={cn("flex-grow h-[30rem] rounded-lg bg-white min-w-0 shadow-md relative", className)}>
            {popupMessage 
            ? 
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                    <p className="text-red-500">{popupMessage}</p>
                </div>
            :
                <>
                    {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <p className="text-slate-500">Loading data...</p>
                    </div>}
                    {errors.length > 0 && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <p className="text-red-500">Error loading data: {errors[0]}</p>
                    </div>}
                    {paths.every((p) => p === null) && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <p className="text-slate-500">No data paths provided - waiting for paths</p>
                    </div>}
                </>
        }
            <PlotlyScatter
                data={plotData}
                xAxisTitle={xName}
                yAxisTitle={yName}
                className={plotClassName}
                title={title}
                layout={{ plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff', legend: { x: 0.05, y:1, xanchor: 'left', yanchor: 'top' }, margin: { r: 50, t: 40 }, modebar: { orientation: 'v' } }}
                config={{ editable: true, displayModeBar: true }}
            />
        </div>
    );
}