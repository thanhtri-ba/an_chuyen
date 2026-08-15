import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Users, Map, Bus, Tag, Building, Route, Settings,
  Gift, ImageIcon, Star, BarChart3, Palette, Calendar, CreditCard, TrendingUp
} from 'lucide-react';

export interface MenuItem {
  id: string;
  labelKey: string;
  label?: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  id: string;
  labelKey: string;
  items: MenuItem[];
  collapsible: boolean;
  defaultExpanded: boolean;
}

export const NAV_GROUPS: MenuGroup[] = [
  {
    id: 'overview',
    labelKey: 'overview',
    collapsible: false,
    defaultExpanded: true,
    items: [
      { id: 'dashboard', labelKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    id: 'management',
    labelKey: 'management',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'users', labelKey: 'users', href: '/users', icon: Users },
      { id: 'bookings', labelKey: 'bookings', href: '/bookings', icon: Tag },
      { id: 'payments', labelKey: 'payments', label: 'Thanh Toán', href: '/payments', icon: CreditCard },
      { id: 'trips', labelKey: 'trips', href: '/trips', icon: Map },
      { id: 'buses', labelKey: 'fleet', href: '/buses', icon: Bus }
    ]
  },
  {
    id: 'marketing',
    labelKey: 'marketing',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'vouchers', labelKey: 'vouchers', href: '/vouchers', icon: Gift },
      { id: 'events', labelKey: 'events', href: '/events', icon: Calendar },
      { id: 'banners', labelKey: 'banners', href: '/banners', icon: ImageIcon },
      { id: 'reviews', labelKey: 'reviews', label: 'Reviews', href: '/reviews', icon: Star }
    ]
  },
  {
    id: 'reports',
    labelKey: 'reports',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'revenue-details', labelKey: 'revenueDetails', href: '/revenue-details', icon: TrendingUp }
    ]
  },
  {
    id: 'configuration',
    labelKey: 'configuration',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'cities', labelKey: 'cities', href: '/cities', icon: Building },
      { id: 'routes', labelKey: 'routes', href: '/routes', icon: Route },
      { id: 'platform-stats', labelKey: 'platformStats', href: '/platform-stats', icon: BarChart3 },
      { id: 'website-config', labelKey: 'websiteConfig', href: '/website-config', icon: Palette },
      { id: 'settings', labelKey: 'settings', href: '/settings', icon: Settings }
    ]
  }
];
