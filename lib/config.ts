// Environment variable validation and configuration
export const config = {
  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    name: "NextPhase IT Help Desk",
    version: "1.0.0",
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
    azureAd: {
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    },
  },

  // Power Automate Integration
  powerAutomate: {
    webhookUrl: process.env.POWER_AUTOMATE_WEBHOOK_URL,
    searchWebhookUrl: process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL,
  },

  // SharePoint Configuration
  sharepoint: {
    siteUrl: process.env.SHAREPOINT_SITE_URL,
    listId: process.env.SHAREPOINT_LIST_ID,
  },

  // Rate Limiting
  rateLimit: {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
    window: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NODE_ENV === "production",
    enableDebugMode: process.env.NODE_ENV === "development",
    enableMaintenance: process.env.MAINTENANCE_MODE === "true",
  },
}

// Validate required environment variables
export function validateConfig() {
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "AZURE_AD_CLIENT_ID",
    "AZURE_AD_CLIENT_SECRET",
    "AZURE_AD_TENANT_ID",
    "POWER_AUTOMATE_WEBHOOK_URL",
    "POWER_AUTOMATE_SEARCH_WEBHOOK_URL",
  ]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
    }
  }

  return config
}

// Export validated config
export default validateConfig()
