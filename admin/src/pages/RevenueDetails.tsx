import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, Tag, Wallet } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { supabase } from '../lib/supabase';
import Table from '../components/Table';
import { isPaidBooking } from '../lib/bookingStatus';

const RANGES = [7, 30, 90] as const;
type RangeDays = typeof RANGES[number];
type ViewMode = 'route' | 'trip';

const formatVND = (n: number) => `${Math.round(n || 0).toLocaleString('vi-VN')}đ`;

const RevenueDetails = () => {
  const [rangeDays, setRangeDays] = useState<RangeDays>(30);
  const [view, setView] = useState<ViewMode>('route');
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [citiesMap, setCitiesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData(rangeDays);
  }, [rangeDays]);

  const fetchData = async (days: number) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);

      const [bookingsRes, citiesRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, status, totalAmount, createdAt, TripSchedule:trip_schedules(id, departureTime, buses(plateNumber), trips(Route:routes(departureCityId, arrivalCityId)))')
          .gte('createdAt', startDate.toISOString())
          .order('createdAt', { ascending: false }),
        supabase.from('cities').select('id, name')
      ]);

      setBookings(bookingsRes.data || []);
      const cMap: Record<string, string> = {};
      (citiesRes.data || []).forEach((c: any) => { cMap[c.id] = c.name; });
      setCitiesMap(cMap);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const paidBookings = useMemo(() => bookings.filter(b => isPaidBooking(b.status)), [bookings]);
  const now = useMemo(() => new Date(), [bookings]);

  const kpis = useMemo(() => {
    const revenue = paidBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const count = paidBookings.length;
    return { revenue, count, avg: count > 0 ? revenue / count : 0 };
  }, [paidBookings]);

  const chartData = useMemo(() => {
    if (rangeDays <= 30) {
      const days: Date[] = [];
      for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        days.push(d);
      }
      return days.map(d => {
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        const revenue = paidBookings
          .filter(b => { const t = new Date(b.createdAt); return t >= d && t < next; })
          .reduce((s, b) => s + (b.totalAmount || 0), 0);
        return { label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), revenue };
      });
    }
    const weeks = Math.ceil(rangeDays / 7);
    const buckets: { start: Date, end: Date }[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const end = new Date(now);
      end.setDate(end.getDate() - i * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      buckets.push({ start, end });
    }
    return buckets.map(({ start, end }) => {
      const revenue = paidBookings
        .filter(b => { const t = new Date(b.createdAt); return t >= start && t <= end; })
        .reduce((s, b) => s + (b.totalAmount || 0), 0);
      return { label: `${start.getDate()}/${start.getMonth() + 1}`, revenue };
    });
  }, [paidBookings, rangeDays, now]);

  const byRoute = useMemo(() => {
    const map = new Map<string, { name: string, revenue: number, count: number }>();
    paidBookings.forEach(b => {
      const route = b.TripSchedule?.trips?.Route;
      if (!route) return;
      const key = `${route.departureCityId}-${route.arrivalCityId}`;
      const name = `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}`;
      const entry = map.get(key) || { name, revenue: 0, count: 0 };
      entry.revenue += b.totalAmount || 0;
      entry.count += 1;
      map.set(key, entry);
    });
    return Array.from(map.values())
      .map(r => ({ ...r, avg: r.count > 0 ? r.revenue / r.count : 0 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [paidBookings, citiesMap]);

  const byTrip = useMemo(() => {
    const map = new Map<string, { id: string, departureTime: string, routeName: string, plate: string, revenue: number, count: number }>();
    paidBookings.forEach(b => {
      const ts = b.TripSchedule;
      if (!ts) return;
      const route = ts.trips?.Route;
      const name = route ? `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}` : '—';
      const entry = map.get(ts.id) || { id: ts.id, departureTime: ts.departureTime, routeName: name, plate: ts.buses?.plateNumber || '—', revenue: 0, count: 0 };
      entry.revenue += b.totalAmount || 0;
      entry.count += 1;
      map.set(ts.id, entry);
    });
    return Array.from(map.values())
      .map(r => ({ ...r, avg: r.count > 0 ? r.revenue / r.count : 0 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [paidBookings, citiesMap]);

  const routeColumns = [
    { key: 'name', label: 'Lộ trình' },
    { key: 'revenue', label: 'Doanh thu', render: (v: number) => <span style={{ fontWeight: 700 }}>{formatVND(v)}</span> },
    { key: 'count', label: 'Số đơn' },
    { key: 'avg', label: 'TB/đơn', render: (v: number) => formatVND(v) }
  ];

  const tripColumns = [
    {
      key: 'departureTime', label: 'Khởi hành', render: (v: string) => {
        const d = new Date(v);
        return `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} · ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    { key: 'routeName', label: 'Lộ trình' },
    { key: 'plate', label: 'Xe' },
    { key: 'revenue', label: 'Doanh thu', render: (v: number) => <span style={{ fontWeight: 700 }}>{formatVND(v)}</span> },
    { key: 'count', label: 'Số đơn' },
    { key: 'avg', label: 'TB/đơn', render: (v: number) => formatVND(v) }
  ];

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-base)' }}>{formatVND(payload[0].value)}</div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>Doanh Thu Chi Tiết</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Phân tích doanh thu theo ngày, lộ trình và chuyến xe.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
          {RANGES.map(d => (
            <button
              key={d}
              onClick={() => setRangeDays(d)}
              style={{
                padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 500,
                backgroundColor: rangeDays === d ? 'var(--color-primary)' : 'transparent',
                color: rangeDays === d ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                transition: 'all 0.15s'
              }}
            >
              {d} ngày
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <SummaryTile title="Tổng doanh thu" value={formatVND(kpis.revenue)} icon={<CreditCard size={18} />} />
            <SummaryTile title="Số đơn đã thanh toán" value={kpis.count.toLocaleString()} icon={<Tag size={18} />} />
            <SummaryTile title="Trung bình / đơn" value={formatVND(kpis.avg)} icon={<Wallet size={18} />} />
          </div>

          {/* Revenue Chart */}
          <div className="pro-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Doanh thu theo thời gian</h3>
            {chartData.every(d => d.revenue === 0) ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                Không có dữ liệu trong khoảng thời gian này
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}tr` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-bg-elevated)' }} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {chartData.map((_, idx) => (
                      <Cell key={idx} fill="var(--color-info)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Breakdown Table */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setView('route')}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: 500,
                backgroundColor: view === 'route' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: view === 'route' ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)'
              }}
            >
              Theo lộ trình
            </button>
            <button
              onClick={() => setView('trip')}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: 500,
                backgroundColor: view === 'trip' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: view === 'trip' ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)'
              }}
            >
              Theo chuyến
            </button>
          </div>

          {view === 'route' ? (
            <Table columns={routeColumns} data={byRoute} title="Doanh thu theo lộ trình" />
          ) : (
            <Table columns={tripColumns} data={byTrip} title="Doanh thu theo chuyến" />
          )}
        </>
      )}
    </div>
  );
};

const SummaryTile = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="pro-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{title}</h3>
      <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{value}</div>
  </div>
);

export default RevenueDetails;
