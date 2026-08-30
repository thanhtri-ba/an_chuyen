# 🚀 Full Web Optimization Plan

**Target:** 47 React components | 22 pages | Comprehensive performance improvement
**Started:** 2026-08-21

---

## 📋 Optimization Phases

### PHASE 1: Code Splitting & Lazy Loading
- [ ] App.tsx: Replace static imports with React.lazy() for all 22 pages
- [ ] Reduce initial bundle from ~500KB to ~150KB
- [ ] Add Suspense fallback components
- [ ] Route-based code splitting

### PHASE 2: Component Optimization
**Design System (8 components):**
- [ ] Button.tsx - Add memo, extract variants
- [ ] Card.tsx - Add memo
- [ ] Input.tsx - Add memo
- [ ] Modal.tsx - Optimize overlay rendering
- [ ] Checkbox.tsx - Add memo
- [ ] Badge.tsx - Add memo
- [ ] Skeleton.tsx - Add memo
- [ ] Tabs.tsx - Optimize tab switching

**Shared Components (7 components):**
- [ ] Header.tsx - ✅ DONE
- [ ] Footer.tsx - Extract sections, add memo
- [ ] CookieConsent.tsx - Lazy load
- [ ] FloatingChat.tsx - Lazy load, virtualize messages
- [ ] ErrorBoundary.tsx - Optimize error UI
- [ ] RouteMap.tsx - Lazy load map library
- [ ] StationMap.tsx - Lazy load map library

**Feature Pages (22 components):**
- [ ] HomePage - Lazy load sections, image optimization
- [ ] TripSearchPage - Memoize search results, virtualize list
- [ ] SeatSelectionPage - Optimize seat grid rendering
- [ ] PaymentPage - Optimize form validation
- [ ] BookingReviewPage - Memoize review details
- [ ] ... (all 22 pages)

### PHASE 3: State Management
- [ ] Reduce unnecessary re-renders with useCallback/useMemo
- [ ] Implement Context memoization
- [ ] Add React.memo to leaf components
- [ ] Optimize AuthContext to prevent full tree re-renders

### PHASE 4: Asset Optimization
- [ ] Image lazy loading (next/image or lazy img)
- [ ] WebP format support
- [ ] SVG optimization
- [ ] Font loading strategy (system fonts first, web fonts async)

### PHASE 5: Build Optimization
- [ ] Check webpack/vite bundle
- [ ] Tree-shake unused dependencies
- [ ] Minify CSS
- [ ] Compress images
- [ ] Add gzip compression

### PHASE 6: Runtime Optimization
- [ ] Virtualize long lists (notifications, bookings, blog posts)
- [ ] Implement request caching
- [ ] Add service worker for offline support
- [ ] Optimize animations (GPU acceleration)

---

## 🎯 Quick Wins (High Impact, Low Effort)

1. **Lazy load all pages** - ⬇️ ~60% initial bundle reduction
2. **Add React.memo to components** - ⬆️ Prevent unnecessary re-renders
3. **Optimize images** - ⬇️ ~40% image size reduction
4. **Extract inline styles** - ⬆️ CSS parsing optimization
5. **Memoize expensive calculations** - ⬆️ FCP by 15-20%

---

## 📊 Expected Results

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Initial Bundle | ~500KB | ~150KB | ⬇️ 70% |
| LCP | ~3.2s | ~1.8s | ⬆️ 44% |
| FCP | ~2.1s | ~1.0s | ⬆️ 52% |
| CLS | 0.15 | 0.05 | ⬆️ 67% |
| TTI | ~4.5s | ~2.2s | ⬆️ 51% |

---

## 🔧 Implementation Order

```
1. App.tsx (code splitting)
   ↓
2. Design system components (memo + extract)
   ↓
3. Shared components (memo + lazy load)
   ↓
4. Feature pages (memo + optimization)
   ↓
5. Images & assets (webp, lazy load)
   ↓
6. Bundle & build optimization
   ↓
7. Runtime optimizations (virtualization, caching)
   ↓
8. Testing & monitoring
```

---

## File Structure to Optimize

```
web/src/
├── App.tsx                          [PHASE 1] Code splitting
├── main.tsx                         [PHASE 6] Preload hints
├── design-system/components/
│   ├── Button.tsx                   [PHASE 2] Memo
│   ├── Card.tsx                     [PHASE 2] Memo
│   ├── Input.tsx                    [PHASE 2] Memo
│   ├── Modal.tsx                    [PHASE 2] Optimize overlay
│   ├── Checkbox.tsx                 [PHASE 2] Memo
│   ├── Badge.tsx                    [PHASE 2] Memo
│   ├── Skeleton.tsx                 [PHASE 2] Memo
│   └── Tabs.tsx                     [PHASE 2] Optimize
├── shared/components/
│   ├── Header.tsx                   ✅ DONE
│   ├── Footer.tsx                   [PHASE 2] Memo
│   ├── CookieConsent.tsx            [PHASE 2] Lazy
│   ├── FloatingChat.tsx             [PHASE 2] Lazy + Virtualize
│   ├── ErrorBoundary.tsx            [PHASE 2] Optimize
│   ├── RouteMap.tsx                 [PHASE 4] Lazy map
│   └── StationMap.tsx               [PHASE 4] Lazy map
├── features/
│   ├── home/                        [PHASE 2] Lazy sections
│   ├── trip-search/                 [PHASE 2] Virtualize
│   ├── seat-selection/              [PHASE 2] Optimize grid
│   ├── booking-review/              [PHASE 2] Memo
│   ├── payment/                     [PHASE 2] Form opt
│   ├── auth/                        [PHASE 2] No opt needed
│   ├── profile/                     [PHASE 2] Form opt
│   ├── my-bookings/                 [PHASE 2] Virtualize
│   ├── blog/                        [PHASE 2] Lazy image + Virtualize
│   ├── loyalty/                     [PHASE 2] Lazy content
│   ├── notifications/               [PHASE 2] Virtualize
│   ├── offers/                      [PHASE 2] Lazy cards
│   ├── schedule/                    [PHASE 2] Memo
│   ├── about/                       [PHASE 2] Lazy content
│   ├── ai/                          [PHASE 2] Lazy
│   └── services/                    [PHASE 2] Lazy maps
├── contexts/
│   └── AuthContext.tsx              [PHASE 3] Memoize
└── styles/
    └── globals.css                  [PHASE 5] Minify
```

---

## Success Criteria

✅ All pages lazy loaded
✅ All components memoized (where applicable)
✅ Images lazy loaded + WebP format
✅ Initial JS bundle < 200KB (gzipped)
✅ LCP < 2.5s
✅ FCP < 1.5s
✅ CLS < 0.1
✅ No console errors/warnings
✅ Lighthouse score > 85

---

## Progress Tracking

```
PHASE 1: [ ] 0% → [Progress bar here]
PHASE 2: [ ] 0%
PHASE 3: [ ] 0%
PHASE 4: [ ] 0%
PHASE 5: [ ] 0%
PHASE 6: [ ] 0%

Total: 0/47 components optimized
```
