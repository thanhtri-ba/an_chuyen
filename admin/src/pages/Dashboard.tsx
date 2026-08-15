import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Tag, TrendingUp, TrendingDown, CreditCard, Bell, Activity,
  XCircle, MapPin, Clock, Bus as BusIcon, ChevronRight, Map as MapIcon, Gift, Calendar,
  Image as ImageIcon, Star, Building, Route as RouteIcon, Settings, BarChart3, Palette
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';
import { isPaidBooking, bookingStatusColor } from '../lib/bookingStatus';

const RANGES = [7, 30, 90] as const;
type RangeDays = typeof RANGES[number];

const formatVND = (n: number) => `${Math.round(n || 0).toLocaleString('vi-VN')}đ`;

const computeTrend = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const Dashboard = () => {
  const { t } = useLanguage();
  const [rangeDays, setRangeDays] = useState<RangeDays>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState('ALL');

  const [bookings, setBookings] = useState<any[]>([]);
  const [citiesMap, setCitiesMap] = useState<Record<string, string>>({});
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [newUsers, setNewUsers] = useState({ current: 0, previous: 0 });
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchDashboardData(rangeDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const tables = ['users', 'bookings', 'payments', 'trip_schedules', 'buses', 'promotions', 'events', 'banners', 'reviews', 'cities', 'routes'];
      const results = await Promise.all(tables.map(tbl => supabase.from(tbl).select('*', { count: 'exact', head: true })));
      const counts: Record<string, number> = {};
      tables.forEach((tbl, i) => { counts[tbl] = results[i].count || 0; });
      setCategoryCounts(counts);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardData = async (days: number) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - days);

      const [bookingsRes, citiesRes, upcomingRes, usersCurrentRes, usersPrevRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, status, totalAmount, createdAt, User:users(fullName, avatar), TripSchedule:trip_schedules(departureTime, trips(Route:routes(departureCityId, arrivalCityId)))')
          .gte('createdAt', prevStart.toISOString())
          .order('createdAt', { ascending: false }),
        supabase.from('cities').select('id, name'),
        supabase
          .from('trip_schedules')
          .select('id, departureTime, arrivalTime, trips(Route:routes(departureCityId, arrivalCityId)), buses(plateNumber)')
          .gte('departureTime', now.toISOString())
          .order('departureTime', { ascending: true })
          .limit(6),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('createdAt', startDate.toISOString()),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('createdAt', prevStart.toISOString()).lt('createdAt', startDate.toISOString())
      ]);

      setBookings(bookingsRes.data || []);

      const cMap: Record<string, string> = {};
      (citiesRes.data || []).forEach((c: any) => { cMap[c.id] = c.name; });
      setCitiesMap(cMap);

      setUpcomingTrips(upcomingRes.data || []);
      setNewUsers({ current: usersCurrentRes.count || 0, previous: usersPrevRes.count || 0 });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const now = useMemo(() => new Date(), [bookings]);
  const startDate = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - rangeDays);
    return d;
  }, [now, rangeDays]);
  const prevStart = useMemo(() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - rangeDays);
    return d;
  }, [startDate, rangeDays]);

  const currentBookings = useMemo(
    () => bookings.filter(b => new Date(b.createdAt) >= startDate),
    [bookings, startDate]
  );
  const previousBookings = useMemo(
    () => bookings.filter(b => { const t = new Date(b.createdAt); return t >= prevStart && t < startDate; }),
    [bookings, prevStart, startDate]
  );

  const kpis = useMemo(() => {
    const sumPaid = (arr: any[]) => arr.filter(b => isPaidBooking(b.status)).reduce((s, b) => s + (b.totalAmount || 0), 0);
    const cancelRate = (arr: any[]) => arr.length === 0 ? 0 : (arr.filter(b => b.status === 'CANCELLED').length / arr.length) * 100;

    const revenue = sumPaid(currentBookings);
    const revenuePrev = sumPaid(previousBookings);
    const bookingsCount = currentBookings.length;
    const bookingsCountPrev = previousBookings.length;
    const cancelRateCurrent = cancelRate(currentBookings);
    const cancelRatePrev = cancelRate(previousBookings);

    return {
      revenue, revenueTrend: computeTrend(revenue, revenuePrev),
      bookingsCount, bookingsTrend: computeTrend(bookingsCount, bookingsCountPrev),
      newUsers: newUsers.current, newUsersTrend: computeTrend(newUsers.current, newUsers.previous),
      cancelRate: cancelRateCurrent, cancelRateTrend: computeTrend(cancelRateCurrent, cancelRatePrev)
    };
  }, [currentBookings, previousBookings, newUsers]);

  const chartData = useMemo(() => {
    const paid = currentBookings.filter(b => isPaidBooking(b.status));
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
        const revenue = paid
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
      const revenue = paid
        .filter(b => { const t = new Date(b.createdAt); return t >= start && t <= end; })
        .reduce((s, b) => s + (b.totalAmount || 0), 0);
      return { label: `${start.getDate()}/${start.getMonth() + 1}`, revenue };
    });
  }, [currentBookings, rangeDays, now]);

  const topRoutes = useMemo(() => {
    const map = new Map<string, { name: string, revenue: number, count: number }>();
    currentBookings.filter(b => isPaidBooking(b.status)).forEach(b => {
      const route = b.TripSchedule?.trips?.Route;
      if (!route) return;
      const key = `${route.departureCityId}-${route.arrivalCityId}`;
      const name = `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}`;
      const entry = map.get(key) || { name, revenue: 0, count: 0 };
      entry.revenue += b.totalAmount || 0;
      entry.count += 1;
      map.set(key, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [currentBookings, citiesMap]);

  const maxTopRouteRevenue = topRoutes[0]?.revenue || 1;

  const recentActivity = useMemo(() => {
    let filtered = bookings;
    if (activityFilter === 'PAID_GROUP') filtered = bookings.filter(b => isPaidBooking(b.status));
    else if (activityFilter !== 'ALL') filtered = bookings.filter(b => b.status === activityFilter);
    return filtered.slice(0, 12);
  }, [bookings, activityFilter]);

  const activityTabs = [
    { key: 'ALL', label: t('dashboard', 'statusAll') },
    { key: 'PAID_GROUP', label: t('dashboard', 'statusPaid') },
    { key: 'PENDING_PAYMENT', label: t('dashboard', 'statusPending') },
    { key: 'CANCELLED', label: t('dashboard', 'statusCancelled') },
    { key: 'REFUNDED', label: t('dashboard', 'statusRefunded') }
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>{t('dashboard', 'title')}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t('dashboard', 'subtitle')}</p>
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
              {t('dashboard', d === 7 ? 'last7Days' : d === 30 ? 'last30Days' : 'last90Days')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading real-time data...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard title={t('dashboard', 'totalRevenue')} value={formatVND(kpis.revenue)} trend={kpis.revenueTrend} icon={<CreditCard size={18} />} />
            <StatCard title={t('dashboard', 'totalBookings')} value={kpis.bookingsCount.toLocaleString()} trend={kpis.bookingsTrend} icon={<Tag size={18} />} />
            <StatCard title={t('dashboard', 'newUsers')} value={kpis.newUsers.toLocaleString()} trend={kpis.newUsersTrend} icon={<Users size={18} />} />
            <StatCard title={t('dashboard', 'cancellationRate')} value={`${kpis.cancelRate.toFixed(1)}%`} trend={kpis.cancelRateTrend} icon={<XCircle size={18} />} invert />
          </div>

          {/* Chart & Recent Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="pro-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('dashboard', 'revenueOverview')}</h3>
              </div>
              <div style={{ flex: 1, minHeight: '300px' }}>
                {chartData.every(d => d.revenue === 0) ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    {t('dashboard', 'noData')}
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
            </div>

            {/* Recent Activity */}
            <div className="pro-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} style={{ color: 'var(--color-info)' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('dashboard', 'recentActivity')}</h3>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {activityTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActivityFilter(tab.key)}
                    style={{
                      padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 500,
                      backgroundColor: activityFilter === tab.key ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                      color: activityFilter === tab.key ? 'var(--color-bg-base)' : 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', maxHeight: '420px', paddingRight: '0.25rem' }}>
                {recentActivity.length === 0 && (
                  <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{t('dashboard', 'noActivity')}</div>
                )}
                {recentActivity.map(notif => {
                  const route = notif.TripSchedule?.trips?.Route;
                  const routeName = route ? `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}` : null;
                  return (
                    <div key={notif.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                      {notif.User?.avatar ? (
                        <img src={notif.User.avatar} alt={notif.User.fullName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Activity size={16} color="var(--color-text-muted)" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notif.User?.fullName || '—'}</span>
                          {notif.totalAmount ? <span style={{ fontSize: '0.8125rem', fontWeight: 'bold', color: 'var(--color-success)', flexShrink: 0 }}>{formatVND(notif.totalAmount)}</span> : null}
                        </div>
                        {routeName && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{routeName}</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            {new Date(notif.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${bookingStatusColor(notif.status)}20`, color: bookingStatusColor(notif.status), fontWeight: 'bold' }}>
                            {notif.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Routes & Upcoming Trips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="pro-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('dashboard', 'topRoutes')}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{t('dashboard', 'topRoutesSubtitle')}</p>
                </div>
                <Link to="/routes" style={{ fontSize: '0.8125rem', color: 'var(--color-info)', fontWeight: 500 }}>{t('dashboard', 'viewAll')}</Link>
              </div>
              {topRoutes.length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{t('dashboard', 'noRoutesData')}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {topRoutes.map((r, idx) => (
                    <div key={r.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', width: '1.25rem' }}>#{idx + 1}</span>
                          <MapPin size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{formatVND(r.revenue)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{r.count} {t('dashboard', 'bookingsLabel')}</div>
                        </div>
                      </div>
                      <div style={{ height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(4, (r.revenue / maxTopRouteRevenue) * 100)}%`, backgroundColor: 'var(--color-info)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {t('dashboard', 'activeRoutes') || 'Routes'}: {(categoryCounts.routes || 0).toLocaleString()}
              </div>
            </div>

            <div className="pro-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{t('dashboard', 'upcomingTrips')}</h3>
                <Link to="/trips" style={{ fontSize: '0.8125rem', color: 'var(--color-info)', fontWeight: 500 }}>{t('dashboard', 'viewAll')}</Link>
              </div>
              {upcomingTrips.length === 0 ? (
                <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{t('dashboard', 'noUpcomingTrips')}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {upcomingTrips.map(trip => {
                    const route = trip.trips?.Route;
                    const routeName = route ? `${citiesMap[route.departureCityId] || '?'} → ${citiesMap[route.arrivalCityId] || '?'}` : '—';
                    const dep = new Date(trip.departureTime);
                    return (
                      <div key={trip.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Clock size={14} style={{ color: 'var(--color-info)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{routeName}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            <span>{dep.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} · {dep.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            {trip.buses?.plateNumber && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <BusIcon size={11} /> {trip.buses.plateNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category Overview: Management / Marketing / Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <CategoryTable
              title={t('sidebar', 'management')}
              items={[
                { label: t('sidebar', 'users'), value: categoryCounts.users, icon: <Users size={16} />, to: '/users' },
                { label: t('sidebar', 'bookings'), value: categoryCounts.bookings, icon: <Tag size={16} />, to: '/bookings' },
                { label: 'Thanh Toán', value: categoryCounts.payments, icon: <CreditCard size={16} />, to: '/payments' },
                { label: t('sidebar', 'trips'), value: categoryCounts.trip_schedules, icon: <MapIcon size={16} />, to: '/trips' },
                { label: t('sidebar', 'fleet'), value: categoryCounts.buses, icon: <BusIcon size={16} />, to: '/buses' }
              ]}
            />
            <CategoryTable
              title={t('sidebar', 'marketing')}
              items={[
                { label: t('sidebar', 'vouchers'), value: categoryCounts.promotions, icon: <Gift size={16} />, to: '/vouchers' },
                { label: t('sidebar', 'events'), value: categoryCounts.events, icon: <Calendar size={16} />, to: '/events' },
                { label: t('sidebar', 'banners'), value: categoryCounts.banners, icon: <ImageIcon size={16} />, to: '/banners' },
                { label: 'Reviews', value: categoryCounts.reviews, icon: <Star size={16} />, to: '/reviews' }
              ]}
            />
            <CategoryTable
              title={t('sidebar', 'configuration')}
              items={[
                { label: t('sidebar', 'cities'), value: categoryCounts.cities, icon: <Building size={16} />, to: '/cities' },
                { label: t('sidebar', 'routes'), value: categoryCounts.routes, icon: <RouteIcon size={16} />, to: '/routes' },
                { label: t('sidebar', 'platformStats'), icon: <BarChart3 size={16} />, to: '/platform-stats' },
                { label: t('sidebar', 'websiteConfig'), icon: <Palette size={16} />, to: '/website-config' },
                { label: t('sidebar', 'settings'), icon: <Settings size={16} />, to: '/settings' }
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

const CategoryTable = ({ title, items }: { title: string, items: { label: string, value?: number, icon: React.ReactNode, to: string }[] }) => {
  const numericValues = items.filter(i => typeof i.value === 'number').map(i => i.value as number);
  const max = Math.max(1, ...numericValues);
  return (
    <div className="pro-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.25rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {items.map(item => (
          <Link key={item.to} to={item.to} style={{ display: 'block', color: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: typeof item.value === 'number' ? '0.35rem' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              </div>
              {typeof item.value === 'number' ? (
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0 }}>{item.value.toLocaleString()}</span>
              ) : (
                <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              )}
            </div>
            {typeof item.value === 'number' && (
              <div style={{ height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.max(4, (item.value / max) * 100)}%`, backgroundColor: 'var(--color-info)', borderRadius: 'var(--radius-full)' }} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, invert }: { title: string, value: string, trend: number, icon: React.ReactNode, invert?: boolean }) => {
  const isPositive = invert ? trend <= 0 : trend >= 0;
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;
  const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
  return (
    <div className="pro-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{title}</h3>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-base)', marginBottom: '0.25rem' }}>{value}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color }}>
          <TrendIcon size={12} />
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
