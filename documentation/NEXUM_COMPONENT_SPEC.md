# Nexum — Component Inventory & UI Specification
**Version:** 1.0  
**Date:** June 2026

---

## Component Inventory

### Shared Components (`components/shared/`)

| Component | Description | Props | States |
|---|---|---|---|
| `ConnectionBadge` | SignalR connection status pill | `status: 'live' \| 'reconnecting' \| 'offline' \| 'sms'` | Live (green dot), Reconnecting (amber pulse), Offline (red), SMS Mode (amber) |
| `GpsAccuracyAlert` | GPS accuracy indicator pill | `accuracyM: number \| null` | Green (≤5m), Amber (5-15m), Red (>15m), No GPS (red) |
| `LocationManualPicker` | Modal: zone + landmark selector | `onConfirm: (zone, landmark) => void`, `onClose: () => void` | Loading, Empty, Populated, Confirming |
| `MapCanvas` | OSM tile map base | `center: LatLng`, `zoom: number`, `offline: boolean` | Loading (shimmer), Loaded, Offline (amber banner) |
| `DispatchPulse` | Radiating ring animation | `active: boolean`, `label?: string` | Idle, Pulsing, Connected |

### Worshipper Components (`components/worshipper/`)

| Component | Description | Key Behaviour |
|---|---|---|
| `EmergencyButton` | Large circular red dispatch CTA | Idle: pulse ring animation. Press: scale(0.96). Success: morphs via layoutId into connecting screen |
| `LocationSelector` | GPS-triggered manual location overlay | Auto-shows when GPS accuracy > 15m. Two-tap: zone → landmark. Dismissible if GPS recovers |
| `IncidentTracker` | Vertical status timeline | Steps pulse blue when active. Live ETA counter. Real-time via SignalR |
| `MissingChildForm` | 3-step multi-part form | Step progress dots. Photo dropzone. Location picker integration |
| `ParkingReportForm` | Parking incident form | Segmented control (Blocking / Relocation). Monospace plate input. Owner contact toggle |
| `VehiclePinMap` | Interactive pin placement on OSM map | Click-to-drop. Bottom sheet confirmation. Saved state with amber marker |

### Responder Components (`components/responder/`)

| Component | Description | Key Behaviour |
|---|---|---|
| `StandbyConsole` | Duty status + recent incidents | Available / Off Duty segmented control. Zone card. Last 5 incident rows |
| `IntakeOverlay` | Full-screen incoming dispatch interrupt | AnimatePresence entrance. 15s CountdownBar. Accept spans ≥25% viewport height |
| `CountdownBar` | Depleting progress bar | Amber fill. Props: `durationS: number`. Fires `onExpired` callback |
| `RouteMap` | Active mission navigation | OSM + pgRouting path. Responder position tracks smoothly (0.5s linear) |
| `MissionControls` | Bottom panel action buttons | "Arrived" (blue). "Request Backup" (amber). Triage outcome form (slides up on closure) |

### Admin Components (`components/admin/`)

| Component | Description | Key Behaviour |
|---|---|---|
| `IncidentFeed` | Live incident list | AnimatePresence item entrance. Sorted by urgency + escalation timer. Color-coded severity border |
| `TacticalMap` | Full command map canvas | Responder dots animate on telemetry update. Incident markers. Geofence polygon layer |
| `ProximityMatrix` | Active pairing ledger | Live ETAs. RE-ROUTE ASSET per row. Manual override confirmation modal |
| `FootprintToggle` | Geofence switch control | Shared layoutId pill animation between Monthly/Congress labels |
| `PersonnelRoster` | Dense filterable data table | Agency tag filters. CSV import button. Rapid-entry command input. Status dot per row |
| `VettingCard` | Side-by-side validation card | Photo + metadata layout. Approve / Reject buttons. Keyboard A/R shortcuts. Audit log strip |

---

## Screen-by-Screen UI Specification

### `/auth/login`
**Layout:** Split — left illustration panel (blue) + right form panel (white)  
**Left panel:** Nexum logo, abstract crowd/signal illustration on deep blue background  
**Right panel:**
- Nexum wordmark top
- "Welcome back" heading (DM Sans, 24px)
- Role chip row: Worshipper | Responder | Admin (Lucide icons; active chip fills nexum-blue)
- Email input (44px, blue focus ring, associated label)
- Password input (44px, show/hide toggle)
- Admin selected: +2FA TOTP field
- Responder pending: amber "Pending vetting approval" notice card
- "Login" CTA: full-width, nexum-blue, 48px, DM Sans bold
- "Don't have an account? Sign Up" — amber link
- Dev mode (staging only): collapsible "Dev Mode" section with role-chip bypass grid, badged "DEV"

