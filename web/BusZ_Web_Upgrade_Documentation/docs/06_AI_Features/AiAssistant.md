# 17. AI Travel Assistant

## 17.1 Phạm vi UI

- Chat widget nổi.
- Trang AI Assistant đầy đủ.
- Gợi ý câu hỏi.
- Card kết quả chuyến đi.
- Chuyển kết quả AI sang trang Search.

## 17.2 Use case

- “Tìm chuyến TP.HCM đi Đà Lạt tối thứ Sáu.”
- “Chuyến nào có giường đôi và đánh giá tốt?”
- “Vé của tôi có được hoàn không?”
- “Điểm đón nào gần Quận 7?”

## 17.3 Nguyên tắc an toàn

- AI không tự thanh toán.
- AI không tự hủy vé.
- AI không thay đổi booking nếu chưa có xác nhận rõ.
- Dữ liệu cá nhân lấy từ session/JWT, không tin userId do model tạo.
- Câu trả lời phải dẫn người dùng đến hành động xác minh được.
