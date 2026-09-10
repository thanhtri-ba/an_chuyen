const SECTIONS = [
  {
    title: '1. Thông tin chúng tôi thu thập',
    body: 'Khi bạn đặt vé, chúng tôi thu thập họ tên, số điện thoại, email, và số CMND/CCCD (nếu nhà xe yêu cầu) để phát hành vé đúng người, đúng chuyến. Chúng tôi cũng ghi nhận lịch sử đặt vé để hỗ trợ tra cứu và gợi ý điền nhanh cho lần đặt sau.',
  },
  {
    title: '2. Mục đích sử dụng',
    body: 'Thông tin của bạn chỉ được dùng để xử lý đơn đặt vé, xác minh danh tính khi cần, gửi vé điện tử/thông báo liên quan tới chuyến đi, và chăm sóc khách hàng. Chúng tôi không bán hay cho thuê dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích quảng cáo.',
  },
  {
    title: '3. Chia sẻ thông tin',
    body: 'Thông tin hành khách (họ tên, SĐT) được chia sẻ với đúng nhà xe vận hành chuyến bạn đặt, để phục vụ việc soát vé và liên hệ khi cần. Thông tin thanh toán được xử lý trực tiếp qua cổng thanh toán (VNPay/MoMo/ngân hàng) — An Chuyến không lưu trữ số thẻ/tài khoản ngân hàng của bạn.',
  },
  {
    title: '4. Bảo mật dữ liệu',
    body: 'Dữ liệu được mã hoá khi truyền tải (HTTPS) và lưu trữ trên hạ tầng có kiểm soát truy cập. Mật khẩu tài khoản được băm (hash), không lưu dạng văn bản thuần.',
  },
  {
    title: '5. Quyền của bạn',
    body: 'Bạn có quyền yêu cầu xem, chỉnh sửa, hoặc xoá thông tin cá nhân đã cung cấp bằng cách liên hệ đội ngũ hỗ trợ. Một số thông tin liên quan tới giao dịch đã hoàn tất có thể cần lưu giữ theo quy định pháp luật kế toán/thuế.',
  },
  {
    title: '6. Cookie',
    body: 'Chúng tôi dùng cookie cần thiết để website hoạt động ổn định (đăng nhập, giỏ đặt vé), và cookie phân tích (nếu bạn đồng ý) để hiểu cách bạn dùng website nhằm cải thiện trải nghiệm.',
  },
  {
    title: '7. Thay đổi chính sách',
    body: 'Chính sách này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tại trang này.',
  },
];

export function PrivacyPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Chính sách bảo mật</h1>
          <p className="text-gray-500 mt-2 text-sm">Cập nhật lần gần nhất: 2026</p>
        </div>

        <div className="flex flex-col gap-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-black/5 text-sm text-gray-500">
          Có câu hỏi về cách chúng tôi xử lý dữ liệu? <a href="/contact" className="text-primary font-semibold hover:underline">Liên hệ với chúng tôi</a>.
        </div>
      </div>
    </div>
  );
}
