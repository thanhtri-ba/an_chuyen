import { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftRight, Star, MapPin, Search, Calendar, ChevronDown, Bus, ArrowRight, Plus, Minus, LocateFixed, Info, Shield, Headphones } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../lib/api';
import { cn } from '../../../shared/utils/cn';

const pinIcon = (color: string) => L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#F8F9FF;color:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)"><svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const startIcon = pinIcon('#785900');
const endIcon = pinIcon('#BA1A1A');

const COMPANY_BADGE: Record<string, { bg: string; text: string; label: string; outline?: boolean }> = {
  'Thành Bưởi': { bg: '#00A651', text: '#FFFFFF', label: 'TB' },
  'Futa Bus Lines': { bg: 'transparent', text: '#F26522', label: 'FUTA', outline: true },
};

// Single source of truth for city name, station label, and map coords — keeps autocomplete and route drawing from drifting apart.
const CITY_LIST: { name: string; station: string; coords: [number, number]; aliases?: string[] }[] = [
  { name: 'Hà Nội', station: 'Bến xe Mỹ Đình', coords: [21.0285, 105.8542] },
  { name: 'TP. Hồ Chí Minh', station: 'Bến xe Miền Đông', coords: [10.8135, 106.7109], aliases: ['hồ chí minh', 'sài gòn', 'sai gon', 'tphcm', 'tp hcm', 'hcm', 'tp.hcm'] },
  { name: 'Nha Trang', station: 'Bến xe phía Bắc', coords: [12.2388, 109.1967] },
  { name: 'Đà Lạt', station: 'Bến xe Đà Lạt', coords: [11.9404, 108.4383] },
  { name: 'Đà Nẵng', station: 'Bến xe Trung tâm', coords: [16.0471, 108.2068] },
  { name: 'Cần Thơ', station: 'Bến xe Trung tâm', coords: [10.0452, 105.7469] },
  { name: 'Hải Phòng', station: 'Bến xe Vĩnh Niệm', coords: [20.8449, 106.6881] },
  { name: 'Huế', station: 'Bến xe phía Nam', coords: [16.4637, 107.5909] },
  { name: 'Sa Pa', station: 'Bến xe Sa Pa', coords: [22.3353, 103.8436], aliases: ['sapa'] },
  { name: 'Vũng Tàu', station: 'Bến xe Vũng Tàu', coords: [10.4114, 107.1362], aliases: ['vung tau'] },
  { name: 'Quy Nhơn', station: 'Bến xe Quy Nhơn', coords: [13.7830, 109.2196], aliases: ['quy nhon'] },
  { name: 'Phan Thiết', station: 'Bến xe Phan Thiết', coords: [10.9289, 108.1021], aliases: ['phan thiet'] },
  { name: 'Buôn Ma Thuột', station: 'Bến xe Buôn Ma Thuột', coords: [12.6667, 108.0500], aliases: ['buon ma thuot'] },
];

// Waypoints along Quốc lộ 1A (north→south), used to keep OSRM's free routing on the Vietnam coastal highway
// instead of cutting through Laos/Cambodia for long north-south trips.
const QL1A_BACKBONE: [number, number][] = [
  [21.0285, 105.8542], // Hà Nội
  [20.2506, 105.9744], // Ninh Bình
  [19.8067, 105.7764], // Thanh Hóa
  [18.6796, 105.6813], // Vinh
  [18.3428, 105.9057], // Hà Tĩnh
  [17.4689, 106.6222], // Đồng Hới
  [16.8163, 107.1005], // Đông Hà
  [16.4637, 107.5909], // Huế
  [16.0471, 108.2068], // Đà Nẵng
  [15.1214, 108.8044], // Quảng Ngãi
  [13.7830, 109.2196], // Quy Nhơn
  [13.0955, 109.3113], // Tuy Hòa
  [12.2388, 109.1967], // Nha Trang
  [11.5645, 108.9899], // Phan Rang
  [10.9289, 108.1021], // Phan Thiết
  [10.8135, 106.7109], // TP. Hồ Chí Minh
  [10.0452, 105.7469], // Cần Thơ
];

