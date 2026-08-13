# Database Overview

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-001

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Database là nền tảng lưu trữ toàn bộ dữ liệu của hệ thống BusZ.

Mọi nghiệp vụ trong hệ thống đều sử dụng Database làm nguồn dữ liệu chính.

---

# 2. Objectives

Đảm bảo:

✓ Data Integrity

✓ High Availability

✓ Scalability

✓ Performance

✓ Security

---

# 3. Technology Stack

Database

PostgreSQL 17+

ORM

Prisma ORM

Migration

Prisma Migration

Connection Pool

PgBouncer

Cache

Redis

Storage

Supabase Storage

---

# 4. Database Architecture

Flutter App

↓

REST API

↓

Business Service

↓

Prisma ORM

↓

PostgreSQL

↓

Supabase Storage

---

# 5. Database Domains

Authentication

Profile

Passenger

Address

Trip

Bus

Route

Seat

Booking

Payment

Ticket

Promotion

Notification

Review

Admin

Audit

System

---

# 6. Core Principles

Normalized

Consistent

Scalable

Secure

Auditable

---

# 7. Naming Convention

Tables

snake_case

Plural

Examples

users

bookings

payment_transactions

ticket_qr_codes

---

Columns

snake_case

Examples

created_at

updated_at

deleted_at

booking_status

---

# 8. Primary Key Strategy

UUID

Ví dụ

id UUID PRIMARY KEY

Không sử dụng Auto Increment cho các bảng chính.

---

# 9. Timestamp Strategy

Mỗi bảng nên có

created_at

updated_at

deleted_at

---

# 10. Soft Delete

Dùng deleted_at.

Không xóa cứng dữ liệu quan trọng.

---

# 11. Audit Strategy

Ghi toàn bộ:

Create

Update

Delete

Login

Payment

Refund

Admin Action

---

# 12. Transaction Strategy

Các nghiệp vụ bắt buộc Transaction

Booking

Payment

Ticket

Refund

Seat Lock

Seat Release

---

# 13. Database Security

TLS

JWT

Encrypted Backup

Encrypted Storage

Least Privilege

Audit Log

---

# 14. Backup Strategy

Daily Backup

Weekly Full Backup

Monthly Archive

Point-in-Time Recovery

---

# 15. Performance Strategy

Indexes

Connection Pool

Caching

Partition (Future)

Read Replica (Future)

---

# 16. Monitoring

CPU

Memory

Slow Query

Connections

Replication

Storage

---

# 17. Database Standards

Third Normal Form (3NF)

Foreign Key Constraint

Unique Constraint

Check Constraint

Index Optimization

---

# 18. Related Documents

ERD

Prisma Schema

API

Backend

Architecture

---

# 19. Future Expansion

Multi-region Database

Read Replica

Database Sharding

Data Warehouse

Event Store

---

# 20. Summary

Database Overview là tài liệu mô tả kiến trúc tổng quan của hệ thống cơ sở dữ liệu BusZ, định nghĩa các nguyên tắc thiết kế, chiến lược bảo mật, hiệu năng, sao lưu và khả năng mở rộng để làm nền tảng cho toàn bộ hệ thống.