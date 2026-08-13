# Address Book

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-006

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Address Book cho phép người dùng lưu các địa chỉ thường sử dụng để chọn nhanh khi đặt vé.

Module này giúp:

- Giảm thời gian nhập liệu.
- Đồng bộ với Booking.
- Hỗ trợ chọn điểm đón/trả.
- Tích hợp bản đồ.

---

# 2. Objectives

Đảm bảo:

✓ Lưu nhiều địa chỉ.

✓ Chọn nhanh.

✓ Đồng bộ Booking.

✓ Hỗ trợ GPS.

✓ Kiểm tra vùng phục vụ.

---

# 3. Actors

Customer

Booking Service

Map Service

Admin

---

# 4. Address Lifecycle

Create Address

↓

Edit Address

↓

Use For Booking

↓

Update

↓

Archive

↓

Delete

---

# 5. Address Types

Home

Work

School

Favorite

Other

---

# 6. Address Information

Address ID

Label

Receiver Name

Phone Number

Province

District

Ward

Street Address

Latitude

Longitude

Note

Default Address

---

# 7. Business Rules

PROFILE-BR-024

Một User có thể lưu nhiều địa chỉ.

PROFILE-BR-025

Chỉ có một địa chỉ mặc định cho mỗi loại.

PROFILE-BR-026

Không được xóa địa chỉ đang được sử dụng trong Booking đang hoạt động.

PROFILE-BR-027

Địa chỉ phải thuộc vùng phục vụ của BusZ hoặc nhà xe.

PROFILE-BR-028

Mọi thay đổi phải ghi Audit Log.

---

# 8. Business Logic

Open Address Book

↓

Load Addresses

↓

Create / Edit

↓

Validate

↓

Save

↓

Sync Booking

---

# 9. Validation

Province Required

↓

District Required

↓

Ward Required

↓

Street Address Required

↓

GPS Validation (Optional)

↓

Service Area Validation

---

# 10. API

GET /profile/addresses

POST /profile/addresses

PUT /profile/addresses/{id}

DELETE /profile/addresses/{id}

PATCH /profile/addresses/{id}/default

GET /profile/addresses/search

---

# 11. Database

addresses

profiles

booking_addresses

service_areas

audit_logs

---

# 12. Loading State

Loading Addresses

↓

Saving Address

↓

Validating Location

↓

Updating Default

---

# 13. Empty State

Chưa có địa chỉ.

↓

Hiển thị:

"Add Your First Address"

---

# 14. Error State

Invalid Address

↓

Show Validation

---

Outside Service Area

↓

Suggest Nearest Pickup Point

---

Network Error

↓

Retry

---

# 15. Success State

Address Saved

↓

Refresh List

↓

Ready For Booking

---

# 16. Map Integration

Search Address

↓

Map Suggestion

↓

Pin Location

↓

Reverse Geocoding

↓

Save Address

---

# 17. Booking Integration

Select Saved Address

↓

Auto Fill Pickup

↓

Auto Fill Drop-off

↓

Continue Booking

---

# 18. Notification

Address Added

Address Updated

Address Deleted

Default Address Changed

---

# 19. Analytics

address_created

address_updated

address_deleted

default_address_changed

saved_address_used

---

# 20. Flutter Widget Tree

Scaffold

↓

AddressList

↓

AddressCard

↓

MapPreview

↓

AddAddressButton

↓

AddressEditorDialog

---

# 21. State Management

AddressBookBloc

AddressRepository

MapRepository

BookingRepository

---

# 22. Performance

Load Addresses

<1 giây

Search Address

<2 giây

Save Address

<500ms

---

# 23. Accessibility

Map Accessibility

Screen Reader

Large Font

Touch Area ≥48dp

---

# 24. Test Cases

✓ Add Address.

✓ Edit Address.

✓ Delete Address.

✓ Set Default.

✓ Outside Service Area.

✓ Search Address.

---

# 25. Acceptance Criteria

✓ Địa chỉ lưu đúng.

✓ Đồng bộ Booking.

✓ GPS chính xác.

✓ Không Duplicate.

✓ Audit Log đầy đủ.

---

# 26. Related Documents

Booking

Map Service

Passenger Management

Travel Preferences

Profile Detail

---

# 27. Future Expansion

Favorite Pickup Points

Route Prediction

Smart Address Suggestion

Shared Address Book

Offline Address Cache

---

# 28. Summary

Address Book giúp người dùng lưu các địa chỉ thường dùng và tích hợp với hệ thống bản đồ để hỗ trợ chọn điểm đón/trả nhanh chóng, chính xác và thuận tiện trong quá trình đặt vé.