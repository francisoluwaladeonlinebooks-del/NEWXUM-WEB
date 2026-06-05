# Nexum — Product Requirements Document (PRD)
**Version:** 1.0  
**Status:** Pre-Development  
**Date:** June 2026  
**Prepared by:** Product & Systems Team

---

## 1. Executive Summary

Nexum is a real-time emergency dispatch and automated escalation web platform built exclusively for Redemption City, RCCG — a 2,500-hectare privately governed campus that hosts over 5 million worshippers during its annual Holy Ghost Congress. It replaces fragmented legacy coordination (walkie-talkies, WhatsApp groups, PA announcements) with a unified, geofenced coordination layer connecting three user classes: Worshippers, Responders (medical/security/traffic), and Administrators.

**Primary outcome:** Compress the current 10-minute manual emergency response window to a 3-second automated dispatch.

---

## 2. Problem Statement

### 2.1 Operational Failures
| Failure | Current State | Impact |
|---|---|---|
| Emergency reporting | Physical crowd search required | 10+ min response time. Cardiac arrest survival drops 10%/min |
| Manual escalation | Human relay at every step | No automated re-dispatch of unacknowledged alerts |
| Missing person broadcast | PA announcements, no geo-targeted push | Low coverage, high noise |
| Parking/lane blockage | Manual warden notification | Emergency transit lanes blocked |
| Personnel coordination | No real-time location layer | Blind dispatch |

### 2.2 Infrastructure Constraints
- Cellular towers reach full bandwidth exhaustion during peak sessions
- Indoor GPS multipath error inside concrete auditoriums (>15m accuracy degradation)
- 5 million concurrent users across a 3km² zone
- Extreme heat and bright outdoor daylight (display legibility requirement)

---

## 3. Product Scope

### 3.1 In Scope
- Worshipper Web Portal (responsive, all breakpoints)
- Responder Web Portal (responsive, all breakpoints)
- Admin Command Center Dashboard (desktop-primary)
- Authentication system with role-based gating and vetting workflow
- Real-time SignalR WebSocket layer
- PostGIS proximity dispatch engine (consumed via API — not built in frontend)
- Offline map tile caching via Service Worker
- SMS fallback telemetry gateway integration (UI indicators only; gateway is backend)
- Geofenced micro-broadcast push (UI indication; backend-driven)

### 3.2 Out of Scope (v1.0)
- Native iOS/Android applications
- Third-party public API
- Multi-event / multi-campus support
- Payments or ticketing
- Historical analytics export beyond CSV

---

## 4. User Personas

### Persona 1 — The Worshipper
**Name:** Adaeze, 38  
**Context:** Attending Holy Ghost Congress with family. Mid-session, she witnesses a medical emergency near her row.  
**Device:** Mid-tier Android smartphone, Chrome browser, intermittent 3G  
**Goals:** Report the emergency with minimum friction. Know help is coming. Find her car after service.  
**Stressors:** Dense crowd, noise, low battery, poor signal, heat  
**Key need:** One-tap emergency dispatch. No login barriers during crisis.

### Persona 2 — The Responder
**Name:** Sgt. Emeka Okonkwo, 34, Security Personnel  
**Context:** On active patrol in Zone B. Receives a proximity-matched dispatch.  
**Device:** Budget Android, Chrome, vest-mounted or one-handed use  
**Goals:** Accept dispatch instantly. Navigate to scene. Log outcome.  
**Stressors:** Moving, crowd noise, physical exertion  
**Key need:** Full-screen intake overlay. Minimal taps to accept and navigate.

### Persona 3 — The Administrator / Clearance Officer
**Name:** Pastor Tolu Adeyemi, 47  
**Context:** Monitoring from the Command Center during a peak session  
**Device:** Desktop workstation, dual monitors, stable LAN  
**Goals:** Full situational awareness. Approve responder vetting. Reassign assets.  
**Key need:** Dense information, instant override controls, persistent live map

---

## 5. Functional Requirements

### 5.1 Authentication & Authorisation
| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Three-role login: Worshipper, Responder, Admin | P0 |
| AUTH-02 | JWT-based session tokens, 8-hour expiry, silent refresh | P0 |
| AUTH-03 | Admin role requires 2FA (TOTP) | P0 |
| AUTH-04 | Responder login blocked until status = AUTHORIZED | P0 |
| AUTH-05 | OTP verification screen for email/phone verification | P1 |
| AUTH-06 | Dev Mode: role-chip grid bypassing real auth for staging | P1 |

### 5.2 Worshipper Portal
| ID | Requirement | Priority |
|---|---|---|
| WOR-01 | Emergency dispatch: one-click, captures GPS, sends to server within 3s | P0 |
| WOR-02 | Incident type selector: Medical, Security, Fire, Other | P0 |
| WOR-03 | Manual location picker if GPS accuracy > 15m (two-tap: zone → landmark) | P0 |
| WOR-04 | Emergency connecting screen: radiating pulse animation, ETA counter, incident ID | P0 |
| WOR-05 | Incident tracker: live status timeline (Dispatched → Arrived → Resolved) | P0 |
| WOR-06 | Missing child report: multi-step form (child details, last location, reporter contact, photo upload) | P1 |
| WOR-07 | Parking report: blocking vehicle / relocation request, plate number, location, photo | P1 |
| WOR-08 | Vehicle pin: drop-pin on OSM map to save parking spot, retrieve after service | P1 |
| WOR-09 | GPS accuracy badge persistent in nav bar | P1 |
| WOR-10 | SignalR connection badge persistent in nav bar | P1 |
| WOR-11 | Optional photo upload on emergency reports | P2 |

