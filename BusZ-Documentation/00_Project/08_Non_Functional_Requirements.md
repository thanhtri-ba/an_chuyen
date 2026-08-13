# Non Functional Requirements

Project: BusZ
Version: 1.0
Status: Draft

---

# 1. Introduction

## 1.1 Purpose

Tài liệu này mô tả toàn bộ yêu cầu phi chức năng của hệ thống BusZ.

Các yêu cầu này đảm bảo hệ thống:

- Nhanh
- Ổn định
- Bảo mật
- Có khả năng mở rộng
- Dễ bảo trì
- Dễ triển khai

---

## 1.2 Scope

Áp dụng cho

- Flutter Mobile
- Backend REST API
- PostgreSQL Database
- Admin Website
- Cloud Infrastructure

---

# 2. Performance Requirements

## 2.1 Authentication

Login

≤ 1 second

Register

≤ 2 seconds

Refresh Token

≤ 500 ms

---

## 2.2 Search

Search Route

≤ 2 seconds

Trip Detail

≤ 1 second

Search Result

≤ 2 seconds

Calendar Price

≤ 2 seconds

---

## 2.3 Booking

Create Booking

≤ 3 seconds

Seat Lock

≤ 500 ms

Seat Release

≤ 2 seconds

Booking History

≤ 2 seconds

---

## 2.4 Payment

Payment Create

≤ 3 seconds

Callback

≤ 10 seconds

Refund

≤ 30 seconds

---

# 3. Scalability

Hệ thống phải có khả năng mở rộng.

Có thể thêm

- Nhà xe

- Xe

- Tuyến

- Quốc gia

- Tiền tệ

- Payment Gateway

không cần thay đổi kiến trúc.

---

# 4. Availability

Production

99.5%

Maintenance

Thông báo trước.

Recovery

≤ 30 phút.

---

# 5. Reliability

Không được:

- Booking trùng.

- Payment trùng.

- QR Code trùng.

- Ghế bị double booking.

---

# 6. Security

## Authentication

JWT

Refresh Token

BCrypt

OTP

---

## Authorization

RBAC

Customer

Staff

Operator

Admin

Super Admin

---

## Encryption

HTTPS

TLS

Password Hash

Sensitive Data Encryption

---

## Input Validation

Email

Phone

Password

Booking

Payment

Review

Promotion

---

## Rate Limiting

Login

Search

Payment

OTP

---

## CORS

Whitelist Domain

---

## XSS Protection

Escape HTML

Sanitize Input

---

## SQL Injection

Prisma ORM

Prepared Statement

---

## CSRF

Admin Website

---

# 7. Data Integrity

Transaction

Booking

↓

Payment

↓

Ticket

↓

Notification

Rollback nếu lỗi.

---

# 8. Consistency

Booking Status

Payment Status

Ticket Status

luôn đồng bộ.

---

# 9. Backup

Daily Backup

Weekly Full Backup

Monthly Archive

Retention

90 Days

---

# 10. Disaster Recovery

Database Restore

Storage Restore

Configuration Restore

---

# 11. Logging

Authentication

Booking

Payment

Refund

Review

Promotion

Notification

System Error

---

# 12. Monitoring

CPU

RAM

API

DB

Network

Storage

Queue

---

# 13. Audit Trail

Lưu toàn bộ:

Admin Action

Login

Booking

Payment

Refund

Role Change

Permission Change

---

# 14. Error Handling

Không trả StackTrace.

Mã lỗi chuẩn.

HTTP Status chuẩn.

Error Code.

---

# 15. Compatibility

Android

Android 10+

iOS

iOS 16+

Browser

Chrome

Edge

Firefox

Safari

---

# 16. Accessibility

Font Scale

Color Contrast

Screen Reader

Keyboard Navigation

---

# 17. Localization

Version 1

Vietnamese

Version 2

English

Version 3

Thai

Khmer

Chinese

---

# 18. Maintainability

Clean Architecture

SOLID

Repository Pattern

Service Layer

Dependency Injection

Modular

---

# 19. Testability

Unit Test

Integration Test

Widget Test

API Test

Performance Test

Security Test

---

# 20. Deployment

Docker

Nginx

GitHub Actions

CI/CD

HTTPS

Reverse Proxy

---

# 21. Coding Standard

Flutter

Effective Dart

Backend

ESLint

Prisma Style Guide

Git Flow

Conventional Commit

---

# 22. Documentation

Swagger

OpenAPI

Markdown

ERD

Sequence Diagram

Activity Diagram

Use Case

---

# 23. Privacy

Email

Phone

ID Card

không hiển thị công khai.

---

# 24. Compliance

Luật Việt Nam

GDPR Ready

PCI DSS Ready

---

# 25. Future Requirements

Redis

Kafka

ElasticSearch

Microservice

GraphQL

Realtime

AI Recommendation

Live Tracking

---

# 26. Success Criteria

API

99.5%

Search

<2s

Booking Success

99%

Payment Success

99%

Crash Rate

<1%

---

# 27. Summary

Các yêu cầu phi chức năng này là nền tảng cho việc thiết kế kiến trúc BusZ.

Mọi module trong hệ thống phải tuân thủ các yêu cầu được mô tả trong tài liệu này.