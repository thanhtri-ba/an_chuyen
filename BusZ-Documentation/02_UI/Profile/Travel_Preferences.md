# Travel Preferences

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-008

Priority: Medium

Status: Draft

Version: 1.0

---

# 1. Purpose

Travel Preferences cho phép người dùng lưu các sở thích du lịch để cá nhân hóa trải nghiệm đặt vé trên BusZ.

Hệ thống sử dụng các tùy chọn này để:

- Đề xuất chuyến xe phù hợp.
- Tự động điền thông tin khi đặt vé.
- Cải thiện trải nghiệm người dùng.

---

# 2. Objectives

Đảm bảo:

✓ Cá nhân hóa trải nghiệm.

✓ Giảm thao tác đặt vé.

✓ Đề xuất thông minh.

✓ Đồng bộ với Booking.

✓ Có thể thay đổi bất kỳ lúc nào.

---

# 3. Actors

Customer

Recommendation Service

Booking Service

Notification Service

---

# 4. Preference Categories

Favorite Bus Companies

Favorite Routes

Preferred Seat

Preferred Pickup Point

Preferred Drop-off Point

Preferred Departure Time

Language

Currency

Notification Preference

---

# 5. Seat Preferences

Window Seat

Aisle Seat

Front Seat

Rear Seat

Upper Deck

Lower Deck

Near Door

No Preference

---

# 6. Travel Time Preferences

Early Morning

Morning

Afternoon

Evening

Night

Flexible

---

# 7. Notification Preferences

Booking Reminder

Trip Reminder

Promotion

Discount

Schedule Change

News

Emergency Notification

---

# 8. Business Rules

PROFILE-BR-034

Preference chỉ áp dụng cho chính tài khoản.

PROFILE-BR-035

Preference không thay đổi Booking đã xác nhận.

PROFILE-BR-036

Có thể đặt lại mặc định bất kỳ lúc nào.

PROFILE-BR-037

Mọi thay đổi phải ghi Audit Log.

---

# 9. Business Logic

Open Preferences

↓

Load Current Preferences

↓

Edit Preferences

↓

Save

↓

Update Recommendation

↓

Sync Booking

---

# 10. API

GET /profile/preferences

PUT /profile/preferences

POST /profile/preferences/reset

GET /profile/preferences/recommendations

---

# 11. Database

travel_preferences

favorite_routes

favorite_bus_companies

seat_preferences

notification_preferences

audit_logs

---

# 12. Loading State

Loading Preferences

↓

Saving Preferences

↓

Updating Recommendations

---

# 13. Empty State

Chưa thiết lập sở thích.

↓

Hiển thị:

"Customize Your Travel Experience"

---

# 14. Error State

Invalid Preference

↓

Show Validation

---

Network Error

↓

Retry

---

Recommendation Service Error

↓

Use Default Recommendation

---

# 15. Success State

Preferences Saved

↓

Recommendations Updated

↓

Ready For Booking

---

# 16. Recommendation Flow

User Preferences

↓

Recommendation Engine

↓

Rank Trips

↓

Display Suggested Trips

---

# 17. Booking Integration

Start Booking

↓

Load Preferences

↓

Auto Select Seat

↓

Auto Fill Pickup

↓

Auto Fill Drop-off

↓

Continue

---

# 18. Notification

Preferences Updated

Recommendation Available

Favorite Route Promotion

---

# 19. Analytics

preference_updated

favorite_route_added

favorite_bus_company_added

preferred_seat_changed

recommendation_clicked

---

# 20. Flutter Widget Tree

Scaffold

↓

PreferenceCategoryList

↓

SeatPreferenceCard

↓

FavoriteRouteCard

↓

NotificationPreferenceCard

↓

SaveButton

---

# 21. State Management

TravelPreferenceBloc

PreferenceRepository

RecommendationRepository

BookingRepository

---

# 22. Performance

Load Preferences

<1 giây

Save Preferences

<500ms

Load Recommendations

<2 giây

---

# 23. Accessibility

Large Font

Screen Reader

Touch Area ≥48dp

Clear Selection Indicator

---

# 24. Test Cases

✓ Save Preferences.

✓ Reset Preferences.

✓ Auto Fill Booking.

✓ Recommendation Update.

✓ Network Retry.

✓ Invalid Preference.

---

# 25. Acceptance Criteria

✓ Preference lưu đúng.

✓ Recommendation cập nhật.

✓ Đồng bộ Booking.

✓ Audit Log đầy đủ.

✓ Không crash.

---

# 26. Related Documents

Booking

Address Book

Passenger Management

Notification Preferences

Loyalty Program

---

# 27. Future Expansion

AI Travel Recommendation

Weather-based Suggestions

Travel Habit Analysis

Personalized Promotions

Carbon Footprint Preference

---

# 28. Summary

Travel Preferences giúp BusZ cá nhân hóa trải nghiệm đặt vé bằng cách lưu các sở thích của người dùng, từ ghế ngồi, tuyến xe, nhà xe đến thời gian khởi hành và tùy chọn nhận thông báo, qua đó giảm thao tác và nâng cao chất lượng đề xuất chuyến đi.