# Review Process

Project: BusZ - Intercity Bus Ticket Booking Platform

Version: 1.0

Document Type: Business Process

Module: Review & Rating

Priority: Medium

Status: Draft

---

# 1. Purpose

Tài liệu này mô tả toàn bộ quy trình đánh giá (Review) và chấm điểm (Rating) trong hệ thống BusZ.

Module Review giúp:

- Đánh giá chất lượng chuyến xe.
- Đánh giá nhà xe.
- Đánh giá tài xế.
- Tăng độ tin cậy của nền tảng.
- Cung cấp dữ liệu phân tích cho nhà xe.

---

# 2. Scope

Áp dụng cho:

- Mobile Application
- Backend API
- Admin Website
- Database

---

# 3. Actors

Primary

Customer

Secondary

Backend

Bus Company

Admin

Moderation Service

---

# 4. Business Goal

Cho phép khách hàng sau khi hoàn thành chuyến đi:

- Chấm sao.
- Viết nhận xét.
- Đính kèm hình ảnh (Future).
- Báo cáo nội dung không phù hợp.

---

# 5. Review Flow

```mermaid
flowchart TD

Trip Completed

-->

Notification

-->

Open Review Screen

-->

Rate Trip

-->

Write Comment

-->

Submit Review

-->

Backend Validate

-->

Save Review

-->

Update Rating

-->

Show Success
```

---

# 6. Preconditions

Review chỉ được tạo khi:

✓ Booking COMPLETED.

✓ Ticket đã CHECKED_IN.

✓ User là chủ Booking.

✓ Booking chưa từng Review.

---

# 7. Review Categories

Customer có thể đánh giá:

Bus Company

Trip

Driver

Bus

Overall Experience

---

# 8. Rating Scale

1 Star

Very Bad

---

2 Stars

Bad

---

3 Stars

Normal

---

4 Stars

Good

---

5 Stars

Excellent

---

# 9. Review Content

Review bao gồm:

Overall Rating

Title

Comment

Anonymous

Created Time

Updated Time

Language

Future

Images

Videos

Voice Review

---

# 10. Database Tables

reviews

review_images

review_reports

review_likes

review_replies

bookings

users

bus_companies

drivers

---

# 11. Review Status

PENDING

VISIBLE

HIDDEN

REPORTED

DELETED

---

# 12. Validation Rules

Một Booking

↓

Chỉ Review một lần.

---

Comment

Không vượt quá 1000 ký tự.

---

Rating

1 → 5.

---

Review chỉ thuộc User của Booking.

---

# 13. Moderation Rules

Backend kiểm tra:

Spam.

Từ ngữ cấm.

Liên kết độc hại.

Nếu vi phạm:

↓

PENDING REVIEW.

↓

Admin kiểm duyệt.

---

# 14. Report Review

Người dùng có thể báo cáo:

Spam

Fake Review

Offensive Content

Harassment

Other

---

# 15. Admin Features

Xem Review.

Ẩn Review.

Khôi phục Review.

Xóa Review.

Trả lời Review.

Khóa User nếu vi phạm.

---

# 16. Review Statistics

Average Rating

Total Reviews

5-Star Count

4-Star Count

3-Star Count

2-Star Count

1-Star Count

---

# 17. Notification

Trip Completed

↓

Review Reminder

---

Review Submitted

↓

Notification

---

Review Approved

↓

Notification

---

# 18. Logging

Review Created

Review Updated

Review Deleted

Review Reported

Review Approved

Review Hidden

---

# 19. Security

JWT Required

Owner Only

Rate Limit

Spam Detection

Audit Trail

---

# 20. Exception Cases

Booking chưa hoàn thành.

↓

Không được Review.

---

Review đã tồn tại.

↓

Không tạo mới.

---

Comment vi phạm.

↓

Chờ duyệt.

---

# 21. Related APIs

POST /reviews

GET /reviews

GET /reviews/{id}

PUT /reviews/{id}

DELETE /reviews/{id}

POST /reviews/{id}/report

---

# 22. Acceptance Criteria

✓ Chỉ Review sau khi hoàn thành chuyến.

✓ Một Booking chỉ Review một lần.

✓ Rating cập nhật đúng.

✓ Review được lưu.

✓ Notification gửi thành công.

✓ Activity Log được ghi.

---

# 23. Future Expansion

Image Review

Video Review

Driver Review

AI Spam Detection

Review Translation

Review Like

Review Reply

---

# 24. Related Documents

Booking Process

Trip Process

Notification Process

Profile Process

Database Design

API Specification

---

# 25. Summary

Review Process giúp nâng cao chất lượng dịch vụ và tăng tính minh bạch trên nền tảng BusZ.

Mọi đánh giá đều phải được liên kết với Booking thực tế để đảm bảo tính xác thực và hạn chế đánh giá giả mạo.