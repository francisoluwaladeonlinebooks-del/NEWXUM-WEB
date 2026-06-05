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
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-8 w-8 text-blue-200" />
            <span className="text-2xl font-bold text-white">Nexum</span>
          </div>
          <p className="text-blue-200">Redemption City Safety Platform</p>
        </div>
        <LoginForm
          callbackUrl={searchParams.callbackUrl}
          error={searchParams.error}
        />
      </div>
    </div>
  );
}