---

### `/auth/verify`
**Layout:** Centered card (max 480px)  
**Elements:** Nexum logo top, "Verify your identity" heading, 6-digit OTP input (auto-advance between digits), 60-second resend countdown, "Resend Code" link activates at T+60

---

### `/worshipper` (Home Dashboard)
**Layout:** Top nav bar + content area (max-width 800px centered)  
**Top nav:** Nexum logo | ConnectionBadge | GpsAccuracyAlert  
**Hero block:** "You're safe. Help is always close." (DM Sans, 32px, nexum-blue)  
**Quick-action grid:** 2×3 grid of white cards
- Medical (Lucide Heart), Security (Lucide Shield), Missing Child (Lucide UserSearch)
- Parking (Lucide ParkingSquare), My Vehicle (Lucide Car), Incident Tracker (Lucide ClipboardList)
- Card specs: 12px border radius, shadow-card, Lucide icon 44px nexum-blue, label below
- Hover: shadow-card-hover + blue bottom border accent (2px)

---

### `/worshipper/emergency`
**Layout:** Full-page critical layout  
**Palette override:** Red/amber urgency on this screen only  
**Elements (top to bottom):**
1. Back navigation (small, grey)
2. "Report Emergency" heading (red, bold)
3. Incident type pills: Medical | Security | Fire | Other (horizontal, nexum-blue fill on selected)
4. EmergencyButton (centered, 160px diameter minimum, deep red, pulsing ring)
5. "TAP TO DISPATCH" label above button
6. Detail text field (optional, 44px, "Add details (optional)")
7. Photo upload — camera icon button (labelled "Add Photo")
8. LocationSelector (auto-trigger if GPS > 15m)
9. "Cancel" link (small, grey, bottom)

---

### `/worshipper/emergency/connecting`
**Layout:** Full-page, nexum-blue background  
**Elements:**
1. Nexum logo (white, top centre)
2. DispatchPulse animation (radiating rings, centred)
3. "Signal Connected" badge (amber pill)
4. ETA: large white numerals ("3 min 20 sec")
5. Incident reference: monospace white pill (`#NXM-00492`)

---

### `/worshipper/incident/:id`
**Layout:** Centred card (max 640px)  
**Elements:**
1. Reference badge (monospace, nexum-blue) — top
2. Vertical status timeline: 5 steps with step labels and timestamps
3. Active step pulses nexum-blue
4. ETA counter (large, bold) when En Route
5. Escalation log: scrollable list, timestamped
6. Bottom actions: "Mark Resolved" (green outline, 44px) | "Cancel Report" (grey outline, 44px)

---

### `/responder/onboarding`
**Layout:** Centred card (max 560px), step indicator dots top  
**Step 1:** Full legal name + agency/government ID  
**Step 2:** Specialty role card selector (2×2 grid)
- MEDICAL_MD (Lucide Stethoscope), PARAMEDIC_TIER_2 (Lucide Siren), CAMP_SECURITY (Lucide ShieldCheck), TRAFFIC_WARDEN (Lucide TrafficCone)
- Active card: nexum-blue border + fill
**Step 3:** Phone number  
**Step 4:** Camera snapshot (getUserMedia preview + retake option)  
**Vetting Pending state:** Hourglass animation, status card, calm infographic

---

### `/responder` (Standby Console)
**Layout:** Responsive, top nav (ConnectionBadge + GPS sync counter)  
**Elements:**
1. Available / Off Duty segmented control (large, nexum-blue fill when Available)
2. Zone assignment card (zone name, map thumbnail)
3. GPS sync counter: "GPS Sync: 2s ago" (green dot, monospace)
4. Recent incident log: last 5 rows (timestamp | type icon | status badge)

---

