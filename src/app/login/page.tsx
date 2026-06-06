import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginContent from '@/components/login/LoginContent';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');

  return <LoginContent />;
}
