import { useEffect, useRef } from'react';
import L from'leaflet';
import'leaflet/dist/leaflet.css';

interface DeliveryMapProps {
 origin: [number, number];
 dest: [number, number];
 isTracking: boolean;
 driverPos?: [number, number];
}

export function DeliveryMap({ origin, dest, isTracking, driverPos }: DeliveryMapProps) {
 const mapRef = useRef<HTMLDivElement>(null);
 const mapInstance = useRef<L.Map | null>(null);
 const layerGroup = useRef<L.LayerGroup | null>(null);

 useEffect(() => {
 if (mapRef.current && !mapInstance.current) {
 mapInstance.current = L.map(mapRef.current, {
 zoomControl: false,
 attributionControl: false
 }).setView(origin, 13);

 L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
 }).addTo(mapInstance.current);

 layerGroup.current = L.layerGroup().addTo(mapInstance.current);
 }
 }, []);

 useEffect(() => {
 if (!mapInstance.current || !layerGroup.current) return;
 
 // Clear previous layers
 layerGroup.current.clearLayers();

 const originIcon = L.divIcon({
 className:'custom-div-icon',
 html: `<div style="background-color: #4C3A8A; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
 iconSize: [14, 14],
 iconAnchor: [7, 7]
 });

 const destIcon = L.divIcon({
 className:'custom-div-icon',
 html: `<div style="background-color: transparent; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #4C3A8A; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
 iconSize: [14, 14],
 iconAnchor: [7, 7]
 });

 L.marker(origin, { icon: originIcon }).addTo(layerGroup.current);
 L.marker(dest, { icon: destIcon }).addTo(layerGroup.current);

 const latlngs: L.LatLngExpression[] = [origin, dest];

 if (isTracking && driverPos) {
 const driverIcon = L.divIcon({
 className:'custom-div-icon',
 html: `<div style="background-color: #4C3A8A; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>`,
 iconSize: [32, 32],
 iconAnchor: [16, 16]
 });

 L.marker(driverPos, { icon: driverIcon }).addTo(layerGroup.current)
 .bindPopup('<div style="font-family:sans-serif; font-weight:bold; color:#4C3A8A">Mike P. - 10 min away</div>').openPopup();
 
 latlngs.splice(1, 0, driverPos); // Insert driver pos between origin and dest for polyline
 }

 L.polyline(latlngs, { color:'#4C3A8A', weight: 4, dashArray:'10, 10' }).addTo(layerGroup.current);
 
 // Fit bounds if origin and dest are different
 if (origin[0] !== dest[0] || origin[1] !== dest[1]) {
 const bounds = L.latLngBounds([origin, dest]);
 mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
 } else {
 mapInstance.current.setView(origin, 14);
 }
 }, [origin, dest, isTracking, driverPos]);

 return <div ref={mapRef} className="w-full h-full z-0 absolute inset-0" />;
}
