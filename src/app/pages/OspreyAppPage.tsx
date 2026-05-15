import IFrame from "@/components/IFrame"
export default function OspreyAppPage() {
    return (
        <IFrame url="http://192.168.10.156:8080" title="osprey" isSizeResponsive={true}/>
    )
}