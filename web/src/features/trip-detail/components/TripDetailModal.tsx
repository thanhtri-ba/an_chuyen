import { 
 Modal, 
 ModalContent, 
 ModalHeader, 
 ModalTitle, 
 ModalDescription 
} from"../../../design-system/components/Modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from"../../../design-system/components/Tabs";
import { Button } from"../../../design-system/components/Button";
import { Badge } from"../../../design-system/components/Badge";
import { MapPin, Info, ShieldAlert, Star, Wifi, Droplets, Usb, Image as ImageIcon, ThumbsUp, MessageSquare } from"lucide-react";
import { useNavigate } from"react-router-dom";

interface TripDetailModalProps {
 isOpen: boolean;
 onClose: () => void;
 trip: any;
}

export function TripDetailModal({ isOpen, onClose, trip }: TripDetailModalProps) {
 const navigate = useNavigate();

 if (!trip) return null;

 const handleSelectSeat = () => {
 onClose();
 navigate(`/seat-selection/${trip.id}`);
 };

 const galleryImages = [
"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
"https://images.unsplash.com/photo-1533606622442-50dffdb99e69?q=80&w=800&auto=format&fit=crop"
 ];

 return (
 <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
 <ModalContent className="max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-background">
 
 {/* Header Banner */}
 <div className="bg-slate-900 text-white p-6 pb-12 relative overflow-hidden">
 <div className="absolute inset-0 z-0 opacity-20">
 <img src={galleryImages[0]} alt="Bus Banner" className="w-full h-full object-cover blur-sm scale-110" />
 </div>
 <div className="relative z-10 flex justify-between items-start">
 <ModalHeader className="mb-2">
 <ModalTitle className="text-3xl font-extrabold text-white flex items-center gap-3">
 {trip.company} 
 <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">{trip.type}</Badge>
 </ModalTitle>
 <ModalDescription className="text-white/80 text-base">
 Chuyến đi từ {trip.from} đến {trip.to} • Hành trình {trip.duration}
 </ModalDescription>
 </ModalHeader>
 <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
 <span className="font-bold text-lg">{trip.rating}</span>
 <span className="text-white/70 text-sm">({trip.reviews})</span>
 </div>
 </div>
 
 <div className="absolute -bottom-6 right-6 bg-white text-foreground ] shadow-xl px-8 py-4 flex items-center gap-8 border z-20">
 <div>
 <div className="text-sm text-muted-foreground font-semibold mb-1">Giá vé chỉ từ</div>
 <div className="text-3xl font-extrabold text-primary">{new Intl.NumberFormat('vi-VN').format(trip.price)}đ</div>
 </div>
 <Button size="lg" onClick={handleSelectSeat} className="font-extrabold text-lg px-8 shadow-md h-14">
 Chọn ghế ngay
 </Button>
 </div>
 </div>

 {/* Content Tabs */}
 <div className="flex-1 overflow-y-auto p-6 pt-12">
 <Tabs defaultValue="overview">
 <TabsList className="mb-8 bg-muted/50 p-1 w-full sm:w-auto inline-flex">
 <TabsTrigger value="overview" className=" px-6 py-2.5 font-bold">Tổng quan & Ảnh</TabsTrigger>
 <TabsTrigger value="schedule" className=" px-6 py-2.5 font-bold">Lịch trình</TabsTrigger>
 <TabsTrigger value="policy" className=" px-6 py-2.5 font-bold">Chính sách</TabsTrigger>
 <TabsTrigger value="reviews" className=" px-6 py-2.5 font-bold">Đánh giá khách hàng</TabsTrigger>
 </TabsList>

 <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Media Gallery */}
 <div className="space-y-4">
 <div className=" overflow-hidden h-64 border shadow-sm relative group">
 <img src={galleryImages[0]} alt="Bus Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
 <ImageIcon className="w-4 h-4" /> Xem tất cả ảnh (12)
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className=" overflow-hidden h-24 border shadow-sm">
 <img src={galleryImages[1]} alt="Bus Exterior" className="w-full h-full object-cover hover:scale-110 transition-transform" />
 </div>
 <div className=" overflow-hidden h-24 border shadow-sm relative">
 <img src={galleryImages[2]} alt="Bus Seat" className="w-full h-full object-cover hover:scale-110 transition-transform" />
 <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black/50 transition-colors">
 +9 ảnh nữa
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div>
 <h3 className="font-extrabold text-xl mb-4">Tiện ích nổi bật</h3>
 <div className="grid grid-cols-2 gap-5">
 <div className="flex items-center gap-3 font-medium text-muted-foreground"><div className="p-2 bg-primary/10 rounded-full text-primary"><Wifi className="w-5 h-5" /></div> Wifi tốc độ cao</div>
 <div className="flex items-center gap-3 font-medium text-muted-foreground"><div className="p-2 bg-primary/10 rounded-full text-primary"><Droplets className="w-5 h-5" /></div> Nước suối & Khăn lạnh</div>
 <div className="flex items-center gap-3 font-medium text-muted-foreground"><div className="p-2 bg-primary/10 rounded-full text-primary"><Usb className="w-5 h-5" /></div> Cổng sạc USB</div>
 <div className="flex items-center gap-3 font-medium text-muted-foreground"><div className="p-2 bg-primary/10 rounded-full text-primary"><ShieldAlert className="w-5 h-5" /></div> Búa thoát hiểm</div>
 </div>
 </div>
 
 <div className="p-5 bg-yellow-50 border border-yellow-200">
 <div className="flex justify-between items-start mb-2">
 <div className="flex items-center gap-2 font-extrabold text-yellow-700 text-lg">
 <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /> {trip.rating}/5 Rất tốt
 </div>
 <Button variant="link" onClick={() => document.querySelector<HTMLButtonElement>('[data-state="inactive"][value="reviews"]')?.click()} className="text-yellow-700 font-bold p-0 h-auto">Đọc {trip.reviews} đánh giá</Button>
 </div>
 <p className="text-sm text-yellow-800/80 leading-relaxed font-medium">Khách hàng thường khen ngợi nhà xe về sự đúng giờ, xe sạch sẽ và thái độ phục vụ thân thiện của tài xế và lơ xe.</p>
 </div>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="schedule" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex gap-8 bg-muted/20 p-6 border">
 {/* Timeline Line */}
 <div className="relative w-8 flex flex-col items-center py-2">
 <div className="w-4 h-4 rounded-full bg-primary z-10 ring-4 ring-primary/20"></div>
 <div className="w-1 border-l-2 border-dashed border-primary/30 flex-1 my-2"></div>
 <div className="w-4 h-4 rounded-full bg-border border-4 border-white z-10"></div>
 </div>
 
 {/* Timeline Content */}
 <div className="flex-1 py-1 space-y-12">
 <div className="bg-white p-5 shadow-sm border relative">
 <div className="absolute left-[-28px] top-4 w-4 h-0.5 bg-primary/30"></div>
 <div className="font-extrabold text-2xl text-primary mb-1">{trip.depTime}</div>
 <div className="font-bold text-lg mb-2">{trip.from}</div>
 <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 p-2 w-fit"><MapPin className="w-4 h-4 text-primary" /> Bến xe Miền Đông mới, Quầy vé số 12</div>
 </div>
 
 <div className="bg-white p-5 shadow-sm border relative">
 <div className="absolute left-[-28px] top-4 w-4 h-0.5 bg-border"></div>
 <div className="font-extrabold text-2xl text-muted-foreground mb-1">{trip.arrTime}</div>
 <div className="font-bold text-lg mb-2">{trip.to}</div>
 <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 p-2 w-fit"><MapPin className="w-4 h-4" /> Bến xe liên tỉnh Đà Lạt</div>
 </div>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="policy" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-white border p-6 shadow-sm">
 <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-red-600"><Info className="w-5 h-5" /> Chính sách hoàn hủy</h3>
 <ul className="space-y-3 text-sm text-muted-foreground">
 <li className="flex justify-between border-b pb-2"><span>Hủy trước 24h</span> <strong className="text-foreground">Hoàn 100%</strong></li>
 <li className="flex justify-between border-b pb-2"><span>Hủy từ 12h - 24h</span> <strong className="text-foreground">Hoàn 50%</strong></li>
 <li className="flex justify-between pb-2"><span>Hủy trước 12h</span> <strong className="text-foreground">Không hoàn tiền</strong></li>
 </ul>
 <p className="text-xs text-muted-foreground mt-4 italic">* Vé ngày Lễ, Tết không áp dụng chính sách hoàn hủy.</p>
 </div>
 
 <div className="bg-white border p-6 shadow-sm">
 <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-700"><Info className="w-5 h-5" /> Quy định hành lý</h3>
 <ul className="space-y-4 text-sm text-muted-foreground">
 <li className="flex items-start gap-3">
 <div className="w-2 h-2 bg-slate-500 rounded-full mt-1.5"></div>
 <span>Mỗi hành khách được mang tối đa <strong>20kg hành lý ký gửi</strong> và 1 balo nhỏ xách tay để trên xe.</span>
 </li>
 <li className="flex items-start gap-3">
 <div className="w-2 h-2 bg-slate-500 rounded-full mt-1.5"></div>
 <span>Không mang theo động vật sống, hàng hóa có mùi (sầu riêng, nước mắm).</span>
 </li>
 </ul>
 </div>
 </div>
 </TabsContent>

 <TabsContent value="reviews" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {/* Comprehensive Review System UI */}
 <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-muted/20 border">
 <div className="flex flex-col items-center justify-center min-w-[150px]">
 <div className="text-6xl font-extrabold text-primary mb-2">{trip.rating}</div>
 <div className="flex gap-1 mb-2">
 {[1,2,3,4,5].map((i) => (
 <Star key={i} className={`w-5 h-5 ${i <= Math.floor(trip.rating) ?'fill-yellow-400 text-yellow-400' :'fill-muted text-muted'}`} />
 ))}
 </div>
 <div className="text-sm font-bold text-muted-foreground">{new Intl.NumberFormat('vi-VN').format(trip.reviews)} đánh giá</div>
 </div>
 
 <div className="flex-1 w-full space-y-2 border-l pl-8">
 {[5,4,3,2,1].map((rating) => {
 const percent = rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : 2;
 return (
 <div key={rating} className="flex items-center gap-3 text-sm font-medium">
 <div className="w-3 text-muted-foreground">{rating}</div>
 <Star className="w-3 h-3 fill-muted-foreground text-muted-foreground" />
 <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
 <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
 </div>
 <div className="w-8 text-right text-muted-foreground text-xs">{percent}%</div>
 </div>
 );
 })}
 </div>
 </div>
 
 <div className="space-y-4">
 <h4 className="font-extrabold text-lg">Đánh giá mới nhất</h4>
 {[
 { name:"Nguyễn Văn A", date:"Hôm qua", content:"Xe rất mới, giường nằm rộng rãi thoải mái. Tài xế lái an toàn không lạng lách. Wifi chạy tốt để xem Youtube.", likes: 12 },
 { name:"Trần Thị B", date:"3 ngày trước", content:"Chất lượng dịch vụ tuyệt vời. Lơ xe rất lịch sự, phát nước và khăn lạnh đầy đủ. Đón khách đúng giờ.", likes: 8 }
 ].map((review, i) => (
 <div key={i} className="p-5 border bg-white shadow-sm">
 <div className="flex justify-between items-start mb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{review.name.charAt(0)}</div>
 <div>
 <div className="font-bold text-sm">{review.name}</div>
 <div className="text-xs text-muted-foreground">{review.date}</div>
 </div>
 </div>
 <div className="flex gap-1 bg-yellow-50 px-2 py-1">
 {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
 </div>
 </div>
 <p className="text-sm text-foreground/90 mb-4">{review.content}</p>
 <div className="flex items-center gap-4 text-muted-foreground">
 <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-primary transition-colors"><ThumbsUp className="w-4 h-4" /> Hữu ích ({review.likes})</button>
 <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-primary transition-colors"><MessageSquare className="w-4 h-4" /> Bình luận</button>
 </div>
 </div>
 ))}
 <Button variant="outline" className="w-full font-bold">Xem thêm tất cả đánh giá</Button>
 </div>
 </TabsContent>
 </Tabs>
 </div>

 </ModalContent>
 </Modal>
 );
}
