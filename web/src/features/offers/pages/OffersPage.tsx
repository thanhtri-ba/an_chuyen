import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Tag, Clock, Share2, Info, Gift, Ticket } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

interface Promotion {
  id: string;
  code: string;
  title: string;
  subtitle: string | null;
  discountPct: number;
  maxDiscount: number | null;
  validUntil: string;
}

const FILTERS = ['Tất cả', 'Vé mới', 'Khách hàng thân thiết', 'Đối tác thanh toán'];

export function OffersPage() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await api.get('/promotions');
        setPromotions(res.data ?? []);
      } catch {
        toast.error('Không tải được danh sách ưu đãi. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleApply = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã lưu mã ${code}. Bạn có thể sử dụng ở bước thanh toán!`);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="container px-4 lg:px-8 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-bold text-[#0f2c59] mb-3"
          >
            Ưu đãi hấp dẫn dành cho bạn
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }} 
            className="text-gray-500 font-medium"
          >
            Khám phá các mã giảm giá và chương trình khuyến mãi mới nhất để chuyến đi của bạn thêm phần tiết kiệm.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#0f2c59] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Promotions Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            
            {/* Promo Card 1 - Demo from Mockup */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f78?q=80&w=800&auto=format&fit=crop" alt="Promo" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">MỚI</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Giảm 50k</h3>
                  <Tag className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-1">Áp dụng cho chuyến đi từ Hà Nội đến Sapa. Số lượng có hạn.</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" /> HSD: 30/11/2026
                  </div>
                  <button onClick={() => handleApply('SAPA50K')} className="bg-[#0f2c59] hover:bg-[#1a4b96] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                    Sử dụng ngay
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Promo Card 2 - Demo from Mockup */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop" alt="Promo" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Hoàn tiền 10%</h3>
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded flex items-center justify-center font-bold text-xs">V</div>
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-1">Khi thanh toán qua ví điện tử VNPay cho mọi tuyến đường.</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" /> HSD: 15/12/2026
                  </div>
                  <button onClick={() => handleApply('VNPAY10')} className="bg-[#0f2c59] hover:bg-[#1a4b96] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                    Sử dụng ngay
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Promo Card 3 - Demo from Mockup (Blue background) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <div className="relative h-40 bg-blue-50/50 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#0f2c59] rounded-xl flex items-center justify-center shadow-lg rotate-12">
                  <Tag className="w-8 h-8 text-white -rotate-12" />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Giảm 20% cho thành viên</h3>
                  <div className="w-5 h-5 bg-[#0f2c59] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-1">Đặc quyền dành riêng cho hạng vé Vàng trở lên trong tháng này.</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" /> HSD: 31/12/2026
                  </div>
                  <button onClick={() => handleApply('VIP20')} className="bg-[#0f2c59] hover:bg-[#1a4b96] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                    Sử dụng ngay
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Map actual promotions from DB */}
            {promotions.map((promo, idx) => (
              <motion.div key={promo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (idx * 0.1) }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
                <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-2xl font-black text-indigo-600">{promo.discountPct}%</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{promo.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1">{promo.subtitle || 'Áp dụng cho mọi chuyến đi khi đặt qua ứng dụng An Chuyến.'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5" /> HSD: {new Date(promo.validUntil).toLocaleDateString('vi-VN')}
                    </div>
                    <button onClick={() => handleApply(promo.code)} className="bg-[#0f2c59] hover:bg-[#1a4b96] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                      Sử dụng ngay
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Referral Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="bg-[#eef2ff] rounded-3xl p-8 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl"></div>
          
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2c59] mb-4">
              Giới thiệu bạn bè, nhận vé miễn phí!
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Mời bạn bè tải app An Chuyến. Khi họ hoàn thành chuyến đi đầu tiên, cả hai sẽ nhận ngay một mã giảm giá 100k cho chuyến đi tiếp theo.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <Share2 className="w-5 h-5" /> Chia sẻ mã giới thiệu
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-colors">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
            {/* Placeholder for the illustration in the screenshot */}
            <div className="w-64 h-48 bg-white/50 backdrop-blur rounded-2xl border border-white flex items-center justify-center shadow-lg relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 bg-white rounded-xl shadow-md rotate-[-5deg] flex items-center justify-center border border-gray-100">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-blue-500" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 bg-white rounded-xl shadow-md rotate-[10deg] flex items-center justify-center border border-gray-100">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <Ticket className="w-10 h-10 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
