import type React from "react";
import { lazy, Suspense } from "react";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AccountSwitcher } from "@/app/(main)/dashboard/_components/header/account-switcher";
import { LayoutControls } from "@/app/(main)/dashboard/_components/header/layout-controls";
import { SearchDialog } from "@/app/(main)/dashboard/_components/header/search-dialog";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/header/theme-switcher";
import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentAdminUser } from "@/lib/current-user";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { cn } from "@/lib/utils";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

const DefaultDashboardPage = lazy(() => import("@/app/(main)/dashboard/default/page"));
const AnalyticsPage = lazy(() => import("@/app/(main)/dashboard/analytics/page"));
const UsersPage = lazy(() => import("@/app/(main)/dashboard/users/page"));
const ProfilePage = lazy(() => import("@/app/(main)/dashboard/profile/page"));
const SettingsPage = lazy(() => import("@/app/(main)/dashboard/settings/page"));

const EmployeesPage = lazy(() => import("@/app/(main)/dashboard/employees/page"));
const VehiclesPage = lazy(() => import("@/app/(main)/dashboard/vehicles/page"));
const BusAgentsPage = lazy(() => import("@/app/(main)/dashboard/bus-agents/page"));
const RoutesPage = lazy(() => import("@/app/(main)/dashboard/routes/page"));
const TripsPage = lazy(() => import("@/app/(main)/dashboard/trips/page"));
const TripSchedulesPage = lazy(() => import("@/app/(main)/dashboard/trip-schedules/page"));
const BookingsPage = lazy(() => import("@/app/(main)/dashboard/bookings/page"));
const VouchersPage = lazy(() => import("@/app/(main)/dashboard/vouchers/page"));
const BannersPage = lazy(() => import("@/app/(main)/dashboard/banners/page"));
const DestinationsPage = lazy(() => import("@/app/(main)/dashboard/destinations/page"));
const EventsPage = lazy(() => import("@/app/(main)/dashboard/events/page"));
const ReviewsPage = lazy(() => import("@/app/(main)/dashboard/reviews/page"));
const WebsiteConfigPage = lazy(() => import("@/app/(main)/dashboard/website-config/page"));
const ToursPage = lazy(() => import("@/app/(main)/dashboard/tours/page"));
const RentalsPage = lazy(() => import("@/app/(main)/dashboard/rentals/page"));
const DeliveriesPage = lazy(() => import("@/app/(main)/dashboard/deliveries/page"));
const PaymentsPage = lazy(() => import("@/app/(main)/dashboard/payments/page"));

const ChatLayout = lazy(() => import("@/app/(main)/chat/layout"));
const ChatAppPage = lazy(() => import("@/app/(main)/chat/page"));

const AuthLayout = lazy(() => import("@/app/(main)/auth/v2/layout"));
const LoginPage = lazy(() => import("@/app/(main)/auth/v2/login/page"));
const RegisterPage = lazy(() => import("@/app/(main)/auth/v2/register/page"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were trying to go to when they were redirected.
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PreferencesStoreProvider initialValues={PREFERENCE_DEFAULTS}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex w-full flex-1 flex-col overflow-auto bg-background text-foreground">
          <header
            className={cn(
              "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
              "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
            )}
          >
            <div className="flex w-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
                />
                <SearchDialog />
              </div>
              <div className="flex items-center gap-2">
                <LayoutControls />
                <ThemeSwitcher />
                <AccountSwitcher users={[getCurrentAdminUser()]} />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
        </main>
      </SidebarProvider>
    </PreferencesStoreProvider>
  );
};

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/default" replace />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route
                  path="/"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DefaultDashboardPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="default"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DefaultDashboardPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="users"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <UsersPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProfilePage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <AnalyticsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="bus-agents"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <BusAgentsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="routes"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <RoutesPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="trips"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <TripsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="trip-schedules"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <TripSchedulesPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <BookingsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="employees"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <EmployeesPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="vehicles"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <VehiclesPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <SettingsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="vouchers"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <VouchersPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="banners"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <BannersPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="destinations"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DestinationsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="events"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <EventsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <ReviewsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="website-config"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <WebsiteConfigPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="tours"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <ToursPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="rentals"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <RentalsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="deliveries"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DeliveriesPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
                <Route
                  path="payments"
                  element={
                    <DashboardLayout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <PaymentsPage />
                      </Suspense>
                    </DashboardLayout>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Protected Standalone Apps */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <ChatLayout>
                  <ChatAppPage />
                </ChatLayout>
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/login"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </Suspense>
          }
        />
        <Route
          path="/auth/register"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </Suspense>
          }
        />
        <Route path="/auth/v2/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/v2/register" element={<Navigate to="/auth/register" replace />} />

        <Route path="*" element={<div className="p-10 text-center">Đang phát triển...</div>} />
      </Routes>
    </TooltipProvider>
  );
}