// For long north-south trips, insert the backbone waypoints that lie between origin and destination
// so OSRM's public routing server can't shortcut through Laos/Cambodia.
function buildWaypoints(origin: [number, number], dest: [number, number]): [number, number][] {
  if (Math.abs(origin[0] - dest[0]) < 3) return [origin, dest];
  const goingSouth = origin[0] > dest[0];
  const [hiLat, loLat] = goingSouth ? [origin[0], dest[0]] : [dest[0], origin[0]];
  const between = QL1A_BACKBONE.filter(p => p[0] < hiLat - 0.3 && p[0] > loLat + 0.3);
  const ordered = goingSouth ? between : [...between].reverse();
  return [origin, ...ordered, dest];
}

function splitVehicleType(type: string) {
  const match = type.match(/^(.*)\s(\d+\s*chỗ)$/);
  if (match) return [match[1].trim(), match[2].trim()];
  return [type, ''];
}

export function TripSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef<LeafletMap | null>(null);

  const searchOrigin = searchParams.get('origin') || '';
  const searchDestination = searchParams.get('destination') || '';
  const searchDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const searchPassengers = searchParams.get('passengers') || '1';

  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [formOrigin, setFormOrigin] = useState(searchOrigin);
  const [formDest, setFormDest] = useState(searchDestination);
  const [formDate, setFormDate] = useState(searchDate);
  const [formPass, setFormPass] = useState(searchPassengers);
  const [isReturn, setIsReturn] = useState(false);
  const [vehicleType, setVehicleType] = useState('Tất cả');
  const [activeField, setActiveField] = useState<'origin'|'dest'|null>(null);
  const [selectedTripId, setSelectedTripId] = useState<number|string|null>(null);
  const [sortBy, setSortBy] = useState<'default'|'price'|'depTime'|'duration'>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const tripCardRefs = useRef<Record<string, HTMLDivElement|null>>({});

  const handleSelectTrip = (tripId: number|string) => {
    setSelectedTripId(tripId);
    if (routePath.length > 1) {
      mapRef.current?.flyToBounds(L.latLngBounds(routePath), { padding: [60, 60], duration: 0.8 });
    } else {
      mapRef.current?.flyTo(mapCenter, 8, { duration: 0.8 });
    }
    // Pull the selected card up into view instead of leaving it wherever the click happened.
    tripCardRefs.current[tripId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const parseDurationMinutes = (duration: string) => {
    const h = duration.match(/(\d+)\s*h/)?.[1];
    const m = duration.match(/(\d+)\s*m/)?.[1];
    return (h ? parseInt(h) * 60 : 0) + (m ? parseInt(m) : 0);
  };

  const parseTimeMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const SORT_OPTIONS: { key: typeof sortBy; label: string }[] = [
    { key: 'default', label: 'Đề xuất' },
    { key: 'price', label: 'Giá thấp nhất' },
    { key: 'depTime', label: 'Giờ khởi hành sớm nhất' },
    { key: 'duration', label: 'Thời gian ngắn nhất' },
  ];

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'depTime') return parseTimeMinutes(a.depTime) - parseTimeMinutes(b.depTime);
    if (sortBy === 'duration') return parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration);
    return 0;
  });

  const suggestionsFor = (value: string) => {
    const q = value.trim().toLowerCase();
    if (!q) return CITY_LIST;
    return CITY_LIST.filter(c => c.name.toLowerCase().includes(q));
  };

  const findCity = (city: string) => {
    const c = city.trim().toLowerCase();
    if (!c) return undefined;
    return CITY_LIST.find(entry =>
      c.includes(entry.name.toLowerCase()) || entry.aliases?.some(alias => c.includes(alias))
    );
  };

  const getCityCoords = (city: string): [number, number] => findCity(city)?.coords || [16.0471, 108.2068];
  const getStationName = (city: string) => findCity(city)?.station || 'Bến xe trung tâm';

  // Same fallback pair used everywhere on this page (cards, summary, map) so an empty search never shows mismatched defaults.
  const effectiveOrigin = searchOrigin || 'TP. Hồ Chí Minh';
  const effectiveDest = searchDestination || 'Nha Trang';

  const originCoords = getCityCoords(effectiveOrigin);
  const destCoords = getCityCoords(effectiveDest);
  const mapCenter: [number, number] = [(originCoords[0] + destCoords[0]) / 2, (originCoords[1] + destCoords[1]) / 2];

  const [routePath, setRoutePath] = useState<[number, number][]>([originCoords, destCoords]);
  const [routeDistance, setRouteDistance] = useState('...');
  const [routeDuration, setRouteDuration] = useState('...');

  useEffect(() => {
    const getRoute = async () => {
      try {
        const waypoints = buildWaypoints(originCoords, destCoords);
        const coordsParam = waypoints.map(p => `${p[1]},${p[0]}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRouteDistance(`${Math.round(route.distance / 1000)} km`);
          const h = Math.floor(route.duration / 3600);
          const m = Math.round((route.duration % 3600) / 60);
          setRouteDuration(`~ ${h}h ${m}m`);
          setRoutePath(route.geometry.coordinates.map((c: any) => [c[1], c[0]]));
        } else {
          setRoutePath([originCoords, destCoords]);
        }
      } catch {
        setRoutePath([originCoords, destCoords]);
      }
    };
    getRoute();
  }, [originCoords[0], originCoords[1], destCoords[0], destCoords[1]]);

  useEffect(() => {
    setPage(1);
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/trips', {
          params: { origin: searchOrigin, destination: searchDestination, date: searchDate, passengers: searchPassengers, page: 1, limit: 10 }
        });

        if (res.data && res.data.data && res.data.data.length > 0) {
          setTrips(res.data.data.map(mapTripFromApi));
          setHasMore(res.data.data.length === 10);
        } else {
          setTrips(getMockTrips(effectiveOrigin, effectiveDest));
          setHasMore(false);
        }
      } catch {
        setTrips(getMockTrips(effectiveOrigin, effectiveDest));
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [searchOrigin, searchDestination, searchDate, searchPassengers]);

  const mapTripFromApi = (item: any) => {
    const busAgent = item.trip?.busAgent;
    const minPrice = item.prices?.length ? Math.min(...item.prices.map((p: any) => p.price)) : item.trip?.route?.basePrice;
    const pickup = item.checkpoints?.find((c: any) => c.type === 'PICKUP')?.station?.name;
    const dropoff = item.checkpoints?.find((c: any) => c.type === 'DROPOFF')?.station?.name;
    const hours = Math.floor((item.durationMins || 0) / 60);
    const mins = (item.durationMins || 0) % 60;
    return {
      id: item.id,
      company: busAgent?.name || 'An Chuyến',
      type: item.bus?.type || (item.trip?.busClass === 'EXECUTIVE' ? 'Limousine' : 'Ghế ngồi'),
      depTime: item.departureTime ? new Date(item.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '07:00',
      arrTime: item.arrivalTime ? new Date(item.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15:30',
      from: pickup || `Bến xe ${effectiveOrigin}`,
      to: dropoff || `Bến xe ${effectiveDest}`,
      duration: item.durationMins ? `${hours}h ${mins}p` : '8h 30m',
      price: minPrice || 350000,
      rating: busAgent?.rating || 4.8,
    };
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const res = await api.get('/trips', {
        params: { origin: searchOrigin, destination: searchDestination, date: searchDate, passengers: searchPassengers, page: nextPage, limit: 10 }
      });
      const newTrips = res.data?.data?.length ? res.data.data.map(mapTripFromApi) : [];
      setTrips(prev => [...prev, ...newTrips]);
      setHasMore(newTrips.length === 10);
      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getMockTrips = (origin: string, dest: string) => [
    { id: 1, company: 'Phương Trang', type: 'Limousine 22 chỗ', depTime: '07:00', arrTime: '15:30', from: `Bến xe ${origin}`, to: `Bến xe ${dest}`, duration: routeDuration, price: 350000, rating: 4.8 },
    { id: 2, company: 'Thành Bưởi', type: 'Giường nằm 40 chỗ', depTime: '08:30', arrTime: '17:30', from: `Bến xe ${origin}`, to: `Bến xe ${dest}`, duration: routeDuration, price: 300000, rating: 4.6 },
    { id: 3, company: 'Futa Bus Lines', type: 'Limousine 34 chỗ', depTime: '10:00', arrTime: '18:15', from: `Bến xe ${origin}`, to: `Bến xe ${dest}`, duration: routeDuration, price: 400000, rating: 4.7 },
  ];

  const handleSearch = () => {
    setSearchParams({ origin: formOrigin, destination: formDest, date: formDate, passengers: formPass });
  };

  const formattedDate = new Date(searchDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen min-h-screen pt-[104px] bg-[#F8F9FF] lg:overflow-hidden font-['Be_Vietnam_Pro',_sans-serif] text-[#0D1C2E]">

      {/* ── LEFT PANEL (Fixed Width on desktop, full width on mobile) ── */}
      <div className="w-full lg:w-[480px] bg-[#F8F9FF] border-r border-[#D4C5AB] flex h-auto lg:h-full shrink-0 z-40 lg:overflow-hidden">

        {/* Floating Navigation Sidebar — desktop only, main nav covers mobile */}
        <div className="hidden lg:flex w-[80px] border-r border-[#D4C5AB] flex-col items-center py-6 shrink-0 h-full">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-[#FFC107] border border-[#785900] rounded-xl flex items-center justify-center text-[#785900] cursor-pointer">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-[#785900] text-center">Tìm vé</span>
          </div>
          <div className="flex flex-col gap-6 mt-8 opacity-70">
            {[{ icon: Calendar, label: 'Vé của tôi', to: '/my-bookings' }, { icon: Star, label: 'Ưu đãi', to: '/offers' }].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.to)}
                className="flex flex-col items-center gap-1 text-[#585E6C] hover:text-[#0D1C2E] cursor-pointer transition-colors"
              >
                <item.icon size={20} />
                <span className="text-[10px] font-semibold text-center w-16">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-1 text-[#585E6C] hover:text-[#0D1C2E] cursor-pointer transition-colors opacity-70">
            <Search size={20} />
            <span className="text-[10px] font-semibold text-center w-16">Trợ giúp</span>
          </div>
        </div>

        {/* Scrollable content beside sidebar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Search Form Card */}
          <div className="p-6 pb-4">
            <div className="bg-white border border-[#D4C5AB] rounded-xl shadow-[0_1px_1px_rgba(0,0,0,0.05)] p-[17px] flex flex-col gap-4">

              {/* Locations */}
              <div className="flex items-center gap-4 relative">
                <div className="flex-1 relative">
                  <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg p-[13px] flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#585E6C]">Điểm đi</span>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#785900] shrink-0" />
                      <input
                        value={formOrigin}
                        onChange={e => setFormOrigin(e.target.value)}
                        onFocus={() => setActiveField('origin')}
                        onBlur={() => setTimeout(() => setActiveField(f => f === 'origin' ? null : f), 150)}
                        className="w-full text-base font-bold text-[#0D1C2E] outline-none bg-transparent"
                      />
                    </div>
                    <span className="text-[11px] text-[#595F66] truncate">{formOrigin ? getStationName(formOrigin) : `Bến xe ${effectiveOrigin}`}</span>
                  </div>
                  {activeField === 'origin' && suggestionsFor(formOrigin).length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D4C5AB] rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto py-1.5">
                      {suggestionsFor(formOrigin).map(c => (
                        <div
                          key={c.name}
                          onMouseDown={e => { e.preventDefault(); setFormOrigin(c.name); setActiveField(null); }}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-[#F8F9FF] transition-colors"
                        >
                          <MapPin size={14} className="text-[#785900] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#0D1C2E] truncate">{c.name}</div>
                            <div className="text-[11px] text-[#595F66] truncate">{c.station}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  onClick={() => { setFormOrigin(formDest); setFormDest(formOrigin); }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#F8F9FF] border border-[#D4C5AB] rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors z-10"
                >
                  <ArrowLeftRight size={14} className="text-[#585E6C]" />
                </div>
                <div className="flex-1 relative">
                  <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg p-[13px] flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#585E6C]">Điểm đến</span>
                    <div className="flex items-center gap-2 pl-1">
                      <input
                        value={formDest}
                        onChange={e => setFormDest(e.target.value)}
                        onFocus={() => setActiveField('dest')}
                        onBlur={() => setTimeout(() => setActiveField(f => f === 'dest' ? null : f), 150)}
                        className="w-full text-base font-bold text-[#0D1C2E] outline-none bg-transparent"
                      />
                    </div>
                    <span className="text-[11px] text-[#595F66] truncate">{formDest ? getStationName(formDest) : `Bến xe ${effectiveDest}`}</span>
                  </div>
                  {activeField === 'dest' && suggestionsFor(formDest).length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D4C5AB] rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto py-1.5">
                      {suggestionsFor(formDest).map(c => (
                        <div
                          key={c.name}
                          onMouseDown={e => { e.preventDefault(); setFormDest(c.name); setActiveField(null); }}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-[#F8F9FF] transition-colors"
                        >
                          <MapPin size={14} className="text-[#BA1A1A] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#0D1C2E] truncate">{c.name}</div>
                            <div className="text-[11px] text-[#595F66] truncate">{c.station}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date & Return */}
              <div className="flex items-start gap-4">
                <label className="flex-1 bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg p-[13px] flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#585E6C]">Ngày đi</span>
                    <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="text-base font-bold text-[#0D1C2E] outline-none bg-transparent cursor-pointer relative z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0" />
                  </div>
                  <Calendar size={18} className="text-[#585E6C] shrink-0" />
                </label>
                <div className="flex items-center gap-3 h-[62px] shrink-0">
                  <span className="text-sm font-medium text-[#585E6C]">Khứ hồi</span>
                  <div className={cn("w-10 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors border border-[#D4C5AB]", isReturn ? 'bg-[#FFC107]' : 'bg-[#EDEBE3]')} onClick={() => setIsReturn(!isReturn)}>
                    <div className={cn("w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm", isReturn ? 'translate-x-4' : 'translate-x-0')} />
                  </div>
                </div>
              </div>

              {/* Ticket Count & Vehicle Type */}
              <div className="grid grid-cols-[2fr_3fr] gap-4">
                <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg p-[13px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#585E6C]">Số lượng vé</span>
                    <select value={formPass} onChange={e => setFormPass(e.target.value)} className="text-sm font-bold text-[#0D1C2E] outline-none appearance-none bg-transparent">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} vé</option>)}
                    </select>
                  </div>
                  <ChevronDown size={12} className="text-[#585E6C]" />
                </div>
                <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg p-[13px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#585E6C]">Loại xe</span>
                    <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="text-sm font-bold text-[#0D1C2E] outline-none appearance-none bg-transparent">
                      <option>Tất cả</option>
                      <option>Limousine</option>
                      <option>Giường nằm</option>
                    </select>
                  </div>
                  <ChevronDown size={12} className="text-[#585E6C]" />
                </div>
              </div>

              <button onClick={handleSearch} className="w-full bg-[#FFC107] hover:brightness-95 text-[#261A00] font-bold py-3 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-all flex items-center justify-center gap-2">
                <Search size={16} /> Tìm chuyến xe
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="px-6 pb-8">
            <div className="flex items-center justify-between pt-2 pb-4 relative">
              <h2 className="text-xl font-semibold text-[#0D1C2E]">Chuyến xe gợi ý</h2>
              <button
                onClick={() => setShowSortMenu(s => !s)}
                className="flex items-center gap-1 text-sm font-medium text-[#585E6C] hover:text-[#0D1C2E] transition-colors"
              >
                <ArrowLeftRight size={11} className="rotate-90" /> Sắp xếp
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute top-full right-0 mt-1.5 bg-white border border-[#D4C5AB] rounded-lg shadow-lg z-30 py-1.5 w-56">
                    {SORT_OPTIONS.map(opt => (
                      <div
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowSortMenu(false); }}
                        className={cn(
                          "px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F8F9FF] transition-colors",
                          sortBy === opt.key ? "font-bold text-[#785900]" : "font-medium text-[#0D1C2E]"
                        )}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {isLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 bg-[#EFF4FF] rounded-xl animate-pulse" />)
              ) : sortedTrips.length > 0 ? (
                sortedTrips.map((trip, idx) => {
                  const isFeatured = idx === 0;
                  const badge = COMPANY_BADGE[trip.company];
                  const [typeLine1, typeLine2] = splitVehicleType(trip.type);
                  const isSelected = selectedTripId === trip.id;
                  return (
                    <div
                      key={trip.id}
                      ref={el => { tripCardRefs.current[trip.id] = el; }}
                      onClick={() => handleSelectTrip(trip.id)}
                      className={cn(
                        "bg-white rounded-xl p-[18px] flex flex-col gap-4 transition-all duration-200 cursor-pointer active:scale-[0.98]",
                        isSelected
                          ? "border-2 border-[#785900] shadow-[0_8px_16px_-4px_rgba(120,89,0,0.25)] ring-2 ring-[#785900]/20 -translate-y-0.5"
                          : isFeatured ? "border-2 border-[#785900] shadow-[0_4px_6px_rgba(0,0,0,0.05)]" : "border border-[#D4C5AB] shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:border-[#785900]/50"
                      )}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-[#0D1C2E] leading-7">{trip.depTime}</span>
                          <span className="text-xs text-[#595F66]">{trip.from}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-4 pt-1">
                          <span className="text-xs font-medium text-[#585E6C] pb-1">~ {trip.duration}</span>
                          <div className="w-full flex items-center relative h-[6px]">
                            <div className="w-[6px] h-[6px] rounded-full border border-[#585E6C] shrink-0" />
                            <div className="flex-1 border-t border-dashed border-[#C5CBD3] relative mx-1">
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 flex items-center justify-center">
                                <Bus size={10} className="text-[#585E6C]" />
                              </div>
                            </div>
                            <div className="w-[6px] h-[6px] rounded-full bg-[#585E6C] border border-[#585E6C] shrink-0" />
                          </div>
                          <div className="pt-1">
                            <div className="bg-[#D4E4FC] text-[#595F66] text-[10px] leading-[15px] text-center rounded px-2 py-0.5 whitespace-nowrap">
                              <p>{typeLine1}</p>
                              {typeLine2 && <p>{typeLine2}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-[#0D1C2E] leading-7 text-right">{trip.arrTime}</span>
                          <span className="text-xs text-[#595F66] text-right">{trip.to}</span>
                        </div>
                      </div>

                      <div className="w-full border-t border-[#D4C5AB] pt-[13px] flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-lg font-bold text-[#BA1A1A] leading-7">
                            {new Intl.NumberFormat('vi-VN').format(trip.price)}đ
                          </span>
                          <div className="flex items-center gap-2">
                            {badge && (
                              badge.outline
                                ? <span className="border rounded-[2px] px-[5px] py-px text-[10px] font-bold" style={{ borderColor: badge.text, color: badge.text }}>{badge.label}</span>
                                : <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: badge.bg, color: badge.text }}>{badge.label}</span>
                            )}
                            <span className="text-xs font-medium text-[#0D1C2E]">{trip.company}</span>
                            <span className="flex items-center gap-0.5 text-xs font-bold text-[#785900]">
                              <Star size={10} className="fill-[#785900] text-[#785900]" /> {trip.rating}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/seat-selection/${trip.id}`); }}
                          className={cn(
                            "rounded-md px-[17px] py-[7px] text-sm font-bold transition-colors",
                            isFeatured ? "border border-[#785900] text-[#785900] hover:bg-[#785900]/10" : "border border-[#D4C5AB] text-[#0D1C2E] hover:bg-[#F8F9FF]"
                          )}
                        >
                          Chọn ghế
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-[#585E6C] bg-[#EFF4FF] rounded-xl border border-dashed border-[#D4C5AB]">
                  <Search size={32} className="mb-3 text-[#D4C5AB]" />
                  <span className="text-sm font-semibold">Không tìm thấy chuyến xe nào</span>
                  <span className="text-[10px] mt-1">Vui lòng thử thay đổi tiêu chí tìm kiếm</span>
                </div>
              )}

              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full py-[13px] bg-[#D4E4FC] border border-[#D4C5AB] rounded-lg text-sm font-medium text-[#0D1C2E] flex items-center justify-center gap-2 hover:bg-[#c8dcf9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Đang tải...' : 'Xem thêm chuyến khác'} <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Map) — hidden on mobile, shown from lg up ── */}
      <div className="hidden lg:block flex-1 relative h-full bg-[#E3EAE6] z-0">
        <MapContainer ref={mapRef} center={mapCenter} zoom={7} className="w-full h-full" zoomControl={false} attributionControl={false} scrollWheelZoom={true}>
          <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" opacity={1} />
          <Marker position={originCoords} icon={startIcon} />
          <Marker position={destCoords} icon={endIcon} />
          <Polyline positions={routePath} color="#785900" weight={4} opacity={0.85} />
        </MapContainer>

        {/* Top Overlay: Route filter pill + map controls */}
        <div className="absolute left-6 right-6 top-6 z-[400] flex items-start justify-between">
          <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-xl p-[13px] flex items-center gap-4 max-w-[448px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D1C2E]">
                {effectiveOrigin} <ArrowRight size={14} className="text-[#585E6C]" /> {effectiveDest}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#585E6C] pt-0.5">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{searchPassengers} vé</span>
                <span>•</span>
                <span>{vehicleType === 'Tất cả' ? 'Tất cả loại xe' : vehicleType}</span>
              </div>
            </div>
            <button className="bg-[#D4E4FC] border border-[#D4C5AB] rounded-lg px-[13px] py-[7px] text-sm font-medium text-[#0D1C2E] hover:bg-[#c8dcf9] transition-colors shrink-0">
              Thay đổi
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <button onClick={() => mapRef.current?.zoomIn()} className="w-10 h-10 flex items-center justify-center border-b border-[#D4C5AB] text-[#0D1C2E] hover:bg-[#F0F1FC] transition-colors">
                <Plus size={14} />
              </button>
              <button onClick={() => mapRef.current?.zoomOut()} className="w-10 h-10 flex items-center justify-center text-[#0D1C2E] hover:bg-[#F0F1FC] transition-colors">
                <Minus size={14} />
              </button>
            </div>
            <button onClick={() => mapRef.current?.setView(mapCenter, 7)} className="w-10 h-10 bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg flex items-center justify-center text-[#0D1C2E] hover:bg-[#F0F1FC] transition-colors shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <LocateFixed size={18} />
            </button>
          </div>
        </div>

        {/* Floating Route Distance Badge */}
        {routeDistance !== '...' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] bg-[#F8F9FF] border border-[#D4C5AB] rounded-lg px-[13px] py-[9px] flex items-center gap-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
            <Bus size={14} className="text-[#585E6C]" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0D1C2E]">{routeDuration}</span>
              <span className="text-[10px] text-[#595F66]">{routeDistance}</span>
            </div>
          </div>
        )}

        {/* Bottom Summary Card Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-[400] bg-[#F8F9FF] border border-[#D4C5AB] rounded-2xl p-[25px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-xl font-semibold text-[#0D1C2E]">Tóm tắt hành trình</h3>
            <div className="bg-[#FFC107] rounded-full px-3 py-1 flex items-center gap-2">
              <Info size={12} className="text-[#261A00]" />
              <span className="text-xs font-bold text-[#261A00]">Thông tin chi tiết</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Route Timeline */}
            <div className="col-span-5 border-r border-[#D4C5AB] pr-px pb-2 flex flex-col gap-6 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-[#785900]/20" />
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0 z-10">
                  <MapPin size={12} className="text-[#261A00]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#0D1C2E]">{getStationName(effectiveOrigin)}</span>
                  <span className="text-xs text-[#585E6C]">{effectiveOrigin}</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-[#FFDAD6] flex items-center justify-center shrink-0 z-10">
                  <MapPin size={12} className="text-[#BA1A1A]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#0D1C2E]">{getStationName(effectiveDest)}</span>
                  <span className="text-xs text-[#585E6C]">{effectiveDest}</span>
                </div>
              </div>
            </div>

            {/* Stats & Highlights */}
            <div className="col-span-7 flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1 bg-[#EFF4FF] border border-[#D4C5AB] rounded-xl flex flex-col items-center p-[13px] gap-1">
                  <MapPin size={18} className="text-[#585E6C] mb-1" />
                  <span className="text-[10px] font-medium text-[#585E6C] tracking-wide uppercase">Khoảng cách</span>
                  <span className="text-base font-bold text-[#0D1C2E]">{routeDistance}</span>
                </div>
                <div className="flex-1 bg-[#EFF4FF] border border-[#D4C5AB] rounded-xl flex flex-col items-center p-[13px] gap-1">
                  <Calendar size={18} className="text-[#585E6C] mb-1" />
                  <span className="text-[10px] font-medium text-[#585E6C] tracking-wide uppercase">Thời gian</span>
                  <span className="text-base font-bold text-[#0D1C2E]">{routeDuration}</span>
                </div>
                <div className="flex-1 bg-[#EFF4FF] border border-[#785900]/20 rounded-xl flex flex-col items-center p-[13px] gap-1">
                  <Bus size={18} className="text-[#785900] mb-1" />
                  <span className="text-[10px] font-medium text-[#585E6C] tracking-wide uppercase">Giá vé từ</span>
                  <span className="text-base font-bold text-[#785900]">300.000đ</span>
                </div>
              </div>
              <div className="bg-[#D4E4FC]/30 border border-[#D4C5AB] rounded-xl flex items-center justify-between p-[13px]">
                <div className="flex items-center gap-2">
                  <Bus size={14} className="text-[#0D1C2E]" />
                  <span className="text-xs font-bold text-[#0D1C2E]">Xe đa dạng</span>
                </div>
                <div className="w-px h-4 bg-[#D4C5AB]" />
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#0D1C2E]" />
                  <span className="text-xs font-bold text-[#0D1C2E]">An toàn</span>
                </div>
                <div className="w-px h-4 bg-[#D4C5AB]" />
                <div className="flex items-center gap-2">
                  <Headphones size={14} className="text-[#0D1C2E]" />
                  <span className="text-xs font-bold text-[#0D1C2E]">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
