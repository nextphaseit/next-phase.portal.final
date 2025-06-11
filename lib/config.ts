// Environment variable validation and configuration
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
    nextAuth: {
      clientId: string | undefined
      clientSecret: string | undefined
      tenantId: string | undefined
    }
    microsoft: {
      clientId: string | undefined
      clientSecret: string | undefined
      tenantId: string | undefined
    }
    auth0: {
      secret: string | undefined
      baseUrl: string | undefined
      issuerBaseUrl: string | undefined
      clientId: string | undefined
      clientSecret: string | undefined
    }
  }
  sharepoint: {
    siteUrl: string | undefined
    siteId: string | undefined
    listId: string | undefined
  }
  powerAutomate: {
    webhookUrl: string | undefined
    searchWebhookUrl: string | undefined
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

// Environment variable validation results
interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
  present: string[]
}

// Create configuration with comprehensive environment variable support
export const config: EnvironmentConfig = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    name: "NextPhase IT Help Desk",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-development",
    url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    nextAuth: {
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID,
    },
    auth0: {
      secret: process.env.AUTH0_SECRET,
      baseUrl: process.env.AUTH0_BASE_URL,
      issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
    },
  },
  sharepoint: {
    siteUrl: process.env.SHAREPOINT_SITE_URL,
    siteId: process.env.SHAREPOINT_SITE_ID,
    listId: process.env.SHAREPOINT_LIST_ID,
  },
  powerAutomate: {
    webhookUrl: process.env.POWER_AUTOMATE_WEBHOOK_URL,
    searchWebhookUrl: process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL,
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

// Comprehensive validation function with detailed reporting
export function validateConfig(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missing: string[] = []
  const present: string[] = []

  // Critical variables that must be present
  const criticalVariables = [
    { key: "NEXTAUTH_SECRET", value: config.auth.secret, required: true },
    { key: "NEXTAUTH_URL", value: process.env.NEXTAUTH_URL, required: true },
  ]

  // Microsoft authentication variables (at least one set must be complete)
  const microsoftVariables = [
    { key: "MICROSOFT_CLIENT_ID", value: config.auth.microsoft.clientId },
    { key: "MICROSOFT_CLIENT_SECRET", value: config.auth.microsoft.clientSecret },
    { key: "MICROSOFT_TENANT_ID", value: config.auth.microsoft.tenantId },
  ]

  // Azure AD variables (alternative to Microsoft variables)
  const azureVariables = [
    { key: "AZURE_AD_CLIENT_ID", value: config.auth.nextAuth.clientId },
    { key: "AZURE_AD_CLIENT_SECRET", value: config.auth.nextAuth.clientSecret },
    { key: "AZURE_AD_TENANT_ID", value: config.auth.nextAuth.tenantId },
  ]

  // Auth0 variables (optional but if used, all must be present)
  const auth0Variables = [
    { key: "AUTH0_SECRET", value: config.auth.auth0.secret },
    { key: "AUTH0_BASE_URL", value: config.auth.auth0.baseUrl },
    { key: "AUTH0_CLIENT_ID", value: config.auth.auth0.clientId },
    { key: "AUTH0_CLIENT_SECRET", value: config.auth.auth0.clientSecret },
    { key: "AUTH0_ISSUER_BASE_URL", value: config.auth.auth0.issuerBaseUrl },
  ]

  // SharePoint variables (required for Microsoft Graph integration)
  const sharepointVariables = [
    { key: "SHAREPOINT_SITE_ID", value: config.sharepoint.siteId },
    { key: "SHAREPOINT_SITE_URL", value: config.sharepoint.siteUrl },
    { key: "SHAREPOINT_LIST_ID", value: config.sharepoint.listId },
  ]

  // Power Automate variables (required for workflow integration)
  const powerAutomateVariables = [
    { key: "POWER_AUTOMATE_WEBHOOK_URL", value: config.powerAutomate.webhookUrl },
    { key: "POWER_AUTOMATE_SEARCH_WEBHOOK_URL", value: config.powerAutomate.searchWebhookUrl },
  ]

  // Check critical variables
  for (const { key, value, required } of criticalVariables) {
    if (!value) {
      if (required && config.app.environment === "production") {
        errors.push(`Missing critical environment variable: ${key}`)
        missing.push(key)
      } else {
        warnings.push(`Missing environment variable: ${key} (required for production)`)
        missing.push(key)
      }
    } else {
      present.push(key)
    }
  }

  // Check Microsoft authentication (either Microsoft or Azure AD must be complete)
  const hasMicrosoftAuth = microsoftVariables.every(({ value }) => value)
  const hasAzureAuth = azureVariables.every(({ value }) => value)

  if (!hasMicrosoftAuth && !hasAzureAuth && config.app.environment === "production") {
    warnings.push(
      "Missing Microsoft authentication credentials. Either MICROSOFT_* or AZURE_AD_* variables must be complete for production",
    )

    // Add missing Microsoft variables to the list
    microsoftVariables.forEach(({ key, value }) => {
      if (!value) missing.push(key)
      else present.push(key)
    })

    // Add missing Azure variables to the list
    azureVariables.forEach(({ key, value }) => {
      if (!value) missing.push(key)
      else present.push(key)
    })
  } else {
    // Add present authentication variables
    if (hasMicrosoftAuth) {
      microsoftVariables.forEach(({ key }) => present.push(key))
    }
    if (hasAzureAuth) {
      azureVariables.forEach(({ key }) => present.push(key))
    }
  }

  // Check SharePoint variables
  sharepointVariables.forEach(({ key, value }) => {
    if (!value) {
      if (config.app.environment === "production") {
        warnings.push(`Missing SharePoint variable: ${key}`)
      }
      missing.push(key)
    } else {
      present.push(key)
    }
  })

  // Check Power Automate variables
  powerAutomateVariables.forEach(({ key, value }) => {
    if (!value) {
      if (config.app.environment === "production") {
        warnings.push(`Missing Power Automate variable: ${key}`)
      }
      missing.push(key)
    } else {
      present.push(key)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missing,
    present,
  }
}

// Validate environment variables at runtime
export function validateEnvironmentVariables() {
  const result = validateConfig()
  if (!result.isValid) {
    console.error("Environment validation failed:", result.errors)
    throw new Error("Environment validation failed")
  }
}

// Validate runtime configuration
export function validateRuntimeConfig() {
  validateEnvironmentVariables()
  return config
}

// Export validated config
export default config
