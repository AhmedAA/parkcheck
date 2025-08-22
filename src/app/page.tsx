"use client"; // This is crucial! It marks the component as a Client Component.

import React, { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
import { loadGeoJSON, saveGeoJSON, GeoJSONFeatureCollection } from '@/app/storage';
import MapLoader from './components/MapLoader';

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONFeatureCollection | null>(null);
  const [pinPosition, setPinPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (typeof window !== 'undefined') {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setPinPosition(new LatLng(latitude, longitude));

            const initialGeoJSON = await loadGeoJSON();
            initialGeoJSON.features[0].geometry.coordinates = [longitude, latitude];
            setGeoJsonData(initialGeoJSON);
          },
          async (error) => {
            console.error("Geolocation error:", error);
            const lastSavedData = await loadGeoJSON();
            const [lng, lat] = lastSavedData.features[0].geometry.coordinates;
            setPinPosition(new LatLng(lat, lng));
            setGeoJsonData(lastSavedData);
          },
          { enableHighAccuracy: true }
        );
      }
    };
    initialize();
  }, []);

  const handlePositionChange = (newPos: LatLng) => {
    setPinPosition(newPos);
    if (geoJsonData) {
      const updatedGeoJson: GeoJSONFeatureCollection = JSON.parse(JSON.stringify(geoJsonData));
      updatedGeoJson.features[0].geometry.coordinates = [newPos.lng, newPos.lat];
      setGeoJsonData(updatedGeoJson);
    }
  };
  
  const handleSave = () => {
    if (geoJsonData) {
      saveGeoJSON(geoJsonData);
      alert("Location saved!");
    }
  };

  return (
    <main className="relative h-screen w-screen">
      {pinPosition ? (
        <MapLoader 
          initialPosition={pinPosition} 
          onPositionChange={handlePositionChange} 
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Getting your location...</h1>
            <p className="text-gray-500">Please grant permission.</p>
        </div>
      )}
      <div className="fixed bottom-5 left-1/2 z-[1000] -translate-x-1/2">
        <button 
          onClick={handleSave} 
          className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Pin Location
        </button>
      </div>
    </main>
  );
}