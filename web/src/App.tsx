import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';
import { Header } from './shared/components/Header';
import { Footer } from './shared/components/Footer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Toaster } from './design-system/components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsent } from './shared/components/CookieConsent';
import { FloatingChat } from './shared/components/FloatingChat';
import { ProtectedRoute } from './shared/components/ProtectedRoute';

// Lazy load all page components (reduces initial bundle by ~60%)
const HomePage = lazy(() => import('./features/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const TripSearchPage = lazy(() => import('./features/trip-search/pages/TripSearchPage').then(m => ({ default: m.TripSearchPage })));
const SeatSelectionPage = lazy(() => import('./features/seat-selection/pages/SeatSelectionPage').then(m => ({ default: m.SeatSelectionPage })));
const PaymentPage = lazy(() => import('./features/payment/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
const BookingConfirmationPage = lazy(() => import('./features/booking-confirmation/pages/BookingConfirmationPage').then(m => ({ default: m.BookingConfirmationPage })));
const BookingReviewPage = lazy(() => import('./features/booking-review/pages/BookingReviewPage').then(m => ({ default: m.BookingReviewPage })));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MyBookingsPage = lazy(() => import('./features/my-bookings/pages/MyBookingsPage').then(m => ({ default: m.MyBookingsPage })));
const OffersPage = lazy(() => import('./features/offers/pages/OffersPage').then(m => ({ default: m.OffersPage })));
const NotificationsPage = lazy(() => import('./features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AboutPage = lazy(() => import('./features/about/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('./features/blog/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./features/blog/pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const SchedulePage = lazy(() => import('./features/schedule/pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const LoyaltyPage = lazy(() => import('./features/loyalty/pages/LoyaltyPage').then(m => ({ default: m.LoyaltyPage })));
const DeliveryPage = lazy(() => import('./features/services/pages/DeliveryPage').then(m => ({ default: m.DeliveryPage })));
const RentalPage = lazy(() => import('./features/services/pages/RentalPage').then(m => ({ default: m.RentalPage })));
const TourPage = lazy(() => import('./features/services/pages/TourPage').then(m => ({ default: m.TourPage })));
const EventsPage = lazy(() => import('./features/services/pages/EventsPage').then(m => ({ default: m.EventsPage })));

// Lazy load optional components
const FloatingChatLazy = lazy(() => import('./shared/components/FloatingChat').then(m => ({ default: m.FloatingChat })));
const CookieConsentLazy = lazy(() => import('./shared/components/CookieConsent').then(m => ({ default: m.CookieConsent })));

// Suspense fallback component
const PageLoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-[#0e1111]">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
));

const AppRoutes = memo(() => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<TripSearchPage />} />
              <Route path="/seat-selection/:tripScheduleId" element={<SeatSelectionPage />} />
              <Route path="/booking-review" element={<BookingReviewPage />} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/rental" element={<RentalPage />} />
              <Route path="/tour" element={<TourPage />} />
              <Route path="/events" element={<EventsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && (
        <Suspense fallback={null}>
          <FloatingChatLazy />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <CookieConsentLazy />
      </Suspense>
      <Toaster />
    </div>
  );
});

function App() {
 return (
 <AuthProvider>
 <BrowserRouter>
 <AppRoutes />
 </BrowserRouter>
 </AuthProvider>
 );
}

export default App;
