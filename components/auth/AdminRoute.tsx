'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Not logged in, redirect to login page
      router.push('/auth/login');
    } else if (session.user.role !== 'admin') {
      // Logged in but not admin, show access denied
      router.push('/access-denied');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006699]"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
} 