import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 1,
    title: 'Kinh nghiệm du lịch',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Ẩm thực địa phương',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Mẹo đặt vé',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Điểm đến hot',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
  }
];

export function BlogPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20 relative">
      {/* Dot Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="container px-4 lg:px-8 max-w-6xl mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mt-12 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-bold text-[#0f2c59] tracking-tight mb-6"
          >
            Bạn muốn đi đâu hôm nay?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }} 
            className="text-gray-500 font-medium text-base md:text-lg max-w-2xl mx-auto mb-10"
          >
            Khám phá những điểm đến tuyệt vời, kinh nghiệm du lịch quý báu và mẹo đặt vé rẻ nhất cùng An Chuyến.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden pl-4 pr-1.5 py-1.5">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Tìm kiếm điểm đến, bài viết..." 
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-gray-700 placeholder-gray-400 font-medium"
              />
              <button className="bg-[#0f2c59] hover:bg-[#1a4b96] text-white font-bold py-3 px-8 rounded-full transition-colors flex-shrink-0">
                Tìm
              </button>
            </div>
          </motion.div>
        </div>

        {/* Featured Categories */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#0f2c59] mb-8">Danh mục nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((category, idx) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
              >
                <Link to="#" className="group relative block w-full aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  {/* Dark Gradient Overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c59]/90 via-black/20 to-transparent"></div>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-white font-bold text-xl leading-tight">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
