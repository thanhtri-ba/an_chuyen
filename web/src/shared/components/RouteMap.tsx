import { useEffect, useRef } from'react';
import L from'leaflet';
import'leaflet/dist/leaflet.css';

interface RouteMapProps {
 originCoords: [number, number];
 destCoords: [number, number];
 originName?: string;
 destName?: string;
 distance?: string;
 duration?: string;
}

export function RouteMap({ originCoords, destCoords, originName ='Điểm đi', destName ='Điểm đến', distance ='-- km', duration ='--' }: RouteMapProps) {
 const mapRef = useRef<HTMLDivElement>(null);
 const mapInstance = useRef<L.Map | null>(null);

 useEffect(() => {
 if (mapRef.current && !mapInstance.current) {
 // Initialize map
 mapInstance.current = L.map(mapRef.current).setView([11.45, 107.5], 7);

 // Add tile layer
 L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
 attribution:'&copy; <a href="https://carto.com/">CARTO</a>'
 }).addTo(mapInstance.current);

 // Add markers
 const customIcon = L.divIcon({
 className:'custom-div-icon',
 html: `<div style="background-color: #0194F3; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
 iconSize: [14, 14],
 iconAnchor: [7, 7]
 });

 L.marker(originCoords, { icon: customIcon }).addTo(mapInstance.current)
 .bindPopup(`<b>${originName}</b>`).openPopup();
 
 L.marker(destCoords, { icon: customIcon }).addTo(mapInstance.current)
 .bindPopup(`<b>${destName}</b>`);

 // Add polyline for route
 const latlngs: L.LatLngExpression[] = [
 originCoords,
 destCoords
 ];

 L.polyline(latlngs, { color:'#0194F3', weight: 4, dashArray:'10, 10' }).addTo(mapInstance.current);
 
 // Fit bounds
 const bounds = L.latLngBounds(latlngs);
 mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
 }

 return () => {
 if (mapInstance.current) {
 mapInstance.current.remove();
 mapInstance.current = null;
 }
 };
 }, [originCoords, destCoords]);

 return (
 <div className="relative overflow-hidden border border-gray-200 shadow-inner h-[250px] w-full">
 <div ref={mapRef} className="w-full h-full z-0" />
 
 {/* Route Info Overlay */}
 <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 shadow-lg border border-gray-100 flex items-center gap-4">
 <div>
 <div className="text-xs text-gray-500 font-bold mb-0.5">Khoảng cách</div>
 <div className="text-sm font-black text-gray-900">{distance}</div>
 </div>
 <div className="w-px h-8 bg-gray-200"></div>
 <div>
 <div className="text-xs text-gray-500 font-bold mb-0.5">TG Dự kiến</div>
 <div className="text-sm font-black text-gray-900">{duration}</div>
 </div>
 </div>
 </div>
 );
}
