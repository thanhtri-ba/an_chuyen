# User Flow

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: UI/UX User Journey

Priority: Critical

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ hành trình người dùng (User Journey) trong ứng dụng BusZ.

Đây là tài liệu kết nối giữa:

- UI
- Business
- Backend
- API
- Database

---

# 2. Actors

Guest

Customer

Bus Company Staff

Bus Company Manager

Administrator

---

# 3. Main User Journey

Guest

↓

Splash

↓

Onboarding

↓

Login / Register

↓

Home

↓

Search

↓

Trip Detail

↓

Seat Selection

↓

Passenger Information

↓

Booking Summary

↓

Payment

↓

Ticket

↓

Trip Completed

↓

Review

---

# 4. Guest Flow

Open App

↓

Splash

↓

Onboarding

↓

Skip/Login

↓

Browse Trips

↓

Login Required

↓

Booking

---

# 5. Customer Booking Flow

Login

↓

Home

↓

Search

↓

Trip Detail

↓

Seat Selection

↓

Passenger Information

↓

Contact Information

↓

Booking Summary

↓

Payment

↓

Payment Success

↓

Ticket Generated

↓

Notification

↓

Trip Completed

↓

Review

---

# 6. Ticket Flow

Booking Success

↓

Generate Ticket

↓

Save Database

↓

Show QR

↓

Ticket List

↓

Ticket Detail

↓

Check-in

↓

Completed

---

# 7. Refund Flow

Booking

↓

Cancel

↓

Refund Request

↓

Approve

↓

Refund Success

↓

Notification

---

# 8. Review Flow

Trip Completed

↓

Open Review

↓

Rate

↓

Comment

↓

Submit

↓

Success

---

# 9. Notification Flow

Booking

↓

Payment

↓

Ticket

↓

Reminder

↓

Trip Delay

↓

Refund

↓

Promotion

↓

System

---

# 10. Profile Flow

Profile

↓

Edit Profile

↓

Passenger

↓

Contacts

↓

Reward Points

↓

History

↓

Settings

---

# 11. Staff Flow

Login

↓

Trip List

↓

Passenger List

↓

QR Scan

↓

Check-in

↓

Completed

---

# 12. Bus Company Flow

Dashboard

↓

Trip Management

↓

Driver

↓

Bus

↓

Revenue

↓

Reports

---

# 13. Admin Flow

Dashboard

↓

Users

↓

Companies

↓

Trips

↓

Payments

↓

Refunds

↓

Reports

↓

System Settings

---

# 14. Navigation Flow

Bottom Navigation

Home

↓

Bookings

↓

Notifications

↓

Profile

---

# 15. Error Flow

Network Error

↓

Retry

---

Payment Failed

↓

Retry

↓

Cancel

---

Booking Failed

↓

Choose Another Seat

---

# 16. Loading Flow

Search

↓

Loading

↓

Trip List

---

Payment

↓

Processing

↓

Success

---

# 17. Empty Flow

No Trip

↓

Suggest Route

---

No Ticket

↓

Book Now

---

No Notification

↓

Empty State

---

# 18. Security Flow

Login

↓

JWT

↓

API

↓

Refresh Token

↓

Continue Session

---

# 19. Future User Journey

AI Recommendation

↓

One Click Booking

↓

Digital Wallet

↓

Smart Check-in

↓

Loyalty Upgrade

---

# 20. Related Documents

Business

Design System

API

Database

Flutter Architecture

---

# 21. Summary

User Flow mô tả toàn bộ hành trình sử dụng BusZ từ khi mở ứng dụng đến khi hoàn thành chuyến đi.

Mọi màn hình trong Figma phải tuân theo User Flow này để đảm bảo trải nghiệm người dùng nhất quán.