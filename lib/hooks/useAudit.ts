'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { logAuditEvent, AuditActions, type AuditLogMetadata } from '../auditLogger';

export function useAudit() {
  const { data: session } = useSession();

  const log = useCallback(async (
    action: string,
    metadata: AuditLogMetadata = {}
  ) => {
    if (!session?.user?.email) {
      console.warn('No user session found for audit logging');
      return;
    }

    await logAuditEvent(action, session.user.email, metadata);
  }, [session]);

  return {
    log,
    AuditActions,
  };
} 