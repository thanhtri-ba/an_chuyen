import { Link } from'react-router-dom';
import { User, Ticket, Bell, LogOut, Gift, Copy } from'lucide-react';

export function OffersPage() {
 return (
 <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-8">
 <div className="container flex flex-col lg:flex-row gap-8">
 
 {/* Sidebar Nav */}
 <div className="w-full lg:w-64 shrink-0 space-y-2">
 <nav className="bg-card border p-2 space-y-1">
 <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 transition-colors font-medium">
 <User className="w-5 h-5" /> Thông tin tài khoản
 </Link>
 <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 transition-colors font-medium">
 <Ticket className="w-5 h-5" /> Chuyến đi của tôi
 </Link>
 <Link to="/offers" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium">
 <Gift className="w-5 h-5" /> Ưu đãi
 </Link>
 <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 transition-colors font-medium">
 <Bell className="w-5 h-5" /> Thông báo
 </Link>
 <button className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors font-medium">
 <LogOut className="w-5 h-5" /> Đăng xuất
 </button>
 </nav>
 </div>

 {/* Main Content */}
 <div className="flex-1 space-y-6">
 <div className="bg-primary text-primary-foreground p-8 flex flex-col md:flex-row justify-between items-center shadow-lg">
 <div>
 <p className="text-primary-foreground/80 font-medium mb-1">SỐ DƯ ĐIỂM THƯỞNG</p>
 <h2 className="text-4xl font-extrabold mb-2">2.450 <span className="text-xl font-normal">điểm</span></h2>
 <p className="text-sm">Tương đương 245.000đ</p>
 </div>
 <div className="mt-6 md:mt-0 text-center md:text-right">
 <div className="w-16 h-16 bg-white/20 rounded-full mx-auto md:ml-auto md:mr-0 flex items-center justify-center mb-2">
 <span className="font-bold text-xl text-white">BẠC</span>
 </div>
 <p className="text-sm font-medium">Hạng thành viên Bạc</p>
 </div>
 </div>

 <div className="bg-card border p-6 lg:p-8">
 <h2 className="text-2xl font-bold mb-6">Mã giảm giá của bạn</h2>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 { title:'Giảm 15% cho chuyến đi đầu tiên', code:'ANCHUYEN15', expiry:'Hết hạn: 31/12/2026', color:'bg-emerald-50 text-emerald-600' },
 { title:'Giảm 50K cho tuyến Đà Lạt', code:'DALAT50K', expiry:'Hết hạn: 15/11/2026', color:'bg-slate-100 text-slate-700' },
 { title:'Mua 1 tặng 1 suất ăn nhẹ', code:'SNACKFREE', expiry:'Hết hạn: 30/11/2026', color:'bg-amber-50 text-amber-600' },
 ].map((offer, idx) => (
 <div key={idx} className="border p-5 flex items-start gap-4">
 <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${offer.color}`}>
 <Gift className="w-6 h-6" />
 </div>
 <div className="flex-1">
 <h3 className="font-bold mb-1">{offer.title}</h3>
 <p className="text-xs text-muted-foreground mb-3">{offer.expiry}</p>
 <div className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1.5 border border-dashed">
 <span className="font-mono font-bold text-sm text-primary">{offer.code}</span>
 <button className="text-muted-foreground hover:text-foreground">
 <Copy className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}
