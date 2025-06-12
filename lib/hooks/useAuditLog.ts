'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { logAuditEvent, withAuditLogging } from '../audit';

export function useAuditLog() {
  const { data: session } = useSession();

  const logEvent = useCallback(async (
    action: string,
    metadata?: Record<string, any>
  ) => {
    if (!session?.user?.email) {
      console.warn('No user session found for audit logging');
      return;
    }

    await logAuditEvent(action, session.user.email, metadata);
  }, [session]);

  const withLogging = useCallback(<T extends (...args: any[]) => Promise<any>>(
    action: string,
    fn: T
  ) => {
    if (!session?.user?.email) {
      console.warn('No user session found for audit logging');
      return fn;
    }

    return withAuditLogging(action, () => session.user.email!)(fn);
  }, [session]);

  return {
    logEvent,
    withLogging,
  };
} 