# Advanced UI & Premium Experience

Tài liệu này đề xuất các cải tiến về mặt giao diện (UI) để đưa ứng dụng BusZ lên chuẩn thiết kế Premium hiện đại.

## 1. Hiệu ứng Glassmorphism (Kính mờ)
- **Mục tiêu:** Tạo chiều sâu và không gian cho ứng dụng.
- **Áp dụng:** Background của thẻ vé, thanh điều hướng (Navbar), popup và form tìm kiếm chuyến xe.
- **Kỹ thuật:** Sử dụng Tailwind CSS `backdrop-blur-md`, `bg-white/70`, `border-white/20`.

## 2. Micro-interactions & Framer Motion
- **Mục tiêu:** Tạo phản hồi mượt mà mỗi khi người dùng tương tác.
- **Áp dụng:** 
  - Hiệu ứng nảy (bounce) nhẹ khi bấm nút hoặc chọn ghế.
  - Các element trượt mượt mà (slide-up) khi scroll xuống hoặc khi chuyển trang.
  - Sáng viền (glow effect) khi hover vào thẻ vé.
- **Kỹ thuật:** Dùng thư viện `framer-motion` cho React (`<motion.div>`), CSS transitions.

## 3. Dark Mode & Ánh sáng Gradient
- **Mục tiêu:** Cung cấp chế độ tối cao cấp (Premium Dark).
- **Áp dụng:** Chuyển nền sang dải màu `slate-900` kết hợp các quầng sáng Gradient (Tím, Xanh Neon) đằng sau các thẻ nội dung chính để làm nổi bật.

## 4. Skeleton Loaders
- **Mục tiêu:** Giảm cảm giác chờ đợi nhàm chán khi fetch dữ liệu.
- **Áp dụng:** Khi trang danh sách chuyến xe đang load, hiển thị các hình hộp mờ với animation lướt sáng ngang thay vì xoay spinner vòng tròn truyền thống.
- **Kỹ thuật:** Tailwind CSS `animate-pulse`, `bg-slate-200`.

---
*Ghi chú: Việc áp dụng các nâng cấp này đòi hỏi sự đồng bộ trên toàn bộ component của Design System (nút bấm, input, modal).*
