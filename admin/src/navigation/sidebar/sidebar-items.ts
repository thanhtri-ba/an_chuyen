import {
  Calendar,
  Car,
  ChartColumn,
  CreditCard,
  Forklift,
  Gift,
  Image,
  LayoutDashboard,
  type LucideIcon,
  MapPinned,
  MessageSquare,
  Package,
  ReceiptText,
  Settings2,
  Star,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Tổng Quan",
    items: [
      { id: "dashboard", title: "Dashboard", url: "/dashboard/default", icon: LayoutDashboard },
      { id: "analytics", title: "Thống Kê", url: "/dashboard/analytics", icon: ChartColumn, badge: "new" },
    ],
  },
  {
    id: 2,
    label: "Quản Lý Bán Hàng",
    items: [
      { id: "bookings", title: "Đặt Vé", url: "/dashboard/bookings", icon: ReceiptText },
      { id: "users", title: "Khách Hàng", url: "/dashboard/users", icon: Users },
    ],
  },
  {
    id: 3,
    label: "Quản Lý Vận Hành",
    items: [
      { id: "trip-schedules", title: "Lịch Trình", url: "/dashboard/trip-schedules", icon: Calendar },
      { id: "trips", title: "Chuyến Xe", url: "/dashboard/trips", icon: Forklift },
      { id: "routes", title: "Tuyến Đường", url: "/dashboard/routes", icon: Forklift },
    ],
  },
  {
    id: 4,
    label: "Quản Lý Đối Tác",
    items: [{ id: "bus-agents", title: "Nhà Xe", url: "/dashboard/bus-agents", icon: Forklift }],
  },
  {
    id: 5,
    label: "Marketing",
    items: [
      { id: "vouchers", title: "Voucher", url: "/dashboard/vouchers", icon: Ticket },
      { id: "banners", title: "Banner", url: "/dashboard/banners", icon: Image },
      { id: "events", title: "Sự Kiện", url: "/dashboard/events", icon: Gift },
      { id: "reviews", title: "Đánh Giá", url: "/dashboard/reviews", icon: Star },
    ],
  },
  {
    id: 6,
    label: "Dịch Vụ Khác",
    items: [
      { id: "tours", title: "Tour", url: "/dashboard/tours", icon: MapPinned },
      { id: "rentals", title: "Xe Tự Lái", url: "/dashboard/rentals", icon: Car },
      { id: "deliveries", title: "Giao Hàng", url: "/dashboard/deliveries", icon: Package },
      { id: "payments", title: "Thanh Toán", url: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    id: 7,
    label: "Hệ Thống",
    items: [
      { id: "chat", title: "Hỗ Trợ / Chat", url: "/chat", icon: MessageSquare, badge: "new" },
      { id: "website-config", title: "Cấu Hình Website", url: "/dashboard/website-config", icon: Settings2 },
      { id: "profile", title: "Tài Khoản", url: "/dashboard/profile", icon: UserRound },
    ],
  },
];
