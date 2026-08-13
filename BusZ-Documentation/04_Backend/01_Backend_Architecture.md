# Backend Architecture

Project

BusZ

Module

Backend API

Document ID

API-001

Priority

Critical

Version

1.0

---

# 1. Purpose

Backend BusZ chịu trách nhiệm xử lý toàn bộ nghiệp vụ của hệ thống.

Bao gồm:

- Authentication
- Booking
- Payment
- Ticket
- Notification
- Promotion
- Admin
- Reporting

Backend là trung tâm giao tiếp giữa:

Flutter App

↓

REST API

↓

Business Logic

↓

Database

---

# 2. Technology Stack

Framework

NestJS 11

Language

TypeScript

ORM

Prisma ORM

Database

PostgreSQL

Cache

Redis

Queue

BullMQ

Storage

Supabase Storage

Realtime

Supabase Realtime

Authentication

JWT

API

REST

Documentation

Swagger

Validation

class-validator

Deployment

Docker

Nginx

---

# 3. High Level Architecture

```
Flutter

↓

API Gateway

↓

Authentication

↓

Business Services

↓

Repositories

↓

Prisma

↓

PostgreSQL
```

---

# 4. Backend Layers

Presentation Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

Database

---

# 5. Modules

Authentication

Users

Profile

Trip

Route

Station

Bus

Seat

Booking

Payment

Ticket

Notification

Promotion

Admin

Audit

System

---

# 6. Folder Structure

```
src/

auth/

users/

profile/

booking/

payment/

ticket/

trip/

route/

station/

bus/

seat/

notification/

promotion/

admin/

audit/

common/

config/

prisma/

main.ts
```

---

# 7. Request Lifecycle

```
Flutter

↓

HTTP Request

↓

Controller

↓

DTO Validation

↓

JWT Guard

↓

Service

↓

Repository

↓

Database

↓

Response
```

---

# 8. Dependency Flow

```
Controller

↓

Service

↓

Repository

↓

Prisma
```

Controller không được gọi Database trực tiếp.

---

# 9. Principles

Single Responsibility

Dependency Injection

Clean Architecture

SOLID

Repository Pattern

DTO Pattern

---

# 10. Authentication Flow

```
Login

↓

JWT

↓

Access Token

↓

Refresh Token

↓

Protected API
```

---

# 11. Business Domains

Authentication

Booking

Payment

Ticket

Trip

Promotion

Notification

Reporting

Admin

---

# 12. Communication

REST API

JSON

HTTPS

UTF-8

---

# 13. Logging

Application Log

Audit Log

Error Log

Access Log

Security Log

---

# 14. Error Handling

Validation Error

Authentication Error

Business Error

Database Error

External API Error

---

# 15. Performance

Redis Cache

Connection Pool

Compression

Pagination

Lazy Loading

---

# 16. Security

JWT

HTTPS

Helmet

CORS

Rate Limit

Password Hash

---

# 17. Deployment

Docker

↓

Nginx

↓

Node

↓

PostgreSQL

↓

Redis

---

# 18. Monitoring

Health Check

Prometheus

Grafana

Sentry

---

# 19. Related Documents

Authentication API

Booking API

Payment API

Deployment

---

# 20. Summary

Backend BusZ được thiết kế theo kiến trúc phân lớp (Layered Architecture) kết hợp Repository Pattern và Dependency Injection. Hệ thống được xây dựng trên NestJS, Prisma ORM và PostgreSQL, đảm bảo khả năng mở rộng, bảo trì và xử lý các nghiệp vụ phức tạp của nền tảng đặt vé xe khách liên tỉnh.