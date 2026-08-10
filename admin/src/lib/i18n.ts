import { useState, useEffect } from 'react';

export const translations = {
  en: {
    sidebar: {
      overview: "Overview",
      dashboard: "Dashboard",
      management: "Management",
      users: "Users",
      bookings: "Bookings",
      trips: "Trips",
      fleet: "Fleet",
      configuration: "Configuration",
      cities: "Cities",
      routes: "Routes",
      settings: "Settings",
      platformStats: "Platform Stats",
      websiteConfig: "Website Config",
      marketing: "Marketing & Content",
      vouchers: "Vouchers",
      banners: "App/Web Banners",
      events: "Events",
      signOut: "Sign out"
    },
    common: {
      search: "Search...",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      actions: "Actions",
      status: "Status",
      saving: "Saving..."
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your bus booking system.",
      totalRevenue: "Total Revenue",
      fromLastMonth: "from last month",
      totalBookings: "Total Bookings",
      activeRoutes: "Active Routes",
      activeBuses: "Active Buses",
      revenueOverview: "Revenue Overview",
      todaysSchedule: "Today's Schedule",
      time: "Time",
      route: "Route",
      bus: "Bus",
      passengers: "Passengers",
      departure: "Departure",
      arrival: "Arrival"
    },
    users: {
      title: "Users",
      subtitle: "Manage all registered users and agents.",
      addUser: "Add User",
      allUsers: "All Users",
      name: "Name",
      email: "Email",
      role: "Role",
      joinedAt: "Joined At"
    },
    bookings: {
      title: "Bookings",
      subtitle: "View and manage customer ticket bookings.",
      allBookings: "All Bookings",
      customer: "Customer",
      bookingDate: "Booking Date",
      amount: "Amount"
    },
    trips: {
      title: "Trips",
      subtitle: "Schedule and monitor active bus trips.",
      addTrip: "Add Trip",
      allTrips: "All Trips",
      driver: "Driver",
      price: "Price"
    },
    buses: {
      title: "Bus Fleet",
      subtitle: "Manage vehicles, capacity, and maintenance.",
      addBus: "Add Bus",
      fleetOverview: "Fleet Overview",
      busNumber: "Bus Number",
      capacity: "Capacity",
      type: "Type"
    },
    cities: {
      title: "Cities",
      subtitle: "Manage terminals and city locations.",
      addCity: "Add City",
      allCities: "All Cities",
      cityName: "City Name",
      region: "Region",
      terminals: "Terminals"
    },
    routes: {
      title: "Routes",
      subtitle: "Configure bus routes and standard durations.",
      addRoute: "Add Route",
      allRoutes: "All Routes",
      origin: "Origin",
      destination: "Destination",
      distance: "Distance",
      duration: "Duration"
    },
    settings: {
      title: "Basic Settings",
      subtitle: "Customize your admin interface appearance.",
      accentColor: "Accent Color",
      accentDesc: "Choose a primary color for buttons, badges, and active elements.",
      themeMode: "Theme Mode",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      language: "Language",
      systemToggles: "System Toggles",
      compactSidebar: "Compact Sidebar",
      compactSidebarDesc: "Hide labels in the sidebar to save space.",
      showAnimations: "Show Animations",
      showAnimationsDesc: "Enable or disable UI animations.",
      soundEffects: "Sound Effects",
      soundEffectsDesc: "Play a sound when a new booking arrives.",
      custom: "Custom"
    },
    vouchers: {
      title: "Vouchers",
      subtitle: "Manage promotional vouchers and discounts.",
      addVoucher: "Add Voucher",
      allVouchers: "All Vouchers",
      code: "Code",
      titleLabel: "Title",
      discount: "Discount",
      validUntil: "Valid Until"
    },
    banners: {
      title: "Banners",
      subtitle: "Manage pictures and banners on App and Web.",
      addBanner: "Add Banner",
      allBanners: "All Banners",
      image: "Image",
      titleLabel: "Title",
      platform: "Platform",
      targetUrl: "Link URL"
    },
    events: {
      title: "Events",
      subtitle: "Manage platform events, news and promotions.",
      addEvent: "Add Event",
      allEvents: "All Events",
      image: "Image",
      titleLabel: "Title",
      dateRange: "Date Range"
    },
    platformStats: {
      title: "Platform Stats",
      subtitle: "Update the statistics shown on the main website and mobile app.",
      editStats: "Edit Statistics",
      totalRoutes: "Total Routes",
      passengers: "Passengers",
      onTimeRate: "On Time Rate",
      ratingScore: "Rating Score",
      saved: "Stats saved successfully"
    },
    websiteConfig: {
      title: "Website UI Config",
      subtitle: "Update images and content displayed on the public website.",
      imagesSection: "Hero & Banner Images",
      heroBackground: "Home Hero Background URL",
      leftBanner: "Home Left Banner URL",
      rightBanner: "Home Right Banner URL",
      aboutContent: "About Page Content",
      aboutContentDesc: "JSON content for the About page (services, specialists, etc.)",
      saved: "Configs saved successfully"
    }
  },
  vi: {
    sidebar: {
      overview: "Tổng quan",
      dashboard: "Bảng điều khiển",
      management: "Quản lý",
      users: "Người dùng",
      bookings: "Đơn đặt vé",
      trips: "Chuyến đi",
      fleet: "Đội xe",
      configuration: "Cấu hình",
      cities: "Tỉnh thành",
      routes: "Lộ trình",
      settings: "Cài đặt",
      platformStats: "Thống kê",
      websiteConfig: "Cấu hình Web",
      marketing: "Marketing & Nội dung",
      vouchers: "Khuyến mãi",
      banners: "Hình ảnh/Banner",
      events: "Sự kiện",
      signOut: "Đăng xuất"
    },
    common: {
      search: "Tìm kiếm...",
      add: "Thêm mới",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      save: "Lưu",
      cancel: "Hủy",
      actions: "Thao tác",
      status: "Trạng thái",
      saving: "Đang lưu..."
    },
    dashboard: {
      title: "Bảng điều khiển",
      subtitle: "Tổng quan hệ thống đặt vé xe của bạn.",
      totalRevenue: "Tổng doanh thu",
      fromLastMonth: "so với tháng trước",
      totalBookings: "Tổng số vé",
      activeRoutes: "Lộ trình hoạt động",
      activeBuses: "Xe đang chạy",
      revenueOverview: "Biểu đồ doanh thu",
      todaysSchedule: "Lịch trình hôm nay",
      time: "Thời gian",
      route: "Lộ trình",
      bus: "Xe buýt",
      passengers: "Hành khách",
      departure: "Khởi hành",
      arrival: "Đến nơi"
    },
    users: {
      title: "Người dùng",
      subtitle: "Quản lý tất cả khách hàng và đại lý.",
      addUser: "Thêm người dùng",
      allUsers: "Tất cả người dùng",
      name: "Tên",
      email: "Email",
      role: "Vai trò",
      joinedAt: "Ngày tham gia"
    },
    bookings: {
      title: "Đơn đặt vé",
      subtitle: "Xem và quản lý các đơn đặt vé của khách hàng.",
      allBookings: "Tất cả đơn vé",
      customer: "Khách hàng",
      bookingDate: "Ngày đặt",
      amount: "Số tiền"
    },
    trips: {
      title: "Chuyến đi",
      subtitle: "Lên lịch và theo dõi các chuyến xe.",
      addTrip: "Thêm chuyến",
      allTrips: "Tất cả chuyến đi",
      driver: "Tài xế",
      price: "Giá vé"
    },
    buses: {
      title: "Đội xe",
      subtitle: "Quản lý phương tiện, sức chứa và bảo trì.",
      addBus: "Thêm xe",
      fleetOverview: "Danh sách xe",
      busNumber: "Biển số",
      capacity: "Sức chứa",
      type: "Loại xe"
    },
    cities: {
      title: "Tỉnh thành",
      subtitle: "Quản lý các bến bãi và tỉnh thành.",
      addCity: "Thêm tỉnh thành",
      allCities: "Danh sách tỉnh thành",
      cityName: "Tên tỉnh/thành",
      region: "Khu vực",
      terminals: "Số bến xe"
    },
    routes: {
      title: "Lộ trình",
      subtitle: "Thiết lập lộ trình và thời gian tiêu chuẩn.",
      addRoute: "Thêm lộ trình",
      allRoutes: "Tất cả lộ trình",
      origin: "Điểm đi",
      destination: "Điểm đến",
      distance: "Khoảng cách",
      duration: "Thời gian đi"
    },
    settings: {
      title: "Cài Đặt Cơ Bản",
      subtitle: "Tuỳ chỉnh giao diện bảng quản trị của bạn.",
      accentColor: "Màu Chủ Đạo",
      accentDesc: "Chọn một màu chính cho các nút bấm, huy hiệu và các phần tử đang hoạt động.",
      themeMode: "Chế Độ Hiển Thị",
      lightMode: "Chế Độ Sáng",
      darkMode: "Chế Độ Tối",
      language: "Ngôn Ngữ",
      systemToggles: "Tuỳ Chọn Hệ Thống",
      compactSidebar: "Thu Gọn Thanh Bên",
      compactSidebarDesc: "Ẩn tên các mục trên thanh bên để tiết kiệm không gian.",
      showAnimations: "Hiệu Ứng Chuyển Động",
      showAnimationsDesc: "Bật hoặc tắt hiệu ứng hình ảnh (animations).",
      soundEffects: "Hiệu Ứng Âm Thanh",
      soundEffectsDesc: "Phát âm thanh khi có đơn đặt vé mới.",
      custom: "Tùy Chỉnh"
    },
    vouchers: {
      title: "Khuyến mãi",
      subtitle: "Quản lý mã giảm giá và các chương trình khuyến mãi.",
      addVoucher: "Thêm Voucher",
      allVouchers: "Tất cả Voucher",
      code: "Mã giảm giá",
      titleLabel: "Tiêu đề",
      discount: "Giảm giá",
      validUntil: "Hạn sử dụng"
    },
    banners: {
      title: "Hình ảnh/Banner",
      subtitle: "Quản lý hình ảnh và banner trên Ứng dụng & Web.",
      addBanner: "Thêm Banner",
      allBanners: "Tất cả Banner",
      image: "Hình ảnh",
      titleLabel: "Tiêu đề",
      platform: "Nền tảng",
      targetUrl: "Đường dẫn (Link)"
    },
    events: {
      title: "Sự kiện",
      subtitle: "Quản lý các sự kiện, tin tức và khuyến mãi.",
      addEvent: "Thêm sự kiện",
      allEvents: "Tất cả sự kiện",
      image: "Hình ảnh",
      titleLabel: "Tiêu đề",
      dateRange: "Thời gian"
    },
    platformStats: {
      title: "Thống Kê Nền Tảng",
      subtitle: "Cập nhật số liệu hiển thị trên website và ứng dụng.",
      editStats: "Chỉnh Sửa Thống Kê",
      totalRoutes: "Tổng Lộ Trình",
      passengers: "Hành Khách",
      onTimeRate: "Tỷ Lệ Đúng Giờ",
      ratingScore: "Điểm Đánh Giá",
      saved: "Đã lưu thống kê thành công"
    },
    websiteConfig: {
      title: "Cấu Hình Giao Diện Web",
      subtitle: "Cập nhật hình ảnh và nội dung hiển thị trên website công khai.",
      imagesSection: "Hình Ảnh Hero & Banner",
      heroBackground: "URL Ảnh Nền Trang Chủ",
      leftBanner: "URL Banner Trái",
      rightBanner: "URL Banner Phải",
      aboutContent: "Nội Dung Trang Giới Thiệu",
      aboutContentDesc: "Nội dung JSON cho trang Giới thiệu (dịch vụ, chuyên gia, v.v.)",
      saved: "Đã lưu cấu hình thành công"
    }
  }
};

export type LanguageCode = 'en' | 'vi';

export const getTranslation = (lang: string, namespace: keyof typeof translations['en'], key: string) => {
  const selectedLang = (translations as any)[lang] ? lang : 'en';
  return (translations as any)[selectedLang]?.[namespace]?.[key] || key;
};

export const useLanguage = () => {
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(localStorage.getItem('language') || 'en');
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const t = (namespace: keyof typeof translations['en'], key: string) => {
    return getTranslation(language, namespace, key);
  };

  return { language, t };
};
