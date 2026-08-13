# Card & Signer Service - API Specification

**Version:** 1.0  
**Component:** REST API Documentation  
**Technology:** Spring Boot 3.x  
**Base URL:** `https://api.busz.com/api/v1`  
**Authentication:** Bearer Token (JWT)  
**Status:** Draft

---

## 1. Overview

Tài liệu này định nghĩa toàn bộ API endpoints cho Card Service & Digital Signer Service.

---

## 2. Authentication & Authorization

### 2.1 Header

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Request-ID: <uuid> (optional)
X-API-Version: v1
```

### 2.2 JWT Claims

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "roles": ["CUSTOMER", "ADMIN"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## 3. Error Response Format

### 3.1 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "CARD_NOT_FOUND",
    "message": "Card not found",
    "details": {
      "card_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "timestamp": "2026-08-13T10:30:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 3.2 Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_REQUEST | 400 | Invalid request parameter |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Permission denied |
| CARD_NOT_FOUND | 404 | Card not found |
| CARD_EXPIRED | 400 | Card expired |
| INVALID_CARD | 400 | Card validation failed |
| DUPLICATE_CARD | 409 | Card already exists |
| PAYMENT_FAILED | 402 | Payment processing failed |
| ENCRYPTION_ERROR | 500 | Encryption/Decryption error |
| DATABASE_ERROR | 500 | Database operation failed |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

---

## 4. Card Management APIs

### 4.1 Add Card

**Endpoint:** `POST /cards`

**Description:** Thêm thẻ thanh toán mới cho người dùng

**Request Body:**

```json
{
  "card_number": "4532015112830366",
  "card_holder_name": "JOHN NGUYỄN",
  "expiry_month": 12,
  "expiry_year": 2027,
  "cvv": "123",
  "is_default": false,
  "card_nickname": "My Visa"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "card_token": "tok_visa_4532",
    "last_four": "0366",
    "card_type": "VISA",
    "issuer": "Vietcombank",
    "expiry_month": 12,
    "expiry_year": 2027,
    "card_nickname": "My Visa",
    "is_default": false,
    "is_active": true,
    "created_at": "2026-08-13T10:30:00Z",
    "updated_at": "2026-08-13T10:30:00Z"
  }
}
```

**Status Codes:**
- `201 Created` - Card added successfully
- `400 Bad Request` - Invalid card data
- `409 Conflict` - Card already exists
- `500 Internal Server Error` - Server error

**Validation Rules:**

```
- Card number: Luhn algorithm + valid BIN
- Expiry month: 1-12
- Expiry year: >= current year
- CVV: 3-4 digits
- Card holder: 3-50 characters
- Card nickname: max 50 characters
- Not expired
```

---

### 4.2 Get User Cards

**Endpoint:** `GET /cards`

**Description:** Lấy danh sách thẻ của người dùng

**Query Parameters:**

```
- page: int (default: 1)
- limit: int (default: 10, max: 100)
- sort_by: string (default: created_at)
  - created_at, last_four, card_type, is_default
- status: string (default: active)
  - active, expired, deleted
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "550e8400-e29b-41d4-a716-446655440001",
        "card_token": "tok_visa_4532",
        "last_four": "0366",
        "card_type": "VISA",
        "issuer": "Vietcombank",
        "expiry_month": 12,
        "expiry_year": 2027,
        "card_nickname": "My Visa",
        "is_default": true,
        "is_active": true,
        "created_at": "2026-08-13T10:30:00Z",
        "updated_at": "2026-08-13T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

---

### 4.3 Get Card Detail

**Endpoint:** `GET /cards/{id}`

**Description:** Lấy chi tiết thẻ cụ thể

**Path Parameters:**

```
- id: UUID (required) - Card ID
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "card_token": "tok_visa_4532",
    "last_four": "0366",
    "card_type": "VISA",
    "issuer": "Vietcombank",
    "expiry_month": 12,
    "expiry_year": 2027,
    "card_nickname": "My Visa",
    "is_default": true,
    "is_active": true,
    "created_at": "2026-08-13T10:30:00Z",
    "updated_at": "2026-08-13T10:30:00Z"
  }
}
```

---

### 4.4 Update Card

**Endpoint:** `PUT /cards/{id}`

**Description:** Cập nhật thông tin thẻ (nickname, default status)

**Path Parameters:**

```
- id: UUID (required)
```

**Request Body:**

