# Nexum — Technical Design Document (TDD)
**Version:** 1.0  
**Status:** Pre-Development  
**Date:** June 2026

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Worshipper  │  │   Responder  │  │  Admin Dashboard │  │
│  │  Web Portal  │  │  Web Portal  │  │   (Desktop-first)│  │
│  │  (Responsive)│  │  (Responsive)│  │                  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼────────────────────┼────────────┘
          │                 │                    │
          ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   TRANSPORT LAYER                           │
│   SignalR WebSocket (primary) │ SMS Gateway (fallback)      │
│   Firebase Cloud Messaging (push notifications)             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              ASP.NET CORE BACKEND ENGINE                    │
│  ┌──────────────┐  ┌────────────┐  ┌───────────────────┐   │
│  │  SignalR Hub │  │  REST API  │  │  Background Jobs  │   │
│  │  (Real-time) │  │ (Commands) │  │ (Escalation/Route)│   │
│  └──────────────┘  └────────────┘  └───────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE POSTGRESQL + POSTGIS                  │
│  Spatial tables │ GiST indexes │ pgRouting graph            │
│  Row-Level Security │ Point geometry │ Polygon geofences    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

| Concern | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for auth pages, CSR for real-time portals |
| Language | TypeScript 5.x | Strict mode enabled |
| Styling | Tailwind CSS 3.x | Extended with Nexum token config |
| Animation | Framer Motion 11.x | GPU-only properties; prefers-reduced-motion respected |
| Maps | Leaflet.js + React-Leaflet | OSM tiles cached via Service Worker |
| Real-time | @microsoft/signalr | WebSocket with HTTP fallback |
| Icons | lucide-react | No emoji in production UI |
| Forms | React Hook Form + Zod | Validation at field level |
| State | Zustand | Per-portal slice stores |
| HTTP | Axios | Interceptors for JWT refresh |
| Fonts | DM Sans (headings) + Inter (body) | Google Fonts, self-hosted for offline |

---

## 3. Design Token Configuration (tailwind.config.ts)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'nexum-blue': {
          DEFAULT: '#1a2faa',
          50:  '#eef0fb',
          100: '#d5d9f5',
          500: '#1a2faa',
          600: '#1527a0',
          700: '#0f1d8f',
          900: '#080d5c',
        },
        'nexum-amber': {
          DEFAULT: '#f5a623',
          50:  '#fef8ee',
          100: '#fde8c2',
          500: '#f5a623',
          600: '#e8950f',
          700: '#c47c0a',
        },
        'nexum-red':    '#D32F2F',
        'nexum-yellow': '#FBC02D',
        'nexum-green':  '#388E3C',
        'nexum-slate':  '#0B0F19',
      },
      fontFamily: {
        heading: ['DM Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1':      ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h2':      ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body':    ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // 8px grid — all values are multiples of 8
        '18': '72px',
        '22': '88px',
        '30': '120px',
      },
      borderRadius: {
        'card':   '12px',
        'input':  '8px',
        'pill':   '9999px',
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'modal':    '0 20px 60px rgba(0,0,0,0.20)',
      },
      animation: {
        'ping-slow':  'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(0.95)', opacity: '0.7' },
          '100%': { transform: 'scale(1.4)',  opacity: '0' },
        },
      },
    },
  },
}
export default config
```

---

## 4. Project Directory Structure

```
nexum-web/
├── app/
│   ├── layout.tsx                  # Root layout — font imports, metadata
│   ├── auth/
│   │   ├── login/page.tsx          # Split-layout login, role selector
│   │   └── verify/page.tsx         # OTP verification screen
│   ├── worshipper/
│   │   ├── layout.tsx              # Top nav, GPS badge, connection badge
│   │   ├── page.tsx                # Home dashboard — quick-action grid
│   │   ├── emergency/
│   │   │   ├── page.tsx            # Emergency dispatch screen
│   │   │   └── connecting/page.tsx # Post-tap connecting overlay
│   │   ├── incident/[id]/page.tsx  # Incident status tracker
│   │   ├── missing-child/page.tsx  # Missing child report form
│   │   ├── parking/page.tsx        # Parking report form
│   │   └── my-vehicle/page.tsx     # Vehicle pin map
│   ├── responder/
│   │   ├── layout.tsx              # Top nav, connection/GPS badges
│   │   ├── onboarding/page.tsx     # Multi-step registration + vetting pending
│   │   ├── page.tsx                # Standby console
│   │   ├── intake/page.tsx         # Incoming dispatch overlay
│   │   └── mission/[id]/page.tsx   # Active mission + route map
│   └── admin/
│       ├── layout.tsx              # Sidebar + topbar shell
│       ├── page.tsx                # Command center (3-pane)
│       ├── roster/page.tsx         # Personnel roster table
│       ├── vetting/page.tsx        # Vetting terminal
│       └── analytics/page.tsx      # KPI dashboard + charts
├── components/
│   ├── worshipper/
│   │   ├── EmergencyButton.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── IncidentTracker.tsx
│   │   ├── MissingChildForm.tsx
│   │   ├── ParkingReportForm.tsx
│   │   └── VehiclePinMap.tsx
│   ├── responder/
│   │   ├── StandbyConsole.tsx
│   │   ├── IntakeOverlay.tsx
│   │   ├── CountdownBar.tsx
│   │   ├── RouteMap.tsx
│   │   └── MissionControls.tsx
│   ├── admin/
│   │   ├── IncidentFeed.tsx
│   │   ├── TacticalMap.tsx
│   │   ├── ProximityMatrix.tsx
│   │   ├── FootprintToggle.tsx
│   │   ├── PersonnelRoster.tsx
│   │   └── VettingCard.tsx
│   └── shared/
│       ├── ConnectionBadge.tsx
│       ├── GpsAccuracyAlert.tsx
│       ├── LocationManualPicker.tsx
│       ├── MapCanvas.tsx
│       └── DispatchPulse.tsx
├── lib/
│   ├── signalr.ts                  # Connection factory + watchdog
│   ├── api.ts                      # Axios instance + JWT interceptors
│   ├── geo.ts                      # GPS utilities, accuracy classification
│   ├── sms-encoder.ts              # SMS telemetry fallback encoder
│   └── spatial.ts                  # Landmark data, zone definitions
├── hooks/
│   ├── useSignalR.ts               # Connection state hook
│   ├── useGps.ts                   # Geolocation + accuracy tracking
│   ├── useIncident.ts              # Incident lifecycle state
│   └── useMapTiles.ts              # Offline tile cache status
├── store/
│   ├── auth.store.ts               # JWT, role, user profile
│   ├── incident.store.ts           # Active incident state
│   ├── responder.store.ts          # Duty status, mission state
│   └── admin.store.ts              # Feed, roster, map state
├── public/
│   └── tiles/                      # Pre-cached OSM map tiles
├── service-worker.ts               # Tile cache + offline fallback
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 5. State Machine — Responder Portal

