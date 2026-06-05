# Nexum — Development Plan & TODO
**Version:** 1.0  
**Date:** June 2026  
**Methodology:** Iterative sprints, P0 features first

---

## Prompt Assessment (Final)

The combined prompt across both documents is **95% production-ready** with the following corrections needed before coding:

### Issues to Fix Before Starting
1. **Profile 1 & 2 still say "mobile app"** — should read "web portal" per the updated direction
2. **Responder layout.tsx note** still references "mobile-first max-width container" — remove entirely
3. **Auth strategy not defined** — PRD now specifies JWT (RS256), HttpOnly cookies, 8h expiry
4. **Role-based route protection** not specified — TDD now covers Next.js middleware guard
5. **Error/empty/offline states** were absent in original — Component Spec now covers all
6. **"Bottom sheet" terminology** in LocationManualPicker — updated to "modal overlay" in spec

**Verdict:** With the four pre-coding documents in this set (PRD, TDD, User Flows, Component Spec), the codebase can begin immediately. No further prompt revision required.

---

## Sprint Plan

### Sprint 0 — Foundation (Week 1)
**Goal:** Scaffolding, design system, auth

- [ ] Initialise Next.js 14 App Router project with TypeScript strict mode
- [ ] Install and configure Tailwind CSS with Nexum token config (tailwind.config.ts)
- [ ] Configure DM Sans + Inter + JetBrains Mono font loading (self-hosted)
- [ ] Install dependencies: framer-motion, lucide-react, zustand, axios, react-hook-form, zod, leaflet, react-leaflet, @microsoft/signalr
- [ ] Set up project directory structure per TDD §4
- [ ] Build `/auth/login` — split layout, role chips, form, 2FA field, dev mode
- [ ] Build `/auth/verify` — OTP input, countdown, resend
- [ ] Implement JWT auth store (Zustand) — token, role, user profile
- [ ] Implement Next.js middleware for role-based route protection
- [ ] Build `ConnectionBadge` shared component (all 4 states)
- [ ] Build `GpsAccuracyAlert` shared component (all 3 states)
- [ ] Set up Axios instance with JWT interceptors and silent refresh

---

### Sprint 1 — Worshipper Portal Core (Week 2)
**Goal:** Emergency dispatch end-to-end (P0 features)

- [ ] Build worshipper `layout.tsx` — top nav, GPS + connection badges
- [ ] Build `/worshipper` home dashboard — quick-action grid (6 cards)
- [ ] Build `EmergencyButton` — idle pulse ring, press scale, layoutId morph
- [ ] Build `/worshipper/emergency` — incident type pills, button, detail field, photo upload
- [ ] Build `LocationSelector` — GPS accuracy trigger, two-tap zone/landmark flow
- [ ] Build `/worshipper/emergency/connecting` — DispatchPulse, ETA counter, reference ID
- [ ] Integrate SignalR `useSignalR` hook — connection, reconnect, event subscription
- [ ] Integrate `useGps` hook — geolocation, accuracy classification
- [ ] Build `/worshipper/incident/:id` — IncidentTracker, status timeline, ETA, escalation log
- [ ] Wire `ReceiveIncidentUpdate` SignalR event to incident tracker
- [ ] Build `LocationManualPicker` modal — landmark dataset, search, confirm

---

### Sprint 2 — Worshipper Portal Extended (Week 3)
**Goal:** Additional worshipper features (P1 features)

- [ ] Build `MissingChildForm` — 3-step, step indicator, photo dropzone
- [ ] Build `/worshipper/missing-child` page
- [ ] Build `ParkingReportForm` — segmented control, monospace plate input, owner contact toggle
- [ ] Build `/worshipper/parking` page
- [ ] Build `VehiclePinMap` — MapCanvas, click-to-pin, confirmation panel, saved state
- [ ] Build `/worshipper/my-vehicle` page
- [ ] Build `MapCanvas` shared component — OSM tiles, loading skeleton, offline banner
- [ ] Implement Service Worker — tile cache-first strategy
- [ ] Implement `useMapTiles` hook — offline detection, cache status flag
- [ ] Build `DispatchPulse` shared component

