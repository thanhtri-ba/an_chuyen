# 12 — User Journey (toàn bộ vòng đời 1 khách hàng, theo đúng thứ tự gọi API)

Nguồn: route thật trong `web/src/App.tsx`, endpoint thật trong `backend/src/index.ts` + `modules/*`. Mỗi bước dưới đây là 1 request thật — không có bước nào suy đoán.

Quy ước: mọi request đi qua chuỗi middleware toàn cục trước khi tới route handler (đã mô tả ở `03-backend-map.md`): `cors → helmet → compression → express.json → requestContextMiddleware → loggingMiddleware → apiLimiter (300/15p) → route`. Sơ đồ dưới đây lược bớt phần này để tập trung vào business logic, chỉ nhắc lại khi có middleware riêng (`verifyAccessToken`, `optionalAuth`, `authLimiter`).

## Toàn cảnh 1 lượt mua vé (happy path, thanh toán VNPay)

```mermaid
sequenceDiagram
    autonumber
    actor U as Khách hàng
    participant W as web/ (React)
    participant API as Express API :3000
    participant DB as PostgreSQL (Prisma)
    participant VNP as VNPay

    Note over U,W: 1. TÌM CHUYẾN — HomePage/TripSearchPage
    U->>W: mở /search, nhập điểm đi/đến/ngày
    W->>API: GET /api/trips?origin=...&destination=...&date=...
    API->>DB: Route.findMany → Trip.findMany → TripSchedule.findMany (cache 300s, core/cache.ts)
    DB-->>API: danh sách TripSchedule kèm Trip/Route/Price/Checkpoint
    API-->>W: 200 { data, total, page, totalPages }
    W-->>U: hiển thị danh sách chuyến

    Note over U,W: 2. CHỌN GHẾ — SeatSelectionPage (/seat-selection/:tripScheduleId)
    U->>W: bấm 1 chuyến trong danh sách
    W->>API: GET /trip-schedules/:tripScheduleId (chi tiết xe/nhà xe)
    API->>DB: SeatService.getTripScheduleDetail
    API-->>W: 200 chi tiết chuyến
    W->>API: GET /trip-schedules/:tripScheduleId/seats (optionalAuth)
    API->>DB: SeatService.getSeatMap — tự dọn ghế LOCKED hết hạn, tạo 36 ghế nếu chưa có
    API-->>W: 200 seat map (available/booked/blocked/held-by-me)
    U->>W: chọn ghế (tối đa 4)
    W->>API: POST /trip-schedules/:tripScheduleId/seats/hold { seatNumbers } (verifyAccessToken)
    API->>DB: SeatService.holdSeats — $transaction, updateMany điều kiện AVAILABLE→LOCKED (10 phút)
    alt ghế còn trống
        DB-->>API: count khớp
        API-->>W: 200 { expiresAt } — countdown 10 phút bắt đầu chạy ở FE (setInterval cục bộ)
    else ghế vừa bị người khác giữ
        DB-->>API: count lệch
        API-->>W: 409 "Ghế đã có người khác giữ"
        W-->>U: toast lỗi, bỏ chọn ghế đó
    end

    Note over U,W: 3. TẠO BOOKING — PaymentPage (/payment, ProtectedRoute)
    U->>W: điền hành khách + chọn phương thức "VNPay" + bấm Thanh toán
    W->>API: POST /api/bookings/create (verifyAccessToken)\nbody: tripScheduleId, seatNumbers, passengers[], paymentMethod:'vnpay', promoCode?
    API->>API: Zod validate (createBookingSchema) — bỏ qua totalAmount client gửi
    API->>DB: BookingService.createBooking — $transaction 8 bước (xem 06-booking-flow.md)
    Note right of DB: tự tính tiền theo TripPrice,\nkhoá ghế LOCKED→LOCKED (giữ cho booking thật),\ntạo Booking(PENDING_PAYMENT)+Passenger+SeatBooking+Ticket(PENDING)+Payment(PENDING)
    DB-->>API: booking { id, totalAmount, status: PENDING_PAYMENT }
    API-->>W: 200/201 booking

    Note over U,W: 4. SINH LINK THANH TOÁN VNPAY
    W->>API: POST /api/vnpay/create-url { bookingId } (verifyAccessToken)
    API->>DB: kiểm tra booking thuộc đúng user, status=PENDING_PAYMENT, payment.status=PENDING
    API->>API: vnpay.util.ts::createPaymentUrl (ký HMAC, buildTxnRef)
    API-->>W: 200 { paymentUrl }
    W->>U: redirect trình duyệt sang paymentUrl (VNPay)

    Note over U,VNP: 5. THANH TOÁN TRÊN VNPAY
    U->>VNP: nhập thông tin thẻ, xác nhận
    VNP-->>U: redirect về GET /api/vnpay/return?vnp_ResponseCode=00&vnp_TxnRef=...
    VNP->>API: (song song, không phụ thuộc trình duyệt) GET /api/vnpay/ipn?...

    Note over API,DB: 6. XÁC NHẬN THANH TOÁN (điểm hội tụ confirm.util.ts)
    API->>API: verifySignature (HMAC) — bỏ qua nếu sai chữ ký
    API->>DB: confirmPaymentSuccess(bookingId,'VNPay',txnId)\nidempotent — bỏ qua nếu Payment đã PAID
    DB-->>API: Payment.status=PAID, Booking.status=CONFIRMED, Seat.status=BOOKED
    API-->>U: redirect FRONTEND_URL/payment/vnpay-result?status=success&bookingId=...

    Note over U,W: 7. XÁC NHẬN — VnpayResultPage → BookingConfirmationPage
    W->>API: GET /api/payments/booking/:bookingId (verifyAccessToken) — kiểm tra trạng thái mới nhất
    API-->>W: 200 payment { status: PAID }
    W-->>U: hiện vé + mã QR (sinh ở client, không gọi API riêng cho QR)
```

