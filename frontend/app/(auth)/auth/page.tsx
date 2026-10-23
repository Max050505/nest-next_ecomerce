'use client';

import { useSearchParams } from 'next/navigation';

import LoginForm from '@/components/auth/AuthFrom';
import RegistrationForm from '@/components/auth/RegistrationFrom';

export default function AuthPage() {
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');

  if (mode === 'register') {
    return <RegistrationForm />;
  }

  return <LoginForm />;
}

