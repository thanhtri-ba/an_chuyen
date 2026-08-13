# Payment Success

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Payment

Document ID: PAYMENT-011

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Payment Success mô tả toàn bộ quy trình sau khi giao dịch thanh toán được xác nhận thành công.

Đây là điểm kết thúc của Payment Module và bắt đầu Ticket Module.

---

# 2. Business Goal

Đảm bảo:

✓ Payment hoàn tất.

✓ Booking được xác nhận.

✓ Vé điện tử được phát hành.

✓ Người dùng nhận thông báo.

✓ Dữ liệu được đồng bộ.

---

# 3. Actors

Customer

Flutter App

Backend

Payment Service

Ticket Service

Notification Service

Reward Service

Audit Service

---

# 4. Preconditions

✓ Payment Success.

✓ Callback Verified.

✓ Booking tồn tại.

✓ Transaction hợp lệ.

---

# 5. Success Flow

Gateway Success

↓

Callback Verified

↓

Update Payment

↓

Update Booking

↓

Issue Ticket

↓

Generate QR

↓

Update Reward Point

↓

Send Notification

↓

Navigate Success Screen

---

# 6. Payment Status

SUCCESS

↓

COMPLETED

---

# 7. Booking Status

CONFIRMED

↓

PAID

↓

READY

---

# 8. Ticket Status

CREATED

↓

ISSUED

↓

ACTIVE

---

# 9. Business Rules

PAY-BR-048

Payment chỉ được cập nhật một lần.

PAY-BR-049

Một Payment chỉ tạo một Ticket.

PAY-BR-050

Reward Point chỉ cộng sau Payment Success.

PAY-BR-051

Booking History phải được cập nhật.

PAY-BR-052

Audit Log bắt buộc.

---

# 10. Business Logic

Verify Callback

↓

Commit Payment

↓

Commit Booking

↓

Issue Ticket

↓

Generate QR

↓

Save History

↓

Reward

↓

Notify User

---

# 11. API

POST /payments/success

GET /payments/{id}

GET /tickets/{ticketId}

GET /booking/history

---

# 12. Database

payments

payment_transactions

tickets

ticket_qr_codes

booking_history

reward_transactions

notifications

audit_logs

---

# 13. Ticket Generation

Booking

↓

Ticket Number

↓

QR Code

↓

Digital Ticket

↓

Save Database

---

# 14. Reward Flow

Payment Success

↓

Calculate Reward

↓

Update Balance

↓

Save Transaction

↓

Notification

---

# 15. Notification

Email

SMS

Push Notification

In-app Notification

---

# 16. Loading State

Generating Ticket

↓

Generating QR

↓

Updating Booking

↓

Sending Notification

---

# 17. Error State

Ticket Generation Failed

↓

Retry

---

Notification Failed

↓

Retry Queue

---

Reward Update Failed

↓

Retry Queue

---

# 18. Success State

Payment Completed

↓

Booking Confirmed

↓

Ticket Active

↓

Navigate Ticket

---

# 19. Navigation

View Ticket

↓

Ticket Detail

Booking History

↓

Booking History

Back Home

↓

Home

---

# 20. Analytics

payment_success

ticket_generated

reward_updated

notification_sent

view_ticket

---

# 21. Flutter Widget Tree

Scaffold

↓

SuccessAnimation

↓

PaymentSummaryCard

↓

TicketPreviewCard

↓

RewardCard

↓

BottomActionBar

---

# 22. State Management

PaymentSuccessBloc

TicketBloc

RewardBloc

NotificationBloc

---

# 23. Performance

Update Payment

<500ms

Generate Ticket

<1s

Generate QR

<1s

Send Notification

<2s

---

# 24. Accessibility

Success Animation

Readable Text

Large Font

Screen Reader

Touch Area ≥ 48dp

---

# 25. Test Cases

✓ Payment Success.

✓ Ticket Generated.

✓ QR Generated.

✓ Reward Updated.

✓ Email Sent.

✓ Push Notification.

✓ Booking History Updated.

---

# 26. Acceptance Criteria

✓ Payment Completed.

✓ Ticket Generated.

✓ Reward Updated.

✓ Notification Sent.

✓ Booking History Updated.

✓ Không Duplicate Ticket.

---

# 27. Related Documents

Payment Processing

Payment Callback

Booking Success

Ticket Module

Reward System

Notification Module

---

# 28. Future Expansion

Digital Invoice

Loyalty Badge

Travel Timeline

Travel Certificate

Carbon Offset Certificate

---

# 29. Summary

Payment Success là bước cuối cùng của Payment Module.

Sau khi giao dịch được xác minh thành công, hệ thống phát hành vé điện tử, cập nhật lịch sử đặt vé, cộng điểm thưởng và gửi đầy đủ thông báo đến khách hàng trước khi chuyển sang Ticket Module.