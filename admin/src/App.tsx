import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Bookings from './pages/Bookings';
import Trips from './pages/Trips';
import Buses from './pages/Buses';
import Cities from './pages/Cities';
import RoutesPage from './pages/Routes';
import Settings from './pages/Settings';
import PlatformStats from './pages/PlatformStats';
import WebsiteConfig from './pages/WebsiteConfig';
import Vouchers from './pages/Vouchers';
import Banners from './pages/Banners';
import Reviews from './pages/Reviews';
import Events from './pages/Events';
import RevenueDetails from './pages/RevenueDetails';
import Login from './pages/Login';
import AdminPaymentPage from './pages/AdminPaymentPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (localStorage.getItem('admin_auth') !== 'true') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<AdminPaymentPage />} />
          <Route path="trips" element={<Trips />} />
          <Route path="buses" element={<Buses />} />
          <Route path="cities" element={<Cities />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="platform-stats" element={<PlatformStats />} />
          <Route path="website-config" element={<WebsiteConfig />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="banners" element={<Banners />} />
          <Route path="events" element={<Events />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="revenue-details" element={<RevenueDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
