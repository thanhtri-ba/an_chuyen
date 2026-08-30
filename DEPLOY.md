# Deploy An Chuyến — Cloudflare Pages (FE) + Render (BE) + Supabase (DB)

## 1. Supabase (DB) — đã có sẵn

Không cần làm gì thêm nếu bạn đang dùng project Supabase hiện tại cho production.
Nếu muốn tách riêng DB dev/production, tạo project Supabase mới và lấy:
- `DATABASE_URL` (pooler, port 6543, có `?pgbouncer=true`)
- `DIRECT_URL` (direct, port 5432 — dùng cho migration)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Từ Project Settings → Database / API.

## 2. Backend → Render

File [backend/render.yaml](backend/render.yaml) đã cấu hình sẵn (Render Blueprint).

**Cách deploy:**
1. Vào [Render Dashboard](https://dashboard.render.com) → New → Blueprint
2. Trỏ vào repo GitHub, Render sẽ tự đọc `backend/render.yaml`
3. Điền các biến môi trường đánh dấu `sync: false` trong dashboard (Render sẽ hỏi khi tạo service):
   - `DATABASE_URL`, `DIRECT_URL` — từ Supabase
   - `JWT_SECRET` — chuỗi ngẫu nhiên mạnh, **khác với giá trị dev**
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — từ Supabase
   - `CORS_ORIGINS` — điền **sau khi** có domain Cloudflare Pages ở bước 3, ví dụ:
     `https://anchuyen-web.pages.dev,https://anchuyen-admin.pages.dev` (hoặc domain riêng nếu đã gắn custom domain)
   - `GOOGLE_GENERATIVE_AI_API_KEY` — API key Gemini cho AI chatbot
   - `SENTRY_DSN` — tuỳ chọn, để trống nếu chưa dùng Sentry

4. Deploy xong, ghi lại URL Render cấp (dạng `https://anchuyen-backend.onrender.com`) — cần cho bước 3.

**Lưu ý:** `startCommand` đã bao gồm `npx prisma migrate deploy` — mỗi lần deploy sẽ tự áp dụng migration mới lên DB production. Không cần chạy tay.

**Free tier Render** tự ngủ sau 15 phút không có traffic → request đầu tiên sau khi ngủ sẽ chậm (~30-50s cold start). Nếu cần luôn online, nâng lên plan trả phí.

## 3. Web + Admin → Cloudflare Pages

Cả hai đều là Vite SPA tĩnh — không cần Cloudflare Worker/Functions, chỉ cần Pages tĩnh.

Đã thêm `_redirects` (`web/public/_redirects`, `admin/public/_redirects`) để client-side routing (React Router) không bị lỗi 404 khi refresh trang con — bắt buộc phải có file này cho SPA trên Cloudflare Pages.

### 3a. Web (khách hàng)

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → chọn repo
2. Cấu hình build:
   - **Root directory**: `web`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Environment variables (Production):
   - `VITE_API_URL` = `https://anchuyen-backend.onrender.com/api` (URL Render từ bước 2)
4. Deploy — Cloudflare cấp domain dạng `https://<project>.pages.dev`

### 3b. Admin (quản trị)

Lặp lại như trên, tạo **project Pages riêng**:
- **Root directory**: `admin`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- Environment variables:
  - `VITE_API_URL` = `https://anchuyen-backend.onrender.com/api`
  - `VITE_APP_NAME` = `An Chuyến Admin`
  - `VITE_APP_DESCRIPTION` = `Trang quản trị hệ thống An Chuyến`

### 3c. Vòng lặp CORS

Sau khi có 2 domain `.pages.dev` (hoặc custom domain), quay lại Render → cập nhật env `CORS_ORIGINS` với đúng 2 domain đó (phân cách bằng dấu phẩy, không có dấu `/` ở cuối) → redeploy backend để áp dụng.

## 4. Checklist sau khi deploy

- [ ] Mở web production → thử tìm chuyến, đặt vé thử (dùng tài khoản test)
- [ ] Mở admin production → đăng nhập bằng tài khoản admin thật
- [ ] Kiểm tra CORS: mở DevTools Console trên web/admin, không có lỗi `blocked by CORS policy`
- [ ] Kiểm tra `https://<backend-render-url>/health` trả về `{"status":"UP"}`
- [ ] Đổi `JWT_SECRET` production khác hẳn giá trị dùng khi dev/test
- [ ] Seed dữ liệu catalog (Tour, Rental car) qua trang admin nếu muốn bán các dịch vụ này ngay

## Custom domain (tuỳ chọn)

Cloudflare Pages hỗ trợ gắn domain riêng miễn phí (Custom domains → thêm domain đã có trên Cloudflare DNS). Sau khi gắn, nhớ cập nhật lại `CORS_ORIGINS` trên Render cho khớp domain mới.
