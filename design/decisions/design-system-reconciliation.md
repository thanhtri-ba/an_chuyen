# Decision: Design System Reconciliation — Đồng bộ 20 trang

**Ngày:** 2026-08-22
**Yêu cầu từ user:** "đạp đi xây lại full giao diện website luôn"

## Bối cảnh

Audit toàn bộ 20 trang đang live (route trong `App.tsx`) phát hiện **4 hệ thống thiết kế khác nhau** cùng tồn tại:

1. **"Lumora dark cinematic"** (đa số — 11/20 trang: HomePage, TripSearchPage, SeatSelectionPage, BookingReviewPage, MyBookingsPage, OffersPage, AboutPage, BlogPage, BlogDetailPage, SchedulePage, AuthPage) — nền `#0e1111`, gold `#d4af37`, font Cormorant Garamond/Playfair Display + system-ui.
2. **Light shadcn/Tailwind** (PaymentPage, ProfilePage, LoyaltyPage) — `bg-gray-50` + component `design-system/components`.
3. **Plain light Tailwind** (BookingConfirmationPage, DeliveryPage, RentalPage, EventsPage, phần card của NotificationsPage).
4. **Palette riêng biệt** (TourPage) — cam/tím `#FF7F50`/`#7C3AED`, copy toàn tiếng Anh.

Tài liệu `design/DESIGN_SYSTEM.md` bản cũ mô tả token `--ink #0C0D0B / --fog #F5F3EE / --gold #F2C118 / Space Mono` — **không trang nào thực sự dùng bộ token này**. Tài liệu mô tả một hệ thống chưa từng được implement.

Brand name cũng lộn xộn: "An Chuyến" (đúng), "LunaTravel Business" (đa số trang nhóm 2/3/4 + `<title>` tag), "2QO Travel"/"2QO Travle" (Header/Footer — lỗi do chính Claude vô tình đổi nhầm trong một phiên tối ưu performance trước đó, không phải chủ đích thiết kế).

## Quyết định: Chuẩn hoá theo hệ Lumora (đa số + đang active iterate), KHÔNG đổi hướng mới

**Lý do chọn Lumora làm canonical thay vì viết lại theo `DESIGN_SYSTEM.md` cũ:**
1. Đã là style của 11/20 trang — ít công sức migrate hơn so với đảo ngược
2. User vừa cùng làm việc trên style này trong phiên trước (hero video theo scroll + parallax) — xác nhận đây là hướng được ưu tiên
3. `DESIGN_SYSTEM.md` cũ mô tả hệ thống 0% implement — giữ tài liệu đó chỉ gây nhầm lẫn cho người viết code sau này

**9 trang được viết lại** (giữ nguyên 100% logic/state/API call, chỉ đổi lớp trình bày):
`EventsPage`, `RentalPage`, `LoyaltyPage`, `NotificationsPage` (chỉ card), `DeliveryPage`, `TourPage`, `BookingConfirmationPage`, `PaymentPage`, `ProfilePage`.

## Các quyết định phụ trong lúc thực hiện

### TourPage — accent tím thứ 2
**Vấn đề:** TourPage gốc dùng tím `#7C3AED` cho nút "View Details" bên cạnh cam `#FF7F50` chính.
**Quyết định:** Bỏ hẳn tím, dùng ghost button viền trắng mờ → hover mới hiện gold. Giữ đúng rule "gold là accent DUY NHẤT" trong `ART_DIRECTION.md`.

### BookingConfirmationPage — vé giấy trắng trên nền tối
**Vấn đề:** Trang mô phỏng hoá đơn/vé giấy in thật (theo convention hoá đơn xe khách VN) — nền trắng có thể là chủ đích, không phải light-mode sót lại.
**Quyết định:** Giữ nguyên receipt màu trắng (đúng ẩn dụ "tờ vé in"), chỉ đổi **shell** xung quanh từ `bg-gray-100` → `#0e1111`. Vé giấy trắng nổi bật trên nền tối tạo hiệu ứng chủ đích, không phải lỗi.

### TourPage — dịch toàn bộ copy Anh → Việt
**Vấn đề:** 100% text trong TourPage là tiếng Anh trong khi toàn site còn lại dùng tiếng Việt.
**Quyết định:** Dịch trực tiếp inline (không wire qua i18n `locales/*.ts` — nằm ngoài phạm vi rewrite thị giác). Nếu cần đa ngôn ngữ đầy đủ cho trang này, làm riêng một task khác.

### Bug fix đi kèm
`ProfilePage.tsx` gọi `useTranslation()` nhưng thiếu import — sẽ crash khi render. Đã thêm `import { useTranslation } from 'react-i18next';`. Đây là bug có sẵn, không liên quan tới redesign nhưng được sửa luôn vì đằng nào cũng phải sửa file này.

### 2 file rỗng không route tới đâu
`PaymentMethodPage.tsx`, `CODConfirmationPage.tsx` (0 byte, không import/route ở đâu) — **không đụng tới**, theo quyết định của user khi được hỏi trực tiếp.

## Ghi chú cho lần sau

- Token canonical đã cập nhật trong `design/DESIGN_SYSTEM.md` — dùng file đó làm nguồn duy nhất, không dùng giá trị cũ `#0C0D0B`/`#F5F3EE`/`#F2C118`/Space Mono nữa.
- Pattern chuẩn cho trang mới: card `background: rgba(255,255,255,0.025)` + `border: 1px solid rgba(255,255,255,0.07)`, input `background: rgba(255,255,255,0.05)` + border sáng khi focus (`#d4af37`), button chính `linear-gradient(135deg,#d4af37,#f0c94a)` chữ `#0e1111`.
- Tham khảo cấu trúc gần nhất khi viết trang mới: `BookingReviewPage.tsx`/`SeatSelectionPage.tsx` (form-heavy), `MyBookingsPage.tsx`/`OffersPage.tsx` (card-list).
