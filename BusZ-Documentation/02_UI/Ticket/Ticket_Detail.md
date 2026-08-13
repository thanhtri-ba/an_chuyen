# Ticket Detail

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-002

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Detail hiển thị đầy đủ thông tin của một vé điện tử.

Đây là màn hình được người dùng sử dụng nhiều nhất sau khi đặt vé thành công.

Màn hình phải cung cấp đầy đủ thông tin để:

- Đi xe
- Check-in
- Chứng minh quyền sử dụng vé
- Hủy vé
- Chuyển vé
- Hoàn vé

---

# 2. Business Goal

Người dùng có thể:

✓ Xem vé.

✓ Xem QR.

✓ Xem thông tin chuyến.

✓ Xem hành khách.

✓ Xem trạng thái.

✓ Chia sẻ vé.

✓ Tải PDF.

---

# 3. Actors

Customer

Passenger

Bus Staff

Ticket Inspector

---

# 4. Preconditions

✓ Ticket đã phát hành.

---

# 5. UI Layout

AppBar

↓

Ticket Status

↓

QR Code

↓

Passenger

↓

Trip

↓

Seat

↓

Pickup

↓

Drop-off

↓

Ticket Action

---

# 6. Components

Status Badge

QR Widget

Passenger Card

Trip Card

Seat Card

Pickup Card

Policy Card

Download Button

Share Button

Cancel Button

Transfer Button

---

# 7. Ticket Information

Ticket Number

Booking Code

Transaction ID

Issue Date

Status

QR Expire Time

---

# 8. Passenger Information

Full Name

Phone

Identity

Passenger Type

Seat Number

---

# 9. Trip Information

Bus Company

Bus Type

Route

Departure

Arrival

Departure Date

Departure Time

Arrival Time

---

# 10. Pickup Information

Pickup Point

Pickup Time

Drop-off Point

Drop-off Time

Platform (Future)

---

# 11. Ticket Status

ACTIVE

CHECKED_IN

COMPLETED

CANCELLED

REFUNDED

EXPIRED

INVALID

---

# 12. Business Rules

TICKET-BR-006

Customer chỉ xem Ticket của mình.

TICKET-BR-007

QR chỉ hiển thị với Ticket ACTIVE.

TICKET-BR-008

Ticket CANCELLED không được Check-in.

TICKET-BR-009

Ticket REFUNDED không hợp lệ.

TICKET-BR-010

Mọi thay đổi phải ghi Audit Log.

---

# 13. Business Logic

Open Ticket

↓

Load Ticket

↓

Load QR

↓

Load Booking

↓

Render Screen

---

# 14. API

GET /tickets/{id}

GET /tickets/{id}/detail

GET /tickets/{id}/qr

GET /tickets/{id}/status

---

# 15. Database

tickets

ticket_qr_codes

booking_details

ticket_status_logs

ticket_history

---

# 16. Loading State

Loading Ticket

↓

Loading QR

↓

Loading Detail

---

# 17. Empty State

Không tìm thấy Ticket.

↓

Return Home

---

# 18. Error State

Ticket Invalid

↓

Retry

---

Ticket Deleted

↓

Return Home

---

Network Error

↓

Retry

---

# 19. Success State

Ticket Loaded

↓

QR Loaded

↓

Ready Check-in

---

# 20. Available Actions

View QR

Download PDF

Share Ticket

Transfer Ticket

Cancel Ticket

Refund Ticket

Contact Support

---

# 21. Navigation

Back

↓

Booking History

QR

↓

QR Detail

Cancel

↓

Cancellation

Refund

↓

Refund

---

# 22. Analytics

ticket_detail_view

ticket_download

ticket_share

ticket_cancel

ticket_transfer

---

# 23. Flutter Widget Tree

Scaffold

↓

TicketHeader

↓

StatusBadge

↓

QRCard

↓

PassengerCard

↓

TripCard

↓

SeatCard

↓

BottomActionBar

---

# 24. State Management

TicketDetailBloc

TicketRepository

BookingRepository

QRRepository

---

# 25. Performance

Load Ticket

<1 giây

Load QR

<500ms

Render

60 FPS

---

# 26. Accessibility

Screen Reader

Dynamic Font

Touch ≥48dp

High Contrast

---

# 27. Test Cases

✓ ACTIVE Ticket.

✓ CANCELLED Ticket.

✓ REFUNDED Ticket.

✓ Download.

✓ Share.

✓ Retry.

---

# 28. Acceptance Criteria

✓ Ticket hiển thị đúng.

✓ QR đúng.

✓ Status đúng.

✓ Không Duplicate.

✓ Không crash.

---

# 29. Related Documents

Ticket Architecture

QR Code

Ticket Validation

Check-in

Refund

---

# 30. Future Expansion

Live Bus Tracking

Apple Wallet

Google Wallet

NFC Ticket

Offline Ticket

Digital ID

---

# 31. Summary

Ticket Detail là màn hình trung tâm của Ticket Module.

Mọi thông tin cần thiết để hành khách sử dụng vé đều phải hiển thị rõ ràng, chính xác và đồng bộ theo thời gian thực với trạng thái của Booking và Payment.