# Ticket Refund

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-008

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Refund quản lý toàn bộ nghiệp vụ hoàn vé sau khi hành khách yêu cầu hủy vé và đủ điều kiện hoàn tiền.

Module này tập trung vào:

- Hoàn vé
- Cập nhật trạng thái vé
- Đồng bộ Booking
- Đồng bộ Seat
- Kích hoạt Payment Refund

---

# 2. Objectives

✓ Hoàn vé chính xác.

✓ Không hoàn vé trùng.

✓ Đồng bộ dữ liệu.

✓ Ghi lịch sử.

✓ Tự động giải phóng ghế.

---

# 3. Actors

Customer

Customer Support

Admin

Ticket Service

Payment Service

Notification Service

---

# 4. Preconditions

✓ Ticket ACTIVE.

✓ Payment SUCCESS.

✓ Vé được phép hoàn.

✓ Chưa Refund.

---

# 5. Refund Flow

Customer

↓

Request Refund

↓

Validate Policy

↓

Cancel Ticket

↓

Release Seat

↓

Trigger Payment Refund

↓

Update Booking

↓

Update History

↓

Notification

---

# 6. Refund Types

Full Ticket Refund

Partial Ticket Refund

System Refund

Operator Refund

Emergency Refund

---

# 7. Ticket Status

ACTIVE

↓

REFUND_PENDING

↓

REFUNDED

---

ACTIVE

↓

REFUND_REJECTED

---

# 8. Refund Information

Refund ID

Ticket ID

Booking ID

Passenger

Refund Amount

Refund Policy

Refund Status

Created Time

Completed Time

---

# 9. Business Rules

TICKET-BR-037

Ticket chỉ Refund một lần.

TICKET-BR-038

Refund Policy do Bus Company cấu hình.

TICKET-BR-039

Refund Amount tính theo Payment Module.

TICKET-BR-040

Seat phải Release sau Refund thành công.

TICKET-BR-041

Audit Log bắt buộc.

---

# 10. Business Logic

Receive Refund Request

↓

Validate Ticket

↓

Validate Policy

↓

Create Refund Request

↓

Update Ticket

↓

Release Seat

↓

Trigger Payment Refund

↓

Notification

---

# 11. API

POST /tickets/{id}/refund

GET /tickets/{id}/refund

POST /tickets/{id}/refund/cancel

GET /tickets/refund-policy

---

# 12. Database

ticket_refunds

tickets

refund_requests

seat_reservations

ticket_history

audit_logs

---

# 13. Validation

Ticket ACTIVE

↓

Not Checked-in

↓

Refund Allowed

↓

Continue

---

# 14. Loading State

Checking Policy

↓

Creating Refund

↓

Updating Ticket

↓

Waiting Payment Refund

---

# 15. Error State

Refund Not Allowed

↓

Reject

---

Already Refunded

↓

Reject

---

Checked-in Ticket

↓

Reject

---

Gateway Error

↓

Retry

---

# 16. Success State

Refund Approved

↓

Ticket Refunded

↓

Seat Released

↓

History Updated

---

# 17. Seat Release

Refund Success

↓

Release Seat

↓

Seat Available

↓

Update Trip Capacity

---

# 18. Booking Update

Update Passenger Status

↓

Update Booking Status

↓

Nếu tất cả vé Refund

↓

Booking REFUNDED

---

# 19. Notification

Refund Requested

Refund Approved

Refund Rejected

Refund Completed

Seat Released

---

# 20. Analytics

ticket_refund_request

ticket_refund_success

ticket_refund_failed

seat_released

refund_completed

---

# 21. Flutter Widget Tree

Scaffold

↓

TicketSummaryCard

↓

RefundSummaryCard

↓

PolicyCard

↓

RefundProgressCard

↓

SupportButton

---

# 22. State Management

TicketRefundBloc

RefundRepository

PaymentRepository

SeatRepository

---

# 23. Performance

Refund Request

<500ms

Seat Release

<500ms

History Update

<1 giây

---

# 24. Accessibility

Readable Policy

Large Font

Screen Reader

Touch Area ≥48dp

---

# 25. Test Cases

✓ Full Refund.

✓ Partial Refund.

✓ Already Refunded.

✓ Checked-in Ticket.

✓ Seat Released.

✓ Retry.

---

# 26. Acceptance Criteria

✓ Ticket cập nhật đúng.

✓ Seat được Release.

✓ Booking đồng bộ.

✓ Payment Refund được Trigger.

✓ Audit Log đầy đủ.

---

# 27. Related Documents

Payment Refund

Ticket Cancellation

Ticket History

Booking History

Seat Management

---

# 28. Future Expansion

Refund Voucher

Travel Credit

Instant Refund

Insurance Refund

Loyalty Compensation

---

# 29. Summary

Ticket Refund quản lý toàn bộ nghiệp vụ hoàn vé của BusZ.

Sau khi yêu cầu hoàn vé được chấp thuận, hệ thống cập nhật trạng thái vé, giải phóng ghế, đồng bộ Booking và kích hoạt quy trình hoàn tiền trong Payment Module, đồng thời lưu đầy đủ lịch sử để phục vụ kiểm tra và hỗ trợ khách hàng.