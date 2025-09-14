"use client";

import dynamic from 'next/dynamic';
import type { Dispatch, SetStateAction } from 'react';

// Define the props that the loader will accept and pass through.
interface MapLoaderProps {
  position: { lat: number; lng: number; };
  setPosition: Dispatch<SetStateAction<{ lat: number; lng: number; }>>;
  isInteractive: boolean;
}

// Dynamically import the MapComponent
const DynamicMap = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
      <div style={{ height: "100%", width: "100%", display: "grid", placeContent: "center", backgroundColor: "#e2e8f0" }}>
        <h2>Loading Map...</h2>
      </div>
    ),
});

// Create a wrapper component that correctly passes the props down
const MapLoader = (props: MapLoaderProps) => {
  return <DynamicMap {...props} />;
};
    
export default MapLoader;