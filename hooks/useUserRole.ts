import { useEffect, useState } from 'react';
import { UserRole } from '@/types/supabase';
import { getCurrentUserRole } from '@/lib/supabase/auth';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRole() {
      try {
        const userRole = await getCurrentUserRole();
        setRole(userRole);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user role'));
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, []);

  return {
    role,
    loading,
    error,
    isAdmin: role === 'admin',
  };
}
