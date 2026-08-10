import { MapContainer, TileLayer, Marker, Popup } from'react-leaflet';
import L from'leaflet';

// Fix leaflet icon issue in React
import icon from'leaflet/dist/images/marker-icon.png';
import iconShadow from'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
 iconUrl: icon,
 shadowUrl: iconShadow,
 iconSize: [25, 41],
 iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const stations = [
 { id: 1, name:'Bến xe Miền Đông', lat: 10.814, lng: 106.711 },
 { id: 2, name:'Bến xe Miền Tây', lat: 10.738, lng: 106.621 },
 { id: 3, name:'Trạm Phạm Ngũ Lão', lat: 10.767, lng: 106.691 }
];

export function StationMap() {
 const center: [number, number] = [10.78, 106.68]; // Ho Chi Minh City center

 return (
 <div className="w-full h-full min-h-[400px] overflow-hidden shadow-md border border-gray-100 z-0 relative">
 <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="w-full h-full">
 <TileLayer
 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 />
 {stations.map(station => (
 <Marker key={station.id} position={[station.lat, station.lng]}>
 <Popup>
 <div className="font-bold text-primary">{station.name}</div>
 <div className="text-xs text-gray-500">Bấm để xem lịch trình qua trạm này.</div>
 </Popup>
 </Marker>
 ))}
 </MapContainer>
 </div>
 );
}
