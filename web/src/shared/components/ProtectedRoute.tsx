import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCustomerIdentity } from '../../contexts/CustomerIdentityContext';

// Chấp nhận HOẶC tài khoản mật khẩu cũ (JWT) HOẶC danh tính thụ động
// Email+OTP/tra-cứu-đơn-hàng (identityUser) — hoàn thiện luồng khách vãng
// lai cho các trang trước đây chỉ cho phép JWT (xem
// docs/architecture/REDESIGN-PLAN.md).
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, token } = useAuth();
  const { identityUser, isLoading: identityLoading } = useCustomerIdentity();
  const location = useLocation();

  if (authLoading || identityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && !token && !identityUser) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
}
