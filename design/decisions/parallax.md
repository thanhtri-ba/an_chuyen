# Decision: Scroll Parallax (Override MOTION_GUIDELINES anti-pattern)

**Ngày:** 2026-08-21
**Yêu cầu từ user:** "làm website chuyển động theo video và ví dụ như lăn chuột" — muốn cảm giác cinematic khi cuộn trang.

## Bối cảnh — Xung đột với rule cũ

`design/MOTION_GUIDELINES.md` liệt kê:
```
❌ Hero background / mountains — Không parallax mountains. Không zoom ảnh.
   Lý do: lag trên mobile, gây motion sickness.
```

User đã xác nhận rõ ràng muốn parallax theo scroll (chọn qua AskUserQuestion, không chọn video tự động/mousemove/custom cursor). Quyết định: **override có kiểm soát**, không xóa rule cũ mà thêm ngoại lệ có điều kiện.

## Quyết định: Transform-based parallax, tắt trên mobile + reduced-motion

**Không dùng:**
- `background-attachment: fixed` (đã có sẵn ở Section 4 — jank nặng, không hoạt động trên iOS Safari)
- Scroll listener thủ công + `setState` mỗi frame (gây re-render toàn cây)

**Dùng:** Framer Motion `useScroll` + `useTransform` — cập nhật trực tiếp CSS transform qua motion value, không re-render React, chạy trên GPU compositor thread.

```tsx
const heroRef = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
```

## Áp dụng ở đâu

1. **Hero video** (`HomePage.tsx`) — video layer di chuyển xuống 18% + scale nhẹ 1→1.12 khi cuộn qua hero. Content (text + search switcher) di chuyển nhanh hơn (35%) và fade out — tạo depth giữa 2 lớp.
2. **Routes section background** (Section 4) — thay `background-attachment: fixed` bằng ảnh absolute có `y` transform từ -12% → 12% dựa trên scroll progress của chính section đó (không phải toàn trang).

## Điều kiện tắt (giữ đúng tinh thần rule cũ)

```tsx
const prefersReducedMotion = useReducedMotion(); // framer-motion hook
const [isMobile, setIsMobile] = useState(false); // matchMedia('(max-width: 767px)')
const parallaxOff = prefersReducedMotion || isMobile;
```

- **Mobile (<768px):** parallax = 0% (tắt hoàn toàn) — đúng theo `MOTION_GUIDELINES.md#mobile-motion` ("giảm translateY", "không dùng spring")
- **prefers-reduced-motion:** parallax = 0% — bắt buộc theo rule accessibility đã có
- **Desktop:** parallax bật, dùng `useTransform` scoped theo từng section (`useScroll({ target: ref })`) thay vì toàn trang, giữ tính toán rẻ

## Lý do kỹ thuật chọn cách này thay vì CSS parallax thuần

1. `will-change: transform` + motion value → chạy compositor thread, không block main thread
2. Scoped theo `target: ref` → chỉ tính scroll progress trong viewport của section đó, không phải window scroll toàn trang
3. Tắt được có điều kiện (mobile/reduced-motion) — CSS `background-attachment: fixed` không thể tắt theo breakpoint dễ dàng và vốn đã bị lỗi trên iOS

## Ghi chú cho lần sau

Nếu thêm parallax ở section khác, dùng lại pattern này: `ref` riêng cho section + `useScroll({ target: ref, offset })` + check `parallaxOff` trước khi tạo `useTransform` range khác 0. Không parallax quá 2 lớp trong 1 section (giữ đúng tinh thần "không hỗn loạn" của `ART_DIRECTION.md`).
