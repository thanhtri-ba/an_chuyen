# Passenger Management

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-005

Priority: Critical

Status: Draft

Version: 1.0

---

# 1. Purpose

Passenger Management cho phép người dùng quản lý danh sách hành khách thường xuyên để đặt vé nhanh hơn.

Thông tin hành khách được lưu độc lập với Booking và có thể tái sử dụng cho nhiều lần đặt vé.

---

# 2. Objectives

Đảm bảo:

✓ Quản lý nhiều hành khách.

✓ Đặt vé nhanh.

✓ Giảm nhập liệu.

✓ Đồng bộ Booking.

✓ Lưu lịch sử thay đổi.

---

# 3. Actors

Customer

Customer Support

Admin

---

# 4. Passenger Lifecycle

Create Passenger

↓

Edit Passenger

↓

Use For Booking

↓

Update

↓

Archive

↓

Delete

---

# 5. Passenger Types

Adult

Child

Infant

Senior Citizen

Student

Special Assistance (Future)

---

# 6. Passenger Information

Passenger ID

Full Name

Date of Birth

Gender

Phone Number (Optional)

Email (Optional)

Nationality

Identity Document

Passenger Type

Relationship

Default Passenger

---

# 7. Relationship Types

Self

Father

Mother

Spouse

Child

Sibling

Friend

Other

---

# 8. Business Rules

PROFILE-BR-019

Một tài khoản có thể lưu nhiều hành khách.

PROFILE-BR-020

Một hành khách có thể dùng cho nhiều Booking.

PROFILE-BR-021

Không được xóa hành khách đang được sử dụng trong Booking chưa hoàn thành.

PROFILE-BR-022

Có thể đặt một hành khách làm mặc định.

PROFILE-BR-023

Mọi thay đổi phải ghi Audit Log.

---

# 9. Business Logic

Open Passenger List

↓

Load Passengers

↓

Create / Edit

↓

Validate

↓

Save

↓

Sync Booking

---

# 10. Validation Rules

Full Name

2–100 ký tự

---

Date of Birth

Không lớn hơn ngày hiện tại

---

Identity Number

Không trùng trong cùng tài khoản

---

Passenger Type

Phù hợp với độ tuổi (nếu áp dụng)

---

# 11. API

GET /profile/passengers

POST /profile/passengers

PUT /profile/passengers/{id}

DELETE /profile/passengers/{id}

PATCH /profile/passengers/{id}/default

---

# 12. Database

passengers

profiles

booking_passengers

passenger_history

audit_logs

---

# 13. Loading State

Loading Passenger List

↓

Saving Passenger

↓

Deleting Passenger

---

# 14. Empty State

Chưa có hành khách.

↓

Hiển thị:

"Add Your First Passenger"

---

# 15. Error State

Invalid Information

↓

Show Validation

---

Passenger In Use

↓

Cannot Delete

---

Network Error

↓

Retry

---

# 16. Success State

Passenger Saved

↓

Refresh List

↓

Ready For Booking

---

# 17. Quick Booking

Select Passenger

↓

Auto Fill Information

↓

Continue Booking

---

# 18. Notification

Passenger Added

Passenger Updated

Passenger Deleted

Default Passenger Changed

---

# 19. Analytics

passenger_created

passenger_updated

passenger_deleted

default_passenger_changed

quick_booking_used

---

# 20. Flutter Widget Tree

Scaffold

↓

PassengerList

↓

PassengerCard

↓

AddPassengerButton

↓

EditPassengerDialog

↓

DeleteConfirmationDialog

---

# 21. State Management

PassengerBloc

PassengerRepository

BookingRepository

ProfileRepository

---

# 22. Performance

Load Passenger List

<1 giây

Save Passenger

<500ms

Delete Passenger

<500ms

---

# 23. Accessibility

Large Font

Screen Reader

Touch Area ≥48dp

Keyboard Navigation

---

# 24. Test Cases

✓ Add Passenger.

✓ Edit Passenger.

✓ Delete Passenger.

✓ Default Passenger.

✓ Passenger In Use.

✓ Quick Booking.

---

# 25. Acceptance Criteria

✓ Passenger lưu đúng.

✓ Đồng bộ Booking.

✓ Không Duplicate.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 26. Related Documents

Profile Detail

Edit Profile

Booking

Ticket

Identity Verification

---

# 27. Future Expansion

Import Contacts

Family Group

Corporate Travelers

Travel Companion

Shared Passenger List

---

# 28. Summary

Passenger Management giúp người dùng lưu và quản lý danh sách hành khách thường xuyên, hỗ trợ đặt vé nhanh, giảm thao tác nhập liệu và đồng bộ với toàn bộ quy trình Booking và Ticket của BusZ.