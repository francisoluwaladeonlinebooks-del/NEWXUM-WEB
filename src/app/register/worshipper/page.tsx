import { redirect } from 'next/navigation';

export default function WorshipperRegisterPage() {
  // Redirect to login page with signup mode - login page now combines both signin and signup
  redirect('/login/worshipper');
}

