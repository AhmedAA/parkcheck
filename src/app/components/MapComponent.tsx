import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';

// Icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface ChangeViewProps { center: LatLng; zoom: number; }
function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface MapComponentProps {
  initialPosition: LatLng;
  onPositionChange: (newPosition: LatLng) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ initialPosition, onPositionChange }) => {
  const [position, setPosition] = useState<LatLng>(initialPosition);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => { setPosition(initialPosition); }, [initialPosition]);
  
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const newPos = marker.getLatLng();
        setPosition(newPos);
        onPositionChange(newPos);
      }
    },
  }), [onPositionChange]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={position} zoom={13} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
        <Popup>
          <div className="space-y-1 text-center">
            <p className="font-bold">You can drag this pin.</p>
            <p className="text-sm text-gray-700">
              Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;