# Ticket Cancellation

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-007

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Cancellation quản lý toàn bộ quy trình hủy vé của hành khách trước khi chuyến xe khởi hành.

Module này chịu trách nhiệm:

- Kiểm tra điều kiện hủy.
- Áp dụng chính sách hủy.
- Cập nhật trạng thái Ticket.
- Đồng bộ Payment.
- Kích hoạt Refund (nếu có).

---

# 2. Objectives

✓ Hủy vé chính xác.

✓ Đồng bộ dữ liệu.

✓ Không mất lịch sử.

✓ Có Audit Log.

✓ Hỗ trợ hoàn tiền.

---

# 3. Actors

Customer

Customer Support

Admin

Backend

Payment Service

Notification Service

---

# 4. Preconditions

✓ Ticket ACTIVE.

✓ Ticket chưa Check-in.

✓ Vé còn trong thời gian được phép hủy.

---

# 5. Cancellation Flow

Customer

↓

Request Cancellation

↓

Validate Policy

↓

Calculate Refund

↓

Update Ticket

↓

Update Booking

↓

Trigger Refund

↓

Notification

↓

History

---

# 6. Cancellation Types

Customer Cancellation

Operator Cancellation

System Cancellation

Force Cancellation

Emergency Cancellation

---

# 7. Ticket Status

ACTIVE

↓

CANCELLING

↓

CANCELLED

---

ACTIVE

↓

REFUND_PENDING

↓

REFUNDED

---

# 8. Business Rules

TICKET-BR-032

Không hủy Ticket đã Check-in.

TICKET-BR-033

Không hủy Ticket COMPLETED.

TICKET-BR-034

Cancellation Policy do nhà xe cấu hình.

TICKET-BR-035

Refund phụ thuộc Payment Policy.

TICKET-BR-036

Audit Log bắt buộc.

---

# 9. Cancellation Policy

Allowed Until

(Configurable)

Ví dụ

2 giờ trước giờ khởi hành

---

Cancellation Fee

(Configurable)

Theo:

Bus Company

Route

Ticket Type

Promotion

Membership

---

# 10. Business Logic

Receive Request

↓

Validate Ticket

↓

Validate Policy

↓

Calculate Refund

↓

Cancel Ticket

↓

Update Booking

↓

Create Refund Request

↓

Notify Customer

---

# 11. API

POST /tickets/{id}/cancel

GET /tickets/{id}/cancellation

POST /tickets/{id}/undo-cancel

GET /tickets/cancellation-policy

---

# 12. Database

ticket_cancellations

tickets

bookings

refund_requests

audit_logs

notification_logs

---

# 13. Validation

Ticket ACTIVE

↓

Not Checked-in

↓

Cancellation Allowed

↓

Continue

---

# 14. Loading State

Checking Policy

↓

Calculating Refund

↓

Updating Ticket

↓

Sending Notification

---

# 15. Error State

Cancellation Not Allowed

↓

Reject

---

Already Checked-in

↓

Reject

---

Booking Completed

↓

Reject

---

Network Error

↓

Retry

---

# 16. Success State

Ticket Cancelled

↓

Refund Requested

↓

Notification Sent

↓

History Updated

---

# 17. Partial Cancellation

Booking nhiều hành khách

↓

Select Passenger

↓

Cancel Selected Ticket

↓

Update Booking Total

↓

Refund Selected Passenger

---

# 18. Notification

Cancellation Requested

Cancellation Completed

Refund Processing

Refund Completed

Cancellation Failed

---

# 19. Analytics

ticket_cancel_request

ticket_cancel_success

ticket_cancel_failed

partial_cancel

refund_triggered

---

# 20. Flutter Widget Tree

Scaffold

↓

TicketSummaryCard

↓

CancellationPolicyCard

↓

RefundEstimateCard

↓

ReasonSelector

↓

ConfirmCancelButton

---

# 21. State Management

TicketCancellationBloc

TicketRepository

RefundRepository

BookingRepository

---

# 22. Performance

Policy Check

<500ms

Cancellation

<1 giây

Refund Trigger

<1 giây

---

# 23. Accessibility

Readable Policy

Large Font

Screen Reader

Touch Area ≥48dp

---

# 24. Test Cases

✓ Cancel Success.

✓ Checked-in Ticket.

✓ Expired Policy.

✓ Partial Cancellation.

✓ Refund Trigger.

✓ Retry.

---

# 25. Acceptance Criteria

✓ Ticket cập nhật đúng.

✓ Refund được tạo.

✓ Booking đồng bộ.

✓ Audit Log đầy đủ.

✓ Không Duplicate Cancellation.

---

# 26. Related Documents

Ticket Refund

Refund Management

Payment Success

Booking History

Ticket History

---

# 27. Future Expansion

Instant Cancellation

AI Cancellation Prediction

Flexible Ticket

Open Ticket

Insurance Cancellation

---

# 28. Summary

Ticket Cancellation quản lý toàn bộ quy trình hủy vé của BusZ.

Hệ thống phải kiểm tra chính sách hủy, cập nhật trạng thái vé, kích hoạt quy trình hoàn tiền (nếu đủ điều kiện) và đồng bộ với Booking, Payment và lịch sử giao dịch.