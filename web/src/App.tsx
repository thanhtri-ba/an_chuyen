import { BrowserRouter, Routes, Route, useLocation } from'react-router-dom';
import { HomePage } from'./features/home/pages/HomePage';
import { TripSearchPage } from'./features/trip-search/pages/TripSearchPage';
import { SeatSelectionPage } from'./features/seat-selection/pages/SeatSelectionPage';
import { PaymentPage } from'./features/payment/pages/PaymentPage';
import { BookingConfirmationPage } from'./features/booking-confirmation/pages/BookingConfirmationPage';
import { BookingReviewPage } from'./features/booking-review/pages/BookingReviewPage';
import { AuthPage } from'./features/auth/pages/AuthPage';
import { ProfilePage } from'./features/profile/pages/ProfilePage';
import { MyBookingsPage } from'./features/my-bookings/pages/MyBookingsPage';
import { OffersPage } from'./features/offers/pages/OffersPage';
import { NotificationsPage } from'./features/notifications/pages/NotificationsPage';
import { Header } from'./shared/components/Header';
import { Footer } from'./shared/components/Footer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { AboutPage } from'./features/about/pages/AboutPage';
import { BlogPage } from'./features/blog/pages/BlogPage';
import { BlogDetailPage } from'./features/blog/pages/BlogDetailPage';
import { SchedulePage } from'./features/schedule/pages/SchedulePage';
import { LoyaltyPage } from'./features/loyalty/pages/LoyaltyPage';
import { DeliveryPage } from'./features/services/pages/DeliveryPage';
import { RentalPage } from'./features/services/pages/RentalPage';
import { TourPage } from'./features/services/pages/TourPage';
import { EventsPage } from'./features/services/pages/EventsPage';
import { Toaster } from'./design-system/components/Toast';
import { AuthProvider } from'./contexts/AuthContext';
import { CookieConsent } from'./shared/components/CookieConsent';
import { FloatingChat } from'./shared/components/FloatingChat';
import { ProtectedRoute } from'./shared/components/ProtectedRoute';

function AppRoutes() {
 const location = useLocation();
 const hideHeaderFooter = location.pathname ==='/auth';

 return (
 <div className="flex flex-col min-h-screen">
 {!hideHeaderFooter && <Header />}
 <main className="flex-1">
 <ErrorBoundary>
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
 </ErrorBoundary>
 </main>
 {!hideHeaderFooter && <Footer />}
 {!hideHeaderFooter && <FloatingChat />}
 <CookieConsent />
 <Toaster />
 </div>
 );
}

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
