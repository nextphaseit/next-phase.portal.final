import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const { ticketId } = params;

  // Your logic here...
  return new Response(`Calendar for ticket: ${ticketId}`);
}
