# 13 — Admin Journey (trình tự request thật khi vận hành hệ thống)

Nguồn: `admin/src/App.tsx`, `backend/src/admin.routes.ts` (toàn bộ sau `router.use(verifyAccessToken); router.use(requireAdmin);`), `payment.routes.ts`.

## Đăng nhập admin — khác cơ chế token với web/

```mermaid
sequenceDiagram
    autonumber
    actor A as Nhân viên/Admin
    participant AD as admin/ (React)
    participant API as Express API
    participant DB as PostgreSQL

    A->>AD: /auth/login — submit email/password
    AD->>API: POST /api/auth/login (authLimiter: 20 req/15p)
    API->>DB: User.findUnique(email), so khớp password
    API-->>AD: 200 { token, user: { role } }
    AD->>AD: lưu token vào localStorage 'admin_token'\n(KHÁC hẳn web/ dùng sessionStorage 'busz_token' — 2 phiên độc lập)
    Note over AD,API: Mọi request sau đều gắn Authorization: Bearer <admin_token>
    Note over API: verifyAccessToken decode JWT → req.user.role\nrequireAdmin chặn nếu role !== 'admin' (403)
```

## Trình tự request khi mở Dashboard mặc định

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant AD as admin/
    participant API as Express API
    participant DB as PostgreSQL

    A->>AD: mở /dashboard/default
    AD->>API: GET /api/admin/stats
    API->>DB: đếm/aggregate (Booking, User, Payment...)
    API-->>AD: 200 số liệu tổng quan
    AD->>API: GET /api/admin/analytics/overview
    API->>DB: truy vấn doanh thu/lượt đặt theo thời gian
    API-->>AD: 200 dữ liệu biểu đồ
    AD-->>A: render metric-cards + performance-overview
```

## Vận hành chuyến xe — tạo lịch trình, sinh ghế, phân công tài xế

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant AD as admin/ TripSchedulesPage
    participant API as Express API
    participant DB as PostgreSQL

    Note over A,AD: 1. Xem/tạo lịch trình
    AD->>API: GET /api/admin/tripSchedules
    API->>DB: createCrudRouter(prisma.tripSchedule).findMany (range/sort/filter → skip/take/orderBy/where)
    API-->>AD: 200 data + header Content-Range/X-Total-Count
    A->>AD: bấm "Tạo lịch trình"
    AD->>API: POST /api/admin/tripSchedules { tripId, departureTime, arrivalTime, busId, ... }
    API->>DB: prisma.tripSchedule.create (writeBlock strip field nhạy cảm nếu có)
    API-->>AD: 201 tripSchedule mới

    Note over A,AD: 2. Sinh sơ đồ ghế cho lịch trình vừa tạo
    A->>AD: bấm "Generate seats"
    AD->>API: POST /api/admin/tripSchedules/:id/generate-seats
    API->>DB: tạo hàng loạt Seat (giống logic auto-tạo trong SeatService.getSeatMap\nnhưng chủ động từ phía admin thay vì lazy khi khách xem trước)
    API-->>AD: 201/200 danh sách ghế

    Note over A,AD: 3. Gán tài xế/phụ xe
    A->>AD: chọn Employee cho lịch trình
    AD->>API: PUT /api/admin/tripSchedules/:id/assign { employeeIds }
    API->>DB: TripStaffAssignment — tạo/cập nhật liên kết Employee ↔ TripSchedule
    API-->>AD: 200 xác nhận

    Note over A,AD: 4. Xem chi tiết xe/khách trên chuyến
    AD->>API: GET /api/admin/tripSchedules/:id/vehicle-detail
    API->>DB: Bus + Seat + SeatBooking + Passenger join
    API-->>AD: 200 sơ đồ xe kèm hành khách từng ghế
```

