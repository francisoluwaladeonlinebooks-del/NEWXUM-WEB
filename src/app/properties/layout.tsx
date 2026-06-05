import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PublicNav } from '@/components/shared/PublicNav';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav session={session} />
      <main>{children}</main>
    </div>
  );
}
