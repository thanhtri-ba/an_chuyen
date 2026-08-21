import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Loader2, Search, Calendar, Users, Star, Clock, Plane, Map, Heart } from 'lucide-react';
import axios from 'axios';

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string;
  itineraries: unknown[];
  reviews: unknown[];
}

export function TourPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Customize Group state
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await axios.get(`${baseUrl}/api/tours`);
        setTours(response.data);
      } catch (error) {
        console.error('Failed to fetch tours', error);
        toast.error('Lỗi tải tours. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Use the first tour's price to calculate estimate if available, otherwise default to 999
  const basePrice = tours.length > 0 ? tours[0].price : 999;
  const estTotal = (basePrice * adults) + (basePrice * 0.5 * children);

  const categories = [
    { id: 'beach', icon: Plane, label: 'Biển', active: true },
    { id: 'mountain', icon: Map, label: 'Núi rừng' },
    { id: 'cultural', icon: Heart, label: 'Văn hoá' },
    { id: 'adventure', icon: Star, label: 'Mạo hiểm' },
  ];

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', paddingTop: 100, paddingBottom: 80, fontFamily: 'system-ui' }}>
      <div style={{ padding: '0 8%', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 12 }}>An Chuyến</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 400, color: '#f0ede6', marginBottom: 16, lineHeight: 1.15 }}>
            Tìm chuyến du lịch <em style={{ color: '#d4af37', fontStyle: 'italic' }}>tiếp theo.</em>
          </h1>
          <p style={{ color: 'rgba(240,237,230,0.5)', fontSize: 17, maxWidth: 560, marginBottom: 32 }}>
            Những gói du lịch được tuyển chọn kỹ lưỡng, đưa bạn đến những điểm đến tuyệt vời nhất.
          </p>

          {/* Search Bar */}
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24 }} className="md:flex-row">
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '8px 16px', borderRight: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
              <Search style={{ width: 20, height: 20, color: 'rgba(240,237,230,0.4)', marginRight: 12, flexShrink: 0 }} />
              <input type="text" placeholder="Bạn muốn đi đâu?" style={{ width: '100%', background: 'transparent', outline: 'none', color: '#f0ede6', fontWeight: 500 }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '8px 16px', borderRight: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
              <Calendar style={{ width: 20, height: 20, color: 'rgba(240,237,230,0.4)', marginRight: 12, flexShrink: 0 }} />
              <input type="text" placeholder="Chọn ngày" style={{ width: '100%', background: 'transparent', outline: 'none', color: '#f0ede6', fontWeight: 500 }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '8px 16px', width: '100%' }}>
              <Users style={{ width: 20, height: 20, color: 'rgba(240,237,230,0.4)', marginRight: 12, flexShrink: 0 }} />
              <span style={{ color: '#f0ede6', fontWeight: 500, flex: 1 }}>2 người lớn, 0 trẻ em</span>
            </div>
            <button style={{ background: 'linear-gradient(135deg,#d4af37,#f0c94a)', color: '#0e1111', fontWeight: 700, padding: '16px 32px', borderRadius: 100, width: '100%', border: 'none', cursor: 'pointer', flexShrink: 0 }} className="md:w-auto">
              Tìm tour
            </button>
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            <span style={{ color: 'rgba(240,237,230,0.5)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>Phổ biến:</span>
            {categories.map(cat => (
              <button
                key={cat.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                  whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s',
                  background: cat.active ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  color: cat.active ? '#d4af37' : 'rgba(240,237,230,0.6)',
                  borderColor: cat.active ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <cat.icon style={{ width: 16, height: 16 }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Featured Experiences + Stories) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: '#f0ede6' }}>Trải nghiệm nổi bật</h2>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <Loader2 style={{ width: 32, height: 32, color: '#d4af37' }} className="animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {tours.map((tour, index) => {
                  const isImageLeft = index % 2 === 0;

                  return (
                    <div key={tour.id} className="group flex flex-col md:flex-row" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>

                      {isImageLeft && (
                        <div className="md:w-5/12" style={{ position: 'relative', height: 256, overflow: 'hidden' }}>
                          <img src={tour.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600'} alt={tour.title} loading="lazy" decoding="async" className="group-hover:scale-105" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }} />
                          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(14,17,17,0.8)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, color: '#f0ede6' }}>
                            <Star style={{ width: 12, height: 12, color: '#d4af37', fill: '#d4af37' }} />
                            4.9 (128)
                          </div>
                          <div style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, background: 'rgba(14,17,17,0.8)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Heart style={{ width: 16, height: 16, color: 'rgba(240,237,230,0.5)' }} />
                          </div>
                        </div>
                      )}

                      <div className="md:w-7/12" style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#f0ede6' }}>{tour.title}</h3>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 19, fontWeight: 800, color: '#d4af37' }}>${tour.price}</div>
                          </div>
                        </div>

                        <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.45)', marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                          {tour.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, fontSize: 11, fontWeight: 700, color: 'rgba(240,237,230,0.6)' }}>
                            <Clock style={{ width: 14, height: 14, color: '#d4af37' }} /> {tour.duration}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, fontSize: 11, fontWeight: 700, color: 'rgba(240,237,230,0.6)' }}>
                            <Plane style={{ width: 14, height: 14, color: '#60a5fa' }} /> Bao gồm vé máy bay
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, fontSize: 11, fontWeight: 700, color: 'rgba(240,237,230,0.6)' }}>
                            <Map style={{ width: 14, height: 14, color: '#34d399' }} /> 4.9 / 5.0
                          </div>
                        </div>

                        <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(240,237,230,0.8)', fontWeight: 700, padding: '14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.color = '#d4af37'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(240,237,230,0.8)'; }}
                        >
                          Xem chi tiết
                        </button>
                      </div>

                      {!isImageLeft && (
                        <div className="md:w-5/12" style={{ position: 'relative', height: 256, overflow: 'hidden' }}>
                          <img src={tour.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600'} alt={tour.title} loading="lazy" decoding="async" className="group-hover:scale-105" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }} />
                          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(14,17,17,0.8)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, color: '#f0ede6' }}>
                            <Star style={{ width: 12, height: 12, color: '#d4af37', fill: '#d4af37' }} />
                            4.8 (95)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Traveler Stories */}
            <div style={{ paddingTop: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: '#f0ede6', marginBottom: 24 }}>Chia sẻ từ du khách</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {tours.length > 0 && tours[0].reviews?.map((review: any) => (
                  <div key={review.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'rgba(240,237,230,0.5)' }}>{review.reviewerInitials}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#f0ede6', fontSize: 13 }}>{review.reviewerName}</div>
                        <div style={{ display: 'flex', color: '#d4af37' }}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} style={{ width: 12, height: 12, fill: 'currentColor' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)', fontStyle: 'italic', lineHeight: 1.6 }}>
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Itinerary + Customize) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Sample Itinerary */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', marginBottom: 24 }}>Lịch trình mẫu</h3>

              <div style={{ position: 'relative', borderLeft: '2px solid rgba(212,175,55,0.3)', marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 16 }}>

                {tours.length > 0 && tours[0].itineraries?.map((item: any, idx: number) => (
                  <div key={item.id} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: -23, top: 4, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: idx === 0 ? '#d4af37' : '#0e1111',
                      border: idx === 0 ? '4px solid #0e1111' : '3px solid rgba(255,255,255,0.15)',
                    }}>
                      {idx === 0 && <div style={{ width: 6, height: 6, background: '#0e1111', borderRadius: '50%' }}></div>}
                    </div>
                    <div style={{ paddingLeft: 24 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 13, color: '#f0ede6', marginBottom: 4 }}>Ngày {item.day}: {item.title}</h4>
                      <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.45)', lineHeight: 1.6, marginBottom: 12 }}>
                        {item.description}
                      </p>
                      {item.tags && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {item.tags.split(',').map((tag: string, i: number) => (
                            <span key={i} style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,230,0.5)', borderRadius: 100 }}>✨ {tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              </div>

              <button style={{ width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#d4af37', marginTop: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
                Xem toàn bộ lịch trình →
              </button>
            </div>

            {/* Customize Group */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', marginBottom: 24 }}>Tuỳ chỉnh đoàn</h3>

              <div className="flex flex-col gap-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f0ede6', fontSize: 13 }}>Người lớn</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.35)' }}>Từ 12 tuổi</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 8 }}>
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', fontWeight: 700, color: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, width: 16, textAlign: 'center', color: '#f0ede6' }}>{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', fontWeight: 700, color: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f0ede6', fontSize: 13 }}>Trẻ em</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.35)' }}>2-11 tuổi</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 8 }}>
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', fontWeight: 700, color: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, width: 16, textAlign: 'center', color: '#f0ede6' }}>{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', fontWeight: 700, color: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#f0ede6', fontSize: 13, marginBottom: 8 }}>Yêu cầu đặc biệt</div>
                  <textarea
                    placeholder="Chế độ ăn, nhu cầu hỗ trợ đặc biệt..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, fontSize: 13, color: '#f0ede6', outline: 'none', resize: 'none', height: 96, borderRadius: 8 }}
                  ></textarea>
                </div>

                <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,237,230,0.5)' }}>Tổng ước tính</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#d4af37' }}>
                    ${estTotal.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
