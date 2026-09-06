# 08 — Payment Flow (5 phương thức thật)

Nguồn: `payment.routes.ts`, `vnpay.routes.ts`, `momo.routes.ts`, `mock-gateway.routes.ts`, `bank-transfer.routes.ts`, `confirm.util.ts`.

## Sơ đồ tổng — điểm hội tụ `confirm.util.ts`

```mermaid
flowchart TD
    BOOK["Booking (PENDING_PAYMENT) + Payment (PENDING)\ntạo bởi BookingService.createBooking"]

    BOOK --> WALLET["Ví An Chuyến\nTRỪ TIỀN NGAY trong transaction tạo booking\n(không qua confirm.util.ts)"]
    BOOK --> VNPAY["VNPay: POST /vnpay/create-url → redirect paymentUrl"]
    BOOK --> MOMO["MoMo: POST /momo/create-url → redirect payUrl"]
    BOOK --> QR["VietQR: GET /bank-transfer/info\n(BankTransferQRPage.tsx tự sinh ảnh QR từ img.vietqr.io, FE-only)"]
    BOOK --> COD["COD / Mock: chờ admin xác nhận thủ công"]

    VNPAY --> VRET["GET /vnpay/return (khách bị redirect về)"]
    VNPAY --> VIPN["GET /vnpay/ipn (server-to-server, cần domain public)"]
    MOMO --> MRET["GET /momo/return"]
    MOMO --> MIPN["POST /momo/ipn"]
    QR --> SEPAY["POST /bank-transfer/webhook/sepay\n(SEPAY_API_KEY)"]
    QR --> CASSO["POST /bank-transfer/webhook/casso\n(CASSO_WEBHOOK_TOKEN)"]
    COD --> ADMINCONFIRM["POST /payments/cod/confirm (admin)\nhoặc /mock-payment/confirm"]

    VRET & VIPN --> VERIFY1["verifySignature (vnpay.util.ts) — HMAC"]
    MRET & MIPN --> VERIFY2["verifySignature (momo.util.ts) — HMAC"]
    SEPAY & CASSO --> VERIFY3["so khớp API key/token + match 8 ký tự đầu bookingId trong nội dung CK + số tiền khớp chính xác"]

    VERIFY1 -->|hợp lệ, responseCode=00| SUCCESS
    VERIFY2 -->|hợp lệ, resultCode=0| SUCCESS
    VERIFY3 -->|khớp| SUCCESS["confirmPaymentSuccess(bookingId, gateway, txnId)"]
    VERIFY1 & VERIFY2 -->|thất bại| FAILED["markPaymentFailed(bookingId)"]

    ADMINCONFIRM --> SUCCESS2["PaymentService.confirmCODPayment — set PAID + CONFIRMED trực tiếp"]

    SUCCESS --> EFFECT["Payment.status=PAID, gateway, transactionId\nBooking.status=CONFIRMED\nSeat.status=BOOKED (idempotent — bỏ qua nếu đã PAID)"]
```

## Webhook — thật, có điều kiện, không phải thành phần đang "chạy sẵn"

Cả 2 webhook `sepay` và `casso` **chỉ hoạt động khi biến môi trường được cấu hình** (`SEPAY_API_KEY`, `CASSO_WEBHOOK_TOKEN`) — nếu thiếu, route trả lỗi 500 ngay, không silent-fail. Không có webhook nào cho VNPay/MoMo ngoài IPN đã liệt kê ở trên (IPN chính là dạng webhook của 2 cổng này).

## Đối soát nội dung chuyển khoản (VietQR)

`bank-transfer.routes.ts` regex `AC\s*([A-F0-9]{8})` khớp 8 ký tự đầu của `bookingId` được nhúng vào nội dung chuyển khoản khi sinh mã QR (`BankTransferQRPage.tsx`, phía frontend). Amount phải khớp **chính xác** `Math.round(booking.totalAmount)` — sai lệch thì bỏ qua, không tự xác nhận, chờ admin xử lý thủ công.

## `PaymentMethod`/`PaymentStatus` thật được set ở đâu

| Trạng thái | Set bởi |
|---|---|
| `Payment.status = PENDING` | `BookingService.createBooking` bước 6 (khi `paymentMethod` khác ví) |
| `Payment.status = PAID` (ví) | `createBooking` (trực tiếp, cùng transaction, không qua `confirm.util.ts`) |
| `Payment.status = PAID` (khác) | `confirmPaymentSuccess` (VNPay/MoMo/SePay/Casso) hoặc `PaymentService.confirmCODPayment` (admin) |
| `Payment.status = FAILED` | `markPaymentFailed` (VNPay/MoMo thất bại), `PaymentService.rejectPayment` (admin từ chối thủ công), `cancelBooking`/`releaseExpiredBookings` (khi huỷ booking còn PENDING) |
| `Payment.status = REFUNDED` | chỉ set trong `BookingService.cancelBooking` khi đã trả bằng ví — **không có refund thật qua API VNPay/MoMo** `[NOT IMPLEMENTED]` |
| `Payment.status = PROCESSING` | `[NOT IMPLEMENTED]` — có trong enum `PaymentStatus` nhưng không có chỗ nào gán |

## Admin duyệt thanh toán thủ công

```mermaid
flowchart LR
    A["Admin dashboard /dashboard/payments"] -->|"GET /api/payments/admin/pending"| L["PaymentService.listPendingPayments"]
    A -->|"COD hợp lệ"| C["POST /api/payments/cod/confirm"] --> CONF["confirmCODPayment → PAID + CONFIRMED + Seat BOOKED"]
    A -->|"CK sai nội dung/số tiền"| R["POST /api/payments/admin/reject"] --> REJ["rejectPayment → FAILED"]
```
