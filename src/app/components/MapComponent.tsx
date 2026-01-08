"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { Dispatch, SetStateAction } from 'react';

// This handles the subfolder prefix for GitHub Pages dynamically
const getCorrectPath = (path: string) => {
  // In production, Next.js doesn't automatically prepend basePath to strings in JS
  const prefix = process.env.NODE_ENV === 'production' ? '/parkcheck' : '';
  return `${prefix}${path}`;
};

const DefaultIcon = L.icon({
  iconUrl: getCorrectPath('/images/marker-icon.png'),
  shadowUrl: getCorrectPath('/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Position { lat: number; lng: number; }

function ChangeView({ center }: { center: Position; }) {
  const map = useMap();
  map.panTo(center);
  React.useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapInteractionController({ isInteractive }: { isInteractive: boolean }) {
  const map = useMap();
  React.useEffect(() => {
    if (isInteractive) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
    }
  }, [isInteractive, map]);

  return null;
}

interface MapComponentProps {
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
  isInteractive: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ position, setPosition, isInteractive }) => {
  function ClickEventHandler() {
    useMapEvents({
      click(e) {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }
  
  const mapPosition = new L.LatLng(position.lat, position.lng);

  return (
    <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
      <MapInteractionController isInteractive={isInteractive} />
      <ChangeView center={position} />
      <ClickEventHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
      <Marker draggable={false} position={mapPosition}>
        <Popup>Pin Position: {mapPosition.lat.toFixed(4)}, {mapPosition.lng.toFixed(4)}</Popup>
      </Marker>
      <Circle
        center={mapPosition}
        radius={5}
        pathOptions={{ color: 'royalblue', fillColor: 'royalblue', fillOpacity: 0.1, weight: 1 }}
      />
    </MapContainer>
  );
};

export default MapComponent;