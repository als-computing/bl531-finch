import Histogram from "@/components/Histogram/Histogram";
import ExperimentXASScan from "@/components/Experiment/ExperimentXASScan";

export default function XASScanPage() {
    return (
        <>
            <div className="max-w-96 text-slate-700">
                <Histogram arrayPV="mcaTest:mca1.VAL" acquirePV="dxpMercury:StartAll" showDeviceController={false} showPlotSettings={false} classNameContainer="text-slate-700"/>
            
            </div>
            <ExperimentXASScan 
                onSuccess={(response) => {
                    console.log("Angle scan started", response);
                }}
                onError={(error) => {
                    console.error("Angle scan failed:", error);
                }}
            />
        </>
    )
}