```json
{
  "card_nickname": "Main Card",
  "is_default": true
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "card_nickname": "Main Card",
    "is_default": true,
    "updated_at": "2026-08-13T10:35:00Z"
  }
}
```

---

### 4.5 Delete Card

**Endpoint:** `DELETE /cards/{id}`

**Description:** Xóa thẻ (soft delete)

**Path Parameters:**

```
- id: UUID (required)
```

**Response (204):**

```
No content
```

**Notes:**
- Soft delete (set `deleted_at`)
- Cannot delete default card (must set another as default first)
- Deleted card cannot be used for payment

---

### 4.6 Set Default Card

**Endpoint:** `POST /cards/{id}/set-default`

**Description:** Đặt thẻ làm mặc định

**Path Parameters:**

```
- id: UUID (required)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "is_default": true,
    "updated_at": "2026-08-13T10:40:00Z"
  }
}
```

---

### 4.7 Verify Card (3D Secure)

**Endpoint:** `POST /cards/{id}/verify`

**Description:** Xác thực thẻ thông qua 3D Secure

**Path Parameters:**

```
- id: UUID (required)
```

**Request Body:**

```json
{
  "amount": 250000,
  "currency": "VND",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "card_id": "550e8400-e29b-41d4-a716-446655440000",
    "verification_status": "VERIFIED",
    "verified_at": "2026-08-13T10:45:00Z"
  }
}
```

---

## 5. Card Wallet APIs

### 5.1 Get Wallet Balance

**Endpoint:** `GET /wallet/balance`

**Description:** Lấy số dư ví

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "balance": 1500000,
    "currency": "VND",
    "last_updated": "2026-08-13T10:50:00Z"
  }
}
```

---

### 5.2 Top Up Wallet

**Endpoint:** `POST /wallet/topup`

**Description:** Nạp tiền vào ví

**Request Body:**

```json
{
  "amount": 500000,
  "currency": "VND",
  "card_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440002",
    "type": "TOPUP",
    "amount": 500000,
    "currency": "VND",
    "new_balance": 2000000,
    "status": "SUCCESS",
    "created_at": "2026-08-13T10:55:00Z"
  }
}
```

---

### 5.3 Transfer Money

**Endpoint:** `POST /wallet/transfer`

**Description:** Chuyển tiền sang tài khoản khác

**Request Body:**

```json
{
  "recipient_user_id": "550e8400-e29b-41d4-a716-446655440003",
  "amount": 100000,
  "currency": "VND",
  "note": "Payment for ticket"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440004",
    "type": "TRANSFER",
    "from_user_id": "550e8400-e29b-41d4-a716-446655440001",
    "to_user_id": "550e8400-e29b-41d4-a716-446655440003",
    "amount": 100000,
    "status": "SUCCESS",
    "created_at": "2026-08-13T11:00:00Z"
  }
}
```

---

### 5.4 Get Wallet History

**Endpoint:** `GET /wallet/history`

**Description:** Lấy lịch sử giao dịch ví

**Query Parameters:**

```
- page: int (default: 1)
- limit: int (default: 20)
- type: string (TOPUP, TRANSFER, PAYMENT, REFUND)
- from_date: ISO8601 datetime
- to_date: ISO8601 datetime
- status: SUCCESS, FAILED, PENDING
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "transaction_id": "550e8400-e29b-41d4-a716-446655440004",
        "type": "TRANSFER",
        "amount": 100000,
        "currency": "VND",
        "status": "SUCCESS",
        "description": "Transfer to user",
        "created_at": "2026-08-13T11:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

---

## 6. Digital Signer APIs

### 6.1 Generate Certificate

**Endpoint:** `POST /certificates/generate`

**Description:** Tạo certificate mới cho người dùng

**Request Body:**

```json
{
  "common_name": "John Nguyen",
  "email": "john@example.com",
  "organization": "BusZ",
  "key_size": 2048
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "common_name": "John Nguyen",
    "email": "john@example.com",
    "status": "ACTIVE",
    "issued_at": "2026-08-13T11:05:00Z",
    "expires_at": "2027-08-13T11:05:00Z",
    "public_key": "-----BEGIN PUBLIC KEY-----\nMFwwDQYJ...",
    "certificate": "-----BEGIN CERTIFICATE-----\nMIID...",
    "key_size": 2048
  }
}
```

---

### 6.2 Get User Certificates

**Endpoint:** `GET /certificates`

**Description:** Lấy danh sách certificate của người dùng

**Query Parameters:**

