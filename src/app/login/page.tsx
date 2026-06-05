import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/shared/LoginForm';
import { Shield } from 'lucide-react';

const GROUP_COPY: Record<string, { heading: string; subheading: string; bullets: string[] }> = {
  responder: {
    heading: 'Responder sign in',
    subheading: 'Medical and security officers receive dispatch alerts, manage active incidents, and coordinate response from one secure portal.',
    bullets: [
      'Real-time incident assignments for medical and security teams.',
      'Missing person alert triage and site coordination.',
      'Fast, secure access to responder tools and event workflows.',
    ],
  },
  driver: {
    heading: 'Driver sign in',
    subheading: 'Access ride requests, keep your location updated, and stay on schedule across the camp network.',
    bullets: [
      'Accept shuttle and transport requests quickly.',
      'Share real-time location and route progress.',
      'Stay connected with camp operations and dispatch.',
    ],
  },
  admin: {
    heading: 'Admin sign in',
    subheading: 'Manage camp operations, bookings, safety alerts, and system-wide dashboards with admin controls.',
    bullets: [
      'Overview of active incidents and missing alerts.',
      'Manage properties, bookings, and user access.',
      'Maintain safety, transit, and geofence workflows.',
    ],
  },
  worshipper: {
    heading: 'Worshipper sign in',
    subheading: 'Book lodging, report incidents, and track camp services all from your worshipper account.',
    bullets: [
      'Manage your approved property bookings.',
      'Report safety incidents or missing persons fast.',
      'Access camp guidance and support tools.',
    ],
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string; group?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect(searchParams.callbackUrl ?? '/');

  const group = Array.isArray(searchParams.group)
    ? searchParams.group[0]?.toLowerCase()
    : searchParams.group?.toLowerCase();

  const copy = group && GROUP_COPY[group]
    ? GROUP_COPY[group]
    : {
      heading: 'One login for every camp role.',
      subheading: 'Sign in once to access worshipper, responder, driver, admin, or host workflows through the same secure Nexum portal.',
      bullets: [
        'Worshipper: book accommodation and report incidents.',
        'Responder: receive alerts and coordinate response.',
        'Driver: accept rides and share route updates.',
        'Admin: oversee camp operations and safety.',
      ],
    };

  const roleRedirects: Record<string, string> = {
    responder: '/responder',
    driver: '/driver/rides',
    admin: '/admin/dashboard',
    worshipper: '/worshipper/bookings',
  };

  const targetRedirect = searchParams.callbackUrl ?? roleRedirects[group ?? ''] ?? '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-md sm:p-10 lg:grid-cols-[1.2fr_0.95fr]">
          <div className="rounded-[2rem] bg-white/10 p-8 text-white ring-1 ring-white/10 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-100" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-100/70">Nexum portal</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">{copy.heading}</h1>
              </div>
            </div>
            <p className="text-base leading-7 text-blue-100/90">{copy.subheading}</p>
            <div className="mt-10 space-y-4">
              {copy.bullets.map((line) => (
                <div key={line} className="flex gap-3 text-sm leading-6 text-blue-100/90">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl lg:p-10">
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sign in</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Access your Nexum account</h2>
              <p className="mt-3 text-sm text-slate-500">
                Use your camp credentials to continue across all personas and secure workflows.
              </p>
            </div>
            <LoginForm
              callbackUrl={targetRedirect}
              error={searchParams.error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
