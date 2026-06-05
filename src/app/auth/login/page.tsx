import LoginPage from '@/app/login/page';

// Re-export the existing login page under /auth/login to separate route
export default function AuthLoginWrapper() {
  return <LoginPage /> as any;
}
