# Demand Forecasting

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

AI & Analytics

Document ID

AI-007

Priority

Critical

Version

1.0

---

# 1. Purpose

Demand Forecasting định nghĩa hệ thống dự báo nhu cầu đặt vé của BusZ nhằm hỗ trợ lập kế hoạch vận hành, tối ưu phân bổ xe, tài xế và tăng hiệu quả kinh doanh.

Mục tiêu

- Dự báo nhu cầu
- Tối ưu vận hành
- Giảm ghế trống
- Tăng doanh thu
- Hỗ trợ AI Decision Making

---

# 2. Objectives

```text
Demand Prediction

Capacity Planning

Revenue Optimization

Resource Planning

Operational Planning
```

---

# 3. Forecasting Architecture

```text
Booking History

↓

Feature Engineering

↓

Forecast Model

↓

Prediction API

↓

Dashboard

↓

Operations Team
```

---

# 4. Data Sources

```text
Bookings

Trips

Routes

Passengers

Payments

Promotions

Weather

Public Holidays

Events
```

---

# 5. Prediction Targets

```text
Daily Bookings

Route Demand

Company Demand

Seat Occupancy

Revenue

Cancellation Rate
```

---

# 6. Forecast Levels

```text
Hourly

Daily

Weekly

Monthly

Quarterly

Yearly
```

---

# 7. Input Features

```text
Route

Departure Time

Day of Week

Holiday

Season

Weather

Promotion

Historical Demand

Ticket Price
```

---

# 8. External Factors

```text
Public Holiday

Festival

School Vacation

Traffic

Weather

Fuel Price

Special Events
```

---

# 9. Machine Learning Models

```text
Linear Regression

Random Forest

XGBoost

LightGBM

LSTM

Prophet
```

---

# 10. Forecast Outputs

```text
Expected Bookings

Expected Revenue

Expected Occupancy

Demand Score

Confidence Score
```

---

# 11. Forecast API

```text
GET /forecast/routes

GET /forecast/revenue

GET /forecast/bookings

GET /forecast/occupancy
```

---

# 12. Operational Actions

```text
Increase Trips

Reduce Trips

Adjust Vehicles

Assign Drivers

Launch Promotion
```

---

# 13. Dashboard KPIs

```text
Forecast Accuracy

Occupancy Prediction

Revenue Prediction

Demand Growth

Peak Hours

Peak Routes
```

---

# 14. Model Training

```text
Daily Feature Update

Weekly Retraining

Monthly Full Training

Manual Training
```

---

# 15. Evaluation Metrics

```text
MAE

RMSE

MAPE

R² Score

Forecast Accuracy
```

---

# 16. Monitoring

Theo dõi

```text
Prediction Accuracy

Model Drift

Forecast Error

API Latency

Training Status
```

---

# 17. Performance Targets

```text
Prediction API

<500 ms

Forecast Accuracy

>90%

Model Retraining

<2 Hours
```

---

# 18. Security

```text
Encrypted Dataset

RBAC

Audit Logs

Model Versioning

Access Control
```

---

# 19. Acceptance Criteria

✓ Route Demand Forecast

✓ Revenue Forecast

✓ Occupancy Forecast

✓ Dashboard Integration

✓ Model Monitoring

✓ Forecast API hoạt động

---

# 20. Related Documents

AI-001 Data Architecture

AI-002 Data Warehouse

AI-006 Recommendation System

AI-008 Dynamic Pricing

AI-012 Machine Learning Operations

---

# 21. Summary

Demand Forecasting của BusZ sử dụng dữ liệu lịch sử đặt vé, tuyến xe, thời tiết, ngày lễ và các yếu tố bên ngoài để dự báo nhu cầu vận chuyển. Hệ thống giúp tối ưu lịch chạy xe, phân bổ tài nguyên, giảm tỷ lệ ghế trống và tăng doanh thu thông qua các mô hình Machine Learning hiện đại như XGBoost, Prophet và LSTM.