import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './shared/components/Header';
import { Footer } from './shared/components/Footer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { PageTransition } from './shared/components/PageTransition';
import { BusLoadingScreen } from './shared/components/BusLoadingScreen';
import { Toaster } from './design-system/components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';

// Lazy load all page components (reduces initial bundle by ~60%)
const HomePage = lazy(() => import('./features/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const TripSearchPage = lazy(() => import('./features/trip-search/pages/TripSearchPage').then(m => ({ default: m.TripSearchPage })));
const SeatSelectionPage = lazy(() => import('./features/seat-selection/pages/SeatSelectionPage').then(m => ({ default: m.SeatSelectionPage })));
const PaymentPage = lazy(() => import('./features/payment/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
const BookingConfirmationPage = lazy(() => import('./features/booking-confirmation/pages/BookingConfirmationPage').then(m => ({ default: m.BookingConfirmationPage })));
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MyBookingsPage = lazy(() => import('./features/my-bookings/pages/MyBookingsPage').then(m => ({ default: m.MyBookingsPage })));
const OffersPage = lazy(() => import('./features/offers/pages/OffersPage').then(m => ({ default: m.OffersPage })));
const NotificationsPage = lazy(() => import('./features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AboutPage = lazy(() => import('./features/about/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./features/contact/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./features/blog/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./features/blog/pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const SchedulePage = lazy(() => import('./features/schedule/pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const LoyaltyPage = lazy(() => import('./features/loyalty/pages/LoyaltyPage').then(m => ({ default: m.LoyaltyPage })));
const DeliveryPage = lazy(() => import('./features/services/pages/DeliveryPage').then(m => ({ default: m.DeliveryPage })));
const RentalPage = lazy(() => import('./features/services/pages/RentalPage').then(m => ({ default: m.RentalPage })));
const TourPage = lazy(() => import('./features/services/pages/TourPage').then(m => ({ default: m.TourPage })));
const HotelsPage = lazy(() => import('./features/services/pages/HotelsPage').then(m => ({ default: m.HotelsPage })));
const HotelDetailPage = lazy(() => import('./features/services/pages/HotelDetailPage').then(m => ({ default: m.HotelDetailPage })));
const TourDetailPage = lazy(() => import('./features/services/pages/TourDetailPage').then(m => ({ default: m.TourDetailPage })));
const EventsPage = lazy(() => import('./features/services/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const DestinationDetailPage = lazy(() => import('./features/destinations/pages/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })));

// Lazy load optional components
const FloatingChatLazy = lazy(() => import('./shared/components/FloatingChat').then(m => ({ default: m.FloatingChat })));
const CookieConsentLazy = lazy(() => import('./shared/components/CookieConsent').then(m => ({ default: m.CookieConsent })));

// Suspense fallback — shown full-screen while a lazy page chunk loads (App.tsx wraps
// every <Routes> in this Suspense boundary, so every navigation to a not-yet-loaded
// route hits it).
const PageLoadingFallback = memo(() => <BusLoadingScreen />);

const AppRoutes = memo(() => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/auth' ||
                           location.pathname === '/forgot-password' ||
                           location.pathname === '/reset-password' ||
                           location.pathname.startsWith('/seat-selection') ||
                           location.pathname === '/payment' ||
                           location.pathname === '/booking-confirmation';
  // Search page is a fixed-height split view (map + results) with no scroll to reach a footer
  const hideFooter = hideHeaderFooter || location.pathname === '/search';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/search" element={<PageTransition><TripSearchPage /></PageTransition>} />
                <Route path="/seat-selection/:tripScheduleId" element={<PageTransition><SeatSelectionPage /></PageTransition>} />
                <Route path="/payment" element={<ProtectedRoute><PageTransition><PaymentPage /></PageTransition></ProtectedRoute>} />
                <Route path="/booking-confirmation" element={<ProtectedRoute><PageTransition><BookingConfirmationPage /></PageTransition></ProtectedRoute>} />
                <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
                <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
                <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><PageTransition><MyBookingsPage /></PageTransition></ProtectedRoute>} />
                <Route path="/offers" element={<PageTransition><OffersPage /></PageTransition>} />
                <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                <Route path="/blog/:slug" element={<PageTransition><BlogDetailPage /></PageTransition>} />
                <Route path="/schedule" element={<PageTransition><SchedulePage /></PageTransition>} />
                <Route path="/loyalty" element={<PageTransition><LoyaltyPage /></PageTransition>} />
                <Route path="/delivery" element={<PageTransition><DeliveryPage /></PageTransition>} />
                <Route path="/rental" element={<PageTransition><RentalPage /></PageTransition>} />
                <Route path="/tour" element={<PageTransition><TourPage /></PageTransition>} />
                <Route path="/tours" element={<PageTransition><TourPage /></PageTransition>} />
                <Route path="/tour/:id" element={<PageTransition><TourDetailPage /></PageTransition>} />
                <Route path="/hotels" element={<PageTransition><HotelsPage /></PageTransition>} />
                <Route path="/hotels/:slug" element={<PageTransition><HotelDetailPage /></PageTransition>} />
                <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
                <Route path="/destinations/:slug" element={<PageTransition><DestinationDetailPage /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!hideFooter && <Footer />}
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
