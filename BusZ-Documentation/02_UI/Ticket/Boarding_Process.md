# Boarding Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-011

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Boarding Process quản lý toàn bộ quy trình hành khách lên xe từ khi mở boarding đến khi xe khởi hành.

Đây là nghiệp vụ cuối cùng của Ticket Module.

---

# 2. Objectives

Đảm bảo:

✓ Đúng hành khách.

✓ Đúng chuyến.

✓ Đúng ghế.

✓ Không bỏ sót hành khách.

✓ Đồng bộ thời gian thực.

---

# 3. Actors

Passenger

Bus Staff

Driver

Operator

Backend

Notification Service

---

# 4. Preconditions

✓ Trip Ready.

✓ Ticket ACTIVE.

✓ Bus Assigned.

✓ Driver Assigned.

---

# 5. Boarding Flow

Trip Ready

↓

Open Boarding

↓

Passenger Queue

↓

Scan Ticket

↓

Validate

↓

Check-in

↓

Board Bus

↓

Update Seat

↓

Close Boarding

↓

Depart

---

# 6. Boarding Window

Open

↓

30 phút trước giờ khởi hành

(Configurable)

---

Reminder

↓

15 phút trước giờ khởi hành

---

Close

↓

Khi xe khởi hành

Hoặc

Theo cấu hình nhà xe

---

# 7. Boarding Status

NOT_STARTED

↓

OPEN

↓

BOARDING

↓

LAST_CALL

↓

CLOSED

↓

DEPARTED

---

# 8. Passenger Status

WAITING

↓

CHECKED_IN

↓

BOARDED

↓

NO_SHOW

↓

CANCELLED

↓

REFUNDED

---

# 9. Business Rules

TICKET-BR-052

Chỉ Ticket ACTIVE được Boarding.

TICKET-BR-053

Không Boarding Ticket CANCELLED.

TICKET-BR-054

Không Boarding Ticket REFUNDED.

TICKET-BR-055

Không Boarding sau khi Boarding Closed (trừ quyền đặc biệt).

TICKET-BR-056

Mọi Boarding phải ghi Audit Log.

---

# 10. Boarding Logic

Open Boarding

↓

Load Passenger List

↓

Scan Ticket

↓

Validate

↓

Update Passenger

↓

Update Seat

↓

Realtime Dashboard

↓

Departure

---

# 11. API

POST /boarding/open

POST /boarding/check-in

POST /boarding/board

POST /boarding/close

GET /boarding/passengers

GET /boarding/statistics

---

# 12. Database

boarding_sessions

boarding_logs

passenger_boarding

trip_statistics

tickets

audit_logs

---

# 13. Boarding Queue

Waiting Passenger

↓

Ready

↓

Scan QR

↓

Board

↓

Complete

---

# 14. Manual Boarding

QR Failed

↓

Search Ticket

↓

Verify Identity

↓

Manual Approval

↓

Board

---

# 15. Late Passenger

Boarding Open?

↓

Yes

↓

Allow

---

Boarding Closed?

↓

Supervisor Approval

↓

Allow

Hoặc

Reject

---

# 16. No-show

Boarding Closed

↓

Passenger chưa Board

↓

Mark NO_SHOW

↓

Notification

↓

Report

---

# 17. Seat Management

Passenger Boarded

↓

Seat Occupied

↓

Realtime Update

↓

Trip Dashboard

---

# 18. Notification

Boarding Open

Last Call

Boarding Closed

No-show

Trip Departed

---

# 19. Dashboard

Passenger Count

Checked-in

Boarded

Waiting

No-show

Occupancy Rate

---

# 20. Analytics

boarding_started

boarding_completed

late_passenger

manual_boarding

no_show

boarding_closed

---

# 21. Flutter Widget Tree

Scaffold

↓

TripSummaryCard

↓

PassengerList

↓

QRScanner

↓

BoardingStatusCard

↓

StatisticsCard

---

# 22. State Management

BoardingBloc

TicketRepository

TripRepository

PassengerRepository

---

# 23. Performance

Load Passenger List

<1 giây

Scan QR

<300ms

Realtime Update

<500ms

---

# 24. Accessibility

Large QR Scanner

Voice Feedback

Vibration

High Contrast

Touch Area ≥48dp

---

# 25. Test Cases

✓ Boarding Success.

✓ Duplicate Boarding.

✓ Manual Boarding.

✓ Late Passenger.

✓ No-show.

✓ Boarding Closed.

✓ Network Error.

---

# 26. Acceptance Criteria

✓ Boarding chính xác.

✓ Dashboard đồng bộ.

✓ Seat cập nhật.

✓ Audit đầy đủ.

✓ Không Duplicate Boarding.

---

# 27. Related Documents

Ticket Validation

Check-in

QR Code

Trip Management

Notification

---

# 28. Future Expansion

Facial Recognition Boarding

NFC Boarding

Bluetooth Boarding

Smart Gate

Auto Boarding Camera

AI Passenger Recognition

---

# 29. KPIs

Average Boarding Time

Passengers Boarded

Boarding Success Rate

No-show Rate

Average Queue Time

Manual Boarding Rate

---

# 30. Summary

Boarding Process là bước cuối cùng của Ticket Module.

Hệ thống quản lý toàn bộ quá trình hành khách lên xe, từ mở boarding, xác thực vé, cập nhật trạng thái hành khách, quản lý ghế đến đóng boarding và khởi hành, đồng thời cung cấp dữ liệu thời gian thực cho nhân viên và nhà xe.