### `/responder/intake`
**Layout:** Full-page, nexum-slate (#0B0F19) background, amber accents  
**Elements:**
1. CountdownBar (top — amber fill depleting over 15s)
2. Incident type icon (Lucide, large, 64px, white)
3. Incident type label (24px bold white)
4. "42m away" (48px, amber)
5. Location: "Main Auditorium, Row F, Pillar 12" (18px white)
6. ACCEPT DISPATCH button: full width, minimum 25% viewport height, nexum-blue, DM Sans 600 24px
7. "Decline" — small grey text link, bottom

---

### `/responder/mission/:id`
**Layout:** Split vertical — RouteMap (top 55%) + mission panel (bottom 45%)  
**Map:** OSM vector + pgRouting path, responder position updates (0.5s linear)  
**Panel:**
- Incident type + severity indicator
- Details summary (2-3 lines max)
- ARRIVED AT SCENE (nexum-blue filled, 56px)
- REQUEST BACKUP (amber outlined, 56px)
- Triage form (slides up on mission close): 3 large outcome buttons

---

### `/admin` (Command Center)
**Layout:** Dark mode (nexum-slate base), 3-pane with fixed sidebar nav  
**Sidebar (240px):** Nexum logo, nav links (Command, Roster, Vetting, Analytics)  
**Left pane (280px):** IncidentFeed — dense scrollable list  
**Center pane (fluid):** TacticalMap + FootprintToggle overlay (top-right)  
**Right pane (280px):** ProximityMatrix  
**Top bar (64px):** Incident counter badge (amber, pulsing) | Active responders count | Event clock (monospace)

---

### `/admin/roster`
**Layout:** Full-width table with toolbar  
**Toolbar:** Agency filters ([MEDICAL_TIER_1] [TRAFFIC_WARDEN] [SECURITY_RECON]) | Search | CSV Import | Command line input  
**Table columns:** Name | Agency | Role | Status | Zone | Last GPS Ping | Actions  
**Status dots:** green (available), amber (on mission), grey (off duty), red (offline)  
**Row actions:** Force Reassign (icon button) | View Profile  
**Offline row:** amber background highlight + "Degraded Signal" indicator

---

### `/admin/vetting`
**Layout:** Left list + right detail card (50/50 split)  
**Left:** Pending registrations feed — scrollable, name + agency + time submitted  
**Right:** VettingCard — photo (large top), metadata grid, ID scan image  
**Actions:** APPROVE & AUTHORIZE (dark green, 48px) | REJECT / FRAUD (red outline, 48px)  
**Keyboard shortcuts:** `A` = Approve, `R` = Reject (visible labels)  
**Audit log:** bottom strip with timestamped history

---

### `/admin/analytics`
**Layout:** Standard admin shell, scrollable content  
**KPI cards row (4):** Total Incidents | Avg Response Time | Responder Utilisation | Resolved Rate  
**Charts:**
- Incident volume by type (grouped bar, nexum-blue palette)
- Incident volume by zone (horizontal bar or choropleth)
- Avg response time trend (line chart, nexum-amber)
- Responder utilisation (horizontal stacked bar)  
**Controls:** Date range picker (top right) | Export CSV/PDF (amber outlined button)

---

## Accessibility Requirements

| Requirement | Implementation |
|---|---|
| WCAG AA contrast | All blue/white and amber/white pairings verified |
| Focus rings | All interactive elements: 2px nexum-blue focus ring, 2px offset |
| Label association | Every `<input>` has explicit `<label>` with `htmlFor` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all Framer Motion animations |
| Screen reader | ARIA roles on live regions (incident feed, connection badge) |
| Touch target size | Minimum 44px height on all interactive elements |
| Error messages | Inline validation errors with `role="alert"` for screen readers |

---

## Loading, Empty & Error States (Required for Every Data Component)

| Component | Loading | Empty | Error |
|---|---|---|---|
| IncidentFeed | Shimmer rows (3) | "No active incidents" (grey, icon) | "Feed unavailable — check connection" |
| TacticalMap | Grey tile shimmer | N/A | "Map offline — serving cached tiles" amber banner |
| ProximityMatrix | Shimmer rows | "No active pairings" | "Pairing data unavailable" |
| PersonnelRoster | Skeleton table rows | "No personnel found" | "Roster unavailable" |
| IncidentTracker | Pulsing skeleton | N/A | "Unable to load incident status" |
| RouteMap | Map shimmer | "No route calculated" | "Route unavailable — GPS required" |
| MissingChildForm photo | N/A | Dashed dropzone | "Upload failed — try again" |
