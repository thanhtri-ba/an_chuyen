import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';

interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
}

export function EventsPage() {
    const { t } = useTranslation();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                const response = await axios.get(`${baseUrl}/api/events`);
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
                toast.error('Lỗi tải danh sách sự kiện.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', paddingTop: 100, paddingBottom: 80, fontFamily: 'system-ui' }}>
            <div style={{ padding: '0 8%' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                        <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Party%20popper/3D/party_popper_3d.png" alt="Events" loading="lazy" decoding="async" style={{ width: 56, height: 56 }} />
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 8 }}>An Chuyến</div>
                            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, margin: 0, color: '#f0ede6' }}>{t('services.events.title', 'Sự Kiện Nổi Bật')}</h1>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                            <Loader2 style={{ width: 32, height: 32, color: '#d4af37' }} className="animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => (
                                <div key={event.id} className="group" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.3s' }}>
                                    <div style={{ height: 192, position: 'relative', overflow: 'hidden' }}>
                                        <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540039155732-68ee23e15b51?auto=format&fit=crop&q=80&w=800'} alt={event.title} loading="lazy" decoding="async" className="group-hover:scale-110" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.9), transparent 50%)' }} />
                                    </div>
                                    <div style={{ padding: 24 }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                            <span style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37', padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <CalendarIcon style={{ width: 12, height: 12 }} />
                                                {new Date(event.startDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <h3 className="group-hover:text-[#d4af37]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 20, color: '#f0ede6', marginBottom: 8, transition: 'color 0.2s' }}>{event.title}</h3>
                                        <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.45)', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                                        <button style={{
                                            width: '100%', marginTop: 16, background: 'rgba(255,255,255,0.05)', color: '#f0ede6',
                                            padding: '12px 16px', fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#d4af37'; e.currentTarget.style.color = '#0e1111'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f0ede6'; }}
                                        >
                                            {t('services.events.bookTicket', 'Mua Vé Ngay')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