## Duyệt thanh toán thủ công (COD / chuyển khoản không khớp webhook)

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant AD as admin/ PaymentsPage
    participant API as Express API
    participant DB as PostgreSQL

    AD->>API: GET /api/payments/admin/pending (verifyAccessToken + requireAdmin)
    API->>DB: PaymentService.listPendingPayments — Payment.status=PENDING, include booking/trip/user
    API-->>AD: 200 danh sách chờ duyệt

    alt Khớp tiền, hợp lệ
        A->>AD: bấm "Xác nhận"
        AD->>API: POST /api/payments/cod/confirm { paymentId, adminEmail }
        API->>DB: PaymentService.confirmCODPayment\nPayment.status=PAID, confirmedBy/confirmedAt,\nBooking.status=CONFIRMED, Seat.status=BOOKED
        API-->>AD: 200 payment đã duyệt
    else Sai nội dung/số tiền, giả mạo
        A->>AD: bấm "Từ chối"
        AD->>API: POST /api/payments/admin/reject { paymentId, adminEmail }
        API->>DB: PaymentService.rejectPayment — chỉ cho phép khi status hiện tại = PENDING\nPayment.status=FAILED (KHÔNG tự huỷ Booking hay nhả ghế ngay)
        API-->>AD: 200 payment đã từ chối
        Note over API,DB: Booking vẫn PENDING_PAYMENT — khách còn cơ hội thử\nphương thức khác cho tới khi bị cron releaseExpiredBookings dọn (30 phút)
    end
```

## Quản lý nội dung / dữ liệu tĩnh (áp dụng như nhau cho 20+ resource CRUD)

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant AD as admin/ (VD: BannersPage, ToursPage, HotelsAdminPage...)
    participant API as createCrudRouter (admin.routes.ts)
    participant CACHE as core/cache.ts
    participant DB as PostgreSQL

    AD->>API: GET /api/admin/banners?range=[0,9]&sort=["createdAt","DESC"]
    API->>DB: prisma.banner.findMany({ skip, take, orderBy, where })
    API-->>AD: 200 + Content-Range: banners 0-9/42

    A->>AD: sửa nội dung banner, bấm Lưu
    AD->>API: PUT /api/admin/banners/:id
    API->>DB: prisma.banner.update
    API->>CACHE: invalidateCache('banners') — vì banner nằm trong cacheKeys của createCrudRouter
    API-->>AD: 200 banner mới
    Note over CACHE: Lần tới khách vào web/, GET /api/banners (route công khai)\nsẽ query lại DB thay vì trả cache cũ — tránh admin sửa xong mà FE vẫn thấy dữ liệu cũ
```

## Chat hỗ trợ khách hàng (REST — không realtime, xem `10-realtime-flow.md`)

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant AD as admin/ ChatAppPage (/chat)
    participant API as Express API
    participant DB as PostgreSQL

    AD->>API: GET /api/admin/support/conversations
    API->>DB: SupportConversation.findMany
    API-->>AD: 200 danh sách hội thoại
    A->>AD: mở 1 hội thoại
    AD->>API: GET /api/admin/support/conversations/:id/messages
    API->>DB: SupportMessage.findMany where conversationId
    API-->>AD: 200 tin nhắn
    A->>AD: gõ trả lời, gửi
    AD->>API: POST /api/admin/support/conversations/:id/messages { content }
    API->>DB: SupportMessage.create
    API-->>AD: 201 tin nhắn mới
    AD->>API: PATCH /api/admin/support/conversations/:id { status: 'resolved' }
    API->>DB: SupportConversation.update
    Note over AD,API: KHÔNG có push/socket cho tin nhắn mới — nếu khách hàng\ngửi thêm tin trong lúc admin đang xem, admin phải tự bấm lại/GET lại để thấy
```

## Bảng tổng hợp trình tự middleware cho MỌI request `/api/admin/*`

```text
cors → helmet → compression → express.json
  → requestContextMiddleware → loggingMiddleware → apiLimiter (300/15p, chung /api)
    → router.use(verifyAccessToken)   [401 nếu thiếu/sai token]
      → router.use(requireAdmin)      [403 nếu role !== 'admin']
        → route handler (custom hoặc createCrudRouter)
          → Prisma → PostgreSQL
        → deepStrip(password) trước khi trả JSON
      → errorMiddleware nếu có lỗi ném ra (luôn 500 — xem 11-error-edge-cases.md)
```
