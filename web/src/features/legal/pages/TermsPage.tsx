const SECTIONS = [
  {
    title: '1. Phạm vi áp dụng',
    body: 'Điều khoản này áp dụng cho mọi giao dịch đặt vé xe khách, tour, khách sạn, thuê xe, và giao hàng thực hiện qua nền tảng An Chuyến. Khi hoàn tất đặt vé, bạn xác nhận đã đọc và đồng ý với các điều khoản dưới đây.',
  },
  {
    title: '2. Đặt vé và thanh toán',
    body: 'Giá vé hiển thị tại thời điểm chọn ghế là giá cuối cùng bạn phải trả, không phát sinh phụ thu ẩn. Đơn đặt vé chỉ được xác nhận sau khi thanh toán thành công; ghế được giữ tạm thời trong lúc bạn hoàn tất thanh toán và có thể được nhả lại nếu quá thời gian giữ chỗ.',
  },
  {
    title: '3. Đổi, huỷ vé và hoàn tiền',
    body: 'Chính sách đổi/huỷ và hoàn tiền cụ thể tuỳ theo từng nhà xe/loại dịch vụ, được hiển thị rõ trước khi bạn thanh toán. An Chuyến hỗ trợ xử lý yêu cầu đổi/huỷ nhưng không chịu trách nhiệm thay cho các trường hợp bất khả kháng (thiên tai, sự cố xe...).',
  },
  {
    title: '4. Trách nhiệm của hành khách',
    body: 'Hành khách chịu trách nhiệm cung cấp thông tin đặt vé chính xác (họ tên, SĐT, giấy tờ tuỳ thân nếu được yêu cầu) và có mặt tại điểm đón đúng giờ khởi hành. An Chuyến không chịu trách nhiệm nếu hành khách trễ giờ do thông tin sai hoặc đến muộn.',
  },
  {
    title: '5. Vai trò của An Chuyến',
    body: 'An Chuyến là nền tảng trung gian kết nối hành khách với các nhà xe/đối tác dịch vụ đã qua kiểm định. Chất lượng vận chuyển thực tế do nhà xe vận hành chịu trách nhiệm chính; An Chuyến hỗ trợ tiếp nhận và xử lý khiếu nại liên quan.',
  },
  {
    title: '6. Giới hạn trách nhiệm',
    body: 'An Chuyến không chịu trách nhiệm với các thiệt hại gián tiếp phát sinh ngoài phạm vi dịch vụ đặt vé (ví dụ: chi phí phát sinh do đổi lịch trình cá nhân), trừ khi pháp luật có quy định khác.',
  },
  {
    title: '7. Thay đổi điều khoản',
    body: 'An Chuyến có thể cập nhật điều khoản dịch vụ theo thời gian để phù hợp với quy định pháp luật hoặc thay đổi trong vận hành. Phiên bản áp dụng là phiên bản đang hiển thị tại thời điểm bạn đặt vé.',
  },
];

export function TermsPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#fcfcfc] pb-20 font-sans text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary mb-3">An Chuyến</div>
          <h1 className="text-3xl md:text-4xl font-bold">Điều khoản dịch vụ</h1>
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
          Cần giải thích thêm về điều khoản? <a href="/contact" className="text-primary font-semibold hover:underline">Liên hệ với chúng tôi</a>.
        </div>
      </div>
    </div>
  );
}
