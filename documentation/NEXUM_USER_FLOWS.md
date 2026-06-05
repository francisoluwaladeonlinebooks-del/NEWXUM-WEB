# Nexum — User Flows
**Version:** 1.0  
**Date:** June 2026

---

## Flow 1 — Worshipper: 3-Second Emergency Dispatch

```
[Landing / Home Dashboard]
         │
         │ Tap "Medical" or "Security" quick-action card
         ▼
[Emergency Screen]
  - Incident type pills: Medical / Security / Fire / Other
  - EmergencyButton (large red circle, pulsing ring)
  - GPS accuracy check runs in background
         │
         ├── GPS accuracy > 15m → LocationSelector overlay appears
         │       User selects: Zone → Landmark (2 taps)
         │       Confirms landmark → LocationSelector closes
         │
         │ Tap EmergencyButton "TAP TO DISPATCH"
         ▼
[POST /api/incidents]
  Payload: { type, lat, lng, landmark?, details?, photo? }
  Server: PostGIS KNN → nearest available responder → SignalR dispatch
         │
         ▼
[Emergency Connecting Screen]
  - DispatchPulse animation (radiating rings, blue background)
  - "Signal Connected" amber badge
  - ETA countdown (large white numerals)
  - Incident reference ID (monospace pill)
  - SignalR event: ReceiveIncidentUpdate { status: RESPONDER_ASSIGNED }
         │
         ▼
[Incident Tracker /worshipper/incident/:id]
  - Status timeline: Dispatched → Assigned → En Route → Arrived → Resolved
  - Active step pulses blue
  - Live ETA counter
  - Escalation log (timestamped)
  - "Resolve" (green) / "Cancel" (grey) action buttons
```

---

## Flow 2 — Worshipper: Missing Child Report

```
[Home Dashboard]
         │ Tap "Missing Child" card
         ▼
[Missing Child Form — Step 1/3: Child Details]
  - Child's name (text input)
  - Age (number input)
  - Photo upload (dashed dropzone — camera or gallery)
  - "Next" button (blue, full-width)
         │
         ▼
[Step 2/3: Last Seen Details]
  - Landmark selector (LocationManualPicker modal)
    └── Select zone → Select landmark (e.g. "Old Auditorium, Exit Gate 3")
  - Time last seen (time input)
  - Brief description text area (optional)
  - "Next" button
         │
         ▼
[Step 3/3: Reporter Contact]
  - Reporter's name
  - Phone number
  - Relationship to child
  - Submit CTA: "Report Missing Child" (blue, full-width, 48px)
         │
         ▼
[POST /api/incidents/missing-child]
  Server: Geofenced micro-broadcast within 400m radius (PostGIS ST_Buffer)
  Nearby devices receive BroadcastMissingPerson push notification
         │
         ▼
[Confirmation Screen]
  - "Report Submitted" — green check icon
  - Incident reference ID
  - "Back to Home" link
```

---

## Flow 3 — Worshipper: Parking Report

```
[Home Dashboard]
         │ Tap "Parking" card
         ▼
[Parking Report Form]
  - Incident type toggle: "Blocking" / "Needs Relocation"
  - Plate number input (monospace, uppercase enforced)
  - Vehicle description (make, color, model — optional)
  - Location input (manual text or landmark picker)
  - "Owner contact attempt" toggle (blue switch)
  - Photo upload (optional)
  - Submit CTA: "Submit Parking Report" (blue, full-width)
         │
         ▼
[POST /api/incidents/parking]
  Server: Assigns to nearest traffic warden
  Background job: if unacknowledged in T+5min → escalate with coordinates
         │
         ▼
[Confirmation Screen]
  - "Report Submitted" with plate number confirmation
  - Reference ID
```

---

## Flow 4 — Worshipper: Save & Retrieve Vehicle Location

```
[Home Dashboard]
         │ Tap "My Vehicle" card
         ▼
[Vehicle Pin Map /worshipper/my-vehicle]
  - Full-width OSM MapCanvas
  - Instruction: "Click the map to drop your parking pin"
         │ User clicks on map
         ▼
[Pin Drop Confirmation Panel]
  - Map zooms to clicked point
  - Nearest landmark auto-labelled (e.g. "Near Car Park A")
  - Zone selector if landmark ambiguous
  - "Save My Spot" CTA (blue)
         │
         ▼
[Saved State]
  - Pin shown with amber marker
  - Panel: "Your vehicle is saved near Car Park A"
  - "Navigate Back" button → opens OSM route from current position to pin
  - "Clear Pin" link (small, grey)
```

