import { Link } from'react-router-dom';
import { User, Ticket, Bell, LogOut, Gift } from'lucide-react';

export function NotificationsPage() {
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
 <Link to="/offers" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 transition-colors font-medium">
 <Gift className="w-5 h-5" /> Ưu đãi
 </Link>
 <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium">
 <Bell className="w-5 h-5" /> Thông báo
 </Link>
 <button className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors font-medium">
 <LogOut className="w-5 h-5" /> Đăng xuất
 </button>
 </nav>
 </div>

 {/* Main Content */}
 <div className="flex-1 bg-card border p-6 lg:p-8">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold">Thông báo</h2>
 <button className="text-primary text-sm font-medium hover:underline">Đánh dấu đã đọc tất cả</button>
 </div>
 
 <div className="space-y-4">
 {[
 { title:'Chuyến đi sắp khởi hành', desc:'Chuyến xe Sài Gòn - Đà Lạt của bạn sẽ khởi hành lúc 08:30 ngày 20/11. Vui lòng có mặt tại bến trước 30 phút.', time:'2 giờ trước', unread: true },
 { title:'Khuyến mãi đặc biệt dành cho bạn', desc:'Nhập mã ANCHUYEN15 để được giảm 15% cho chuyến đi tiếp theo.', time:'1 ngày trước', unread: false },
 { title:'Thanh toán thành công', desc:'Giao dịch 350.000đ cho mã vé BZ-982314 đã được xác nhận thành công.', time:'2 ngày trước', unread: false },
 ].map((notif, idx) => (
 <div key={idx} className={`p-4 border flex gap-4 transition-colors ${notif.unread ?'bg-primary/5 border-primary/20' :'bg-card'}`}>
 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.unread ?'bg-primary/20 text-primary' :'bg-muted text-muted-foreground'}`}>
 <Bell className="w-5 h-5" />
 </div>
 <div className="flex-1">
 <h3 className={`mb-1 ${notif.unread ?'font-bold' :'font-semibold text-muted-foreground'}`}>{notif.title}</h3>
 <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{notif.desc}</p>
 <p className="text-xs text-muted-foreground/70 font-medium">{notif.time}</p>
 </div>
 {notif.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>}
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>
 );
}
