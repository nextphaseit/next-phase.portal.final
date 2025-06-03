// Comprehensive environment variable validation with proper typing
interface EnvironmentConfig {
  app: {
    url: string
    name: string
    version: string
    environment: string
  }
  auth: {
    secret: string | undefined
    url: string
    azureAd: {
      clientId: string | undefined
      clientSecret: string | undefined
      tenantId: string | undefined
    }
  }
  powerAutomate: {
    webhookUrl: string | undefined
    searchWebhookUrl: string | undefined
  }
  sharepoint: {
    siteUrl: string | undefined
    listId: string | undefined
  }
  rateLimit: {
    max: number
    window: number
  }
  features: {
    enableAnalytics: boolean
    enableDebugMode: boolean
    enableMaintenance: boolean
    enableAnalyze: boolean
  }
}

// Validate and create configuration with proper fallbacks
export const config: EnvironmentConfig = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    name: "NextPhase IT Help Desk",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    azureAd: {
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    },
  },
  powerAutomate: {
    webhookUrl: process.env.POWER_AUTOMATE_WEBHOOK_URL,
    searchWebhookUrl: process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL,
  },
  sharepoint: {
    siteUrl: process.env.SHAREPOINT_SITE_URL,
    listId: process.env.SHAREPOINT_LIST_ID,
  },
  rateLimit: {
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    window: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10),
  },
  features: {
    enableAnalytics: process.env.NODE_ENV === "production",
    enableDebugMode: process.env.NODE_ENV === "development",
    enableMaintenance: process.env.MAINTENANCE_MODE === "true",
    enableAnalyze: process.env.ANALYZE === "true",
  },
}

// Comprehensive validation function
export function validateEnvironmentVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Required variables for production
  const requiredForProduction = [
    { key: "NEXTAUTH_SECRET", value: config.auth.secret },
    { key: "AZURE_AD_CLIENT_ID", value: config.auth.azureAd.clientId },
    { key: "AZURE_AD_CLIENT_SECRET", value: config.auth.azureAd.clientSecret },
    { key: "AZURE_AD_TENANT_ID", value: config.auth.azureAd.tenantId },
    { key: "POWER_AUTOMATE_WEBHOOK_URL", value: config.powerAutomate.webhookUrl },
    { key: "POWER_AUTOMATE_SEARCH_WEBHOOK_URL", value: config.powerAutomate.searchWebhookUrl },
  ]

  // Check required variables
  for (const { key, value } of requiredForProduction) {
    if (!value) {
      if (config.app.environment === "production") {
        errors.push(`Missing required environment variable: ${key}`)
      } else {
        warnings.push(`Missing environment variable: ${key} (required for production)`)
      }
    }
  }

  // Validate URL formats
  try {
    new URL(config.app.url)
  } catch {
    errors.push("NEXT_PUBLIC_APP_URL is not a valid URL")
  }

  try {
    new URL(config.auth.url)
  } catch {
    warnings.push("NEXTAUTH_URL is not a valid URL")
  }

  // Validate numeric values
  if (isNaN(config.rateLimit.max) || config.rateLimit.max <= 0) {
    warnings.push("RATE_LIMIT_MAX should be a positive number")
  }

  if (isNaN(config.rateLimit.window) || config.rateLimit.window <= 0) {
    warnings.push("RATE_LIMIT_WINDOW should be a positive number")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Export validated config
export default config