---

## Flow 5 — Responder: Onboarding & Vetting

```
[/responder/onboarding — Step 1/4: Identity]
  - Full legal name
  - Government / Agency ID number
  - "Next" button
         │
         ▼
[Step 2/4: Specialty Role]
  - Card selector grid:
    MEDICAL_MD / PARAMEDIC_TIER_2 / CAMP_SECURITY / TRAFFIC_WARDEN
  - Active card fills blue
  - "Next" button
         │
         ▼
[Step 3/4: Contact]
  - Phone number input
  - "Next" button
         │
         ▼
[Step 4/4: Identity Verification]
  - Live camera snapshot (browser getUserMedia)
  - Preview of captured photo
  - Optional: ID document scan upload
  - "Submit for Vetting" CTA
         │
         ▼
[POST /api/auth/register-responder]
  Server: Creates user record with status = PENDING
         │
         ▼
[Vetting Pending Screen]
  - Animated hourglass icon
  - Status card: "STATUS: VETTING PENDING"
  - Infographic: "A clearance officer is reviewing your credentials"
  - WebSocket listener: OnClearanceApproved event
         │ Admin approves in Vetting Terminal
         │ Server pushes OnClearanceApproved
         ▼
[Portal Unlocked — Standby Console]
  - AnimatePresence exit: pending card fades out
  - Standby Console fades in
```

---

## Flow 6 — Responder: Accept & Complete Mission

```
[Standby Console]
  - Available / Off Duty toggle (blue/grey)
  - Status: AVAILABLE
         │ PostGIS KNN match fires
         │ TriggerIntakeAlert SignalR event received
         ▼
[Intake Overlay — Full Screen Interrupt]
  - Dark blue background, amber urgency accent
  - CountdownBar: 15s amber progress bar depleting
  - Incident type + large icon (e.g. "🩺 Medical Distress" → Lucide icon)
  - "42m away — Main Auditorium, Row F, Pillar 12"
  - ACCEPT DISPATCH button (≥25% viewport height, deep blue)
  - "Decline" link (small grey, low affordance)
         │
         ├── 15s expires without action → Auto-escalated to next responder
         │
         │ Tap ACCEPT DISPATCH
         ▼
[POST /api/incidents/:id/accept]
  Server: Updates incident status = RESPONDER_ASSIGNED
  Worshipper receives ReceiveIncidentUpdate
         │
         ▼
[Mission Screen /responder/mission/:id]
  - RouteMap: OSM vector map, pgRouting path from responder → worshipper
  - Bottom panel (40% height):
    - Incident details summary
    - ARRIVED AT SCENE (blue filled, 56px)
    - REQUEST BACKUP (amber outlined, 56px)
         │
         │ Tap ARRIVED AT SCENE
         ▼
[PATCH /api/incidents/:id/status { status: 'ARRIVED' }]
         │
         ▼
[Triage Outcome Form (slides up)]
  - Large touch-target buttons:
    RESOLVED — AMBULANCE EVAC
    RESOLVED — MINOR TREATMENT
    FALSE ALARM
  - "Close Mission" CTA
         │
         ▼
[PATCH /api/incidents/:id/close { outcome }]
         │
         ▼
[Back to Standby Console]
```

---

## Flow 7 — Admin: Real-Time Command Center

```
[Login — Admin Role Selected]
  - Email + password + 2FA TOTP code
         │
         ▼
[Command Center /admin — 3-Pane Layout]
  ┌──────────────┬──────────────────────┬─────────────────┐
  │  INCIDENT    │    TACTICAL MAP      │   PROXIMITY     │
  │  FEED        │    (PostGIS)         │   MATRIX        │
  │  (left 280px)│    (fluid center)    │   (right 280px) │
  └──────────────┴──────────────────────┴─────────────────┘

  Left pane:
  - Live scrolling incident list (AnimatePresence, slide-in from top)
  - Each row: severity border color | type icon | location | status badge | timer
  - Sorted by urgency + escalation time remaining

  Center pane:
  - Full OSM map with geofence polygon overlay
  - Responder dots (blue): animate position updates (0.5s linear)
  - Incident markers (red/amber)
  - FootprintToggle top-right: Monthly ↔ Congress (layoutId pill animation)

  Right pane:
  - Active pairings ledger
  - Each row: Responder name [ROLE] → Linked to Incident #XXX, ETA: 1m 45s
  - RE-ROUTE ASSET button per row
  - Top bar: incident count (amber badge), responder count, event clock
```

