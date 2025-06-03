import { NextResponse } from "next/server"
import { validateConfig } from "@/lib/config"

export async function GET() {
  try {
    const validation = validateConfig()

    return NextResponse.json({
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      missing: validation.missing,
      present: validation.present,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to validate environment configuration",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