### 5.3 Responder Portal
| ID | Requirement | Priority |
|---|---|---|
| RES-01 | Onboarding: multi-step registration (name, agency ID, specialty, phone, camera snapshot) | P0 |
| RES-02 | Vetting pending screen: WebSocket listener, blocks portal until AUTHORIZED | P0 |
| RES-03 | Standby console: Available / Off Duty toggle, zone assignment, recent incident log | P0 |
| RES-04 | Intake overlay: full-screen interrupt, incident type, distance, location, 15s countdown | P0 |
| RES-05 | Accept dispatch: CTA spanning ≥25% viewport height | P0 |
| RES-06 | Mission screen: OSM route map (pgRouting), Arrived + Request Backup buttons | P0 |
| RES-07 | Post-incident triage form: outcome selection (Evac / Minor / False Alarm), large tap targets | P0 |
| RES-08 | SignalR connection badge + GPS sync counter in nav | P1 |
| RES-09 | Automated escalation re-dispatch notification if original responder unresponsive | P1 |

### 5.4 Admin Dashboard
| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Three-pane command center: incident feed (left), tactical map (center), proximity matrix (right) | P0 |
| ADM-02 | Incident feed: live sorted by urgency + escalation timer, color-coded severity borders | P0 |
| ADM-03 | Tactical map: geofence polygon, responder dots, incident markers | P0 |
| ADM-04 | Footprint toggle: Monthly ↔ Congress geofence, one-click, no deployment | P0 |
| ADM-05 | Proximity matrix: active pairings, ETA, Re-route Asset button | P0 |
| ADM-06 | Personnel roster: filterable table, status dots, CSV import, command-line entry | P0 |
| ADM-07 | Vetting terminal: side-by-side validation card, Approve / Reject, audit log | P0 |
| ADM-08 | Analytics dashboard: KPI cards, charts (incident volume, response time, utilization) | P1 |
| ADM-09 | Map: animate responder position updates smoothly (0.5s linear, no teleporting) | P1 |
| ADM-10 | Congestion zone painter: draw polygon over map to inflate edge weights | P2 |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Emergency dispatch triggered within 3 seconds of button tap end-to-end |
| Availability | 99.9% uptime during congress sessions; automatic failover to SMS gateway on WebSocket failure |
| Accessibility | WCAG 2.1 AA compliance across all portals |
| Browser support | Chrome 110+, Firefox 110+, Safari 16+, Samsung Internet 20+ |
| Offline | Map tile cache via Service Worker; offline banner shown when tiles served from cache |
| Responsiveness | Worshipper and Responder portals: 360px → 1440px. Admin: 1280px minimum |
| Animation performance | All transitions using GPU-accelerated properties only (transform, opacity). 60fps on mid-tier Android |
| Reduced motion | All animations disabled or reduced when prefers-reduced-motion: reduce is set |
| Security | Row-level security per role; responders cannot access other zones' spatial data |
| Data privacy | GPS coordinates stored only for active incident duration; purged on resolution |

---

## 7. Color Semantics (Enforced, Non-Negotiable)

| Color | Hex | Use |
|---|---|---|
| Nexum Blue | #1a2faa | Primary brand, nav, CTAs, active states |
| Nexum Amber | #f5a623 | Secondary CTAs, urgency accents, escalation indicators |
| Critical Red | #D32F2F | Medical emergency, critical incident severity, Reject actions |
| Warning Amber | #FBC02D | Traffic/parking blockage, escalation alerts |
| Safe Green | #388E3C | Connected status, Approve actions, Resolved state |
| Slate Background | #0B0F19 | Admin dashboard dark mode base |
| Pure White | #FFFFFF | Content area backgrounds (worshipper/responder portals) |

---

## 8. Role-Based Access Control Matrix

| Feature | Worshipper | Responder | Admin |
|---|---|---|---|
| Emergency dispatch | ✓ | — | — |
| View own incident status | ✓ | — | — |
| Missing child report | ✓ | — | — |
| Parking report | ✓ | — | — |
| Vehicle pin | ✓ | — | — |
| Accept dispatch | — | ✓ | — |
| View route map | — | ✓ | — |
| Log incident outcome | — | ✓ | — |
| View tactical map | — | — | ✓ |
| View all incidents | — | — | ✓ |
| Approve/reject vetting | — | — | ✓ |
| Toggle geofence footprint | — | — | ✓ |
| Re-route asset | — | — | ✓ |
| Import CSV roster | — | — | ✓ |
| View analytics | — | — | ✓ |

---

## 9. Geospatial Context

**Campus:** RCCG Redemption City of God, Ogun State, Nigeria  
**Projection:** WGS 84 / UTM Zone 31N (EPSG:32631)  
**Centroid:** 6.8111°N, 3.4244°E  
**Bounding Box:** 6.8375°N / 7.3850°N / 3.3912°E / 3.4545°E  
**Key zones:** Old Auditorium, The Arena (3M), Youth Centre, RCCG Medical Centre, Car Parks A & C, National Kitchen, Emmanuel Amusement Park

---

## 10. Success Metrics

| Metric | Baseline | Target (v1.0) |
|---|---|---|
| Emergency dispatch-to-assign time | 10+ minutes | ≤ 3 seconds |
| Responder intake acknowledgement rate | Unmeasured | ≥ 95% within 15 seconds |
| Unacknowledged escalation rate | High | ≤ 5% of incidents |
| GPS accuracy (indoor) | Unreliable | Landmark fallback covers 100% of indoor zones |
| WebSocket uptime during peak | ~40% (congestion) | 85%+ via SMS fallback |
