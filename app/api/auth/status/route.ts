import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      message: "Custom authentication system is running",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Authentication system error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
