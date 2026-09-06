import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

// Danh tính thụ động Email+OTP (song song với AuthContext.tsx — tài khoản
// mật khẩu cũ vẫn hoạt động bình thường, đây chỉ là đường mới cho khách vãng
// lai). Xem docs/architecture/REDESIGN-PLAN.md, Phase 4.
export interface IdentityUser {
  id: string;
  email: string | null;
  fullName: string;
  role: string;
}

interface CustomerIdentityContextType {
  identityUser: IdentityUser | null;
  isLoading: boolean;
  // Tra cứu lịch sử đặt vé bằng email + mã đơn hàng — thay cho OTP (quyết
  // định có chủ đích: OTP gây ma sát không cần thiết cho đặt vé mới, chỉ
  // còn cần khi khách muốn XEM LẠI lịch sử trên thiết bị mới).
  lookupOrder: (email: string, bookingId: string) => Promise<void>;
  logout: () => Promise<void>;
  // Gọi lại sau khi POST /bookings/create tạo danh tính khách vãng lai mới
  // (cookie DeviceSession vừa được set) — context không tự biết chuyện này
  // vì effect nhận-diện-thiết-bị-quen chỉ chạy 1 lần lúc app mount.
  refresh: () => Promise<void>;
}

const CustomerIdentityContext = createContext<CustomerIdentityContextType | undefined>(undefined);

export function CustomerIdentityProvider({ children }: { children: React.ReactNode }) {
  const [identityUser, setIdentityUser] = useState<IdentityUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async (): Promise<void> => {
    try {
      const res = await api.get('/identity/session');
      setIdentityUser(res.data.user);
    } catch {
      setIdentityUser(null);
    }
  };

  useEffect(() => {
    // Tự nhận diện thiết bị quen qua cookie httpOnly — 401 ở đây là bình
    // thường cho khách chưa từng xác minh, không phải lỗi (xem lib/api.ts).
    refresh().finally(() => setIsLoading(false));
  }, []);

  const lookupOrder = async (email: string, bookingId: string): Promise<void> => {
    await api.post('/identity/lookup-order', { email, bookingId });
    const res = await api.get('/identity/session');
    setIdentityUser(res.data.user);
  };

  const logout = async (): Promise<void> => {
    await api.post('/identity/logout');
    setIdentityUser(null);
  };

  return (
    <CustomerIdentityContext.Provider value={{ identityUser, isLoading, lookupOrder, logout, refresh }}>
      {children}
    </CustomerIdentityContext.Provider>
  );
}

export const useCustomerIdentity = () => {
  const context = useContext(CustomerIdentityContext);
  if (context === undefined) {
    throw new Error('useCustomerIdentity must be used within a CustomerIdentityProvider');
  }
  return context;
};
