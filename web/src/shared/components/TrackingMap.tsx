import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TrackingMapProps {
  originCoords: [number, number];
  destCoords: [number, number];
  currentLocation: [number, number];
  originName?: string;
  destName?: string;
  statusText?: string;
}

export function TrackingMap({ 
  originCoords,
  destCoords,
  currentLocation,
  originName = 'Điểm đi', 
  destName = 'Điểm đến',
  statusText = 'Đang di chuyển'
}: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(currentLocation, 12);
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { className: 'grayscale-map-tiles' }).addTo(mapInstance.current);
    }
    let ignore = false;

    const drawRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (ignore) return;

        // Clean up old layers right before drawing
        mapInstance.current!.eachLayer(layer => {
          if (layer instanceof L.Polyline || layer instanceof L.Marker) {
            layer.remove();
          }
        });
        markerRef.current = null;

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          L.polyline(coords, { color: '#2563eb', weight: 5, opacity: 0.8 }).addTo(mapInstance.current!);
        }
      } catch (e) {
        if (ignore) return;
        L.polyline([originCoords, destCoords], { color: '#2563eb', weight: 5, opacity: 0.8, dashArray: '10, 10' }).addTo(mapInstance.current!);
      }

      const pointIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #9ca3af; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6]
      });

      L.marker(originCoords, { icon: pointIcon }).addTo(mapInstance.current!).bindPopup(`<b>${originName}</b>`);
      L.marker(destCoords, { icon: pointIcon }).addTo(mapInstance.current!).bindPopup(`<b>${destName}</b>`);

      const busIcon = L.divIcon({
        className: 'bus-icon',
        html: `<div style="background-color: #0194F3; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(1, 148, 243, 0.4); color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`,
        iconSize: [32, 32], iconAnchor: [16, 16]
      });

      if (!markerRef.current) {
        markerRef.current = L.marker(currentLocation, { icon: busIcon }).addTo(mapInstance.current!).bindPopup(`<b>Vị trí hiện tại</b><br/>${statusText}`).openPopup();
      }
      
      const bounds = L.latLngBounds([originCoords, destCoords, currentLocation]);
      mapInstance.current!.fitBounds(bounds, { padding: [50, 50] });
    };

    drawRoute();
    
    return () => { ignore = true; };
  }, [originCoords, destCoords]);

  useEffect(() => {
    if (markerRef.current && mapInstance.current) {
      markerRef.current.setLatLng(currentLocation);
      mapInstance.current.panTo(currentLocation);
    }
  }, [currentLocation]);

  return (
    <div className="relative overflow-hidden border border-gray-200 shadow-sm rounded-xl h-full w-full z-0">
      <style>{`.grayscale-map-tiles { filter: grayscale(10%); }`}</style>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Overlay Status */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-semibold text-gray-800">{statusText}</span>
      </div>
    </div>
  );
}
