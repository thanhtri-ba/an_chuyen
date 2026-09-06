// Mail 2/2 — gửi khi thanh toán được xác nhận (admin duyệt thủ công, hoặc
// gateway/webhook tự động xác nhận qua confirm.util.ts) — kèm vé điện tử
// thật. Tách riêng khỏi orderConfirmation.ts vì đây là lúc booking mới thật
// sự CONFIRMED, đúng lúc vé mới có giá trị sử dụng.
export interface ETicketData {
  bookingId: string;
  routeLabel: string;
  departureTime: Date;
  busAgentName: string;
  passengerNames: string[];
  seatNumbers: string[];
  totalAmount: number;
}

// Dịch vụ QR public (api.qrserver.com — không cần API key, cùng kiểu dùng
// ảnh QR bên ngoài như img.vietqr.io đã dùng cho chuyển khoản) — mã QR nhúng
// thẳng bookingId đầy đủ (UUID), nhân viên soát vé quét/tra trên trang admin
// bằng đúng ID này để đối chiếu, không cần thêm dependency ở backend.
function ticketQrImageUrl(bookingId: string): string {
  const data = encodeURIComponent(bookingId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${data}`;
}

export function eTicketEmailTemplate(data: ETicketData): { subject: string; html: string } {
  const { bookingId, routeLabel, departureTime, busAgentName, passengerNames, seatNumbers, totalAmount } = data;
  const shortId = bookingId.slice(0, 8).toUpperCase();
  const amountLabel = new Intl.NumberFormat('vi-VN').format(totalAmount) + 'đ';
  const departureLabel = departureTime.toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' });

  return {
    subject: `Thanh toán thành công — Vé điện tử #${shortId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #163328;">✓ Thanh toán thành công</h2>
        <p style="color: #444; font-size: 15px;">
          Đơn hàng #${shortId} đã được xác nhận thanh toán. Vé điện tử của bạn dưới đây — vui lòng xuất trình
          mã QR này (hoặc email này) cho nhân viên nhà xe khi lên xe.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${ticketQrImageUrl(bookingId)}" alt="Mã QR vé điện tử" width="180" height="180" style="border: 1px solid #eee; border-radius: 8px;" />
        </div>
        <div style="border: 1px dashed #D4C5AB; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
            <tr><td style="padding: 6px 0; color: #777;">Mã vé</td><td style="padding: 6px 0; text-align: right; font-weight: 700;">${shortId}</td></tr>
            <tr><td style="padding: 6px 0; color: #777;">Nhà xe</td><td style="padding: 6px 0; text-align: right;">${busAgentName}</td></tr>
            <tr><td style="padding: 6px 0; color: #777;">Tuyến</td><td style="padding: 6px 0; text-align: right;">${routeLabel}</td></tr>
            <tr><td style="padding: 6px 0; color: #777;">Giờ khởi hành</td><td style="padding: 6px 0; text-align: right;">${departureLabel}</td></tr>
            <tr><td style="padding: 6px 0; color: #777;">Hành khách</td><td style="padding: 6px 0; text-align: right;">${passengerNames.join(', ')}</td></tr>
            <tr><td style="padding: 6px 0; color: #777;">Ghế</td><td style="padding: 6px 0; text-align: right;">${seatNumbers.join(', ')}</td></tr>
            <tr><td style="padding: 10px 0 0; color: #777; font-weight: 700;">Tổng đã thanh toán</td><td style="padding: 10px 0 0; text-align: right; font-weight: 700; color: #163328;">${amountLabel}</td></tr>
          </table>
        </div>
        <p style="color: #777; font-size: 13px;">Vui lòng có mặt tại điểm đón trước giờ khởi hành ít nhất 15 phút. Chúc bạn có một chuyến đi an toàn!</p>
      </div>
    `,
  };
}
