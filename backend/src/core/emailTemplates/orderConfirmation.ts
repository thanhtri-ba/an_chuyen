// Mail 1/2 — gửi ngay khi tạo booking (đơn hàng đang chờ thanh toán). CHƯA có
// vé điện tử (booking chưa PENDING_PAYMENT → CONFIRMED) — vé thật chỉ gửi ở
// eTicket.ts sau khi admin/gateway xác nhận đã nhận tiền, tránh khách hiểu
// nhầm "đặt xong" trong khi tiền chưa qua.
export interface OrderConfirmationData {
  bookingId: string;
  routeLabel: string;
  departureTime: Date;
  seatNumbers: string[];
  totalAmount: number;
  paymentMethod: string;
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  bank_transfer: 'Chuyển khoản ngân hàng',
  mock: 'Thanh toán giả lập (Demo)',
};

export function orderConfirmationEmailTemplate(data: OrderConfirmationData): { subject: string; html: string } {
  const { bookingId, routeLabel, departureTime, seatNumbers, totalAmount, paymentMethod } = data;
  const shortId = bookingId.slice(0, 8).toUpperCase();
  const methodLabel = PAYMENT_METHOD_LABEL[paymentMethod] || paymentMethod;
  const amountLabel = new Intl.NumberFormat('vi-VN').format(totalAmount) + 'đ';
  const departureLabel = departureTime.toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' });

  return {
    subject: `Đơn hàng #${shortId} — An Chuyến đã ghi nhận, đang chờ thanh toán`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a1a;">Đã ghi nhận đơn hàng của bạn</h2>
        <p style="color: #444; font-size: 15px;">
          Cảm ơn bạn đã đặt vé tại An Chuyến. Đơn hàng dưới đây đang <strong>chờ xác nhận thanh toán</strong> —
          vé điện tử sẽ được gửi ở một email riêng ngay khi thanh toán được xác nhận.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; color: #333;">
          <tr><td style="padding: 6px 0; color: #777;">Mã đơn hàng</td><td style="padding: 6px 0; text-align: right; font-weight: 700;">${shortId}</td></tr>
          <tr><td style="padding: 6px 0; color: #777;">Tuyến</td><td style="padding: 6px 0; text-align: right;">${routeLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #777;">Giờ khởi hành</td><td style="padding: 6px 0; text-align: right;">${departureLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #777;">Ghế</td><td style="padding: 6px 0; text-align: right;">${seatNumbers.join(', ')}</td></tr>
          <tr><td style="padding: 6px 0; color: #777;">Phương thức thanh toán</td><td style="padding: 6px 0; text-align: right;">${methodLabel}</td></tr>
          <tr><td style="padding: 10px 0 0; color: #777; font-weight: 700;">Tổng tiền</td><td style="padding: 10px 0 0; text-align: right; font-weight: 700; color: #163328;">${amountLabel}</td></tr>
        </table>
        <p style="color: #777; font-size: 13px;">Nếu bạn không thực hiện đơn hàng này, vui lòng bỏ qua email — đơn sẽ tự huỷ nếu không có thanh toán trong thời gian giữ chỗ.</p>
      </div>
    `,
  };
}
