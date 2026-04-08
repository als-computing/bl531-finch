import IFrame from "@/components/IFrame"
export default function CalibrationAppPage() {
    return (
        <IFrame url="http://192.168.10.156:4001/" title="calibration" isSizeResponsive={true}/>
    )
}