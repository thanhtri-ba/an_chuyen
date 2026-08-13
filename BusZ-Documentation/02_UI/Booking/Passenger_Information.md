# Passenger Information Screen

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Booking

Screen ID: BOOK-002

Priority: Critical

Status: Draft

---

# 1. Purpose

Passenger Information cho phép người dùng nhập thông tin của từng hành khách tương ứng với từng ghế đã chọn.

Thông tin này sẽ được sử dụng để:

- Tạo vé điện tử.
- Đối chiếu khi lên xe.
- Liên hệ trong trường hợp cần thiết.
- Thống kê hành khách.

---

# 2. Business Goal

Người dùng có thể:

- Nhập thông tin nhanh.
- Sao chép thông tin giữa các hành khách.
- Lưu hành khách thường dùng.
- Kiểm tra dữ liệu trước khi thanh toán.

---

# 3. Actors

Customer

---

# 4. Preconditions

✓ Đã chọn ghế.

✓ Ghế đang được giữ.

✓ Booking Session còn hiệu lực.

---

# 5. UI Layout

AppBar

↓

Trip Summary

↓

Passenger List

↓

Passenger Form

↓

Selected Seats

↓

Continue Button

---

# 6. Components

Trip Summary Card

Passenger Card

Full Name Input

Phone Input

Email Input

Gender Selector

Date Of Birth Picker

Identity Type

Identity Number

Saved Passenger Dropdown

Copy Information Button

Continue Button

---

# 7. Passenger Card

Seat Number

Passenger Name

Passenger Type

Edit Button

Delete Button

Validation Status

---

# 8. Passenger Fields

Full Name

Phone Number

Email

Gender

Birthday

Identity Type

Identity Number

Nationality

Special Request

---

# 9. Passenger Types

Adult

Child

Student

Senior Citizen

Disabled Passenger

---

# 10. Identity Types

Citizen ID

Passport

Driving License

Student Card

Other

---

# 11. Business Rules

BOOK-BR-007

Một ghế tương ứng một hành khách.

BOOK-BR-008

Tên không được để trống.

BOOK-BR-009

Số điện thoại hợp lệ.

BOOK-BR-010

Email hợp lệ (nếu nhập).

BOOK-BR-011

CCCD/Passport không được trùng trong cùng Booking.

BOOK-BR-012

Thông tin phải đầy đủ trước khi tiếp tục.

---

# 12. Business Logic

Open Passenger Screen

↓

Load Selected Seats

↓

Generate Passenger Forms

↓

User Input

↓

Validate

↓

Save Draft

↓

Continue

---

# 13. API

GET /users/passengers

POST /booking/passengers

PUT /booking/passengers/{id}

DELETE /booking/passengers/{id}

---

# 14. Database

passengers

booking_passengers

users

saved_passengers

identity_documents

---

# 15. Validation

Tên tối thiểu 2 ký tự.

Phone đúng định dạng.

Email hợp lệ.

Ngày sinh hợp lệ.

CCCD đúng số ký tự.

Không để trống.

---

# 16. Loading State

Loading Passenger

↓

Loading Saved Passenger

↓

Loading Continue

---

# 17. Empty State

Không có hành khách đã lưu.

↓

Nhập thủ công.

---

# 18. Error State

Sai Email.

Sai Phone.

CCCD trùng.

Server Error.

Network Error.

Booking Timeout.

---

# 19. Success State

Thông tin hợp lệ.

↓

Enable Continue.

---

# 20. Save Passenger

Người dùng có thể:

✓ Lưu hành khách.

✓ Chọn hành khách đã lưu.

✓ Cập nhật.

✓ Xóa.

---

# 21. Navigation

Continue

↓

Contact Information

Back

↓

Seat Selection

---

# 22. Analytics

passenger_screen_view

passenger_saved

saved_passenger_selected

continue_click

validation_error

---

# 23. Flutter Widget Tree

Scaffold

↓

CustomScrollView

↓

TripSummaryCard

↓

PassengerList

↓

PassengerForm

↓

BottomActionBar

---

# 24. State Management

PassengerBloc

PassengerRepository

SavedPassengerRepository

BookingBloc

---

# 25. Performance

Load Passenger

< 1 giây

Validation

Realtime

Auto Save

Có

---

# 26. Accessibility

Touch ≥ 48dp

Screen Reader

Keyboard Navigation

Large Text

---

# 27. Test Cases

✓ Nhập đầy đủ.

✓ Bỏ trống tên.

✓ Sai Phone.

✓ Sai Email.

✓ Lưu hành khách.

✓ Chọn hành khách đã lưu.

✓ Booking Timeout.

---

# 28. Acceptance Criteria

✓ Tạo đúng số Form theo số ghế.

✓ Validation đầy đủ.

✓ Continue đúng.

✓ Không mất dữ liệu khi quay lại.

✓ Không crash.

---

# 29. Related Documents

Seat Selection

Contact Information

Booking Summary

Database

Passenger API

---

# 30. Future Expansion

OCR CCCD

Scan Passport

Import từ Vé cũ

Auto Fill

AI Validation

Face Verification

---

# 31. Summary

Passenger Information thu thập đầy đủ thông tin của từng hành khách để phục vụ việc phát hành vé, xác minh khi lên xe và quản lý hành trình.

Tất cả dữ liệu phải được kiểm tra hợp lệ trước khi chuyển sang bước tiếp theo.