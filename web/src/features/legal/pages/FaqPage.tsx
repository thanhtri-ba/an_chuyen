import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Làm sao để đặt vé xe khách trên An Chuyến?', a: 'Vào trang "Tìm chuyến", nhập điểm đi/điểm đến/ngày khởi hành, chọn chuyến còn ghế, chọn chỗ ngồi trên sơ đồ ghế thật của xe, rồi thanh toán. Vé điện tử sẽ nằm sẵn trong mục "Vé của tôi".' },
  { q: 'Tôi có thể đổi hoặc huỷ vé đã đặt không?', a: 'Có. Vào "Vé của tôi", chọn đơn cần đổi/huỷ. Vé đã thanh toán mà bạn huỷ trước giờ khởi hành sẽ được xử lý hoàn tiền theo chính sách hoàn vé.' },
  { q: 'An Chuyến hỗ trợ những phương thức thanh toán nào?', a: 'Hỗ trợ VNPay, MoMo, chuyển khoản ngân hàng (quét mã QR), và thanh toán khi lên xe (COD) tuỳ theo nhà xe.' },
  { q: 'Vé điện tử có cần in ra không?', a: 'Không cần. Vé nằm sẵn trong mục "Vé của tôi", phụ xe quét mã QR trên điện thoại của bạn khi lên xe.' },
  { q: 'Làm sao để biết xe đang ở đâu?', a: 'Với các chuyến có bật theo dõi vị trí, bạn có thể xem vị trí xe theo thời gian thực ngay trong trang chi tiết vé.' },
  { q: 'Tôi quên lấy hoá đơn/mã đơn hàng thì tra cứu lại bằng cách nào?', a: 'Dùng email đã đặt vé kèm mã đơn hàng để tra cứu lại trong mục đăng nhập bằng email — không cần nhớ mật khẩu.' },
];

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Hỏi đáp</h1>
          <p className="text-gray-500 mt-2">Những câu hỏi khách hàng gửi về nhiều nhất.</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-semibold text-[15px]">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          Không tìm thấy câu trả lời? <a href="/contact" className="text-primary font-semibold hover:underline">Liên hệ đội ngũ hỗ trợ</a>
        </div>
      </div>
    </div>
  );
}
