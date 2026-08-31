import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './shared/components/Header';
import { Footer } from './shared/components/Footer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Toaster } from './design-system/components/Toast';
import { AuthProvider } from './contexts/AuthContext';
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
const ContactPage = lazy(() => import('./features/contact/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./features/blog/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./features/blog/pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const SchedulePage = lazy(() => import('./features/schedule/pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const LoyaltyPage = lazy(() => import('./features/loyalty/pages/LoyaltyPage').then(m => ({ default: m.LoyaltyPage })));
const DeliveryPage = lazy(() => import('./features/services/pages/DeliveryPage').then(m => ({ default: m.DeliveryPage })));
const RentalPage = lazy(() => import('./features/services/pages/RentalPage').then(m => ({ default: m.RentalPage })));
const TourPage = lazy(() => import('./features/services/pages/TourPage').then(m => ({ default: m.TourPage })));
const EventsPage = lazy(() => import('./features/services/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const DestinationDetailPage = lazy(() => import('./features/destinations/pages/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })));

// Lazy load optional components
const FloatingChatLazy = lazy(() => import('./shared/components/FloatingChat').then(m => ({ default: m.FloatingChat })));
const CookieConsentLazy = lazy(() => import('./shared/components/CookieConsent').then(m => ({ default: m.CookieConsent })));

// Suspense fallback component
const PageLoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-pulse text-primary font-bold tracking-widest uppercase text-sm">Đang tải...</div>
  </div>
));

const AppRoutes = memo(() => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/auth' ||
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
                <Route path="/" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><HomePage /></motion.div>} />
                <Route path="/search" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><TripSearchPage /></motion.div>} />
                <Route path="/seat-selection/:tripScheduleId" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><SeatSelectionPage /></motion.div>} />
                <Route path="/booking-review" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><BookingReviewPage /></motion.div>} />
                <Route path="/payment" element={<ProtectedRoute><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><PaymentPage /></motion.div></ProtectedRoute>} />
                <Route path="/booking-confirmation" element={<ProtectedRoute><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}><BookingConfirmationPage /></motion.div></ProtectedRoute>} />
                <Route path="/auth" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><AuthPage /></motion.div>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/loyalty" element={<LoyaltyPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />
                <Route path="/rental" element={<RentalPage />} />
                <Route path="/tour" element={<TourPage />} />
                <Route path="/tours" element={<TourPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
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
