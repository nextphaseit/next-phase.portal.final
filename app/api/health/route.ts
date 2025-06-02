import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      "POWER_AUTOMATE_WEBHOOK_URL",
      "POWER_AUTOMATE_SEARCH_WEBHOOK_URL",
      "AZURE_AD_CLIENT_ID",
      "AZURE_AD_TENANT_ID",
      "NEXTAUTH_SECRET",
    ]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Missing required environment variables",
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
