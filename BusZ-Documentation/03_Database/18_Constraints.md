# Database Constraints

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Database

Document ID: DB-018

Priority

Critical

Version

1.0

---

# 1. Purpose

Tài liệu này định nghĩa toàn bộ các ràng buộc (Constraints) trong cơ sở dữ liệu BusZ nhằm đảm bảo:

- Tính toàn vẹn dữ liệu (Data Integrity)
- Tính nhất quán (Consistency)
- Tuân thủ quy tắc nghiệp vụ
- Ngăn dữ liệu không hợp lệ

---

# 2. Constraint Types

Hệ thống sử dụng các loại ràng buộc sau:

- Primary Key (PK)
- Foreign Key (FK)
- Unique Constraint
- Check Constraint
- Not Null Constraint
- Default Constraint
- Business Constraint

---

# 3. Primary Key Constraints

Mỗi bảng phải có:

```text
id UUID PRIMARY KEY
```

Quy tắc:

- UUID duy nhất.
- Không được NULL.
- Không thay đổi sau khi tạo.

---

# 4. Foreign Key Constraints

Ví dụ:

```text
bookings.user_id

↓

users.id
```

```text
payments.booking_id

↓

bookings.id
```

```text
tickets.trip_id

↓

trips.id
```

Nguyên tắc:

- Không tham chiếu đến bản ghi không tồn tại.
- Tất cả FK phải có Index.

---

# 5. ON DELETE Strategy

| Quan hệ | ON DELETE |
|----------|-----------|
| users → bookings | RESTRICT |
| users → notifications | CASCADE |
| bookings → tickets | CASCADE |
| bookings → payments | RESTRICT |
| trips → bookings | RESTRICT |
| routes → trips | RESTRICT |
| buses → trips | RESTRICT |
| promotions → bookings | SET NULL |

---

# 6. ON UPDATE Strategy

Mặc định:

```text
ON UPDATE CASCADE
```

Áp dụng cho hầu hết Foreign Key.

---

# 7. Unique Constraints

Ví dụ:

```text
users.email

users.phone

bookings.booking_code

payments.payment_code

tickets.ticket_code

tickets.qr_code

routes.route_code

stations.station_code

buses.bus_code

buses.plate_number

promotions.promotion_code
```

---

# 8. Composite Unique Constraints

```text
trip_id + seat_template_id
```

Không cho phép một ghế xuất hiện nhiều lần trong cùng một Trip.

---

```text
bus_id + seat_number
```

Không cho phép trùng số ghế trong cùng một xe.

---

# 9. Check Constraints

Booking

```sql
CHECK(final_amount >= 0)
```

---

Trip

```sql
CHECK(arrival_time > departure_time)
```

---

Bus

```sql
CHECK(total_seats > 0)
```

---

Station

```sql
CHECK(latitude BETWEEN -90 AND 90)
```

```sql
CHECK(longitude BETWEEN -180 AND 180)
```

---

Promotion

```sql
CHECK(start_at < end_at)
```

---

Payment

```sql
CHECK(amount >= 0)
```

---

# 10. Not Null Constraints

Bắt buộc:

```text
email

booking_code

payment_code

trip_code

route_code

station_name

departure_time

arrival_time

status
```

---

# 11. Default Constraints

Ví dụ:

```text
created_at

↓

NOW()
```

---

```text
status

↓

PENDING
```

---

```text
currency

↓

VND
```

---

```text
email_verified

↓

FALSE
```

---

# 12. Business Constraints

## Booking

Không cho phép:

- Booking Trip đã hủy.
- Booking Trip đã khởi hành.
- Booking khi hết ghế.

---

## Seat

Không cho phép:

- Lock ghế đã BOOKED.
- Đặt ghế đã LOCKED.
- Check-in ghế chưa BOOKED.

---

## Payment

Không cho phép:

- Thanh toán Booking CANCELLED.
- Refund quá số tiền thanh toán.
- Thanh toán nhiều lần cùng một Booking.

---

## Ticket

Không cho phép:

- Hai Ticket cùng QR Code.
- Hai Ticket cùng Passenger trên cùng Booking.
- Check-in hai lần.

---

## Promotion

Không cho phép:

- Promotion hết hạn.
- Vượt Usage Limit.
- Áp dụng cho Booking không đủ điều kiện.

---

# 13. Referential Integrity

Ví dụ:

```text
Booking

↓

Payment

↓

Ticket

↓

Audit
```

Nếu Booking không tồn tại:

↓

Không được tạo Payment.

---

# 14. Soft Delete Rules

Các bảng nghiệp vụ:

```text
deleted_at
```

Thay vì:

```sql
DELETE
```

Sử dụng:

```sql
UPDATE
SET deleted_at=NOW()
```

---

Không áp dụng cho:

```text
audit_logs
```

---

# 15. Validation Rules

Email

RFC5322

---

Phone

E.164

---

Password

BCrypt

---

Money

>=0

---

Seat Number

Regex

```text
A01

B15

C20
```

---

# 16. Constraint Naming

Primary

```text
pk_users
```

Unique

```text
uk_users_email
```

Foreign

```text
fk_booking_user
```

Check

```text
chk_trip_time
```

Default

```text
df_booking_status
```

---

# 17. Error Handling

Ví dụ:

```text
Duplicate Email

↓

409 Conflict
```

```text
Invalid Foreign Key

↓

400 Bad Request
```

```text
Constraint Failed

↓

422 Unprocessable Entity
```

---

# 18. Testing

Kiểm thử:

✓ Duplicate Email.

✓ Duplicate Booking Code.

✓ Invalid Foreign Key.

✓ Invalid Seat.

✓ Invalid QR.

✓ Invalid Amount.

✓ Invalid Route.

✓ Invalid Station.

---

# 19. Best Practices

✓ Không bỏ Foreign Key.

✓ Không bỏ Check Constraint.

✓ Không lưu dữ liệu không hợp lệ.

✓ Business Rule được kiểm tra cả ở Backend và Database.

✓ Sử dụng Soft Delete với dữ liệu nghiệp vụ.

---

# 20. Related Documents

DB-003 Data Dictionary

DB-004 Prisma Schema

DB-017 Index Strategy

---

# 21. Summary

Database Constraints của BusZ đảm bảo dữ liệu luôn chính xác, nhất quán và tuân thủ các quy tắc nghiệp vụ. Việc kết hợp Primary Key, Foreign Key, Unique, Check và Business Constraint giúp hệ thống hoạt động an toàn, hạn chế lỗi dữ liệu và hỗ trợ mở rộng lâu dài.