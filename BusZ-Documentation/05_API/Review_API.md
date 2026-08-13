# Review API

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Review & Rating Management

Document ID

API-011

Priority

Medium

Version

1.0

---

# 1. Purpose

Review API quản lý toàn bộ hệ thống đánh giá và phản hồi của BusZ.

Hỗ trợ

- Trip Review
- Operator Review
- Driver Review
- Rating
- Comment
- Photo Review
- Review Reply
- Review Report

---

# 2. API Overview

```text
Passenger App

↓

Review API

↓

Review Service

↓

Moderation Service

↓

PostgreSQL
```

---

# 3. Review Flow

```text
Completed Trip

↓

Passenger Review

↓

Validation

↓

Publish Review

↓

Operator Reply

↓

Report (Optional)
```

---

# 4. API Endpoints

```text
POST /reviews

GET /reviews

GET /reviews/{reviewId}

PATCH /reviews/{reviewId}

DELETE /reviews/{reviewId}

POST /reviews/{reviewId}/reply

POST /reviews/{reviewId}/report

GET /operators/{operatorId}/reviews

GET /drivers/{driverId}/reviews

GET /trips/{tripId}/reviews
```

---

# 5. Create Review

Endpoint

```http
POST /api/v1/reviews
```

Description

Tạo đánh giá sau khi hoàn thành chuyến đi.

Authentication

```text
Required
```

---

# 6. Request Body

```json
{
    "bookingId":"BK260700001",
    "rating":5,
    "comment":"Xe sạch sẽ, tài xế thân thiện.",
    "images":[
        "review1.jpg",
        "review2.jpg"
    ]
}
```

---

# 7. Review Information

```text
Review ID

Booking ID

Trip ID

Passenger

Operator

Driver

Rating

Comment

Created Time
```

---

# 8. Rating Scale

```text
1 Star

2 Stars

3 Stars

4 Stars

5 Stars
```

---

# 9. Review Categories

```text
Overall

Driver

Vehicle

Service

Punctuality

Comfort

Cleanliness
```

---

# 10. Update Review

Endpoint

```http
PATCH /api/v1/reviews/{reviewId}
```

Cho phép chỉnh sửa

```text
Rating

Comment

Images
```

Trong vòng

```text
24 Hours
```

---

# 11. Delete Review

Endpoint

```http
DELETE /api/v1/reviews/{reviewId}
```

---

# 12. Review Images

Hỗ trợ

```text
JPEG

PNG

WEBP
```

Maximum

```text
5 Images

10 MB / Image
```

---

# 13. Operator Reply

Endpoint

```http
POST /api/v1/reviews/{reviewId}/reply
```

Chỉ dành cho

```text
Operator

Admin
```

---

# 14. Report Review

Endpoint

```http
POST /api/v1/reviews/{reviewId}/report
```

Lý do

```text
Spam

Offensive Content

Fake Review

Harassment

Other
```

---

# 15. Review Status

```text
PENDING

PUBLISHED

HIDDEN

REPORTED

REMOVED
```

---

# 16. Validation Rules

```text
Completed Booking Required

One Review Per Booking

Rating Required

Rating 1-5

Comment ≤1000 Characters
```

---

# 17. Business Rules

```text
Only Passenger Can Review

Only Completed Trip

One Booking One Review

Operator Cannot Review Own Service

Deleted Reviews Archived
```

---

# 18. Moderation

Hệ thống kiểm tra

```text
Spam Detection

Profanity Filter

Duplicate Content

Reported Reviews
```

---

# 19. Statistics

Hiển thị

```text
Average Rating

Total Reviews

Rating Distribution

Latest Reviews
```

---

# 20. Security

```text
JWT

RBAC

HTTPS

Content Moderation
```

---

# 21. Database Tables

```text
Reviews

ReviewImages

ReviewReplies

ReviewReports

Bookings

Users
```

---

# 22. Error Codes

```text
REVIEW_NOT_FOUND

INVALID_RATING

BOOKING_NOT_COMPLETED

REVIEW_ALREADY_EXISTS

REPORT_FAILED

UNAUTHORIZED
```

---

# 23. Performance Targets

```text
Create Review

<500 ms

Review Query

<300 ms

Reply Review

<500 ms
```

---

# 24. Audit Logs

Theo dõi

```text
Review Created

Review Updated

Review Deleted

Reply Created

Review Reported
```

---

# 25. Integration

```text
Booking API

Trip API

Operator API

Driver API

Notification API
```

---

# 26. Acceptance Criteria

✓ Chỉ khách đã đi mới được đánh giá

✓ Chỉ một đánh giá cho mỗi Booking

✓ Rating hiển thị chính xác

✓ Nhà xe phản hồi được

✓ Review vi phạm được báo cáo

✓ Điểm trung bình cập nhật tự động

---

# 27. Related Documents

Booking API

Trip API

User API

Notification API

Review Business Rules

Database Schema

---

# 28. Summary

Review API quản lý toàn bộ hệ thống đánh giá chất lượng dịch vụ của BusZ. API cho phép hành khách đánh giá chuyến đi, nhà xe và tài xế sau khi hoàn thành hành trình, đồng thời hỗ trợ phản hồi từ nhà xe, kiểm duyệt nội dung và thống kê điểm đánh giá nhằm nâng cao chất lượng dịch vụ và độ tin cậy của nền tảng.