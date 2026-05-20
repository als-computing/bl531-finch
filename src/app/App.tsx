import './App.css';
import '@blueskyproject/tiled/style.css';

import { FinchConfigProvider } from './FinchConfigProvider';
import DashboardSummaryPage from './pages/DashboardSummaryPage';
import DeviceControlPage from './pages/DeviceControlPage';
import QServerPage from './pages/QServerPage';
import CameraPage from './pages/CameraPage';
import GoogleDocsPage from './pages/GoogleDocsPage';
import ServiceStatusPage from './pages/ServiceStatusPage';
import EnergyScanPage from './pages/EnergyScanPage';
import AngleScanPage from './pages/AngleScanPage';
import XASScanPage from './pages/XASScanPage';
import XASDataPage from './pages/XASDataPage';
import HubAppLayout from '@/components/HubAppLayout';

import { RouteItem } from '@/types/navigationRouterTypes';

import { House, Joystick, ImageSquare, StackPlus, Camera, GoogleLogo, Terminal, Barcode, BookOpenText } from "@phosphor-icons/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { finchIcons } from '@/assets/icons';
import TiledHeatmapSelector from '@/features/TiledHeatmapSelector';
import TiledPage from './pages/TiledPage';
import { Book } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const routes:RouteItem[] = [
    {
      element:<DashboardSummaryPage/>, 
      path: "/", 
      label: "Home", 
      icon: <House size={32}/>, 
      isBackgroundTransparent: true
    },
    {
      element: <XASScanPage />,
      path: '/xas-scan',
      label: 'XAS Scan',
      icon: <Barcode size={32} />,
      isBackgroundTransparent: true,
    },
    {
      element: <DeviceControlPage />, 
      path: '/control', 
      label: "Control", 
      icon: <Joystick size={32} />, 
      isBackgroundTransparent: true
    },
    {
      element: <XASDataPage />,
      path: '/data',
      label: 'Data',
      icon: <ImageSquare size={32} />,
      isBackgroundTransparent: true,
    },
    {
      element: <QServerPage />,
      path: '/qserver',
      label: 'QServer',
      icon: <StackPlus size={32} />,
      isBackgroundTransparent: true,
    },
    {
      element: <CameraPage />,
      path: '/camera',
      label: 'Camera',
      icon: <Camera size={32} />,
      isBackgroundTransparent: true,
    },
    {
      element: <GoogleDocsPage />,
      path: '/docs',
      label: 'Docs',
      icon: <GoogleLogo size={32} />,
      isBackgroundTransparent: false,
    },
    {
      element: <ServiceStatusPage />,
      path: '/status',
      label: 'Status',
      icon: <Terminal size={32} />,
      isBackgroundTransparent: true,
    },
    {
      element: <TiledPage />,
      path: '/tiled',
      label: 'Tiled',
      icon: <BookOpenText size={32} />,
      isBackgroundTransparent: true,
    }
    // {
    //   element: <EnergyScanPage />,
    //   path: '/energy-scan',
    //   label: 'Energy Scan',
    //   icon: <Barcode size={32} />,
    //   isBackgroundTransparent: true,
    // },
    // {
    //   element: <AngleScanPage />,
    //   path: '/angle-scan',
    //   label: 'Angle Scan',
    //   icon: <Barcode size={32} />,
    //   isBackgroundTransparent: true,
    // },

  ]
  return (
    <FinchConfigProvider
      config={{
        tiledApiUrl: import.meta.env.VITE_TILED_API_URL,
        tiledApiKey: import.meta.env.VITE_TILED_API_KEY,
        ophydApiUrl: import.meta.env.VITE_OPHYD_API_URL,
        qServerApiUrl: import.meta.env.VITE_QSERVER_API_URL,
        qServerApiKey: import.meta.env.VITE_QSERVER_API_KEY,
        finchApiUrl: import.meta.env.VITE_FINCH_API_URL,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <HubAppLayout 
          routes={routes} 
          headerTitle='Beamline 5.3.1' 
          headerLogoUrl='/images/finchWithBeaker.png' 
          classNameHeaderLogoImage="h-14 aspect-auto"

        />
      </QueryClientProvider>
    </FinchConfigProvider>
  )

}

export default App