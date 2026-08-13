# Notification Architecture

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Notification

Document ID: NOTIFICATION-001

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Notification Module quản lý toàn bộ hệ thống thông báo của BusZ.

Mục tiêu:

- Gửi thông báo đúng người.
- Gửi đúng thời điểm.
- Đảm bảo khả năng theo dõi.
- Hỗ trợ nhiều kênh thông báo.

---

# 2. Objectives

Đảm bảo:

✓ Real-time Notification.

✓ Reliable Delivery.

✓ Multi-channel.

✓ User Preference.

✓ Notification History.

---

# 3. Scope

Bao gồm

In-App Notification

Push Notification

Email

SMS

Notification History

Notification Preferences

Notification Templates

Không bao gồm

Marketing Campaign Management

Live Chat

Customer Support Ticket

---

# 4. Actors

Customer

Admin

Notification Service

Booking Service

Payment Service

Ticket Service

Promotion Service

---

# 5. Notification Lifecycle

Event Occurred

↓

Create Notification

↓

Determine Channel

↓

Send

↓

Delivered

↓

Read

↓

Archived

---

Expired

↓

Deleted

---

# 6. Notification Channels

In-App

Push Notification

Email

SMS

Future

WhatsApp

Telegram

Zalo OA

---

# 7. Notification Sources

Authentication

Booking

Payment

Ticket

Promotion

Profile

System

Admin Announcement

---

# 8. Core Components

Notification Service

Template Engine

Preference Engine

Delivery Service

Retry Queue

History Service

Analytics

---

# 9. Architecture

Business Event

↓

Notification Service

↓

Template Engine

↓

Channel Router

↓

Delivery Provider

↓

Customer

---

# 10. Business Rules

NOTI-BR-001

Notification phải thuộc một User.

NOTI-BR-002

Notification phải có loại.

NOTI-BR-003

Notification phải ghi lịch sử gửi.

NOTI-BR-004

User Preference phải được áp dụng trước khi gửi.

NOTI-BR-005

Notification thất bại phải Retry.

---

# 11. API

GET /notifications

GET /notifications/unread

POST /notifications/read

POST /notifications/read-all

DELETE /notifications/{id}

---

# 12. Database

notifications

notification_templates

notification_preferences

notification_logs

notification_queue

audit_logs

---

# 13. Security

JWT

RBAC

Encrypted Payload

HTTPS

Audit Log

---

# 14. Performance

Notification Creation

<100ms

Push Delivery

<3 giây

Load Notification Center

<1 giây

---

# 15. Analytics

notification_sent

notification_delivered

notification_opened

notification_failed

notification_deleted

---

# 16. Related Documents

Booking

Payment

Ticket

Profile

Settings

---

# 17. Future Expansion

AI Notification Priority

Smart Reminder

Geo Notification

Location-based Alert

Scheduled Campaign

---

# 18. Summary

Notification Architecture là nền tảng quản lý toàn bộ hệ thống thông báo của BusZ, hỗ trợ nhiều kênh gửi, đảm bảo khả năng mở rộng, theo dõi và cá nhân hóa theo từng người dùng.