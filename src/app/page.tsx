import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Role } from '@/types';
import Link from 'next/link';
import { Shield, AlertTriangle, Search, Bus, Car, ArrowRight, ChevronRight } from 'lucide-react';

const ROLE_HOME: Record<Role, string> = {
  worshipper:       '/worshipper/bookings',
  medical_officer:  '/officer/incidents',
  security_officer: '/officer/missing-persons',
  driver:           '/driver/rides',
  admin:            '/admin/dashboard',
  host:             '/host/properties',
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role) {
    redirect(ROLE_HOME[session.user.role]);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#1B3A6B]" />
            <span className="text-xl font-bold text-[#1B3A6B]">Nexum</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#1B3A6B] transition-colors">Features</a>
            <a href="#modules" className="hover:text-[#1B3A6B] transition-colors">Modules</a>
            <Link href="/properties" className="hover:text-[#1B3A6B] transition-colors">Properties</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-sm font-medium text-gray-700 hover:text-[#1B3A6B] transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link href="/register"
              className="text-sm font-medium bg-[#1B3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-[#0F1F3D] via-[#1B3A6B] to-[#2563EB]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
            Real-time safety · Track 0D — Incident Management
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Safety Intelligence for<br />
            <span className="text-blue-300">Redemption City</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time emergency dispatch, automated escalation, and crowd coordination
            for the world's largest regular gathering — 5 million worshippers, one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1B3A6B] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Stat strip */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '5M+',   label: 'Peak worshippers' },
            { value: '2,500', label: 'Hectares covered' },
            { value: '3s',    label: 'Emergency dispatch' },
            { value: '24/7',  label: 'Always active' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-blue-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-24 px-6 bg-gray-50" id="features">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The coordination gap Nexum closes
          </h2>
          <p className="text-lg text-gray-500">
            When five million people converge on a 3km² auditorium zone, existing tools fail.
            Walkie-talkies, WhatsApp groups, and PA announcements cannot scale to this density.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏱',
              title: 'Manual response is too slow',
              body: 'Locating a responder in a crowd of millions takes tens of minutes. In a cardiac arrest, every minute reduces survival odds by 10%.',
              accent: 'border-red-200 bg-red-50',
            },
            {
              icon: '📢',
              title: 'Escalation depends on humans',
              body: 'No automated protocol exists to re-escalate unacknowledged emergencies or broadcast missing person alerts to every device inside camp.',
              accent: 'border-amber-200 bg-amber-50',
            },
            {
              icon: '🗂',
              title: 'Infrastructure is invisible',
              body: 'Guest properties operate with no unified inspection registry. Bookings happen through WhatsApp and handwritten lists with no double-booking protection.',
              accent: 'border-blue-200 bg-blue-50',
            },
          ].map(card => (
            <div key={card.title} className={`rounded-2xl border p-6 ${card.accent}`}>
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="py-24 px-6" id="modules">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">One platform, every module</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Built specifically for Redemption City. Each module addresses a real operational failure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
                bg: 'bg-red-50',
                title: 'Emergency Dispatch',
                badge: 'Track 0D Core',
                badgeColor: 'bg-red-100 text-red-700',
                body: 'One-tap emergency report. Server captures GPS, runs PostGIS proximity match, dispatches the nearest available officer within 3 seconds via SignalR WebSocket and FCM push.',
                points: ['Medical & security incidents', 'Auto-dispatch to nearest officer', 'Automated re-escalation at 2 minutes'],
              },
              {
                icon: <Search className="h-6 w-6 text-amber-500" />,
                bg: 'bg-amber-50',
                title: 'Missing Persons',
                badge: 'Track 0D Core',
                badgeColor: 'bg-amber-100 text-amber-700',
                body: 'Geofenced broadcast of missing person alerts with photographs to every device inside camp simultaneously. Sightings reported with GPS coordinates update a live map for security officers.',
                points: ['Photo broadcast to all camp users', 'GPS sighting reporting', 'Live sightings map for officers'],
              },
              {
                icon: <Car className="h-6 w-6 text-blue-500" />,
                bg: 'bg-blue-50',
                title: 'Smart Parking',
                badge: 'Differentiator',
                badgeColor: 'bg-blue-100 text-blue-700',
                body: 'Worshippers pin their car\'s GPS location on arrival. Blocking vehicle reports trigger immediate owner notification. No response in 5 minutes escalates automatically to traffic wardens.',
                points: ['GPS car pin with photo', 'Blocking vehicle alerts', 'Auto-escalation to wardens'],
              },
              {
                icon: <Bus className="h-6 w-6 text-teal-600" />,
                bg: 'bg-teal-50',
                title: 'Transit & Shuttle Routing',
                badge: 'Differentiator',
                badgeColor: 'bg-teal-100 text-teal-700',
                body: 'Shuttle dispatch via pgRouting over a digitised camp road network. Real-time congestion detection reroutes active journeys automatically. Admin can close road segments instantly.',
                points: ['GPS proximity dispatch', 'Live congestion detection', 'Dynamic route recalculation'],
              },
            ].map(mod => (
              <div key={mod.title} className="rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${mod.bg}`}>{mod.icon}</div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{mod.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{mod.body}</p>
                <ul className="space-y-1.5">
                  {mod.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role CTAs ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for every role</h2>
            <p className="text-gray-500">One app, personalised for how you serve the camp.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { emoji: '🙏', role: 'Worshipper', desc: 'Report emergencies, find missing persons, pin your car, and book accommodation.', cta: 'Register free', href: '/register', color: 'hover:border-blue-300' },
              { emoji: '🏥', role: 'Medical Officer', desc: 'Receive real-time dispatch alerts, manage incident queue, update response status.', cta: 'Officer login', href: '/login', color: 'hover:border-red-300' },
              { emoji: '👮', role: 'Security Officer', desc: 'Manage missing person alerts, receive dispatch notifications, coordinate response.', cta: 'Officer login', href: '/login', color: 'hover:border-amber-300' },
              { emoji: '🚌', role: 'Shuttle Driver', desc: 'Accept pickup requests, broadcast your location, navigate the camp road network.', cta: 'Driver login', href: '/login', color: 'hover:border-teal-300' },
            ].map(r => (
              <div key={r.role}
                className={`bg-white rounded-2xl border border-gray-200 ${r.color} p-6 flex flex-col transition-colors`}>
                <div className="text-4xl mb-3">{r.emoji}</div>
                <div className="font-semibold text-gray-900 mb-2">{r.role}</div>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{r.desc}</p>
                <Link href={r.href}
                  className="text-sm font-medium text-[#1B3A6B] hover:text-[#2563EB] flex items-center gap-1 transition-colors">
                  {r.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Properties CTA ── */}
      <section className="py-24 px-6 bg-[#1B3A6B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Looking for accommodation at Redemption City?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Browse approved guest properties. No account needed to explore — only required when you book.
          </p>
          <Link href="/properties"
            className="inline-flex items-center gap-2 bg-white text-[#1B3A6B] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Browse Properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1B3A6B]" />
            <span className="font-bold text-[#1B3A6B]">Nexum</span>
            <span className="text-gray-400 text-sm ml-2">· Redemption City Safety Platform</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/properties" className="hover:text-gray-900 transition-colors">Properties</Link>
            <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-gray-900 transition-colors">Register</Link>
          </div>
          <div className="text-sm text-gray-400">© 2026 Nexum · Track 0D Submission</div>
        </div>
      </footer>
    </div>
  );
}
