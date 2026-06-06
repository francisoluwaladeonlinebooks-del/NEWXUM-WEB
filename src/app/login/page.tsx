import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="grid grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-[#0047AB] to-[#003580] relative overflow-hidden flex flex-col justify-between p-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-12">
              <div className="text-sm font-semibold text-blue-100/70 mb-2">NEXUM CAMP SYSTEM V2.5</div>
              <h1 className="text-5xl font-bold text-white mb-3">Nexum</h1>
              <p className="text-blue-100/80 text-base">Safety Intelligence for Redemption City</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-[#FFA500] rounded-full mt-2"></div>
                <p className="text-blue-100/90">5M+ Peak worshippers</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-[#FFA500] rounded-full mt-2"></div>
                <p className="text-blue-100/90">2,500 Hectares covered</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-[#FFA500] rounded-full mt-2"></div>
                <p className="text-blue-100/90">3s Emergency dispatch</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 bg-[#FFA500] rounded-full mt-2"></div>
                <p className="text-blue-100/90">24/7 Always active</p>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="relative z-10 border-t border-blue-400/30 pt-6">
            <p className="text-sm text-blue-100/70">Real-time emergency dispatch, automated escalation, and crowd coordination for the world's largest regular gathering</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white flex flex-col justify-center px-12 relative">
          {/* Decorative Header */}
          <div className="mb-10">
            <div className="text-sm font-semibold text-slate-500 mb-1">CHOOSE YOUR PORTAL ACCESS</div>
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-600 mt-2">Select your role to continue</p>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <Link
              href="/login/worshipper"
              className="px-6 py-3 border-b-2 border-[#0047AB] text-[#0047AB] font-semibold"
            >
              Worshipper
            </Link>
            <Link
              href="/login/responder"
              className="px-6 py-3 border-b-2 border-transparent text-slate-600 font-semibold hover:text-slate-900 transition"
            >
              Responder
            </Link>
            <Link
              href="/login/admin"
              className="px-6 py-3 border-b-2 border-transparent text-slate-600 font-semibold hover:text-slate-900 transition"
            >
              HQ Admin
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <p className="text-sm text-slate-600 mb-3">Don't have an account?</p>
            <div className="flex gap-4 text-sm">
              <Link href="/register/worshipper" className="text-[#0047AB] font-semibold hover:underline">
                Register
              </Link>
              <span className="text-slate-300">•</span>
              <a href="#" className="text-[#0047AB] font-semibold hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-xs font-semibold text-amber-900 mb-2">⚡ DEMO BYPASS PRESETS</p>
            <div className="space-y-1 text-xs text-amber-800">
              <p>Pilgrim Comfort (Worshipper)</p>
              <p>Officer Obenga (Pending Vetting)</p>
              <p>Dr. Stella Ola (Approved Med)</p>
              <p>HQ Commandant (Admin 2FA)</p>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-slate-500 text-center">
            Secure login powered by Nexum Gateway Session Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
