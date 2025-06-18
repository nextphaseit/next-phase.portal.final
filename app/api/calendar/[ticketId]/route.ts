import { NextRequest } from "next/server";

// ✅ Use the correct type for context
interface RouteContext {
  params: {
    ticketId: string;
  };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { ticketId } = context.params;

  // Replace this with your actual logic
  return new Response(JSON.stringify({ message: `You requested ticket ID: ${ticketId}` }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

