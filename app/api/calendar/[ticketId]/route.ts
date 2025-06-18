import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: { ticketId: string } }
) {
  return NextResponse.json({
    ticketId: context.params.ticketId,
    message: `You searched for calendar ticket: ${context.params.ticketId}`
  })
} 