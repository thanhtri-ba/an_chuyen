# SMS Notification

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-005

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

SMS Notification chịu trách nhiệm gửi tin nhắn SMS đến người dùng khi cần các thông báo quan trọng hoặc yêu cầu xác thực.

SMS được ưu tiên sử dụng trong các trường hợp khẩn cấp hoặc khi người dùng không thể nhận Push Notification hay Email.

---

# 2. Objectives

Đảm bảo:

✓ Reliable Delivery.

✓ OTP Verification.

✓ Emergency Notification.

✓ SMS History.

✓ Cost Optimization.

---

# 3. Actors

Customer

Notification Service

SMS Gateway

Authentication Service

Booking Service

Admin

---

# 4. SMS Categories

OTP Verification

Password Reset

Booking Confirmation

Payment Success

Trip Reminder

Schedule Changed

Emergency Notice

Security Alert

---

# 5. SMS Lifecycle

Business Event

↓

Generate SMS

↓

Load Template

↓

Validate Phone Number

↓

Queue

↓

Send

↓

Delivered

↓

Archived

---

# 6. SMS Components

Recipient

Message

Template

Priority

Language

Gateway

Status

Tracking ID

---

# 7. SMS Priority

Critical

High

Normal

Low

---

# 8. Business Rules

NOTI-BR-021

OTP chỉ có hiệu lực trong thời gian cấu hình.

NOTI-BR-022

SMS phải được ghi Delivery Log.

NOTI-BR-023

SMS thất bại phải Retry.

NOTI-BR-024

Không gửi SMS quảng cáo nếu người dùng từ chối.

NOTI-BR-025

Gateway được chọn theo cấu hình hệ thống.

---

# 9. Business Logic

Receive Event

↓

Generate SMS

↓

Select Gateway

↓

Queue

↓

Send

↓

Track Status

↓

Save Result

---

# 10. API

POST /notifications/sms/send

POST /notifications/sms/otp

GET /notifications/sms/history

GET /notifications/sms/status/{id}

POST /notifications/sms/retry

---

# 11. Database

sms_notifications

sms_templates

sms_delivery_logs

sms_gateways

notification_queue

audit_logs

---

# 12. Loading State

Generating SMS

↓

Selecting Gateway

↓

Sending SMS

↓

Waiting Delivery

---

# 13. Error State

Invalid Phone Number

↓

Show Validation

---

Gateway Unavailable

↓

Switch Gateway

---

Delivery Failed

↓

Retry Queue

---

# 14. Success State

SMS Sent

↓

Delivered

↓

History Updated

---

# 15. Delivery Status

QUEUED

SENDING

SENT

DELIVERED

FAILED

EXPIRED

---

# 16. Retry Strategy

Send Failed

↓

Retry Queue

↓

Exponential Backoff

↓

Max Retry

↓

Mark Failed

---

# 17. Cost Optimization

Batch SMS

↓

Preferred Gateway

↓

Fallback Gateway

↓

Delivery Report

---

# 18. Notification Examples

OTP Code

Booking Confirmed

Trip Reminder

Bus Delayed

Trip Cancelled

Emergency Notice

---

# 19. Analytics

sms_sent

sms_delivered

sms_failed

otp_sent

otp_verified

gateway_switched

---

# 20. Flutter Widget Tree

Không có màn hình riêng.

SMS được quản lý bởi Backend và Notification Service.

---

# 21. State Management

SMSRepository

NotificationRepository

GatewayRepository

OTPRepository

---

# 22. Performance

Generate SMS

<200ms

Queue SMS

<100ms

Delivery

<30 giây

OTP Delivery

<10 giây

---

# 23. Accessibility

Ngôn ngữ theo cấu hình người dùng.

Tin nhắn ngắn gọn, dễ đọc.

Không chứa thông tin nhạy cảm.

---

# 24. Test Cases

✓ Send OTP.

✓ Booking SMS.

✓ Payment SMS.

✓ Retry SMS.

✓ Invalid Phone.

✓ Gateway Failure.

✓ Emergency SMS.

---

# 25. Acceptance Criteria

✓ SMS gửi đúng.

✓ OTP hoạt động.

✓ Retry hoạt động.

✓ Delivery Log đầy đủ.

✓ Gateway Failover hoạt động.

---

# 26. Related Documents

Authentication

Booking

Payment

Ticket

Notification Preferences

---

# 27. Future Expansion

Multi-Gateway Load Balancing

Rich SMS (RCS)

International SMS Routing

AI SMS Optimization

Voice Call Notification

---

# 28. Summary

SMS Notification cung cấp cơ chế gửi tin nhắn xác thực và thông báo quan trọng đến người dùng, đảm bảo khả năng liên lạc ngay cả khi Push Notification hoặc Email không khả dụng, đồng thời hỗ trợ theo dõi trạng thái gửi, tối ưu chi phí và cơ chế gửi lại khi cần thiết.