# Ticket Transfer

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Ticket

Document ID: TICKET-006

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Ticket Transfer cho phép chủ vé chuyển quyền sử dụng vé cho người khác trước khi chuyến xe khởi hành.

Việc chuyển vé phải đảm bảo:

- Đúng người.
- Đúng chuyến.
- Không gian lận.
- Có thể theo dõi lịch sử.

---

# 2. Objectives

✓ Chuyển vé an toàn.

✓ Không mất dữ liệu.

✓ Có xác nhận người nhận.

✓ Có lịch sử chuyển vé.

✓ Chống chuyển vé trái phép.

---

# 3. Actors

Ticket Owner

Recipient

Customer Support

Backend

Notification Service

Audit Service

---

# 4. Preconditions

✓ Ticket ACTIVE.

✓ Ticket chưa Check-in.

✓ Ticket chưa hết hạn.

✓ Vé được phép chuyển.

---

# 5. Transfer Flow

Owner

↓

Request Transfer

↓

Validate Ticket

↓

Validate Policy

↓

Generate Transfer Request

↓

Recipient Accept

↓

Transfer Ownership

↓

Update Ticket

↓

Notification

---

# 6. Transfer Status

REQUESTED

↓

PENDING

↓

ACCEPTED

↓

COMPLETED

---

REQUESTED

↓

CANCELLED

---

REQUESTED

↓

EXPIRED

---

REJECTED

---

# 7. Transfer Information

Transfer ID

Ticket ID

Booking ID

Current Owner

New Owner

Created Time

Expired Time

Status

Transfer Reason

---

# 8. Recipient Information

Full Name

Phone Number

Email

Identity Number (Optional)

Relationship (Optional)

---

# 9. Business Rules

TICKET-BR-026

Chỉ chủ vé mới được yêu cầu chuyển.

TICKET-BR-027

Không chuyển vé đã Check-in.

TICKET-BR-028

Không chuyển vé đã Refund.

TICKET-BR-029

Người nhận phải xác nhận.

TICKET-BR-030

Mọi Transfer phải ghi Audit Log.

TICKET-BR-031

Số lần chuyển vé tối đa được cấu hình theo chính sách.

---

# 10. Business Logic

Receive Request

↓

Validate Ticket

↓

Validate Policy

↓

Create Transfer Request

↓

Notify Recipient

↓

Recipient Accept

↓

Transfer Ownership

↓

Update Ticket

↓

Audit Log

---

# 11. API

POST /tickets/{id}/transfer

GET /tickets/transfers/{id}

POST /tickets/transfers/{id}/accept

POST /tickets/transfers/{id}/reject

POST /tickets/transfers/{id}/cancel

---

# 12. Database

ticket_transfers

tickets

users

notifications

audit_logs

transfer_history

---

# 13. Validation

Ticket ACTIVE

↓

Not Checked-in

↓

Transfer Allowed

↓

Recipient Valid

↓

Continue

---

# 14. Loading State

Creating Transfer

↓

Sending Notification

↓

Waiting Recipient

↓

Updating Ticket

---

# 15. Error State

Ticket Invalid

↓

Reject

---

Already Checked-in

↓

Reject

---

Transfer Expired

↓

Reject

---

Recipient Invalid

↓

Retry

---

# 16. Success State

Recipient Accepted

↓

Ownership Updated

↓

Notification Sent

---

# 17. Transfer Expiration

Default

24 Hours

Hoặc

Đến trước giờ khởi hành

(Configurable)

---

# 18. Notification

Transfer Request

Transfer Accepted

Transfer Rejected

Transfer Cancelled

Transfer Completed

---

# 19. Transfer History

Old Owner

New Owner

Transfer Time

Transfer Reason

Operator

Status

---

# 20. Analytics

ticket_transfer_request

ticket_transfer_accept

ticket_transfer_reject

ticket_transfer_cancel

ticket_transfer_complete

---

# 21. Flutter Widget Tree

Scaffold

↓

TicketSummaryCard

↓

RecipientForm

↓

TransferPolicyCard

↓

TransferButton

↓

TransferStatusCard

---

# 22. State Management

TicketTransferBloc

TicketRepository

NotificationRepository

TransferRepository

---

# 23. Performance

Create Request

<500ms

Accept Transfer

<1 giây

Notification

<2 giây

---

# 24. Accessibility

Readable Policy

Large Font

Screen Reader

Touch Area ≥48dp

---

# 25. Test Cases

✓ Transfer Success.

✓ Reject Transfer.

✓ Cancel Transfer.

✓ Transfer Expired.

✓ Checked-in Ticket.

✓ Invalid Recipient.

---

# 26. Acceptance Criteria

✓ Transfer đúng.

✓ Ownership cập nhật.

✓ Audit Log đầy đủ.

✓ Notification hoạt động.

✓ Không Duplicate Transfer.

---

# 27. Related Documents

Ticket Detail

Ticket Security

Ticket History

Ticket Cancellation

Refund

---

# 28. Future Expansion

Transfer Fee

Marketplace Transfer

Transfer Approval Workflow

Corporate Ticket Transfer

Gift Ticket

Multi-passenger Transfer

---

# 29. Summary

Ticket Transfer cho phép chuyển quyền sử dụng vé giữa hai người dùng theo chính sách của BusZ hoặc nhà xe.

Hệ thống phải xác minh điều kiện chuyển vé, yêu cầu người nhận xác nhận và lưu toàn bộ lịch sử chuyển vé để đảm bảo tính minh bạch và khả năng kiểm tra sau này.