# 📂 An Chuyến — Folder Structure & File Map

**Cập nhật: 2026-08-21**

---

## 📦 Project Root Structure

```
an_chuyen-master/
├── .claude/                    # Claude Code config
│   ├── launch.json            # Dev server config
│   └── worktrees/             # Worktree sessions
├── .github/                   # GitHub workflows
│   └── workflows/             # CI/CD pipelines
├── .vscode/                   # VS Code settings
├── admin/                     # Admin dashboard (React + Vite)
├── backend/                   # Backend API (Express/Hono)
├── web/                       # Frontend website (Next.js)
├── design/                    # 🎨 DESIGN SYSTEM (TÀI LIỆU THIẾT KẾ)
├── CLAUDE.md                  # Project instructions
├── DESIGN_SYSTEM_MAP.md       # 🆕 Tổng hợp design system
├── FOLDER_STRUCTURE.md        # 🆕 TÀI LIỆU NÀY
├── docker-compose.yml
├── package.json
├── package-lock.json
├── feedback.md
└── test-api-flow.sh
```

---

## 🎨 DESIGN FOLDER — Toàn bộ hệ thống thiết kế

```
design/
│
├── 📄 ART_DIRECTION.md           # Visual direction + 6 signature effects
│                                 # - Fog Dissolve, SVG Mountains, Torn Paper
│                                 # - Winding Path, Wave, Blob Clip Card
│                                 # - Typography, Colors, Layout Principles
│
├── 📄 DESIGN_SYSTEM.md           # Color tokens, Typography, Spacing
│                                 # - Buttons, Cards, Forms, Inputs
│                                 # - Navigation, Section Transitions
│                                 # - Gradients, Icons, Responsive Breakpoints
│
├── 📄 UX_PRINCIPLES.md           # Navigation flows, Search, Booking
│                                 # - Seat Selection, Auth Flow
│                                 # - Error/Loading States, Accessibility
│                                 # - Mobile-specific UX
│
├── 📄 MOTION_GUIDELINES.md       # Animation timing, easing, when to animate
│                                 # - Hero intro, Scroll-triggered, Hover states
│                                 # - Stats counter, Page transitions
│                                 # - Framer Motion patterns
│
├── 📄 DESIGN_SYSTEM_MAP.md       # 🆕 Bản đồ tổng hợp (tất cả nội dung)
│
├── decisions/                    # Lịch sử quyết định thiết kế
│   ├── hero.md                  # Hero section: SVG mountains, fog dissolve, search overlap
│   └── booking.md               # Booking flow: 5-step linear, seat map, payment page
│
└── references/                   # Visual reference library
    └── README.md                # Guide: khi nào có reference, lưu như thế nào

```

---

## 💻 WEB FOLDER — Frontend (Next.js 14 + Tailwind)

