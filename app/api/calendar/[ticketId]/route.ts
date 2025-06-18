import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  return NextResponse.json({ ticketId: params.ticketId })
} 