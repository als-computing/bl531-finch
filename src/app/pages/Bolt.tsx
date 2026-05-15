import { House, Joystick, StackPlus, ImageSquare  } from "@phosphor-icons/react";
import BoltControl from "@/features/bolt/BoltControl";
import alsLogo from '@/assets/alsLogo.png';
export default function Bolt () {
    const menuItems = [
        { icon: <House size={32} />, label: 'Home' },
        { icon: <Joystick size={32} />, label: 'Control' },
        { icon: <StackPlus size={32} />, label: 'Q Server' },
        { icon: <ImageSquare size={32} />, label: 'Data' },
    ];
    return (
        <div className="grid grid-cols-[6rem_1fr] grid-rows-[auto_1fr] h-screen">
            {/* Sidebar extends vertically the full height of the page */}
            <aside className="row-span-2 bg-sky-950 flex flex-col py-4">
                {menuItems.map((item, index) => 
                <div key={index} className="flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center h-20 aspect-square rounded-lg text-white hover:bg-sky-800 cursor-pointer">
                        {item.icon}
                        <span className="font-light">{item.label}</span>
                    </div>
                    <div className="h-[1px] w-10/12 border-b border-white/50 my-4"></div>
                </div>
                )}
            </aside>
            {/* Header is to the right of the sidebar, extends to the right end of the page */}
            <header className="bg-white h-16 flex justify-between items-center">
                <div className="flex items-center space-x-6 ml-6">
                    <img src={alsLogo} className="h-10 aspect-square"/>
                    <h1 className="text-sky-950 text-2xl font-semibold">ALS COMPUTING HUB</h1>
                </div>
            </header>
            {/* Main fills out the bottom right area remaining on the page */}
            <main className="bg-sky-900">
                <BoltControl />
            </main>
        </div>
    )
}