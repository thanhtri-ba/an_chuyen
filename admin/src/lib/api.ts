const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface FetchOptions extends RequestInit {
  data?: any;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem("admin_token");
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { data, headers: customHeaders, ...customConfig } = options;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((customHeaders as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: data ? "POST" : "GET",
      body: data ? JSON.stringify(data) : undefined,
      headers,
      // Cần để cookie phiên thiết bị (Email+OTP, identity.controller.ts) đi
      // kèm request cross-origin tới backend — chuẩn bị cho login admin bằng
      // OTP; chưa đổi UI đăng nhập trong đợt này (xem
      // docs/architecture/REDESIGN-PLAN.md, Phase 4). Backend đã bật
      // cors({ credentials: true }) tương ứng.
      credentials: "include",
      ...customConfig,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const result = await response.json();

      if (response.status === 401) {
        // Token hết hạn (JWT 7 ngày) hoặc không hợp lệ — ProtectedRoute
        // (App.tsx) chỉ kiểm tra token có tồn tại trong localStorage, không
        // kiểm tra còn hạn, nên trước đây UI vẫn hiển thị "đã đăng nhập"
        // trong khi mọi API call âm thầm fail 401. Xoá token cũ + đưa về
        // trang đăng nhập ngay khi phát hiện, thay vì để bảng dữ liệu trống
        // trơn không rõ lý do.
        localStorage.removeItem("admin_token");
        if (!window.location.pathname.startsWith("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "An error occurred");
      }

      return result as T;
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  get<T>(endpoint: string, customConfig: RequestInit = {}) {
    return this.request<T>(endpoint, { ...customConfig, method: "GET" });
  }

  post<T>(endpoint: string, data: any, customConfig: RequestInit = {}) {
    return this.request<T>(endpoint, { ...customConfig, data, method: "POST" });
  }

  put<T>(endpoint: string, data: any, customConfig: RequestInit = {}) {
    return this.request<T>(endpoint, { ...customConfig, data, method: "PUT" });
  }

  delete<T>(endpoint: string, customConfig: RequestInit = {}) {
    return this.request<T>(endpoint, { ...customConfig, method: "DELETE" });
  }
}

export const api = new ApiClient();