```
UNREGISTERED
     │ submit registration form
     ▼
VETTING_PENDING
     │ Admin clicks APPROVE & AUTHORIZE
     │ OnClearanceApproved WebSocket event
     ▼
STANDBY (Available / Off-Duty toggle)
     │ PostGIS proximity match fires
     │ IntakeOverlay interrupt
     ▼
INTAKE (15s countdown)
     │ ACCEPT_DISPATCH tap
     ▼
EN_ROUTE
     │ ARRIVED_AT_SCENE tap
     ▼
ON_SCENE
     │ Submit triage form
     ▼
MISSION_CLOSED → back to STANDBY
     │ (or REQUEST_BACKUP → escalation → new responder assigned)
```

---

## 6. State Machine — Emergency Incident

```
CREATED (worshipper taps dispatch button)
     │ Server captures GPS, runs PostGIS KNN
     ▼
DISPATCHED (nearest responder notified)
     │ Responder accepts within 15s
     ▼
RESPONDER_ASSIGNED
     │ Responder starts moving
     ▼
EN_ROUTE
     │ Responder taps ARRIVED
     ▼
ARRIVED
     │ Responder submits triage outcome
     ▼
RESOLVED
     ─ If no acknowledgement in 15s:
       AUTO_ESCALATED → back to DISPATCHED with next responder
```

---

## 7. SignalR Hub Contract

### Server → Client Events
| Event | Payload | Consumers |
|---|---|---|
| `ReceiveIncidentUpdate` | `{ incidentId, status, eta, responderId }` | Worshipper, Admin |
| `TriggerIntakeAlert` | `{ incidentId, type, distanceM, location, landmark }` | Responder |
| `OnClearanceApproved` | `{ userId, status: 'AUTHORIZED' }` | Responder (onboarding) |
| `ReceiveEscalationAlert` | `{ incidentId, escalationLevel, timerRemaining }` | Responder, Admin |
| `BroadcastMissingPerson` | `{ name, age, photo, lastSeen, radius }` | Worshippers in geo-radius |
| `UpdateResponderPosition` | `{ responderId, lat, lng, timestamp }` | Admin |
| `ParkingEscalation` | `{ plate, zone, escalationStep }` | Admin, Traffic warden |

