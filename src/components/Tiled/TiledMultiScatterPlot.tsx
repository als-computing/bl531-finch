import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import PlotlyScatter from "../PlotlyScatter";
import { PlotData } from "plotly.js";

import { getTableDataAsJson } from "@blueskyproject/tiled";
import { TiledPlotlyTrace } from "./types/tiledPlotTypes";

type TiledMultiScatterPlotProps = {
    /**Bluesky Run ID saved into Tiled */
    blueskyRunId: string;
    /** Trace descriptor mapping Plotly fields to table column names for x and y axes. */
    tiledTrace: TiledPlotlyTrace;
    /** Tiled paths to table nodes. `null` entries are skipped and show a waiting message. */
    paths: (string | null)[];
    /** Table partition index to fetch. Defaults to `0`. */
    partition?: number;
    /** Base URL of the Tiled server. Falls back to the library default when omitted. */
    tiledBaseUrl?: string;
    /** When `true`, refetches data at the interval set by `pollingIntervalMs`. */
    enablePolling?: boolean;
    /** Milliseconds between data refetches when `enablePolling` is `true`. Defaults to `1000`. */
    pollingIntervalMs?: number;
    /** Additional class names applied to the outer container element. */
    className?: string;
    /** Additional class names applied to the `PlotlyScatter` element. */
    plotClassName?: string;
}

export default function TiledMultiScatterPlot({ blueskyRunId, tiledTrace, paths, partition = 0, tiledBaseUrl, enablePolling, pollingIntervalMs = 1000, className, plotClassName }: TiledMultiScatterPlotProps) {
    const results = useQueries({
        queries: paths.map((path) => ({
            queryKey: ['tiled', 'table', path],
            queryFn: () => getTableDataAsJson(path!, partition, tiledBaseUrl),
            enabled: path !== null,
            refetchInterval: enablePolling ? pollingIntervalMs : false,
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
        return `Scatter plot data: ${totalPoints} points${enablePolling ? ' (Live)' : ''}`;
    };

    const plotData: Partial<PlotData>[] = results.flatMap((r, i) => {
        const data = r.data;
        if (!data || !data[xName] || !data[yName]) return [];
        return [{
            ...tiledTrace,
            x: data[xName],
            y: data[yName],
            name: paths[i] ?? `trace ${i}`,
        } as Partial<PlotData>];
    });

    return (
        <div className={cn("flex-grow h-[30rem] p-4 rounded-lg bg-white min-w-0 shadow-md", className)}>
            <span className="flex items-center h-8 space-x-8">
                <p className="text-sm text-gray-600">{getStatusText()}</p>
            </span>
            <PlotlyScatter
                data={plotData}
                xAxisTitle={xName}
                yAxisTitle={yName}
                className={plotClassName}
                title={'bluesky run: ' + blueskyRunId}
                layout={{ plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff' }}
            />
        </div>
    );
}