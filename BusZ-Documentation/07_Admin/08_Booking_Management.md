# Booking Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-008

Priority

Critical

Version

1.0

---

# 1. Purpose

Booking Management cho phép quản trị viên quản lý toàn bộ đơn đặt vé trong hệ thống BusZ.

Bao gồm:

- Quản lý booking
- Quản lý hành khách
- Quản lý ghế
- Quản lý trạng thái
- Hoàn tiền
- Xuất hóa đơn
- Theo dõi lịch sử thay đổi

---

# 2. User Flow

```text
Dashboard

↓

Bookings

↓

Search Booking

↓

Booking Detail

↓

Update Status

↓

Save
```

---

# 3. Booking List

Hiển thị

- Booking ID
- Booking Code
- Customer
- Trip
- Route
- Seat(s)
- Total Amount
- Payment Status
- Booking Status
- Created Time

---

# 4. Search

Theo

```text
Booking ID

Booking Code

Customer Name

Phone

Email

Trip ID
```

Search Delay

```text
300ms
```

---

# 5. Filters

Theo

```text
Booking Status

Payment Status

Trip

Bus Company

Route

Booking Date

Departure Date
```

---

# 6. Booking Detail

Hiển thị

### Customer

```text
Name

Phone

Email
```

### Passenger

```text
Passenger List

Seat

Pickup Point

Dropoff Point
```

### Payment

```text
Method

Transaction ID

Status

Amount
```

---

# 7. Booking Status

```text
PENDING

CONFIRMED

PAID

CHECKED_IN

COMPLETED

CANCELLED

REFUNDED

EXPIRED
```

---

# 8. Seat Management

Hiển thị

```text
Booked

Available

Locked

Cancelled
```

Cho phép

```text
Release Seat

Reassign Seat
```

Theo chính sách nghiệp vụ.

---

# 9. Passenger Management

Cho phép

```text
Edit Passenger Info

Change Pickup Point

Change Dropoff Point
```

Nếu chuyến chưa khởi hành.

---

# 10. Cancellation

Flow

```text
Select Booking

↓

Choose Reason

↓

Cancel Booking

↓

Release Seats

↓

Refund (Optional)
```

---

# 11. Refund

Thông tin

```text
Refund Amount

Refund Method

Refund Status

Refund Reason
```

Trạng thái

```text
Pending

Approved

Rejected

Completed
```

---

# 12. Invoice

Cho phép

```text
View Invoice

Download PDF

Email Invoice
```

---

# 13. Booking Timeline

Hiển thị

```text
Created

Confirmed

Paid

Seat Assigned

Checked In

Completed

Refunded
```

---

# 14. Notes

Admin có thể thêm

```text
Internal Notes
```

Không hiển thị với khách hàng.

---

# 15. Bulk Actions

Cho phép

```text
Export

Cancel

Resend Confirmation

Send Notification
```

---

# 16. Export

Định dạng

```text
Excel

CSV

PDF
```

Bao gồm

- Booking
- Passenger
- Payment

---

# 17. API Integration

```text
GET /admin/bookings

GET /admin/bookings/{id}

PATCH /admin/bookings/{id}

PATCH /admin/bookings/{id}/cancel

POST /admin/bookings/{id}/refund

GET /admin/bookings/{id}/invoice
```

---

# 18. Component Tree

```text
BookingManagementPage

↓

FilterBar

↓

SearchBox

↓

BookingTable

↓

BookingDetailDrawer

↓

PassengerSection

↓

PaymentSection

↓

TimelineSection

↓

ActionToolbar
```

---

# 19. Performance

Booking List

```text
<200ms
```

Booking Detail

```text
<300ms
```

Invoice PDF

```text
<3s
```

---

# 20. UX Guidelines

✓ Trạng thái Booking hiển thị bằng màu sắc.

✓ Timeline dễ theo dõi.

✓ Cảnh báo trước khi hủy booking.

✓ Cho phép mở nhanh Trip hoặc Customer từ Booking.

✓ Hỗ trợ thao tác hàng loạt.

---

# 21. Test Cases

✓ Search Booking.

✓ Filter Booking.

✓ View Detail.

✓ Cancel Booking.

✓ Refund Booking.

✓ Download Invoice.

✓ Edit Passenger.

✓ Export Booking.

---

# 22. Acceptance Criteria

✓ CRUD hoạt động theo quyền.

✓ Timeline chính xác.

✓ Refund hoạt động.

✓ Invoice tạo thành công.

✓ Export đầy đủ.

✓ Audit Log được ghi nhận.

---

# 23. Related Documents

ADM-007 Trip Management

ADM-009 Payment Management

APP-007 Booking Module

API-007 Booking API

---

# 24. Summary

Booking Management là module trung tâm dành cho đội Customer Support và Operations của BusZ. Hệ thống hỗ trợ quản lý toàn bộ vòng đời của đơn đặt vé, từ khi tạo booking đến khi hoàn thành hoặc hoàn tiền, đồng thời cung cấp đầy đủ thông tin hành khách, thanh toán và lịch sử thay đổi để hỗ trợ xử lý nghiệp vụ nhanh chóng.