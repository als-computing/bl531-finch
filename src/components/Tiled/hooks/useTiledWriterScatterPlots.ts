import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getSearchResults, TiledSearchConfig } from "@blueskyproject/tiled";
import { useTiledApiUrls } from "src/utils/apiUtils";

async function searchById(config: TiledSearchConfig): Promise<unknown | null> {
    try {
        return await getSearchResults(config);
    } catch {
        return null;
    }
}

type UseTiledWriterScatterPlotsReturn = {
    /** Resolved Tiled paths, one per run ID. `null` while the path is still being located. */
    tiledPaths: (string | null)[];
    /** `true` while any path is still being resolved. */
    isLoading: boolean;
    /** Per-run error/status messages. `null` means that run's path resolved successfully. */
    errors: (string | null)[];
};

type UseTiledWriterScatterPlotsOptions = {
    /** The base URL for the Tiled server, e.g. `http://localhost:8000/api/v1`. */
    tiledBaseUrl?: string;
};

export const useTiledWriterScatterPlots = (
    blueskyRunIds: string[],
    options: UseTiledWriterScatterPlotsOptions = {}
): UseTiledWriterScatterPlotsReturn => {
    const { httpBaseUrl, apiKey: rawApiKey } = useTiledApiUrls();
    const baseUrl = options.tiledBaseUrl ?? httpBaseUrl;
    const apiKey = rawApiKey ?? undefined;

    // Layer 1: verify each run exists in Tiled.
    const runQueries = useQueries({
        queries: blueskyRunIds.map((id) => ({
            queryKey: ['tiled', 'searchById', baseUrl, { path: id }],
            queryFn: () => searchById({ baseUrl, apiKey, path: id }),
            enabled: !!id?.trim(),
            retry: false,
        })),
    });

    // Layer 2: try the newer streams/primary path.
    const streamsQueries = useQueries({
        queries: blueskyRunIds.map((id, i) => ({
            queryKey: ['tiled', 'searchById', baseUrl, { path: `${id}/streams/primary` }],
            queryFn: () => searchById({ baseUrl, apiKey, path: `${id}/streams/primary` }),
            enabled: !!runQueries[i]?.data,
            retry: false,
        })),
    });

    // Layer 3: fallback to the older primary path when streams/primary returned nothing.
    const directQueries = useQueries({
        queries: blueskyRunIds.map((id, i) => {
            const streamsDone = streamsQueries[i]?.isSuccess;
            const streamsEmpty = streamsDone && !streamsQueries[i]?.data;
            return {
                queryKey: ['tiled', 'searchById', baseUrl, { path: `${id}/primary` }],
                queryFn: () => searchById({ baseUrl, apiKey, path: `${id}/primary` }),
                enabled: !!runQueries[i]?.data && streamsEmpty,
                retry: false,
            };
        }),
    });

    const tiledPaths = useMemo(() =>
        blueskyRunIds.map((id, i) => {
            const streamsFound = streamsQueries[i]?.isSuccess && !!streamsQueries[i]?.data;
            const directFound = directQueries[i]?.isSuccess && !!directQueries[i]?.data;
            if (streamsFound) return `${id}/streams/primary/internal`;
            if (directFound) return `${id}/primary/internal`;
            return null;
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [blueskyRunIds, streamsQueries, directQueries]
    );

    const isLoading = runQueries.some((q) => q.isLoading) ||
        streamsQueries.some((q) => q.isLoading) ||
        directQueries.some((q) => q.isLoading);

    const errors = useMemo(() =>
        blueskyRunIds.map((id, i) => {
            if (tiledPaths[i]) return null;
            if (!id?.trim()) return 'No run ID provided';
            if (!runQueries[i]?.data) return `Searching for run ${id}...`;
            return `No data path found for run ${id}`;
        }),
        [blueskyRunIds, tiledPaths, runQueries]
    );

    return { tiledPaths, isLoading, errors };
};
