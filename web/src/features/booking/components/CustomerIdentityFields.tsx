import { toast } from 'sonner';
import { useCustomerIdentity } from '../../../contexts/CustomerIdentityContext';

// Đồng ý cung cấp thông tin để đặt vé — KHÔNG bắt xác minh OTP (quyết định
// có chủ đích, xem docs/architecture/REDESIGN-PLAN.md): OTP gây ma sát
// không cần thiết cho 1 hệ thống đặt vé. Danh tính khách vãng lai được tạo
// tự động phía backend từ email khi gọi POST /bookings/create
// (guestBookingIdentity.middleware.ts) — component này chỉ cần thu thập sự
// đồng ý, không cần input email/CCCD riêng (đã có sẵn ở form hành khách).
//
// `consent`/`onConsentChange` được nâng lên SeatSelectionPage để nút "Tiếp
// tục" có thể bắt buộc đã tick trước khi cho qua bước thanh toán — nếu để
// state cục bộ trong component này thì việc tick hay không hoàn toàn không
// có tác dụng gì (đã xảy ra: khách không tick vẫn tiếp tục được bình thường).
export function CustomerIdentityFields({ consent, onConsentChange }: { consent: boolean; onConsentChange: (v: boolean) => void }) {
  const { identityUser, logout } = useCustomerIdentity();

  // Đã được nhận diện từ trước (thiết bị quen, do đặt vé lần trước hoặc đã
  // tra cứu đơn hàng cũ) — không cần hỏi lại gì cả.
  if (identityUser) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-[#D4C5AB] bg-[#F8F9FF] px-4 py-3 text-sm">
        <span>
          Đặt vé với email <b>{identityUser.email}</b>
        </span>
        <button
          type="button"
          onClick={() => logout().catch(() => toast.error('Không thể đăng xuất, vui lòng thử lại.'))}
          className="text-xs font-semibold text-[#785900] underline underline-offset-2"
        >
          Không phải bạn?
        </button>
      </div>
    );
  }

  return (
    <label className="flex items-start gap-2 rounded-lg border border-[#D4C5AB] p-4 text-xs text-[#4F4632]">
      <input
        type="checkbox"
        checked={consent}
        onChange={(e) => onConsentChange(e.target.checked)}
        className="mt-0.5"
      />
      Tôi đồng ý cung cấp thông tin (email, SĐT, CCCD) ở trên cho An Chuyến để phục vụ việc đặt vé.
    </label>
  );
}
