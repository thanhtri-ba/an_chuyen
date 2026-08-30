import { useEffect, useState } from 'react';
import { Loader2, Search, Calendar, Users, Star, Clock, Plane, Map, Heart } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string;
  itineraries: any[];
  reviews: any[];
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
        const DUMMY_TOURS = [
          {
            id: '1',
            title: 'Khám phá Vịnh Hạ Long 3N2Đ',
            description: 'Trải nghiệm du thuyền 5 sao, chèo kayak và ngắm hoàng hôn trên vịnh Hạ Long.',
            duration: '3 Ngày',
            price: 150,
            imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200',
            itineraries: [
              { id: '1', day: 1, title: 'Hà Nội - Hạ Long', description: 'Xe đón tại Hà Nội đi Hạ Long, nhận phòng du thuyền.', tags: 'Du thuyền, Bữa tối' },
              { id: '2', day: 2, title: 'Hang Sửng Sốt - Đảo Ti Tốp', description: 'Thăm quan hang động đẹp nhất và tắm biển.', tags: 'Khám phá, Bơi lội' },
            ],
            reviews: [
              { id: '1', reviewerName: 'Minh Tuấn', reviewerInitials: 'MT', rating: 5, comment: 'Dịch vụ rất tốt, phong cảnh tuyệt đẹp!' }
            ]
          },
          {
            id: '2',
            title: 'Săn mây Đà Lạt 2N1Đ',
            description: 'Hành trình săn mây sớm tại Cầu Đất và thưởng thức cà phê ngắm cảnh.',
            duration: '2 Ngày',
            price: 99,
            imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200',
            itineraries: [
              { id: '1', day: 1, title: 'Sài Gòn - Đà Lạt', description: 'Đến Đà Lạt, dạo phố và ăn tối.', tags: 'Ẩm thực' }
            ],
            reviews: [
              { id: '1', reviewerName: 'Hải Yến', reviewerInitials: 'HY', rating: 5, comment: 'Chuyến đi ý nghĩa và cảnh rất mộng mơ.' }
            ]
          }
        ];
        setTours(response.data && response.data.length > 0 ? response.data : DUMMY_TOURS);
      } catch (error) {
        console.error('Failed to fetch tours', error);
        // toast.error('Failed to load tours. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const basePrice = tours.length > 0 ? tours[0].price : 999;
  const estTotal = (basePrice * adults) + (basePrice * 0.5 * children);

  const categories = [
    { id: 'beach', icon: Plane, label: 'Beach Holidays', active: true },
    { id: 'mountain', icon: Map, label: 'Mountains' },
    { id: 'cultural', icon: Heart, label: 'Cultural' },
    { id: 'adventure', icon: Star, label: 'Adventure' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-24">
      
      {/* ===== HERO HEADER ===== */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center px-6 lg:px-12 pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-[1400px] text-white">
          <div className="text-sm font-semibold tracking-wide text-[#d4af37] mb-2">Curated Experiences</div>
          <h1 className="text-5xl md:text-6xl font-display font-medium leading-[1.1] mb-4">
            Find your next <span className="text-[#d4af37] font-serif italic">adventure.</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed font-medium">
            Handpicked travel packages taking you to the most incredible destinations.
          </p>
        </div>
      </section>

      {/* ===== SEARCH PILL ===== */}
      <section className="relative z-20 px-6 lg:px-12 -mt-10 flex justify-center max-w-[1400px] mx-auto mb-16">
        <div className="bg-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 flex flex-col md:flex-row items-center w-full max-w-4xl border border-gray-100">
          
          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer transition-colors hover:bg-gray-50/50 rounded-l-full">
            <Search className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer">Where to?</label>
              <input type="text" placeholder="Search destinations" className="text-sm border-none outline-none text-[#1a1a1a] font-medium placeholder:text-gray-400 w-full bg-transparent" />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer transition-colors hover:bg-gray-50/50">
            <Calendar className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer">Date</label>
              <input type="date" className="text-sm border-none outline-none text-[#1a1a1a] font-medium w-full bg-transparent cursor-pointer text-gray-400" />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full group cursor-pointer transition-colors hover:bg-gray-50/50">
            <Users className="text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
            <div className="flex flex-col w-full">
              <label className="text-[11px] font-bold text-[#1a1a1a] mb-0.5 cursor-pointer">Travelers</label>
              <div className="text-sm font-medium text-gray-500">{adults} Adults, {children} Kids</div>
            </div>
          </div>

          <button className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 m-2 md:m-0 shrink-0 w-full md:w-auto justify-center transition-colors">
            Search
          </button>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Categories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Popular:</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                cat.active 
                  ? 'bg-primary text-white border-primary shadow-sm' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#1a1a1a]'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column (Featured Experiences + Stories) */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            <div>
              <h2 className="text-3xl font-display font-medium text-[#1a1a1a] mb-8">Featured Experiences</h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {tours.map((tour, index) => {
                    const isImageLeft = index % 2 === 0;

                    return (
                      <motion.div whileHover={{ y: -4 }} key={tour.id} className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        
                        {isImageLeft && (
                          <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
                            <img src={tour.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80'} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3 h-3 text-secondary fill-secondary" /> 4.9 (128)
                            </div>
                            <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm text-gray-400 hover:text-red-500">
                              <Heart className="w-4 h-4" />
                            </div>
                          </div>
                        )}

                        <div className="md:w-7/12 p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight">{tour.title}</h3>
                            <div className="text-xl font-bold text-primary">${tour.price}</div>
                          </div>

                          <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                            {tour.description}
                          </p>

                          <div className="flex flex-wrap gap-3 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-primary" /> {tour.duration}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                              <Plane className="w-3.5 h-3.5 text-blue-500" /> Flights included
                            </div>
                          </div>

                          <button className="w-full bg-white border border-gray-200 text-[#1a1a1a] hover:border-primary hover:text-primary font-bold py-3 rounded-xl transition-colors shadow-sm">
                            View Details
                          </button>
                        </div>

                        {!isImageLeft && (
                          <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
                            <img src={tour.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80'} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3 h-3 text-secondary fill-secondary" /> 4.8 (95)
                            </div>
                          </div>
                        )}

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Traveler Stories */}
            <div>
              <h2 className="text-3xl font-display font-medium text-[#1a1a1a] mb-8">Traveler Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tours.length > 0 && tours[0].reviews?.map((review: any) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                        {review.reviewerInitials}
                      </div>
                      <div>
                        <div className="font-bold text-[#1a1a1a] text-sm">{review.reviewerName}</div>
                        <div className="flex text-secondary mt-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Itinerary + Customize) */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Customize Group */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-28">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">Customize Group</h3>

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a] text-sm">Adults</div>
                    <div className="text-xs text-gray-400">Age 12+</div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center text-[#1a1a1a]">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1a1a1a] text-sm">Children</div>
                    <div className="text-xs text-gray-400">Age 2-11</div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center text-[#1a1a1a]">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 bg-white font-bold text-[#1a1a1a] flex items-center justify-center rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#1a1a1a] text-sm mb-2">Special Requests</div>
                  <textarea
                    placeholder="Dietary requirements, accessibility..."
                    className="w-full bg-gray-50 border border-gray-200 p-4 text-sm text-[#1a1a1a] outline-none resize-none h-24 rounded-xl focus:border-primary transition-colors placeholder:text-gray-400"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-end justify-between">
                  <div className="text-sm font-bold text-gray-400">Estimated Total</div>
                  <div className="text-3xl font-bold text-[#1a1a1a]">
                    ${estTotal.toLocaleString('en-US')}
                  </div>
                </div>
                
                <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-2">
                  Proceed to Booking
                </button>
              </div>
            </div>

            {/* Sample Itinerary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-8">Sample Itinerary</h3>

              <div className="relative border-l-2 border-gray-100 ml-3 flex flex-col gap-8 pb-4">
                {tours.length > 0 && tours[0].itineraries?.map((item: any, idx: number) => (
                  <div key={item.id} className="relative">
                    <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-primary border-4 border-white shadow-sm' : 'bg-white border-2 border-gray-200'}`}>
                    </div>
                    <div className="pl-6">
                      <h4 className="font-bold text-sm text-[#1a1a1a] mb-2">Day {item.day}: {item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        {item.description}
                      </p>
                      {item.tags && (
                        <div className="flex gap-2 flex-wrap">
                          {item.tags.split(',').map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-sm font-bold text-primary mt-6 hover:text-primary-hover transition-colors">
                View Full Itinerary →
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
