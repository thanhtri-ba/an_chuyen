# API Versioning

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Backend API

Document ID

API-015

Priority

High

Version

1.0

---

# 1. Purpose

API Versioning định nghĩa chiến lược quản lý phiên bản API nhằm đảm bảo:

- Không làm gián đoạn ứng dụng Flutter.
- Hỗ trợ nâng cấp dần.
- Duy trì khả năng tương thích ngược.
- Dễ dàng loại bỏ API cũ.

---

# 2. Version Strategy

BusZ sử dụng URI Versioning.

Ví dụ:

```text
/api/v1/auth/login

/api/v1/bookings

/api/v2/bookings
```

---

# 3. Current Version

Production

```text
v1
```

Development

```text
v2 (nếu có)
```

---

# 4. Version Naming

Định dạng

```text
v1

v2

v3
```

Không dùng

```text
v1.0

v1.2

beta
```

---

# 5. Breaking Changes

Các thay đổi sau bắt buộc tạo phiên bản mới:

- Đổi URL.
- Xóa trường trong Response.
- Thay đổi kiểu dữ liệu.
- Thay đổi Authentication.
- Thay đổi Business Logic gây không tương thích.

---

# 6. Non-Breaking Changes

Không cần tạo phiên bản mới khi:

- Thêm field mới trong Response.
- Thêm endpoint mới.
- Tối ưu hiệu năng.
- Sửa lỗi nội bộ.
- Thêm tùy chọn lọc hoặc sắp xếp.

---

# 7. Backward Compatibility

Nguyên tắc:

- API cũ vẫn hoạt động trong thời gian hỗ trợ.
- Không thay đổi hành vi của API hiện có.
- Không xóa field đang được ứng dụng sử dụng.

---

# 8. Deprecation Policy

Khi API sắp ngừng hỗ trợ:

Response Header

```text
Deprecation: true

Sunset: 2027-01-01
```

Swagger phải đánh dấu:

```text
Deprecated
```

---

# 9. Sunset Policy

Chu kỳ hỗ trợ:

| Version | Support |
|---------|---------|
| v1 | 12 tháng |
| v2 | 12 tháng |
| v3 | Active |

Sau thời gian này:

- Không thêm tính năng.
- Chỉ sửa lỗi nghiêm trọng.
- Sau ngày Sunset sẽ ngừng hoạt động.

---

# 10. Response Headers

Ví dụ:

```text
API-Version: v1

Deprecation: false

Request-Id: abc123
```

---

# 11. Mobile Compatibility

Flutter App gửi:

```text
X-App-Version

1.5.0
```

Backend kiểm tra:

- Phiên bản tối thiểu.
- Phiên bản khuyến nghị.
- Phiên bản không còn hỗ trợ.

---

# 12. API Lifecycle

```text
Design

↓

Development

↓

Testing

↓

Release

↓

Deprecated

↓

Sunset

↓

Removed
```

---

# 13. Migration Strategy

Khi phát hành v2:

- v1 vẫn hoạt động.
- Tài liệu hướng dẫn nâng cấp được cung cấp.
- Ứng dụng Flutter được cập nhật dần.

---

# 14. Documentation

Swagger hiển thị:

```text
/api/v1/docs

/api/v2/docs
```

Mỗi phiên bản có tài liệu riêng.

---

# 15. Webhook Versioning

Webhook URL

```text
/webhooks/v1/payment

/webhooks/v2/payment
```

Không thay đổi payload của phiên bản cũ.

---

# 16. Error Handling

Nếu Client gọi phiên bản không tồn tại:

HTTP

```text
404 Not Found
```

Response

```json
{
  "success": false,
  "error": {
    "code": "API_001",
    "message": "API version not supported."
  }
}
```

---

# 17. Best Practices

✓ Chỉ tăng Major Version khi có Breaking Change.

✓ Không sửa API đã phát hành.

✓ Duy trì tài liệu cho mọi phiên bản.

✓ Thông báo trước khi ngừng hỗ trợ.

✓ Có kế hoạch chuyển đổi rõ ràng.

---

# 18. Test Cases

✓ Access v1.

✓ Access v2.

✓ Invalid Version.

✓ Deprecated Endpoint.

✓ Sunset Endpoint.

✓ Webhook Version.

---

# 19. Acceptance Criteria

✓ Version hoạt động đúng.

✓ Backward Compatibility.

✓ Swagger tách riêng.

✓ Mobile tương thích.

✓ Deprecation Header đầy đủ.

---

# 20. Related Documents

API-002 API Standards

API-014 API Error Codes

API-020 Backend Deployment

---

# 21. Summary

API Versioning giúp BusZ phát triển Backend lâu dài mà không ảnh hưởng đến các ứng dụng Flutter và hệ thống tích hợp. Chiến lược URI Versioning kết hợp với Backward Compatibility và Deprecation Policy đảm bảo quá trình nâng cấp diễn ra an toàn và có thể kiểm soát.