## Nhánh phương thức thanh toán khác (thay bước 4-6 ở trên)

```mermaid
sequenceDiagram
    autonumber
    actor U as Khách hàng
    participant W as web/
    participant API as Express API
    participant DB as PostgreSQL

    alt Ví An Chuyến
        Note over W,API: Trừ tiền NGAY trong POST /api/bookings/create\n(BookingService — isWalletPayment=true)
        API->>DB: Wallet.balance -= totalAmount, WalletTransaction(type=PAYMENT)\nBooking.status=CONFIRMED thẳng, Seat.status=BOOKED thẳng
        Note over U,W: Không có bước redirect cổng ngoài — về thẳng /booking-confirmation
    else MoMo
        W->>API: POST /api/momo/create-url { bookingId }
        API-->>W: { paymentUrl }
        Note over U: giống luồng VNPay, thay bằng GET/POST /api/momo/return, /api/momo/ipn
    else Chuyển khoản (VietQR)
        W->>API: GET /api/bank-transfer/info
        API-->>W: { accountName, accountNumber, bankBin }
        W-->>U: BankTransferQRPage tự sinh ảnh QR (img.vietqr.io) nhúng 8 ký tự đầu bookingId vào nội dung CK
        Note over API,DB: KHÔNG có polling từ FE — xác nhận đến từ webhook bên ngoài
        Note over API: POST /api/bank-transfer/webhook/sepay (SEPAY_API_KEY)\nHOẶC POST /api/bank-transfer/webhook/casso (CASSO_WEBHOOK_TOKEN)
        API->>DB: match content regex "AC{8 ký tự}" + amount khớp chính xác\n→ confirmPaymentSuccess(bookingId,'SePay'|'Casso',...)
    else COD / Mock (demo)
        Note over U,API: Booking ở PENDING_PAYMENT, chờ ADMIN xác nhận thủ công\n(xem 13-admin-journey.md, mục duyệt thanh toán)
    end
```

## Các hành trình khác của user (ngoài mua vé)

```mermaid
sequenceDiagram
    autonumber
    actor U as Khách hàng
    participant W as web/
    participant API as Express API
    participant DB as PostgreSQL

    Note over U,W: Đăng ký / đăng nhập (authLimiter: 20 req/15p, chống brute-force)
    U->>W: AuthPage — submit form
    alt đăng ký thường
        W->>API: POST /api/auth/register
    else đăng nhập thường
        W->>API: POST /api/auth/login
    else Google
        W->>API: POST /api/auth/google (google-auth-library verify id_token)
    end
    API->>DB: User.findUnique/create, bcrypt so khớp password
    API-->>W: 200 { token, user } → lưu sessionStorage 'busz_token'

    Note over U,W: Xem vé đã đặt
    U->>W: mở /my-bookings (ProtectedRoute)
    W->>API: GET /api/bookings (verifyAccessToken)
    API->>DB: Booking.findMany where userId
    API-->>W: 200 danh sách booking

    Note over U,W: Huỷ vé
    U->>W: bấm Huỷ trên 1 booking PENDING_PAYMENT/CONFIRMED
    W->>API: POST /api/bookings/:id/cancel (verifyAccessToken)
    API->>DB: BookingService.cancelBooking — $transaction:\nSeat→AVAILABLE, tính refundPct theo CancellationPolicy nếu trả ví,\nBooking.status = REFUNDED (đã hoàn) hoặc CANCELLED
    API-->>W: 200 booking đã cập nhật

    Note over U,W: Hỏi AI (không cần đăng nhập)
    U->>W: gõ câu hỏi vào FloatingChat
    W->>API: POST /api/ai/chat { message }
    API->>API: ai.tools.ts buildContext (RAG) → ai.prompt.ts → fetch Ollama local
    API-->>W: 200 { reply, suggestions }
```

## Ghi chú trình tự quan trọng (dễ hiểu sai nếu chỉ đọc code rời rạc)

1. **Hold ghế xảy ra TRƯỚC khi tạo Booking**, và là 2 lần khoá riêng biệt trên cùng bảng `Seat` — hold dùng `lockExpiresAt` (10 phút, tự dọn lazy), tạo Booking thì xoá `lockExpiresAt` đi (khoá không giới hạn thời gian theo kiểu hold nữa, mà theo `BOOKING_EXPIRY_MINUTES` ở tầng Booking).
2. **`/vnpay|momo/create-url` gọi SAU `/bookings/create`**, không phải trước — Payment record (`status: PENDING`) đã tồn tại từ bước tạo booking, route `create-url` chỉ kiểm tra lại rồi sinh URL.
3. **`GET /vnpay|momo/return` và `GET/POST .../ipn` có thể tới theo thứ tự bất kỳ, hoặc chỉ 1 trong 2 tới** (ví dụ chạy local không có domain public thì IPN không bao giờ gọi được) — vì vậy `confirmPaymentSuccess` phải idempotent, ai tới trước thắng, người tới sau nhận `alreadyProcessed: true`.
4. **Không có bước nào trong toàn bộ luồng gọi tới Socket.IO** — kể cả khi ghế vừa bị khoá/nhả, client khác không được thông báo chủ động (xem `10-realtime-flow.md`).
