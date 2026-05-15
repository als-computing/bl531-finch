import Histogram from "@/components/Histogram/Histogram";
import ExperimentXASScan from "@/components/Experiment/ExperimentXASScan";
import Hexapod from "@/components/Hexapod/Hexapod";

export default function XASScanPage() {
    return (
        <>
            <ExperimentXASScan 
                onSuccess={(response) => {
                    console.log("Angle scan started", response);
                }}
                onError={(error) => {
                    console.error("Angle scan failed:", error);
                }}
            />
            <div className="flex space-x-8 w-fit mt-12 items-start ">
                <div className="max-w-fit text-slate-700">
                    <Histogram 
                        arrayPV="mcaTest:mca1.VAL" 
                        exposurePV="mcaTest:mca1.PRTM" 
                        acquirePV="mcaTest:mca1EraseStart" 
                        showDeviceController={true} 
                        showPlotSettings={false} 
                        classNameContainer="text-slate-700"/>
                </div>
                <Hexapod />
            </div>
        </>
    )
}