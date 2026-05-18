import { TiledPlotlyTrace } from "./types/tiledPlotTypes"
import { useTiledWriterScatterPlots } from "./hooks/useTiledWriterScatterPlots";
import TiledMultiScatterPlot from "./TiledMultiScatterPlot";

type TiledWriterMultiScatterPlotProps = {
    /** Trace descriptor mapping Plotly fields to table column names for x and y axes. */
    tiledTrace: TiledPlotlyTrace;
    /** Bluesky run UIDs used to locate the primary stream data in Tiled. */
    blueskyRunIds: string[];
    /** Base URL of the Tiled server forwarded to `TiledMultiScatterPlot`. */
    tiledBaseUrl?: string;
    /** Milliseconds between data refetches while the run is ongoing. Defaults to `1000`. */
    pollingIntervalMs?: number;
    /** Additional class names applied to the `TiledMultiScatterPlot` container. */
    className?: string;
    /** Additional class names applied to the plot inside `TiledMultiScatterPlot`. */
    plotClassName?: string;
    /** When `true`, renders a status/error text line above the plot. Defaults to `true`. */
    showStatusText?: boolean;
    /** Title for the plot. */
    title?: string;
}

export default function TiledWriterMultiScatterPlot({
    tiledTrace,
    blueskyRunIds,
    tiledBaseUrl,
    pollingIntervalMs,
    className,
    plotClassName,
    showStatusText = true,
    title
}: TiledWriterMultiScatterPlotProps) {
    const { tiledPaths, isLoading, errors } = useTiledWriterScatterPlots(blueskyRunIds, { tiledBaseUrl });

    const getStatusText = () => {
        if (blueskyRunIds.length === 0) return 'No run IDs provided - waiting for data';
        if (isLoading) return `Loading Tiled data for ${blueskyRunIds.length} run(s)...`;
        const activeErrors = errors.filter(Boolean);
        if (activeErrors.length > 0) return activeErrors.join(' | ');
        const resolvedCount = tiledPaths.filter(Boolean).length;
        return `Found ${resolvedCount} of ${blueskyRunIds.length} path(s)`;
    };

    return (
        <>
            {showStatusText && (
                <p className="text-xs text-gray-600 mb-2">
                    {getStatusText()}
                </p>
            )}
            <TiledMultiScatterPlot
                paths={tiledPaths}
                tiledTrace={tiledTrace}
                tiledBaseUrl={tiledBaseUrl}
                pollingIntervalMs={pollingIntervalMs}
                className={className}
                plotClassName={plotClassName}
                title={title}
                shortPathNames={true}
            />
        </>
    );
}           