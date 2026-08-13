# Contact Information Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-003

Priority: Critical

Status: Draft

---

# 1. Purpose

Contact Information cho phép người đặt vé nhập thông tin liên hệ để hệ thống gửi:

- Vé điện tử
- Thông báo chuyến đi
- Thông báo thay đổi lịch trình
- Hóa đơn điện tử
- Thông tin hoàn tiền (nếu có)

Lưu ý:

Người liên hệ (Contact Person) không nhất thiết là hành khách.

---

# 2. Business Goal

Đảm bảo hệ thống luôn có một đầu mối liên hệ chính xác trong suốt quá trình đặt vé và sau chuyến đi.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Đã hoàn thành Passenger Information.

✓ Booking Session còn hiệu lực.

✓ Ghế vẫn đang được giữ.

---

# 5. UI Layout

AppBar

↓

Trip Summary

↓

Contact Form

↓

Notification Preference

↓

Invoice Option

↓

Continue Button

---

# 6. Components

Trip Summary Card

Full Name Input

Phone Number Input

Email Input

Country Code Picker

Notification Switch

Invoice Switch

Continue Button

---

# 7. Contact Fields

Full Name

Phone Number

Email Address

Country Code

Preferred Language

Receive SMS

Receive Email

Receive Push Notification

Need Invoice

Invoice Email

---

# 8. Business Rules

BOOK-BR-013

Tên không được để trống.

BOOK-BR-014

Phone là bắt buộc.

BOOK-BR-015

Email bắt buộc nếu chọn nhận vé qua Email.

BOOK-BR-016

Email hóa đơn có thể khác Email nhận vé.

BOOK-BR-017

Chỉ có một Contact Person cho mỗi Booking.

---

# 9. Business Logic

Load Contact Form

↓

Auto Fill

↓

Validate

↓

Save Contact

↓

Continue

---

# 10. API

GET /users/profile

POST /booking/contact

PUT /booking/contact

---

# 11. Database

users

booking_contacts

booking_notifications

invoice_requests

---

# 12. Validation

Tên ≥ 2 ký tự.

Phone đúng định dạng.

Email đúng định dạng.

Invoice Email hợp lệ.

---

# 13. Loading State

Loading Contact

↓

Auto Fill

↓

Loading Continue

---

# 14. Empty State

Không có thông tin đã lưu.

↓

Hiển thị Form trống.

---

# 15. Error State

Sai Email.

Sai Phone.

Server Error.

Network Error.

Booking Timeout.

---

# 16. Success State

Thông tin liên hệ hợp lệ.

↓

Cho phép tiếp tục.

---

# 17. Notification Preference

Email

SMS

Push Notification

Người dùng có thể bật/tắt từng loại.

---

# 18. Invoice Option

Không cần hóa đơn.

↓

Bỏ qua.

---

Cần hóa đơn.

↓

Hiển thị Email nhận hóa đơn.

---

# 19. Navigation

Continue

↓

Pickup & Drop-off

Back

↓

Passenger Information

---

# 20. Analytics

contact_screen_view

contact_saved

notification_changed

invoice_enabled

continue_click

---

# 21. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

TripSummaryCard

↓

ContactForm

↓

NotificationSettingCard

↓

InvoiceCard

↓

BottomActionBar

---

# 22. State Management

ContactBloc

ContactRepository

BookingBloc

UserRepository

---

# 23. Performance

Auto Fill

< 500ms

Validation

Realtime

---

# 24. Accessibility

Touch Area ≥ 48dp

Screen Reader

Keyboard Navigation

Large Font

---

# 25. Test Cases

✓ Nhập đúng Phone.

✓ Nhập sai Phone.

✓ Nhập đúng Email.

✓ Email hóa đơn khác Email nhận vé.

✓ Bật/Tắt Notification.

✓ Continue.

---

# 26. Acceptance Criteria

✓ Thông tin liên hệ lưu thành công.

✓ Validation đầy đủ.

✓ Notification Preference lưu đúng.

✓ Continue hoạt động.

✓ Không crash.

---

# 27. Related Documents

Passenger Information

Pickup & Drop-off

Booking Summary

Payment

User Profile

---

# 28. Future Expansion

Multiple Contact Person

Emergency Contact

Business Invoice

Corporate Account

Digital Invoice

---

# 29. Summary

Contact Information lưu thông tin của người đại diện cho booking.

Đây là đầu mối duy nhất để BusZ gửi vé điện tử, thông báo chuyến đi, hóa đơn và liên hệ khi có thay đổi hoặc sự cố.