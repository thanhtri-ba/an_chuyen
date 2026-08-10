import { motion } from'framer-motion';
import { Calendar, User, ArrowRight, BookOpen } from'lucide-react';
import { Link } from'react-router-dom';

const BLOG_POSTS = [
 {
 id: 1,
 title:'Top 5 quán cafe view hồ tuyệt đẹp ở Đà Lạt',
 excerpt:'Khám phá những góc check-in sống ảo cực chill không thể bỏ lỡ khi đến thành phố ngàn hoa...',
 image:'https://images.unsplash.com/photo-1549488344-c7c4e532bbf2?q=80&w=800&auto=format&fit=crop',
 author:'Minh Tùng',
 date:'12 Thg 8, 2026',
 category:'Cẩm nang du lịch'
 },
 {
 id: 2,
 title:'Kinh nghiệm đi xe đêm đường dài không bị say',
 excerpt:'Những mẹo nhỏ nhưng có võ giúp bạn có một chuyến đi xa thật khỏe khoắn và an toàn...',
 image:'https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=800&auto=format&fit=crop',
 author:'Hải Yến',
 date:'08 Thg 8, 2026',
 category:'Kinh nghiệm'
 },
 {
 id: 3,
 title:'Lịch trình khám phá Nha Trang 3 ngày 2 đêm',
 excerpt:'Ăn gì, chơi đâu, ở đâu? Tất tần tật kinh nghiệm du lịch Nha Trang tự túc siêu tiết kiệm...',
 image:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800&auto=format&fit=crop',
 author:'An Chuyến Team',
 date:'01 Thg 8, 2026',
 category:'Lịch trình'
 }
];

export function BlogPage() {
 return (
 <div className="bg-gray-50 min-h-screen pt-24 pb-20">
 <div className="container px-4 lg:px-8 max-w-7xl mx-auto">
 {/* Header Section */}
 <div className="text-center mb-12">
 <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm mb-4">
 <BookOpen className="w-4 h-4" /> Cẩm nang Du lịch
 </motion.div>
 <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
 Khám phá thế giới cùng An Chuyến
 </motion.h1>
 <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
 Những bài viết chia sẻ kinh nghiệm, địa điểm du lịch hấp dẫn và mẹo đi xe cực hữu ích dành riêng cho bạn.
 </motion.p>
 </div>

 {/* Blog Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {BLOG_POSTS.map((post, idx) => (
 <motion.div 
 key={post.id}
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 + 0.3 }}
 className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
 >
 <div className="relative h-56 overflow-hidden">
 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-800 shadow-sm">
 {post.category}
 </div>
 </div>
 <div className="p-6 flex flex-col flex-1">
 <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3">
 <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
 <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
 </div>
 <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
 {post.title}
 </h3>
 <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
 {post.excerpt}
 </p>
 <Link to="#" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all mt-auto w-fit">
 Đọc tiếp <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 );
}
