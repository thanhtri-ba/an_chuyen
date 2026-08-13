# Fraud Detection

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-009

Priority

Critical

Version

1.0

---

# 1. Purpose

Fraud Detection định nghĩa kiến trúc phát hiện gian lận của BusZ nhằm giảm thiểu rủi ro trong quá trình đặt vé, thanh toán, hoàn tiền và sử dụng khuyến mãi.

Mục tiêu

- Phát hiện gian lận
- Giảm Chargeback
- Bảo vệ doanh thu
- Bảo vệ khách hàng
- Hỗ trợ Risk Scoring

---

# 2. Objectives

```text
Fraud Detection

Risk Assessment

Transaction Monitoring

Account Protection

Payment Security
```

---

# 3. Fraud Detection Architecture

```text
Flutter / Web

↓

Backend API

↓

Fraud Detection Engine

↓

Risk Scoring

↓

Decision Engine

↓

Approve

Review

Reject
```

---

# 4. Fraud Detection Pipeline

```text
Transaction

↓

Feature Extraction

↓

Rule Engine

↓

ML Model

↓

Risk Score

↓

Decision
```

---

# 5. Fraud Sources

```text
Booking

Payment

Refund

Promotion

Login

Device

IP Address

Location

Review
```

---

# 6. Fraud Scenarios

```text
Duplicate Booking

Multiple Accounts

Fake Promotion

Refund Abuse

Card Testing

Bot Booking

Mass Booking

Credential Stuffing
```

---

# 7. Input Features

```text
Customer ID

Device ID

IP Address

Country

Booking Amount

Payment Method

Booking Frequency

Login Frequency

Failed Payments

Cancellation Rate
```

---

# 8. Device Intelligence

```text
Device Fingerprint

Operating System

Browser

App Version

Root Detection

Jailbreak Detection
```

---

# 9. Behavioral Features

```text
Booking Pattern

Travel Pattern

Payment Pattern

Navigation Pattern

Typing Speed

Click Speed
```

---

# 10. Machine Learning Models

```text
Isolation Forest

XGBoost

Random Forest

LightGBM

AutoEncoder

Neural Network
```

---

# 11. Rule Engine

Ví dụ

```text
>5 Failed Payments / Hour

↓

High Risk

Same Card

↓

Multiple Accounts

Refund >3 Times / Month

↓

Manual Review

VPN + New Device

↓

Medium Risk
```

---

# 12. Risk Score

```text
0-30

Low Risk

31-70

Medium Risk

71-100

High Risk
```

---

# 13. Decision Engine

```text
Approve

↓

Review

↓

Reject
```

---

# 14. Dashboard KPIs

```text
Fraud Rate

Blocked Transactions

Manual Reviews

Chargeback Rate

False Positive Rate

Fraud Loss
```

---

# 15. Alert Rules

```text
Mass Booking

Bot Activity

Multiple Failed Payments

Promotion Abuse

High Risk Account

High Risk Device
```

---

# 16. Model Training

```text
Daily Feature Update

Weekly Retraining

Monthly Evaluation

Manual Retraining
```

---

# 17. Evaluation Metrics

```text
Precision

Recall

F1 Score

ROC-AUC

False Positive Rate

False Negative Rate
```

---

# 18. Monitoring

```text
Fraud Rate

Prediction Accuracy

Model Drift

Latency

Blocked Users

Alert Volume
```

---

# 19. Security

```text
RBAC

Audit Logs

Encrypted Features

Model Versioning

Access Control
```

---

# 20. Performance Targets

```text
Fraud Prediction

<100 ms

Risk Score

<50 ms

False Positive

<2%

Fraud Detection Rate

>95%
```

---

# 21. Acceptance Criteria

✓ Fraud Engine hoạt động

✓ Risk Score chính xác

✓ Rule Engine hoạt động

✓ ML Model triển khai

✓ Dashboard Fraud đầy đủ

✓ Monitoring hoạt động

---

# 22. Related Documents

AI-007 Demand Forecasting

AI-008 Dynamic Pricing

AI-010 Customer Segmentation

AI-012 Machine Learning Operations

SEC-006 Payment Security

---

# 23. Summary

Fraud Detection của BusZ kết hợp Rule-based Engine và Machine Learning để phát hiện các hành vi gian lận trong đặt vé, thanh toán và hoàn tiền. Hệ thống đánh giá rủi ro theo thời gian thực, sinh Risk Score cho mỗi giao dịch và hỗ trợ cơ chế Approve, Manual Review hoặc Reject nhằm giảm thiểu tổn thất tài chính và bảo vệ hệ sinh thái BusZ.