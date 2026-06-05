import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ResponderSidebar } from '@/components/responder/ResponderSidebar';

export default async function ResponderLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'medical_officer' && session.user.role !== 'security_officer' && session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <ResponderSidebar user={session.user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
