import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { DashboardPreview } from "@/components/dashboard-preview"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/signin');
  }
  return null;
}
