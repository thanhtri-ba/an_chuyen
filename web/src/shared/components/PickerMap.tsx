import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PickerMapProps {
  initialCenter?: [number, number];
  points: { id: string; name: string; lat: number; lng: number }[];
  selectedPointId?: string;
  onSelectPoint: (id: string) => void;
}

export function PickerMap({ initialCenter = [10.78, 106.68], points, selectedPointId, onSelectPoint }: PickerMapProps) {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={initialCenter} zoom={13} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/intl/vi_VN/help/terms_maps/">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        {points.map(point => {
          const isSelected = point.id === selectedPointId;
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${isSelected ? '#ef4444' : '#0194F3'}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          return (
            <Marker 
              key={point.id} 
              position={[point.lat, point.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectPoint(point.id),
              }}
            >
              <Popup>
                <div className="font-bold">{point.name}</div>
                <div className="text-xs text-gray-500 mt-1">Nhấn để chọn điểm này</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
