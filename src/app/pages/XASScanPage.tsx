import Histogram from "@/components/Histogram/Histogram";
import ExperimentXASScan from "@/components/Experiment/ExperimentXASScan";

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
            <div className="max-w-96 text-slate-700 mt-12">
                <Histogram arrayPV="mcaTest:mca1.VAL" exposurePV="mcaTest:mca1.PRTM" acquirePV="mcaTest:mca1EraseStart" showDeviceController={true} showPlotSettings={false} classNameContainer="text-slate-700"/>
            
            </div>
        </>
    )
}