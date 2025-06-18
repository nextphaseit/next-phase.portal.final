import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✔️ Loaded' : '❌ Missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✔️ Loaded' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Missing',
    SHAREPOINT_SITE_ID: process.env.SHAREPOINT_SITE_ID || '❌ Missing',
    SHAREPOINT_LIST_ID: process.env.SHAREPOINT_LIST_ID || '❌ Missing',
    POWER_AUTOMATE_WEBHOOK_URL: process.env.POWER_AUTOMATE_WEBHOOK_URL ? '✔️ Present' : '❌ Missing',
    POWER_AUTOMATE_SEARCH_WEBHOOK_URL: process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL ? '✔️ Present' : '❌ Missing'
  };

  return NextResponse.json(envVars);
} 