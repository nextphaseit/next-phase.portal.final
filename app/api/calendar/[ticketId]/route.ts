import { NextRequest, NextResponse } from 'next/server'

type Context = {
  params: {
    ticketId: string
  }
}

export async function GET(
  req: NextRequest,
  context: Context
) {
  return NextResponse.json({ ticketId: context.params.ticketId })
} 