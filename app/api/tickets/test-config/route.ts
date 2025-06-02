import { NextResponse } from "next/server"

export async function GET() {
  try {
    const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL
    const searchWebhookUrl = process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL

    const missingVars = []
    if (!webhookUrl) missingVars.push("POWER_AUTOMATE_WEBHOOK_URL")
    if (!searchWebhookUrl) missingVars.push("POWER_AUTOMATE_SEARCH_WEBHOOK_URL")

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing environment variables: ${missingVars.join(", ")}`,
        missingVars,
      })
    }

    // Test if URLs are valid
    try {
      new URL(webhookUrl)
      new URL(searchWebhookUrl)
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Invalid webhook URL format",
      })
    }

    return NextResponse.json({
      success: true,
      message: "All environment variables configured correctly",
      config: {
        webhookConfigured: !!webhookUrl,
        searchWebhookConfigured: !!searchWebhookUrl,
        webhookDomain: new URL(webhookUrl).hostname,
        searchWebhookDomain: new URL(searchWebhookUrl).hostname,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Configuration check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
