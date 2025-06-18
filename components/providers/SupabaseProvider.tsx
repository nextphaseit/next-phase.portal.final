"use client"

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClient());
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
} 