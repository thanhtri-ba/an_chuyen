# Decision: Booking Flow

## Quyết định: 5-step linear flow

**Ngày:** 2026-08-19

**Flow:**
```
Search → Trip Listing → Seat Selection → Review → Payment → Confirmation
```

**Lý do linear (không multi-path):**
- Người dùng VN quen với step-by-step rõ ràng
- Giảm cognitive load — chỉ cần quyết định 1 việc tại 1 thời điểm
- Dễ implement lock state (ghế bị lock 10 phút)

---

## Quyết định: Seat map dùng grid CSS, không canvas

**Vấn đề:** Render seat map — dùng Canvas/SVG hay CSS grid?

**Quyết định:** CSS Grid.

**Lý do:**
- Accessibility tốt hơn (button elements, keyboard navigation)
- Easier state management (class-based: available/booked/selected)
- Không cần canvas API phức tạp
- Responsive tốt hơn
- Đủ performant cho 40–60 ghế

**Layout:**
```tsx
<div className="grid grid-cols-3 gap-2"> {/* 2+1 */}
  {seats.map(seat => (
    <button
      key={seat.id}
      disabled={seat.status === 'booked'}
      onClick={() => toggleSeat(seat.id)}
      className={cn(
        'h-10 rounded text-xs font-mono',
        seat.status === 'booked'  && 'bg-red-200 cursor-not-allowed',
        seat.status === 'selected' && 'bg-gold text-ink',
        seat.status === 'available' && 'bg-green-100 hover:bg-green-200',
      )}
    >
      {seat.label}
    </button>
  ))}
</div>
```

---

## Quyết định: Payment page — stripped UI

**Vấn đề:** Payment page có dùng chung layout (nav + footer) không?

**Quyết định:** Không. Payment page dùng layout riêng.

**Layout payment:**
- Không có global nav
- Không có footer
- Chỉ: logo nhỏ (link về home) + progress bar + back button
- Distraction-free environment

**Lý do:** Conversion rate cao hơn khi không có exit points. User đã commit đến bước này.

---

## Quyết định: Hiện giá ngay trên listing card

**Vấn đề:** Giá hiển thị ở đâu — trên card listing hay chỉ trong trang chi tiết?

**Quyết định:** Trên card listing, prominently.

**Format:**
```
Từ 180,000đ
```

Gold color, font Barlow Condensed 700.

**Lý do:** Research người dùng VN: giá là yếu tố quyết định số 1.
Hiding price behind a click → cao tỷ lệ bounce.

---

## Quyết định: Lock ghế 10 phút với countdown

**Vấn đề:** Prevent double booking trong seat selection.

**Quyết định:** Lock ghế khi user chọn, 10 phút countdown visible.

**UI:**
```
[⏱ Ghế được giữ trong 09:45 — Hoàn tất thanh toán để không mất ghế]
```

Banner warning vàng nhạt, đếm ngược real-time.
Khi hết giờ: redirect về seat selection với message "Ghế đã được release."

**Lý do:** 10 phút đủ để user điền thông tin và thanh toán. Dưới 10 phút gây pressure không cần thiết.
