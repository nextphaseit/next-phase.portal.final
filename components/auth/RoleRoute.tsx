'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasFeatureAccess } from '@/lib/auth/roles';
import { ShieldAlert } from 'lucide-react';

interface RoleRouteProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
}

export default function RoleRoute({ children, feature, fallback }: RoleRouteProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006699]"></div>
      </div>
    );
  }

  if (!session || !hasFeatureAccess(session.user.role, feature as any)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-sm text-gray-600">
              You don't have permission to access this feature. Please contact your administrator if you
              believe this is a mistake.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 