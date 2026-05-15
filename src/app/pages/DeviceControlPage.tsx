import Beamstop from "@/features/Beamstop";
import Hexapod from "@/components/Hexapod/Hexapod";
import BeamEnergyOphyd from "@/components/BeamEnergy/BeamEnergyOphyd";
import CameraContainer from "@/components/Camera/CameraContainer";
import Histogram from "@/components/Histogram/Histogram";
export default function DeviceControlPage() {
    return (
        <div className="flex flex-wrap items-start justify-center gap-16 text-slate-700">
            <Beamstop 
                enableBestOption={false} 
                stackVertical={true} 
                beamstopXTitle="Beamstop - X" 
                beamstopYTitle="Beamstop - Y" 
                beamstopCurrentName="bl201-beamstop:current" 
                beamstopXName="bl531_xps2:beamstop_x_mm" 
                beamstopYName="bl531_xps2:beamstop_y_mm" 
                className = "flex-row overflow-auto items-center text-white"
            /> ,
            <BeamEnergyOphyd/>
            <Hexapod />
            <CameraContainer prefix="BL531a2A2448" enableControlPanel={true} enableSettings={false} canvasSize="medium"/>
            <Histogram arrayPV="dxpMercury:mca1.VAL" acquirePV="dxpMercury:StartAll" showDeviceController={false} showPlotSettings={false} />
        </div>          
    )
}