---

### Sprint 3 — Responder Portal (Week 4)
**Goal:** Full responder flow (P0 features)

- [ ] Build responder `layout.tsx` — top nav, connection badge, GPS sync counter
- [ ] Build `/responder/onboarding` — 4-step form, vetting pending screen, camera snapshot
- [ ] Implement `VettingCard` component (used in both responder onboarding + admin vetting)
- [ ] Implement WebSocket listener for `OnClearanceApproved`
- [ ] Build `StandbyConsole` — duty toggle, zone card, recent incident log
- [ ] Build `/responder` standby page
- [ ] Build `IntakeOverlay` — full-screen interrupt, AnimatePresence
- [ ] Build `CountdownBar` — depleting progress bar, `onExpired` callback
- [ ] Build `/responder/intake` page
- [ ] Build `RouteMap` — OSM + pgRouting path, 0.5s linear position tracking
- [ ] Build `MissionControls` — Arrived, Request Backup, triage outcome form
- [ ] Build `/responder/mission/:id` page
- [ ] Wire `TriggerIntakeAlert` SignalR event to IntakeOverlay

---

### Sprint 4 — Admin Dashboard Core (Week 5)
**Goal:** Command center, vetting, roster (P0 features)

- [ ] Build admin `layout.tsx` — fixed sidebar (240px), topbar shell
- [ ] Build `IncidentFeed` — AnimatePresence list, urgency sort, severity borders
- [ ] Build `TacticalMap` — geofence polygon, responder dots, incident markers
- [ ] Implement responder dot smooth position animation (0.5s linear)
- [ ] Build `FootprintToggle` — shared layoutId pill animation
- [ ] Build `ProximityMatrix` — pairing ledger, ETA, RE-ROUTE ASSET button
- [ ] Build `/admin` command center — 3-pane layout composition
- [ ] Build `PersonnelRoster` — dense table, filters, CSV import, command line
- [ ] Build `/admin/roster` page
- [ ] Build `VettingCard` admin variant — photo, metadata, Approve/Reject, audit log
- [ ] Build `/admin/vetting` page — side-by-side layout
- [ ] Implement keyboard shortcuts (A / R) for vetting
- [ ] Wire all admin SignalR events: `ReceiveIncidentUpdate`, `UpdateResponderPosition`, `ReceiveEscalationAlert`, `ParkingEscalation`

---

### Sprint 5 — Resilience & Admin Analytics (Week 6)
**Goal:** Failover, SMS fallback, analytics (P1-P2 features)

- [ ] Build Connection Watchdog service — 10s heartbeat failure detection
- [ ] Implement SMS fallback mode — amber UI badge, encoder integration
- [ ] Build `useSignalR` degraded transport mode transition
- [ ] Build `/admin/analytics` — KPI cards, 4 chart types (recharts/chart.js)
- [ ] Build indoor GPS degradation badge + force-picker trigger
- [ ] Build congestion zone painter on TacticalMap (P2 — drag to draw polygon)
- [ ] Implement `prefers-reduced-motion` — audit all Framer Motion components
- [ ] WCAG AA contrast audit — all color pairings
- [ ] Focus ring audit — all interactive elements
- [ ] ARIA live region audit — incident feed, connection badge

---

### Sprint 6 — QA, Polish & Pre-Event Testing (Week 7)
**Goal:** Production readiness

