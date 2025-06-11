export type UserRole = 'admin' | 'user';

export interface UserMetadata {
  role: UserRole;
}

declare module '@supabase/supabase-js' {
  interface User {
    user_metadata: UserMetadata;
  }
} 