```
- status: ACTIVE, EXPIRED, REVOKED (default: ACTIVE)
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "common_name": "John Nguyen",
      "email": "john@example.com",
      "status": "ACTIVE",
      "issued_at": "2026-08-13T11:05:00Z",
      "expires_at": "2027-08-13T11:05:00Z"
    }
  ]
}
```

---

### 6.3 Get Public Key

**Endpoint:** `GET /certificates/{id}/public-key`

**Description:** Lấy public key (không cần auth)

**Path Parameters:**

```
- id: UUID (required)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "certificate_id": "550e8400-e29b-41d4-a716-446655440005",
    "public_key": "-----BEGIN PUBLIC KEY-----\nMFwwDQYJ...",
    "algorithm": "RSA2048",
    "expires_at": "2027-08-13T11:05:00Z"
  }
}
```

---

### 6.4 Revoke Certificate

**Endpoint:** `POST /certificates/{id}/revoke`

**Description:** Thu hồi certificate

**Path Parameters:**

```
- id: UUID (required)
```

**Request Body:**

```json
{
  "reason": "compromised"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "status": "REVOKED",
    "revoked_at": "2026-08-13T11:10:00Z"
  }
}
```

---

## 7. Digital Signature APIs

### 7.1 Sign Data

**Endpoint:** `POST /sign`

**Description:** Ký dữ liệu (ticket, transaction, etc.)

**Request Body:**

```json
{
  "entity_type": "TICKET",
  "entity_id": "550e8400-e29b-41d4-a716-446655440006",
  "data": "base64-encoded-data",
  "certificate_id": "550e8400-e29b-41d4-a716-446655440005"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "signature_id": "550e8400-e29b-41d4-a716-446655440007",
    "entity_type": "TICKET",
    "entity_id": "550e8400-e29b-41d4-a716-446655440006",
    "signature": "base64-encoded-signature",
    "algorithm": "SHA256WithRSA",
    "timestamp": "2026-08-13T11:15:00Z",
    "public_key_id": "550e8400-e29b-41d4-a716-446655440005"
  }
}
```

---

### 7.2 Verify Signature

**Endpoint:** `POST /verify`

**Description:** Xác thực chữ ký (không cần auth)

**Request Body:**

```json
{
  "signature_id": "550e8400-e29b-41d4-a716-446655440007",
  "data": "base64-encoded-data"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "signature_id": "550e8400-e29b-41d4-a716-446655440007",
    "is_valid": true,
    "algorithm": "SHA256WithRSA",
    "verified_at": "2026-08-13T11:20:00Z",
    "certificate_status": "ACTIVE"
  }
}
```

---

### 7.3 Get Signature Detail

**Endpoint:** `GET /signatures/{id}`

**Description:** Lấy chi tiết chữ ký

**Path Parameters:**

```
- id: UUID (required)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "signature_id": "550e8400-e29b-41d4-a716-446655440007",
    "entity_type": "TICKET",
    "entity_id": "550e8400-e29b-41d4-a716-446655440006",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "algorithm": "SHA256WithRSA",
    "is_verified": true,
    "timestamp": "2026-08-13T11:15:00Z",
    "certificate_id": "550e8400-e29b-41d4-a716-446655440005"
  }
}
```

---

### 7.4 Get Audit Log

**Endpoint:** `GET /audit-log`

**Description:** Lấy audit log của signatures

**Query Parameters:**

```
- entity_type: TICKET, TRANSACTION, etc.
- entity_id: UUID
- user_id: UUID
- from_date: ISO8601
- to_date: ISO8601
- page: int (default: 1)
- limit: int (default: 50)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440008",
        "entity_type": "TICKET",
        "entity_id": "550e8400-e29b-41d4-a716-446655440006",
        "signature_id": "550e8400-e29b-41d4-a716-446655440007",
        "verified_at": "2026-08-13T11:20:00Z",
        "verified_by": "SYSTEM",
        "status": "VERIFIED"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100
    }
  }
}
```

---

## 8. Timestamp APIs

### 8.1 Request Timestamp

**Endpoint:** `POST /timestamp`

**Description:** Yêu cầu timestamp từ timestamp authority

**Request Body:**

```json
{
  "data": "base64-encoded-data"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "timestamp_id": "550e8400-e29b-41d4-a716-446655440009",
    "timestamp": "2026-08-13T11:25:00Z",
    "timestamp_token": "base64-encoded-token",
    "accuracy": "milliseconds"
  }
}
```

---

### 8.2 Get Timestamp