- [ ] Loading state audit — every data-dependent component has loading skeleton
- [ ] Empty state audit — every list/table has empty state UI
- [ ] Error state audit — every network-dependent component has error state
- [ ] Offline map tile pre-caching — populate `public/tiles/` with Redemption City tiles
- [ ] Performance: verify all animations use transform/opacity only (no layout thrash)
- [ ] Lighthouse PWA audit (offline capability, fast load)
- [ ] Cross-browser testing: Chrome, Firefox, Safari, Samsung Internet
- [ ] Responsive breakpoint audit: 360px, 768px, 1024px, 1280px, 1440px
- [ ] Security audit: JWT HttpOnly, RLS policies, route protection
- [ ] 72-hour pre-event checklist (per DEPLOYMENT_AND_RUNBOOK.md)
- [ ] End-to-end test: emergency dispatch → assign → arrive → close
- [ ] End-to-end test: responder onboarding → vetting → standby → mission
- [ ] Load test: simulate 50 concurrent incident submissions

---

## Dependency Map

```
Sprint 0 (Auth + Design System)
    └── Sprint 1 (Worshipper Core — needs auth, ConnectionBadge, GpsAccuracyAlert)
            └── Sprint 2 (Worshipper Extended — needs MapCanvas, LocationManualPicker)
    └── Sprint 3 (Responder Portal — needs auth, ConnectionBadge, VettingCard)
            └── Sprint 4 (Admin Dashboard — needs all shared components, SignalR events)
                    └── Sprint 5 (Resilience + Analytics)
                            └── Sprint 6 (QA + Polish)
```

---

## Open Decisions (Resolve Before Sprint 1)

| Decision | Options | Recommended |
|---|---|---|
| Map tile provider | Mapbox, MapLibre, plain Leaflet+OSM | Leaflet + OSM (free, no API key congestion risk) |
| Push notifications | Firebase Cloud Messaging vs SignalR only | FCM for background, SignalR for foreground |
| Chart library | Recharts vs Chart.js | Recharts (React-native, easier theming) |
| Camera capture (onboarding) | Browser getUserMedia vs file input fallback | getUserMedia with file input fallback |
| Offline tile format | Raster PNG vs Vector tiles | Raster PNG (simpler caching, works offline reliably) |
| Admin dark mode | Always dark vs toggle | Always dark for admin only; light for worshipper/responder |
| State persistence | Zustand + sessionStorage vs in-memory only | In-memory (security: no sensitive data in storage) |

---

## Landmark Reference Data (Pre-load in `lib/spatial.ts`)

```typescript
export const LANDMARKS = [
  { id: 1,  name: 'Old Auditorium',        zone: 'Auditorium',    lat: 6.8055, lng: 3.4182 },
  { id: 2,  name: 'The Arena (3M)',          zone: 'Auditorium',    lat: 6.8188, lng: 3.4395 },
  { id: 3,  name: 'Children Auditorium',     zone: 'Auditorium',    lat: 6.8042, lng: 3.4195 },
  { id: 4,  name: 'Youth Centre Main Hall',  zone: 'Youth Center',  lat: 6.8122, lng: 3.4211 },
  { id: 10, name: 'Car Park A',              zone: 'Car Park',      lat: 6.8038, lng: 3.4165 },
  { id: 11, name: 'Car Park C (Arena)',      zone: 'Car Park',      lat: 6.8155, lng: 3.4350 },
  { id: 13, name: 'RCCG Medical Centre',     zone: 'Hospital',      lat: 6.8095, lng: 3.4135 },
  { id: 19, name: 'Open Heavens Sanctuary',  zone: 'Notable Place', lat: 6.8072, lng: 3.4138 },
  { id: 21, name: 'Emmanuel Amusement Park', zone: 'Notable Place', lat: 6.8015, lng: 3.4152 },
  { id: 22, name: 'National Kitchen',        zone: 'Notable Place', lat: 6.8035, lng: 3.4188 },
] as const

export const CAMPUS_CENTROID = { lat: 6.8111, lng: 3.4244 }
export const CAMPUS_BOUNDS = {
  north: 6.8375, south: 6.7385, west: 3.3912, east: 3.4545
}
```
