# Email Notification

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-004

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Email Notification quản lý toàn bộ việc gửi email từ hệ thống BusZ.

Email được sử dụng để:

- Xác nhận giao dịch.
- Gửi vé điện tử.
- Thông báo quan trọng.
- Hỗ trợ người dùng.

---

# 2. Objectives

Đảm bảo:

✓ Reliable Delivery.

✓ Template Management.

✓ Delivery Tracking.

✓ Retry Mechanism.

✓ Email History.

---

# 3. Actors

Customer

Notification Service

Email Provider

Booking Service

Payment Service

Ticket Service

Admin

---

# 4. Email Categories

Account Verification

Password Reset

Booking Confirmation

Payment Confirmation

Ticket Delivery

Trip Reminder

Cancellation

Refund

Promotion

Security Alert

System Announcement

---

# 5. Email Lifecycle

Business Event

↓

Generate Email

↓

Load Template

↓

Render Content

↓

Queue

↓

Send

↓

Delivered

↓

Opened

↓

Archived

---

# 6. Email Components

Recipient

Subject

Body

Template

Attachments

Tracking ID

Priority

Status

---

# 7. Attachments

Electronic Ticket (PDF)

Invoice

Booking Summary

Refund Receipt

Travel Guide (Optional)

---

# 8. Business Rules

NOTI-BR-016

Email phải sử dụng Template.

NOTI-BR-017

Email phải ghi Delivery Log.

NOTI-BR-018

Email thất bại phải Retry.

NOTI-BR-019

Attachment phải được kiểm tra trước khi gửi.

NOTI-BR-020

Tôn trọng Notification Preferences.

---

# 9. Business Logic

Receive Event

↓

Generate Email

↓

Load Template

↓

Render Variables

↓

Attach Files

↓

Queue

↓

Send

↓

Save Result

---

# 10. API

POST /notifications/email/send

GET /notifications/email/history

GET /notifications/email/status/{id}

POST /notifications/email/retry

---

# 11. Database

email_notifications

email_templates

email_delivery_logs

email_attachments

notification_queue

audit_logs

---

# 12. Loading State

Generating Email

↓

Rendering Template

↓

Uploading Attachment

↓

Sending

---

# 13. Error State

Template Missing

↓

Fallback Template

---

Attachment Error

↓

Retry

---

SMTP Failed

↓

Retry Queue

---

# 14. Success State

Email Sent

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

OPENED

FAILED

BOUNCED

---

# 16. Retry Strategy

Delivery Failed

↓

Retry Queue

↓

Exponential Backoff

↓

Max Retry

↓

Mark Failed

---

# 17. Tracking

Sent Time

Delivered Time

Opened Time

Bounce Time

Retry Count

Provider Response

---

# 18. Notification Examples

Verify Your Email

Booking Confirmed

Payment Successful

Your Ticket is Ready

Trip Tomorrow

Refund Completed

Security Alert

---

# 19. Analytics

email_sent

email_delivered

email_opened

email_failed

email_bounced

attachment_downloaded

---

# 20. Flutter Widget Tree

Không có màn hình riêng.

Email được quản lý bởi Backend và Notification Service.

---

# 21. State Management

EmailRepository

NotificationRepository

TemplateRepository

AttachmentRepository

---

# 22. Performance

Generate Email

<500ms

Queue Email

<100ms

Delivery

<10 giây

---

# 23. Accessibility

Responsive HTML Email

Dark Mode Support

Alt Text cho Image

Readable Font

---

# 24. Test Cases

✓ Booking Confirmation.

✓ Ticket PDF.

✓ Password Reset.

✓ Retry Email.

✓ Invalid Email.

✓ SMTP Failure.

✓ Attachment Missing.

---

# 25. Acceptance Criteria

✓ Email gửi đúng.

✓ Template đúng.

✓ PDF đính kèm đúng.

✓ Retry hoạt động.

✓ Delivery Log đầy đủ.

---

# 26. Related Documents

Notification Templates

Booking

Payment

Ticket

Notification Preferences

---

# 27. Future Expansion

AMP Email

Interactive Email

Calendar Invitation (.ics)

Multi-language Email

AI Personalized Email

---

# 28. Summary

Email Notification quản lý việc gửi email của BusZ, bao gồm xác nhận tài khoản, đặt vé, thanh toán, vé điện tử và các thông báo quan trọng khác, đồng thời hỗ trợ theo dõi trạng thái gửi và cơ chế gửi lại khi thất bại.