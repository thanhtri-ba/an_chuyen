const API_BASE_URL = "http://localhost:3000/api";

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
      ...customConfig,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const result = await response.json();

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
