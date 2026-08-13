# Tech Architecture & Operations Upgrades

Tài liệu này vạch ra các chiến lược cải tiến về mặt kiến trúc phần mềm và vận hành (DevOps) để đảm bảo hệ thống có thể mở rộng (scale) và hoạt động ổn định.

## 1. Kiến trúc Microservices
- **Mục tiêu:** Tăng khả năng chịu tải và dễ dàng bảo trì khi dự án lớn lên.
- **Thực thi:**
  - Chuyển đổi từ kiến trúc Monolith hiện tại sang các dịch vụ nhỏ (Microservices). Ví dụ: `Auth Service`, `Booking Service`, `Payment Service`, `Notification Service`.
  - Sử dụng Message Broker (RabbitMQ hoặc Apache Kafka) để các services giao tiếp bất đồng bộ với nhau.

## 2. Hệ thống Cache với Redis
- **Mục tiêu:** Giảm độ trễ (latency) và giảm tải cho Database chính (PostgreSQL).
- **Thực thi:**
  - Cache các dữ liệu ít thay đổi hoặc được truy vấn nhiều như: Danh sách bến xe, Lịch trình cố định, Các chuyến đi còn trống.
  - Xử lý các tác vụ như giới hạn truy cập (Rate Limiting) để chống Spam/DDoS.

## 3. DevOps & CI/CD Pipeline
- **Mục tiêu:** Tự động hóa quy trình kiểm thử và triển khai, giảm rủi ro lỗi do con người.
- **Thực thi:**
  - Áp dụng triệt để Container hóa bằng Docker và điều phối bằng Kubernetes (K8s) cho môi trường Production.
  - Thiết lập luồng CI/CD (GitHub Actions / GitLab CI): tự động chạy Unit Test, Linting, Build Image và Deploy lên Server mỗi khi có code mới được merge vào nhánh chính.
  - Tích hợp hệ thống theo dõi và cảnh báo (Monitoring & Alerting) bằng Prometheus + Grafana hoặc Datadog.
