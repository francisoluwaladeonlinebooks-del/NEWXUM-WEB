import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/shared/LoginForm';
import { Shield } from 'lucide-react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect(searchParams.callbackUrl ?? '/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-md sm:p-10 lg:grid-cols-[1.2fr_0.95fr]">
          <div className="rounded-[2rem] bg-white/10 p-8 text-white ring-1 ring-white/10 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-100" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-100/70">Nexum portal</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">One login for every camp role.</h1>
              </div>
            </div>
            <p className="text-base leading-7 text-blue-100/90">
              Sign in once to access the worshipper, responder, driver, admin, or host experience. All personas share the same secure Nexum portal.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Worshipper: book accommodation, report incidents, pin your vehicle.',
                'Medical Officer: receive dispatch alerts and manage incident response.',
                'Security Officer: handle missing person alerts and coordinate safety.',
                'Driver: accept rides, share location, and navigate camp routes.',
                'Host: manage approved properties and guest bookings.',
              ].map((line) => (
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
              callbackUrl={searchParams.callbackUrl}
              error={searchParams.error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
