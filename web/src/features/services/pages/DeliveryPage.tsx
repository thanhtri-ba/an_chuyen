import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Package, Truck, MapPin, Navigation, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { DeliveryMap } from '../components/DeliveryMap';
import { ServicePageHeader } from '../components/ServicePageHeader';

interface Vehicle {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Haversine distance formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function DeliveryPage() {
  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [packageType, setPackageType] = useState('Document');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  // Geocoding & Map states
  const [originCoords, setOriginCoords] = useState<[number, number]>([10.7725, 106.6980]);
  const [destCoords, setDestCoords] = useState<[number, number]>([10.7725, 106.6980]);
  const [distance, setDistance] = useState(0);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Workflow state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Tracking state
  const [driverPos] = useState<[number, number]>([10.785, 106.680]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await axios.get(`${baseUrl}/api/deliveries/vehicles`);
        setVehicles(response.data);
        if (response.data.length > 0) {
          setSelectedVehicle(response.data[1]?.id || response.data[0]?.id);
        }
      } catch (error) {
        console.error('Failed to load delivery vehicles', error);
        toast.error('Lỗi tải danh sách xe vận chuyển.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Debounced Geocoding
  useEffect(() => {
    const geocode = async () => {
      setIsGeocoding(true);
      try {
        // Use Nominatim OSM for free geocoding
        const resPickup = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}`);
        const resDropoff = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoff)}`);

        let o: [number, number] = originCoords;
        let d: [number, number] = destCoords;

        if (resPickup.data && resPickup.data.length > 0) {
          o = [parseFloat(resPickup.data[0].lat), parseFloat(resPickup.data[0].lon)];
          setOriginCoords(o);
        }
        if (resDropoff.data && resDropoff.data.length > 0) {
          d = [parseFloat(resDropoff.data[0].lat), parseFloat(resDropoff.data[0].lon)];
          setDestCoords(d);
        }

        // Compute distance
        const dist = calculateDistance(o[0], o[1], d[0], d[1]);
        setDistance(dist < 1 ? 1 : dist); // min 1km
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setIsGeocoding(false);
      }
    };

    const timer = setTimeout(() => {
      if (pickup && dropoff) geocode();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pickup, dropoff]);

  const getDynamicPrice = () => {
    const v = vehicles.find(x => x.id === selectedVehicle);
    if (!v) return 0;
    // Price = base + distance * base/2
    return v.price + (distance * (v.price * 0.15));
  };

  const handleConfirm = async () => {
    if (!selectedVehicle || !pickup || !dropoff) return;

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      await axios.post(`${baseUrl}/api/deliveries/book`, {
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        vehicleId: selectedVehicle,
        packageType,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        totalAmount: getDynamicPrice()
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to submit delivery order', error);
      toast.error('Có lỗi xảy ra khi đặt giao hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstimatedMinutes = () => Math.round(distance * 4); // roughly 15km/h in city = 4 mins/km

  const packageTypes = [
    { id: 'Document', icon: FileText, label: 'Tài liệu' },
    { id: 'Parcel', icon: Package, label: 'Kiện hàng' },
    { id: 'Heavy Goods', icon: Truck, label: 'Hàng nặng' },
  ];

  return (
    <div style={{ background: '#fcfcfc', color: '#1a1a1a', minHeight: '100vh', paddingTop: 100, paddingBottom: 80, fontFamily: 'system-ui' }}>
      <div style={{ padding: '0 8%', maxWidth: 1200, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <ServicePageHeader title="Đặt giao hàng" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">

            <AnimatePresence mode="wait">
              <motion.div
                key="booking-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                {/* Package Type */}
                <div style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 24 }}>
                  <h3 style={{ color: '#1a1a1a', fontWeight: 700, marginBottom: 16 }}>1. Loại hàng</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {packageTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setPackageType(type.id)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12,
                          border: `2px solid ${packageType === type.id ? '#163328' : 'rgba(0,0,0,0.08)'}`,
                          background: packageType === type.id ? 'rgba(22,51,40,0.1)' : 'transparent',
                          color: packageType === type.id ? '#163328' : 'rgba(0,0,0,0.5)',
                          borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <type.icon style={{ width: 24, height: 24, marginBottom: 8 }} />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ color: '#1a1a1a', fontWeight: 700 }}>2. Địa điểm</h3>
                    {isGeocoding && <Loader2 style={{ width: 16, height: 16, color: '#163328' }} className="animate-spin" />}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 15, top: 24, bottom: 24, width: 2, background: 'rgba(0,0,0,0.1)' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, position: 'relative' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#163328', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>
                        <MapPin style={{ width: 16, height: 16, color: '#fcfcfc' }} />
                      </div>
                      <input type="text" value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Nhập điểm lấy hàng..." style={{ width: '100%', background: 'rgba(0,0,0,0.05)', padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#1a1a1a', outline: 'none', border: '1px solid transparent', borderRadius: 8 }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'transparent', border: '4px solid #163328', zIndex: 1, flexShrink: 0 }}></div>
                      <input type="text" value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Nhập điểm giao hàng..." style={{ width: '100%', background: 'rgba(0,0,0,0.05)', padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#1a1a1a', outline: 'none', border: '1px solid transparent', borderRadius: 8 }} />
                    </div>
                  </div>
                </div>

                {/* Select Vehicle */}
                <div style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 24 }}>
                  <h3 style={{ color: '#1a1a1a', fontWeight: 700, marginBottom: 16 }}>3. Chọn xe</h3>
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                      <Loader2 style={{ width: 24, height: 24, color: '#163328' }} className="animate-spin" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {vehicles.map(v => {
                        const dynPrice = v.price + (distance * (v.price * 0.15));
                        const selected = selectedVehicle === v.id;
                        return (
                          <div
                            key={v.id}
                            onClick={() => setSelectedVehicle(v.id)}
                            style={{
                              display: 'flex', alignItems: 'center', padding: 12,
                              border: `2px solid ${selected ? '#163328' : 'rgba(0,0,0,0.08)'}`,
                              background: selected ? 'rgba(22,51,40,0.05)' : 'transparent',
                              cursor: 'pointer', transition: 'all 0.2s', borderRadius: 8,
                            }}
                          >
                            <div style={{
                              width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderRadius: 8,
                              background: selected ? '#163328' : 'rgba(0,0,0,0.05)', color: selected ? '#fcfcfc' : 'rgba(0,0,0,0.5)',
                            }}>
                              <Truck style={{ width: 24, height: 24 }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{v.name}</h4>
                              <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>{v.description}</p>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>
                              ${dynPrice.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Map Area */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 16, flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 500 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 16, zIndex: 1, position: 'relative' }}>
                <div style={{ background: 'rgba(0,0,0,0.08)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                  <Clock style={{ width: 16, height: 16, color: '#163328' }} />
                  ~{getEstimatedMinutes()} phút
                </div>
                <div style={{ background: 'rgba(0,0,0,0.08)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                  <Navigation style={{ width: 16, height: 16, color: '#163328' }} /> {distance.toFixed(1)} km
                </div>
              </div>

              {/* Map implementation */}
              <DeliveryMap origin={originCoords} dest={destCoords} isTracking={true} driverPos={driverPos} />

              {isSuccess && (
                <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', padding: 16, border: '1px solid rgba(0,0,0,0.1)', margin: 8, borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>Giao đến</h4>
                      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>{dropoff}</p>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
                      Đang tìm tài xế...
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} className="animate-pulse" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>Đang tìm tài xế... <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 400 }}>--</span></p>
                    </div>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(0,0,0,0.08)', height: 6, borderRadius: 100, marginTop: 16, overflow: 'hidden' }}>
                    <div style={{ background: '#163328', width: '60%', height: '100%', borderRadius: 100 }}></div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Total Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
            >
              <div>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 4 }}>Tổng chi phí ước tính</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>
                  ${getDynamicPrice().toFixed(2)}
                </p>
              </div>
              <button
                disabled={isSubmitting || isSuccess || isGeocoding}
                onClick={handleConfirm}
                style={{
                  padding: '16px 32px', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none',
                  display: 'flex', alignItems: 'center', gap: 8, cursor: (isSubmitting || isGeocoding) ? 'not-allowed' : 'pointer',
                  opacity: (isSubmitting || isGeocoding) ? 0.7 : 1,
                  background: isSuccess ? '#10b981' : 'linear-gradient(135deg,#163328,#f0c94a)',
                  color: isSuccess ? '#fff' : '#fcfcfc',
                }}
              >
                {isSubmitting ? <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" /> : null}
                {isSuccess ? (
                  <><CheckCircle2 style={{ width: 20, height: 20 }} /> Đã xác nhận!</>
                ) : (
                  'Xác nhận giao hàng'
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
