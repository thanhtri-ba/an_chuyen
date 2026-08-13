# Loyalty Program

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Profile

Document ID: PROFILE-009

Priority: High

Status: Draft

Version: 1.0

---

# 1. Purpose

Loyalty Program quản lý chương trình khách hàng thân thiết của BusZ.

Module này khuyến khích người dùng sử dụng dịch vụ thường xuyên thông qua hệ thống điểm thưởng, hạng thành viên và ưu đãi.

---

# 2. Objectives

Đảm bảo:

✓ Tích điểm tự động.

✓ Đổi điểm minh bạch.

✓ Quản lý hạng thành viên.

✓ Đồng bộ Promotion.

✓ Theo dõi lịch sử điểm.

---

# 3. Actors

Customer

Promotion Service

Payment Service

Booking Service

Admin

---

# 4. Loyalty Lifecycle

Register

↓

First Booking

↓

Earn Points

↓

Upgrade Tier

↓

Redeem Points

↓

Maintain Tier

↓

Expire Points

---

# 5. Membership Levels

Standard

↓

Silver

↓

Gold

↓

Platinum

↓

Diamond

(Configurable)

---

# 6. Reward Points

Earn Points

Redeem Points

Bonus Points

Expired Points

Adjustment Points

Referral Bonus (Future)

---

# 7. Membership Information

Membership ID

Current Tier

Reward Points

Lifetime Points

Current Benefits

Tier Expiration Date

Last Updated

---

# 8. Business Rules

PROFILE-BR-038

Điểm chỉ cộng sau khi Booking hoàn thành.

PROFILE-BR-039

Điểm đổi không được vượt số dư.

PROFILE-BR-040

Điểm có thể hết hạn theo chính sách.

PROFILE-BR-041

Điều kiện nâng hạng được cấu hình.

PROFILE-BR-042

Mọi thay đổi phải ghi Audit Log.

---

# 9. Point Earning

Completed Trip

↓

Calculate Points

↓

Update Balance

↓

Update Lifetime Points

↓

Notification

---

# 10. Point Redemption

Select Reward

↓

Check Balance

↓

Redeem

↓

Update Balance

↓

Issue Voucher / Discount

---

# 11. API

GET /profile/loyalty

GET /profile/loyalty/history

POST /profile/loyalty/redeem

GET /profile/loyalty/benefits

---

# 12. Database

loyalty_accounts

loyalty_transactions

membership_levels

reward_rules

reward_redemptions

audit_logs

---

# 13. Loading State

Loading Loyalty

↓

Calculating Points

↓

Redeeming Reward

---

# 14. Empty State

Chưa có giao dịch tích điểm.

↓

Hiển thị:

"Start Your First Trip to Earn Rewards"

---

# 15. Error State

Insufficient Points

↓

Show Error

---

Reward Unavailable

↓

Refresh Reward List

---

Network Error

↓

Retry

---

# 16. Success State

Points Earned

↓

Membership Updated

↓

Reward Available

---

# 17. Benefits

Priority Support

Exclusive Promotions

Birthday Voucher

Free Ticket Voucher

Priority Boarding (Configurable)

Higher Refund Benefits (Configurable)

---

# 18. Notification

Points Earned

Tier Upgraded

Points Expiring Soon

Reward Redeemed

Special Promotion

---

# 19. Analytics

points_earned

points_redeemed

tier_upgraded

reward_claimed

points_expired

---

# 20. Flutter Widget Tree

Scaffold

↓

MembershipCard

↓

RewardPointCard

↓

BenefitList

↓

TransactionHistory

↓

RedeemButton

---

# 21. State Management

LoyaltyBloc

RewardRepository

PromotionRepository

BookingRepository

---

# 22. Performance

Load Loyalty

<1 giây

Redeem Reward

<1 giây

Update Membership

<500ms

---

# 23. Accessibility

Large Font

Screen Reader

Color-independent Status

Touch Area ≥48dp

---

# 24. Test Cases

✓ Earn Points.

✓ Redeem Points.

✓ Tier Upgrade.

✓ Expired Points.

✓ Insufficient Points.

✓ Network Retry.

---

# 25. Acceptance Criteria

✓ Điểm tính đúng.

✓ Hạng cập nhật đúng.

✓ Lịch sử đầy đủ.

✓ Đồng bộ Promotion.

✓ Không Duplicate Transaction.

---

# 26. Related Documents

Payment Success

Promotion

Booking

Travel Preferences

Notification

---

# 27. Future Expansion

Airline Miles Conversion

Partner Rewards

Cashback Program

Subscription Membership

Family Points Pool

Gamification System

---

# 28. Summary

Loyalty Program giúp BusZ xây dựng hệ thống khách hàng thân thiết thông qua tích điểm, đổi thưởng và phân hạng thành viên, góp phần tăng tỷ lệ khách hàng quay lại và nâng cao trải nghiệm sử dụng dịch vụ.