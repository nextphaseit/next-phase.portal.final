export const config = {
  app: {
    name: "NextPhase IT Help Desk",
    version: process.env.npm_package_version || "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment: process.env.NODE_ENV || "development",
  },

  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    azure: {
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    },
  },

  powerAutomate: {
    webhookUrl: process.env.POWER_AUTOMATE_WEBHOOK_URL,
    searchWebhookUrl: process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL,
  },

  security: {
    rateLimitMax: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
    rateLimitWindow: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/zip",
    ],
  },

  features: {
    analytics: process.env.NODE_ENV === "production",
    errorTracking: process.env.NODE_ENV === "production",
    debugMode: process.env.NODE_ENV === "development",
  },
} as const

// Validate required environment variables
export function validateConfig() {
  const required = [
    "NEXTAUTH_SECRET",
    "AZURE_AD_CLIENT_ID",
    "AZURE_AD_CLIENT_SECRET",
    "AZURE_AD_TENANT_ID",
    "POWER_AUTOMATE_WEBHOOK_URL",
    "POWER_AUTOMATE_SEARCH_WEBHOOK_URL",
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