```
web/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── search/              # Search results page
│   │   ├── trips/               # Trip listing
│   │   ├── seat-selection/      # Seat selection page
│   │   ├── booking-review/      # Booking review page
│   │   ├── payment/             # Payment page
│   │   ├── confirmation/        # Confirmation page
│   │   ├── my-bookings/         # User bookings
│   │   ├── profile/             # User profile
│   │   ├── auth/                # Auth pages (login, signup)
│   │   └── admin/               # Admin pages
│   │
│   ├── components/
│   │   ├── ui/                  # Design system base components
│   │   │   ├── Button.tsx      # Primary, Dark, Outline, Ghost buttons
│   │   │   ├── Card.tsx        # Base card component
│   │   │   ├── Input.tsx       # Input field
│   │   │   ├── Modal.tsx       # Modal dialog
│   │   │   └── Badge.tsx       # Badge component
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── Navigation.tsx  # Global navbar
│   │   │   ├── Footer.tsx      # Footer
│   │   │   ├── TornEdge.tsx    # Torn paper transition (E3)
│   │   │   ├── WaveTransition.tsx # Wave transition (E5)
│   │   │   └── MobileNav.tsx   # Mobile bottom nav
│   │   │
│   │   └── features/            # Feature-specific components
│   │       ├── SearchBar.tsx   # Search form (3 fields)
│   │       ├── TripCard.tsx    # Trip listing card
│   │       ├── SeatMap.tsx     # Seat selection grid
│   │       ├── ServiceCard.tsx # Service card (blob clip)
│   │       ├── BlogCard.tsx    # Blog post card
│   │       ├── RouteCard.tsx   # Route narrative card
│   │       ├── StatsSection.tsx # Stats counter
│   │       └── HeroSection.tsx # Hero with SVG mountains
│   │
│   ├── lib/
│   │   ├── api.ts              # Axios instance (JWT auto-attach)
│   │   ├── queries/            # React Query hooks
│   │   │   ├── trips.ts       # Trip queries
│   │   │   ├── bookings.ts    # Booking queries
│   │   │   ├── seats.ts       # Seat queries
│   │   │   └── auth.ts        # Auth queries
│   │   ├── utils.ts           # Helper functions
│   │   └── constants.ts       # Constants (colors, breakpoints)
│   │
│   ├── styles/
│   │   ├── globals.css        # Global styles + CSS variables
│   │   │   # --ink, --fog, --gold, --amber, --forest, --slate, --mist
│   │   │   # Font stacks, spacing, animation timings
│   │   └── tailwind.config.ts # Tailwind configuration
│   │
│   └── hooks/
│       ├── useAuth.ts         # Auth context hook
│       ├── useBooking.ts      # Booking state hook
│       ├── useReducedMotion.ts # prefers-reduced-motion
│       └── useScrollPosition.ts # Track scroll for nav animation
│
├── public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/                 # Cormorant Garamond, Barlow Condensed, Inter, Space Mono
│
├── .env.example               # Environment variables template
├── next.config.ts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ BACKEND FOLDER — API (Express/Hono + Prisma)

```
backend/
├── src/
│   ├── index.ts                # Main server entry point
│   ├── auth.routes.ts          # Authentication endpoints
│   ├── admin.routes.ts         # Admin panel endpoints
│   │
│   ├── core/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── supabase.ts        # Supabase client
│   │   ├── logger.ts          # Logging setup
│   │   ├── cache.ts           # Caching logic
│   │   ├── audit.ts           # Audit logging
│   │   └── socket.ts          # WebSocket setup
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── admin.middleware.ts # Admin role check
│   │   ├── error.middleware.ts # Error handling
│   │   └── logging.middleware.ts # Request logging
│   │
│   └── modules/
│       ├── booking/            # Booking module
│       │   ├── booking.routes.ts
│       │   ├── booking.service.ts
│       │   └── booking.model.ts
│       ├── trips/             # Trips module
│       ├── seats/             # Seat management
│       ├── payment/           # Payment processing
│       ├── users/             # User management
│       ├── loyalty/           # Loyalty points
│       ├── delivery/          # Delivery management
│       ├── ai-advisor/        # AI chat advisor
│       └── event/             # Event management
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Database seeding scripts
│
├── .env.example
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

---

## 👨‍💼 ADMIN FOLDER — Dashboard (React + Vite)

```
admin/
├── src/
│   ├── App.tsx                # Main app component
│   ├── index.tsx              # Entry point
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Login.tsx          # Admin login
│   │   ├── Buses.tsx          # Bus management
│   │   ├── Routes.tsx         # Route management
│   │   ├── Trips.tsx          # Trip management
│   │   ├── Bookings.tsx       # Booking management
│   │   ├── Users.tsx          # User management
│   │   ├── Reviews.tsx        # Review management
│   │   ├── Events.tsx         # Event management
│   │   ├── Vouchers.tsx       # Voucher management
│   │   ├── RevenueDetails.tsx # Revenue analytics
│   │   ├── Settings.tsx       # Admin settings
│   │   └── ...
│   │
│   ├── components/
│   │   ├── Sidebar.tsx        # Sidebar navigation
│   │   ├── Table.tsx          # Reusable table
│   │   ├── Modal.tsx          # Modal dialog
│   │   ├── Select.tsx         # Select dropdown
│   │   ├── ActionButtons.tsx  # Action buttons
│   │   ├── ActionMenu.tsx     # Action menu
│   │   ├── WalletManagerModal.tsx  # Wallet management
│   │   ├── SeatManagerModal.tsx    # Seat management
│   │   └── PlaceholderPage.tsx
│   │
│   ├── layouts/
│   │   └── AdminLayout.tsx    # Admin layout wrapper
│   │
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── navigation.ts      # Navigation structure
│   │   ├── i18n.ts            # Internationalization
│   │   ├── placeholder.ts
│   │   └── bookingStatus.ts
│   │
│   ├── hooks/
│   │   └── useMenuGroupState.ts
│   │
│   ├── styles/
│   │   └── index.css          # Admin styles
│   │
│   └── assets/
│       └── logo.png
│
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   └── manifest.json
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── Dockerfile
```

---

## 📋 Root Level Config Files

```
an_chuyen-master/
│
├── 📄 CLAUDE.md                 # Project instructions (READ THIS FIRST!)
├── 📄 DESIGN_SYSTEM_MAP.md      # 🆕 Design system summary (3,400+ lines)
├── 📄 FOLDER_STRUCTURE.md       # 🆕 TÀI LIỆU NÀY
│
├── 📄 .env                      # Environment variables (git ignored)
├── 📄 .env.example              # Environment template
├── 📄 .gitignore                # Git ignore rules
│
├── 📄 docker-compose.yml        # Docker compose config
├── 📄 package.json              # Root package.json
├── 📄 package-lock.json         # Lock file
│
├── 📄 feedback.md               # User feedback log
├── 📄 test-api-flow.sh          # API testing script
│
└── 📄 README.md                 # Project readme
```