**Endpoint:** `GET /timestamp/{id}`

**Description:** Lấy thông tin timestamp

**Path Parameters:**

```
- id: UUID (required)
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "timestamp_id": "550e8400-e29b-41d4-a716-446655440009",
    "timestamp": "2026-08-13T11:25:00Z",
    "timestamp_token": "base64-encoded-token",
    "accuracy": "milliseconds"
  }
}
```

---

## 9. Rate Limiting

### 9.1 Rate Limits

```
Standard User:
- 100 requests / minute
- 1000 requests / hour
- 5000 requests / day

Admin:
- 500 requests / minute
- 5000 requests / hour
- 50000 requests / day
```

### 9.2 Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1692002400
```

### 9.3 Rate Limit Exceeded

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```

Status Code: `429 Too Many Requests`

---

## 10. Webhook Events

### 10.1 Supported Events

```
- card.created
- card.updated
- card.deleted
- card.expired
- signature.created
- signature.verified
- signature.failed
- certificate.expiring
- certificate.revoked
```

### 10.2 Webhook Payload

```json
{
  "event": "card.created",
  "timestamp": "2026-08-13T11:30:00Z",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "card_type": "VISA",
    "last_four": "0366"
  }
}
```

---

## 11. SDK Integration

### 11.1 Java SDK

```java
CardClient cardClient = new CardClient(
    baseUrl = "https://api.busz.com/api/v1",
    apiKey = "sk_live_xxx"
);

// Add card
CardResponse card = cardClient.cards()
    .create(AddCardRequest.builder()
        .cardNumber("4532015112830366")
        .cardHolderName("JOHN NGUYEN")
        .expiryMonth(12)
        .expiryYear(2027)
        .cvv("123")
        .build());

// Get cards
List<Card> cards = cardClient.cards().list();

// Sign data
SignResponse signature = cardClient.signer()
    .sign(SignRequest.builder()
        .entityType("TICKET")
        .entityId("550e8400-e29b-41d4-a716-446655440006")
        .data("ticket-data")
        .build());
```

---

## 12. Examples

### 12.1 Complete Payment Flow

```bash
# 1. Add Card
curl -X POST https://api.busz.com/api/v1/cards \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_number": "4532015112830366",
    "card_holder_name": "JOHN NGUYEN",
    "expiry_month": 12,
    "expiry_year": 2027,
    "cvv": "123"
  }'

# 2. Create Booking & Payment
curl -X POST https://api.busz.com/api/v1/payments/create \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "550e8400-e29b-41d4-a716-446655440010",
    "card_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 500000
  }'

# 3. Verify & Sign Ticket
curl -X POST https://api.busz.com/api/v1/sign \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "TICKET",
    "entity_id": "550e8400-e29b-41d4-a716-446655440011",
    "data": "base64-ticket-data"
  }'

# 4. Verify Signature (Public)
curl -X POST https://api.busz.com/api/v1/verify \
  -H "Content-Type: application/json" \
  -d '{
    "signature_id": "550e8400-e29b-41d4-a716-446655440007",
    "data": "base64-ticket-data"
  }'
```

---

## 13. Best Practices

### 13.1 Card Security

```
✓ Always use HTTPS
✓ Never log card numbers
✓ Use card tokens (not full card)
✓ Implement 3D Secure
✓ Validate on both client & server
✓ Use PCI-compliant storage
✓ Implement rate limiting
```

### 13.2 Signature Verification

```
✓ Always verify before processing
✓ Check certificate status
✓ Validate timestamp
✓ Maintain audit trail
✓ Never trust unverified signatures
✓ Implement signature caching
✓ Monitor verification failures
```

---

## 14. Versioning

Current Version: **v1**

Future versions will use:
- `X-API-Version: v2` header
- Separate endpoints: `/api/v2/cards`
- Backward compatibility maintained for 12 months

---

## 15. Deprecation Policy

Endpoints marked as deprecated will:
1. Continue working for 6 months
2. Issue `X-Deprecated-On` header
3. Log deprecation warnings
4. Eventually return 410 Gone

---

## 16. Support

For API issues:
- Email: api-support@busz.com
- Slack: #api-support
- Documentation: https://docs.busz.com/api
- Status Page: https://status.busz.com

---

## 17. Changelog

### v1.0 (2026-08-13)

- [ ] Initial release
- [ ] Card management APIs
- [ ] Digital signature APIs
- [ ] Certificate management
- [ ] Wallet APIs
- [ ] Timestamp service
