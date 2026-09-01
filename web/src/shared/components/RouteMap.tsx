import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [routeDistance, setRouteDistance] = useState(distance);
  const [routeDuration, setRouteDuration] = useState(duration);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(originCoords, 7);
      
      // Google Maps Tiles with grayscale filter class
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        className: 'grayscale-map-tiles'
      }).addTo(mapInstance.current);
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

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          
          // Draw polyline
          const polyline = L.polyline(coords, { color: '#2563eb', weight: 5, opacity: 0.8 }).addTo(mapInstance.current!);
          
          // Fit bounds
          mapInstance.current!.fitBounds(polyline.getBounds(), { padding: [50, 50] });

          // Update distance/duration if not provided
          if (distance === '-- km') setRouteDistance(`${(route.distance / 1000).toFixed(1)} km`);
          if (duration === '--') setRouteDuration(`${Math.round(route.duration / 60)} phút`);
        }
      } catch (e) {
        if (ignore) return;
        console.error('Failed to fetch route', e);
        // Fallback straight line
        const polyline = L.polyline([originCoords, destCoords], { color: '#2563eb', weight: 5, opacity: 0.8, dashArray: '10, 10' }).addTo(mapInstance.current!);
        mapInstance.current!.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }

      // Add markers
      const createIcon = (color: string, label: string) => L.divIcon({
        className: 'custom-route-marker',
        html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; font-family: system-ui;">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(originCoords, { icon: createIcon('#059669', 'A') }).addTo(mapInstance.current!)
        .bindTooltip(`<b>${originName}</b>`, { direction: 'top', offset: [0, -10] });
        
      L.marker(destCoords, { icon: createIcon('#DC2626', 'B') }).addTo(mapInstance.current!)
        .bindTooltip(`<b>${destName}</b>`, { direction: 'top', offset: [0, -10] });
    };

    drawRoute();
    
    return () => { ignore = true; };

  }, [originCoords, destCoords, originName, destName]);

  return (
    <div className="relative overflow-hidden border border-gray-200 shadow-inner h-full w-full rounded-xl z-0">
      {/* Inject grayscale style for the map tiles to match the admin dashboard look */}
      <style>{`.grayscale-map-tiles { filter: grayscale(20%); }`}</style>
      
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Route Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 backdrop-blur-md p-3 shadow-lg border border-gray-100 flex items-center gap-4 pointer-events-none">
        <div>
          <div className="text-xs text-gray-500 font-bold mb-0.5 uppercase tracking-wider">Khoảng cách</div>
          <div className="text-sm font-black text-gray-900">{routeDistance}</div>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <div className="text-xs text-gray-500 font-bold mb-0.5 uppercase tracking-wider">TG Dự kiến</div>
          <div className="text-sm font-black text-gray-900">{routeDuration}</div>
        </div>
      </div>
    </div>
  );
}
