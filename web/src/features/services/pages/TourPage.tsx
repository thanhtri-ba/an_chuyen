import { useEffect, useState } from'react';
import { useTranslation } from'react-i18next';
import { Loader2, Search, Calendar, Users, Star, Clock, Plane, Map, Heart } from'lucide-react';
import axios from'axios';

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
 const { t } = useTranslation();
 const [tours, setTours] = useState<Tour[]>([]);
 const [loading, setLoading] = useState(true);

 // Customize Group state
 const [adults, setAdults] = useState(2);
 const [children, setChildren] = useState(0);

 useEffect(() => {
 const fetchTours = async () => {
 try {
 const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/tours`);
 setTours(response.data);
 } catch (error) {
 console.error('Failed to fetch tours', error);
 } finally {
 setLoading(false);
 }
 };
 fetchTours();
 }, []);

 // Use the first tour's price to calculate estimate if available, otherwise default to 999
 const basePrice = tours.length > 0 ? tours[0].price : 999;
 const estTotal = (basePrice * adults) + (basePrice * 0.5 * children);

 return (
 <div className="pt-24 min-h-screen bg-gradient-to-b from-[#FFEBD9] to-[#FFF5ED] font-sans pb-20">
 <div className="container max-w-6xl mx-auto px-4">
 
 {/* Header Section */}
 <div className="mb-12">
 <h1 className="text-4xl md:text-5xl font-extrabold text-[#3D3A38] tracking-tight mb-4">
 Find your next <span className="text-[#FF7F50]">escape.</span>
 </h1>
 <p className="text-slate-500 text-lg max-w-xl mb-8">
 Curated vacation packages and guided tours to exotic destinations, meticulously planned for your perfect getaway.
 </p>
 
 {/* Search Bar */}
 <div className="bg-white rounded-full p-2 shadow-lg shadow-orange-900/5 flex flex-col md:flex-row items-center gap-2 mb-6">
 <div className="flex-1 flex items-center px-4 py-2 border-r border-slate-100">
 <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
 <input type="text" placeholder="Where do you want to go?" className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder-slate-400" />
 </div>
 <div className="flex-1 flex items-center px-4 py-2 border-r border-slate-100">
 <Calendar className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
 <input type="text" placeholder="Select Dates" className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder-slate-400" />
 </div>
 <div className="flex-1 flex items-center px-4 py-2">
 <Users className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
 <span className="text-slate-700 font-medium flex-1">2 Adults, 0 Children</span>
 </div>
 <button className="bg-[#FF7F50] hover:bg-[#F26A3B] transition-colors text-white font-bold px-8 py-4 rounded-full w-full md:w-auto shadow-md shadow-orange-500/20">
 Search Tours
 </button>
 </div>

 {/* Categories */}
 <div className="flex items-center gap-4 overflow-x-auto pb-2">
 <span className="text-slate-500 text-sm font-medium whitespace-nowrap">Popular:</span>
 {[
 { id:'beach', icon: Plane, label:'Beach', active: true },
 { id:'mountain', icon: Map, label:'Mountain' },
 { id:'cultural', icon: Heart, label:'Cultural' },
 { id:'adventure', icon: Star, label:'Adventure' },
 ].map(cat => (
 <button 
 key={cat.id} 
 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
 cat.active 
 ?'bg-purple-100 text-[#7C3AED]' 
 :'bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
 }`}
 >
 <cat.icon className="w-4 h-4" />
 {cat.label}
 </button>
 ))}
 </div>
 </div>

 {/* Main Content Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* Left Column (Featured Experiences + Stories) */}
 <div className="lg:col-span-8 space-y-8">
 <h2 className="text-2xl font-extrabold text-[#3D3A38]">Featured Experiences</h2>
 
 {loading ? (
 <div className="flex justify-center py-20 bg-white/50">
 <Loader2 className="w-8 h-8 animate-spin text-[#FF7F50]" />
 </div>
 ) : (
 <div className="space-y-6">
 {tours.map((tour, index) => {
 const isImageLeft = index % 2 === 0;

 return (
 <div key={tour.id} className="bg-white overflow-hidden shadow-xl shadow-orange-900/5 flex flex-col md:flex-row group">
 
 {isImageLeft && (
 <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
 <img src={tour.imageUrl ||'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600'} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
 <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
 4.9 (128)
 </div>
 <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors">
 <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
 </div>
 </div>
 )}

 <div className="p-8 md:w-7/12 flex flex-col justify-center">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-xl font-bold text-[#3D3A38]">{tour.title}</h3>
 <div className="text-right">
 <div className="text-xl font-extrabold text-[#FF7F50]">${tour.price}</div>
 </div>
 </div>
 
 <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">
 {tour.description}
 </p>
 
 <div className="flex flex-wrap gap-2 mb-6">
 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-600">
 <Clock className="w-3.5 h-3.5 text-orange-400" /> {tour.duration}
 </div>
 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-600">
 <Plane className="w-3.5 h-3.5 text-blue-400" /> Flight inc.
 </div>
 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-600">
 <Map className="w-3.5 h-3.5 text-emerald-400" /> 4.9 / 5.0
 </div>
 </div>

 <button className="w-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold py-3.5 transition-colors">
 View Details
 </button>
 </div>

 {!isImageLeft && (
 <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden">
 <img src={tour.imageUrl ||'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600'} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
 <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
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
 <div className="pt-4">
 <h2 className="text-2xl font-extrabold text-[#3D3A38] mb-6">Traveler Stories</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {tours.length > 0 && tours[0].reviews?.map((review: any) => (
 <div key={review.id} className="bg-white p-6 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{review.reviewerInitials}</div>
 <div>
 <div className="font-bold text-[#3D3A38] text-sm">{review.reviewerName}</div>
 <div className="flex text-orange-400">
 {[...Array(review.rating)].map((_, i) => (
 <Star key={i} className="w-3 h-3 fill-current" />
 ))}
 </div>
 </div>
 </div>
 <p className="text-sm text-slate-500 italic leading-relaxed">
"{review.comment}"
 </p>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* Right Column (Itinerary + Customize) */}
 <div className="lg:col-span-4 space-y-6">
 
 {/* Sample Itinerary */}
 <div className="bg-white p-8 shadow-xl shadow-orange-900/5">
 <h3 className="text-xl font-extrabold text-[#3D3A38] mb-6">Sample Itinerary</h3>
 
 <div className="relative border-l-2 border-[#FF7F50]/30 ml-3 space-y-8 pb-4">
 
 {tours.length > 0 && tours[0].itineraries?.map((item: any, idx: number) => (
 <div key={item.id} className="relative">
 <div className={`absolute -left-[23px] top-1 w-5 h-5 ${idx === 0 ?'bg-[#FF7F50] border-4 border-white shadow-sm' :'bg-white border-[3px] border-slate-300'} rounded-full flex items-center justify-center`}>
 {idx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
 </div>
 <div className="pl-6">
 <h4 className="font-bold text-sm text-[#3D3A38] mb-1">Day {item.day}: {item.title}</h4>
 <p className="text-xs text-slate-500 leading-relaxed mb-3">
 {item.description}
 </p>
 {item.tags && (
 <div className="flex gap-2">
 {item.tags.split(',').map((tag: string, i: number) => (
 <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500">✨ {tag.trim()}</span>
 ))}
 </div>
 )}
 </div>
 </div>
 ))}

 </div>

 <button className="w-full text-center text-sm font-bold text-[#FF7F50] mt-4 hover:text-[#F26A3B]">
 View Full Itinerary →
 </button>
 </div>

 {/* Customize Group */}
 <div className="bg-white p-8 shadow-xl shadow-orange-900/5">
 <h3 className="text-xl font-extrabold text-[#3D3A38] mb-6">Customize Group</h3>
 
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <div className="font-bold text-[#3D3A38] text-sm">Adults</div>
 <div className="text-xs text-slate-400">Age 12+</div>
 </div>
 <div className="flex items-center gap-4 bg-slate-50 p-1.5">
 <button 
 onClick={() => setAdults(Math.max(1, adults - 1))}
 className="w-8 h-8 bg-white shadow-sm font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100"
 >
 -
 </button>
 <span className="font-bold w-4 text-center">{adults}</span>
 <button 
 onClick={() => setAdults(adults + 1)}
 className="w-8 h-8 bg-white shadow-sm font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100"
 >
 +
 </button>
 </div>
 </div>

 <div className="flex items-center justify-between">
 <div>
 <div className="font-bold text-[#3D3A38] text-sm">Children</div>
 <div className="text-xs text-slate-400">Age 2-11</div>
 </div>
 <div className="flex items-center gap-4 bg-slate-50 p-1.5">
 <button 
 onClick={() => setChildren(Math.max(0, children - 1))}
 className="w-8 h-8 bg-white shadow-sm font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100"
 >
 -
 </button>
 <span className="font-bold w-4 text-center">{children}</span>
 <button 
 onClick={() => setChildren(children + 1)}
 className="w-8 h-8 bg-white shadow-sm font-bold text-slate-600 flex items-center justify-center hover:bg-slate-100"
 >
 +
 </button>
 </div>
 </div>

 <div>
 <div className="font-bold text-[#3D3A38] text-sm mb-2">Special Requests</div>
 <textarea 
 placeholder="Dietary requirements, accessibility needs..."
 className="w-full bg-slate-50 p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 resize-none h-24 placeholder-slate-400"
 ></textarea>
 </div>

 <div className="pt-6 border-t border-slate-100 flex items-end justify-between">
 <div className="text-sm font-bold text-slate-500">Est. Total</div>
 <div className="text-2xl font-extrabold text-[#FF7F50]">
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
