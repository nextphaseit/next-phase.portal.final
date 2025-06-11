import { createClient } from '@supabase/supabase-js';
import { UserRole } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUserWithRole(
  email: string,
  password: string,
  role: UserRole = 'user'
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { user_metadata: { role } }
  );

  if (error) throw error;
  return data;
}

export async function getCurrentUserRole() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user?.user_metadata?.role as UserRole | undefined;
}

// Helper function to check if user has admin role
export async function isAdmin() {
  const role = await getCurrentUserRole();
  return role === 'admin';
} 