import { useState, useEffect } from "react";
import { Tiled } from "@blueskyproject/tiled";
import { TiledItemSelectionData } from "@blueskyproject/tiled/dist/components/Tiled/types";
import TiledWriterMultiScatterPlot from "@/components/Tiled/TiledWriterMultiScatterPlot";
import { TiledSearchConfig, TiledSearchResult, getSearchResults } from "@blueskyproject/tiled";
export default function XASDataPage() {
    const [blueskyIds, setBlueskyIds] = useState<string[]>([]);
    const handleDataSelect = (data: TiledItemSelectionData) => {
        console.log("Selected data from Tiled:", data);
        setBlueskyIds((prev) => [...prev, data.id]);
    };
    const handleIDSelect = (id: string) => {
        setBlueskyIds((prev) => [...prev, id]);
    };
    const handleIDUnselect = (id: string) => {
        setBlueskyIds((prev) => prev.filter((existingId) => existingId !== id));
    };
    const [ searchResults, setSearchResults ] = useState<TiledSearchResult | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            //eventually uncomment this and get the key contains working once that's updated in tiled api
            const searchConfig: TiledSearchConfig = {
                options: {
                    sort: '-',
                },
                filters: {
                    specs: {include: ['BlueskyRun'], exclude: []},
                }
            };
            try {
                const results:TiledSearchResult | null = await getSearchResults(searchConfig);
                setSearchResults(results);
            } catch (error) {
                console.error("Error fetching ExperimentHistory data:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className=" ">
            {/* <Tiled singleColumnMode={true} onSelectCallback={handleDataSelect}/> */}
                        {/* <Tiled singleColumnMode={true} backgroundClassName="h-[40rem] min-w-96 w-36" contentClassName="h-full w-full"/> */}
            <TiledWriterMultiScatterPlot
                tiledTrace={{ x: 'seq_num', y: 'rand' }}
                blueskyRunIds={blueskyIds}
                showStatusText={true}
            />
            <section className="flex">
                {/* All Data For selection */}
                <ul className="w-96 h-96 overflow-scroll bg-white">
                    {searchResults && searchResults.data.map((item) => {
                        // const startTime = item?.attributes?.metadata?.start?.time;
                        // const formattedStartTime = startTime ? dayjs.unix(startTime).format('MM/DD h:mm A') : "N/A";
                        // const endTime = item?.attributes?.metadata?.stop?.time;
                        // const duration = startTime && endTime ? dayjs.unix(endTime).diff(dayjs.unix(startTime), 'second') + " s" : "N/A";
                        // const status = item?.attributes?.metadata?.stop ? item?.attributes?.metadata?.stop?.exit_status : "running";
                        const isSelected = blueskyIds.includes(item.id);
                        return (
                            // <tr key={item.id} className={`mb-2 p-2 text-slate-800 font-light mx-2 hover:bg-sky-200 cursor-pointer ${
                            //     enablePersistentSelection && selectedItemId === item.id 
                            //         ? 'bg-sky-300' 
                            //         : 'bg-white/10'
                            // }`} onClick={()=>{
                            //     if (enablePersistentSelection) {
                            //         setSelectedItemId(item.id);
                            //     }
                            //     if (onItemClick) onItemClick(item);
                            // }}>
                            //     <td className="px-2 py-2">{formattedStartTime}</td>
                            //     <td className="px-2 py-2 max-w-24 truncate">{item.id}</td>
                            //     <td className="px-2 py-2">{status}</td>
                            //     <td className="px-2 py-2 text-center">{duration}</td>
                            // </tr>

                            <li 
                                className={`${isSelected ? 'text-slate-300 hover:text-slate-800' : 'text-slate-800 hover:text-slate-500'} hover:cursor-pointer `}
                                key={item.id}
                                onClick={isSelected ? () => handleIDUnselect(item.id) : () => handleIDSelect(item.id)}
                            >
                                <p>{item.id}</p>
                            </li>
                        )
                    }
                    )}
                </ul>
                {/* Currently Selected items */}
                <ul className="w-96 h-96 overflow-scroll bg-white">
                    {blueskyIds.map((id) => (
                        <li key={id} className="text-slate-800">
                            <p>{id}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}