### Client → Server Invocations
| Invocation | Payload | Caller |
|---|---|---|
| `ReportEmergency` | `{ type, lat, lng, landmark?, details?, photo? }` | Worshipper |
| `AcceptDispatch` | `{ incidentId, responderId }` | Responder |
| `UpdateStatus` | `{ responderId, status: 'EN_ROUTE' \| 'ARRIVED' \| 'RESOLVED' }` | Responder |
| `PushTelemetry` | `{ lat, lng, accuracy, timestamp }` | Responder (every 5s) |
| `ReRouteAsset` | `{ incidentId, fromResponderId, toResponderId }` | Admin |
| `SwitchGeofence` | `{ footprint: 'MONTHLY' \| 'CONGRESS' }` | Admin |

---

## 8. Framer Motion Architecture

### Easing Curves (global)
```typescript
// lib/motion.ts
export const EASING = {
  urgency:   [0.16, 1, 0.3, 1],   // Ultra-fast deceleration for critical states
  standard:  [0.4, 0, 0.2, 1],    // Material standard
  sharp:     [0.4, 0, 0.6, 1],    // Quick in, quick out
} as const

export const DURATION = {
  micro:    0.12,  // Button press, badge update
  fast:     0.18,  // Panel transitions
  standard: 0.25,  // Major view switches
  map:      0.50,  // Responder position glide (linear)
} as const
```

### Key Animation Patterns
```typescript
// Emergency button: idle pulse ring
const pingVariants = {
  animate: {
    scale:   [1, 1.4],
    opacity: [0.7, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut' }
  }
}

// Intake overlay: full-screen interrupt entrance
const intakeVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15, ease: EASING.urgency } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.12 } }
}

// Alert feed item entrance (Admin/Responder)
const feedItemVariants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: EASING.urgency } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.12 } }
}

// Footprint toggle pill (shared layoutId)
// <motion.div layoutId="activeFootprintPill" />  slides between Monthly/Congress
```

---

## 9. GPS & Indoor Location Strategy

```
Device GPS accuracy radius
        │
        ├── ≤ 5m  → GREEN badge. Use GPS coordinates directly.
        │
        ├── 5-15m → AMBER badge. Use GPS with warning; offer manual picker.
        │
        └── > 15m → RED badge. Force two-tap manual picker:
                    Step 1: Select zone/auditorium (e.g. "Old Auditorium")
                    Step 2: Select landmark (e.g. "Pillar 42", "Row K Exit")
                    Result: Text metadata bound into incident payload
                    Map display: "GPS Unreliable — User: Pillar 42, Row K"
```

---

## 10. SMS Fallback Telemetry Format

**Triggered when:** SignalR heartbeat fails for >10 consecutive seconds

**Payload format:** `NXM:{version}:{userIdHash}:{emergencyTypeCode}:{lat6},{lng6}:{timestamp}`

**Example:** `NXM:1:A43F:MED:6.805500,3.418200:9812`

**Type codes:** `MED` (medical), `SEC` (security), `FIR` (fire), `OTH` (other), `MCH` (missing child), `PKG` (parking)

**UI indicator:** Amber "SMS Mode" badge replaces SignalR "Live" badge

---

## 11. Service Worker Cache Strategy

```typescript
// service-worker.ts
// Strategy: Cache-first for map tiles, Network-first for API calls

const TILE_CACHE = 'nexum-tiles-v1'
const TILE_URL_PATTERN = /\/tiles\//

self.addEventListener('fetch', (event) => {
  if (TILE_URL_PATTERN.test(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // Return cached tile; attempt background refresh
          return cached
        }
        return fetch(event.request).then(response => {
          const clone = response.clone()
          caches.open(TILE_CACHE).then(cache => cache.put(event.request, clone))
          return response
        })
      })
    )
  }
})
```

**Offline state:** `MapCanvas.tsx` reads a `tilesFromCache: boolean` flag from `useMapTiles()` hook and renders an amber "Offline Map — Cached Tiles" banner when true.

---

## 12. Security Architecture

| Concern | Implementation |
|---|---|
| Authentication | JWT (RS256), issued by ASP.NET Core Identity |
| Token storage | HttpOnly cookie (not localStorage) |
| Token refresh | Silent refresh 5 minutes before expiry via /api/auth/refresh |
| 2FA (Admin) | TOTP via Authenticator app; server validates before issuing JWT |
| Role enforcement | Next.js middleware validates JWT role claim on every protected route |
| Row-Level Security | Supabase RLS policies: responders read only their zone's incidents |
| Vetting gate | Frontend blocks all portal routes until JWT contains `status: AUTHORIZED` claim |
| API rate limiting | 100 req/min per IP on dispatch endpoints; 1000 req/min on telemetry |