---

## 🔍 Key Files You Need to Know

### Design & UX
- **design/DESIGN_SYSTEM_MAP.md** ← START HERE (tất cả thiết kế)
- **design/ART_DIRECTION.md** ← Visual style guide
- **design/DESIGN_SYSTEM.md** ← Colors, typography, components
- **design/UX_PRINCIPLES.md** ← Flows, navigation, accessibility
- **design/MOTION_GUIDELINES.md** ← Animation rules
- **CLAUDE.md** ← Project instructions

### Frontend Code
- **web/src/components/ui/** ← Base design system components
- **web/src/components/layout/** ← Nav, footer, transitions
- **web/src/styles/globals.css** ← CSS variables
- **web/tailwind.config.ts** ← Tailwind configuration

### Backend
- **backend/prisma/schema.prisma** ← Database schema
- **backend/src/modules/booking/** ← Booking logic
- **backend/src/middleware/auth.middleware.ts** ← JWT auth

### Admin
- **admin/src/pages/** ← Admin pages
- **admin/src/components/Sidebar.tsx** ← Navigation

---

## 🎨 Design System Files — Full List

```
design/
├── ART_DIRECTION.md
│   • Core Concept: Cinematic Adventure Travel
│   • 6 Signature Effects (Fog Dissolve, SVG Mountains, etc.)
│   • Atmospheric Perspective Rule
│   • Typography Direction
│   • Color Mood Table
│   • Layout Principles
│   • Anti-patterns (what to AVOID)
│
├── DESIGN_SYSTEM.md
│   • Color Tokens (CSS variables: --ink, --fog, --gold, etc.)
│   • Typography Stack (Cormorant, Barlow, Inter, Space Mono)
│   • Type Scale (Display, Heading, Body, Label)
│   • Spacing Scale
│   • Buttons (Primary, Dark, Outline, Ghost)
│   • Cards (Service, Route, Blog)
│   • Section Transitions (Torn Paper, Wave)
│   • Navigation Styles
│   • Forms & Inputs
│   • CSS Landscape Gradients
│   • Icons & Responsive Breakpoints
│
├── UX_PRINCIPLES.md
│   • 4 Core Jobs To Be Done
│   • Navigation (Desktop & Mobile)
│   • Search Bar (Priority)
│   • Search Results Page
│   • Seat Selection Flow
│   • Booking Flow (5 steps)
│   • Auth Flow
│   • Error & Loading States
│   • Empty States
│   • Performance UX
│   • Accessibility Rules
│   • Mobile-Specific Guidelines
│
├── MOTION_GUIDELINES.md
│   • Philosophy: "Motion phục vụ nội dung"
│   • Timing Scale (Instant → Cinematic)
│   • Easing Functions
│   • WHEN TO ANIMATE (hero, scroll-triggered, hover, stats)
│   • WHEN NOT TO ANIMATE (parallax, torn edge, spinner)
│   • Framer Motion Patterns
│   • prefers-reduced-motion
│   • Mobile Motion Rules
│
├── DESIGN_SYSTEM_MAP.md (🆕)
│   • Tất cả nội dung trên + references + decisions
│   • Cheatsheet nhanh
│   • Pre-update checklist
│
├── decisions/
│   ├── hero.md
│   │   • SVG mountains vs real images
│   │   • Fog dissolve CSS mask technique
│   │   • Search bar overlap positioning
│   │   • Hero heading font choice
│   │
│   └── booking.md
│       • 5-step linear flow (why)
│       • CSS Grid seat map (not canvas)
│       • Payment page stripped UI
│       • Price visibility strategy
│       • 10-minute seat lock countdown
│
└── references/
    └── README.md
        • How to use visual references
        • References list (hero, route, cards, etc.)
        • Analysis of each reference
```

---

## 📊 File Statistics

| Folder | Purpose | Status |
|--------|---------|--------|
| design/ | Design system docs | ✅ Complete (8 files) |
| web/ | Frontend Next.js | 🔄 In development |
| backend/ | API + Database | 🔄 In development |
| admin/ | Admin dashboard | 🔄 In development |
| .claude/ | Claude Config | ✅ Ready |
| .github/ | CI/CD | ✅ Ready |

---

## 🚀 How to Use This Map

1. **New to project?** → Start with `DESIGN_SYSTEM_MAP.md`
2. **Want to change colors?** → Check `DESIGN_SYSTEM.md` + `ART_DIRECTION.md`
3. **Building a component?** → Read `web/src/components/ui/`
4. **Adding animation?** → Read `MOTION_GUIDELINES.md`
5. **Changing a flow?** → Read `UX_PRINCIPLES.md`
6. **Making a design decision?** → Write to `design/decisions/`

---

**Last updated: 2026-08-21**
**Design System Version: 1.0**