---

## Flow 8 — Admin: Responder Vetting

```
[Vetting Terminal /admin/vetting]
  ┌───────────────────┬──────────────────────────────────┐
  │  PENDING LIST     │   VALIDATION CARD                │
  │                   │                                  │
  │  [Name]           │  [Photo — large]                 │
  │  [Agency ID]      │  [Name, Agency, Role, Phone]     │
  │  [Submitted time] │  [ID Document scan image]        │
  │                   │                                  │
  │  [Name 2]         │  [APPROVE & AUTHORIZE]  (green)  │
  │  ...              │  [REJECT / FRAUD]       (red)    │
  │                   │                                  │
  │                   │  Keyboard: A = Approve, R = Reject│
  │                   │  ─────────────────────────────── │
  │                   │  Audit log: timestamped history  │
  └───────────────────┴──────────────────────────────────┘
         │
         │ Click APPROVE & AUTHORIZE
         ▼
[PATCH /api/users/:id/authorize]
  Server: Updates status = AUTHORIZED
  Server: Pushes OnClearanceApproved to responder's WebSocket
  Admin card slides out (x: 100, opacity: 0)
  Next pending record loads
         │
         │ On responder device simultaneously:
         ▼
  Vetting Pending screen fades out (AnimatePresence)
  Standby Console fades in
```

---

## Flow 9 — Admin: Toggle Geofence Footprint

```
[FootprintToggle Component (top-right of map)]
  ┌──────────────────────────────┐
  │  [ Monthly ] [ Congress ]    │
  │       ↑ animated pill        │
  └──────────────────────────────┘
         │ Click "Congress"
         ▼
[Optimistic UI: pill slides to Congress label (layoutId animation)]
[POST /api/geofence/switch { footprint: 'CONGRESS' }]
  Server: Calls switch_active_geofence() SQL function
  Server: Broadcasts new polygon to all connected admin clients
         │
         ▼
[Map polygon layer updates to expanded congress boundary]
[Toast: "Congress footprint active"]
```

---

## Flow 10 — System: Automated Escalation

```
[Incident created — responder dispatched]
         │
         │ T+0: TriggerIntakeAlert sent to responder
         │ T+15s: Intake countdown expires without ACCEPT
         ▼
[Background Job: EscalationWorker]
  - Queries next available responder in zone
  - Marks original responder as ESCALATION_MISSED
  - Creates escalation event record
  - Dispatches to next responder
  - Pushes ReceiveEscalationAlert to Admin
         │
         │ If no responders in zone:
         ▼
[Zone supervisor alert pushed]
[ReceiveEscalationAlert with escalationLevel: 2]
[Amber pulsing border on incident feed row]
```

---

## Error & Edge Case Flows

### GPS Unavailable on Worshipper Device
- No geolocation API / permission denied → `GpsAccuracyAlert` shows red "No GPS"
- Emergency button still enabled
- LocationSelector forces manual picker before submit

### SignalR Disconnection
- `ConnectionWatchdog` detects heartbeat failure > 10s
- `ConnectionBadge` transitions: Green → Amber "Reconnecting" → Red "Offline"
- After 10s: SMS fallback mode activates
- UI: Amber "SMS Mode" banner replaces badge; dispatch payload sent via SMS encoder

### Responder Physically Blocked
- Telemetry velocity < 0.5 m/s for > 30s on active mission
- Server: Marks responder as `PHYSICALLY_BLOCKED`
- Admin: Pulsing orange indicator on responder dot
- Option: Admin manually re-routes via RE-ROUTE ASSET

### Admin Map — No Responders Online
- Proximity matrix shows "No responders available in zone"
- Incident feed row shows "Unassigned" status with red border
- Auto-escalation chain triggers zone supervisor notification
