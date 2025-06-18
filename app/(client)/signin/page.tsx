"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useSession } from '@/hooks/use-session';

export default function SignInPage() {
  const router = useRouter();
  const { session } = useSession();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "azure" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <button
          onClick={handleSignIn}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
} 