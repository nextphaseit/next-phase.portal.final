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
    secret: process.env.NEXTAUTH_SECRET,
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
    { key: "SHAREPOINT_SITE_ID", value: config.sharepoint.siteId, required: true },
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
      if (required || config.app.environment === "production") {
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

  if (!hasMicrosoftAuth && !hasAzureAuth) {
    errors.push(
      "Missing Microsoft authentication credentials. Either MICROSOFT_* or AZURE_AD_* variables must be complete",
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

  // Check Auth0 variables (if any are present, all must be present)
  const auth0Present = auth0Variables.some(({ value }) => value)
  const auth0Complete = auth0Variables.every(({ value }) => value)

  if (auth0Present && !auth0Complete) {
    warnings.push("Partial Auth0 configuration detected. All Auth0 variables must be set if using Auth0")
    auth0Variables.forEach(({ key, value }) => {
      if (!value) missing.push(key)
      else present.push(key)
    })
  } else if (auth0Complete) {
    auth0Variables.forEach(({ key }) => present.push(key))
  }

  // Check SharePoint variables (critical for Microsoft Graph)
  for (const { key, value, required } of sharepointVariables) {
    if (!value) {
      if (required || config.app.environment === "production") {
        errors.push(`Missing SharePoint variable: ${key} (required for Microsoft Graph integration)`)
        missing.push(key)
      } else {
        warnings.push(`Missing SharePoint variable: ${key}`)
        missing.push(key)
      }
    } else {
      present.push(key)
    }
  }

  // Check Power Automate variables
  for (const { key, value } of powerAutomateVariables) {
    if (!value) {
      if (config.app.environment === "production") {
        warnings.push(`Missing Power Automate variable: ${key}`)
      }
      missing.push(key)
    } else {
      present.push(key)
    }
  }

  // Validate URL formats
  try {
    new URL(config.app.url)
    present.push("NEXT_PUBLIC_APP_URL (valid)")
  } catch {
    errors.push("NEXT_PUBLIC_APP_URL is not a valid URL")
    missing.push("NEXT_PUBLIC_APP_URL (invalid)")
  }

  try {
    new URL(config.auth.url)
    present.push("NEXTAUTH_URL (valid)")
  } catch {
    if (config.app.environment === "production") {
      errors.push("NEXTAUTH_URL is not a valid URL")
    } else {
      warnings.push("NEXTAUTH_URL is not a valid URL")
    }
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
    missing: [...new Set(missing)], // Remove duplicates
    present: [...new Set(present)], // Remove duplicates
  }
}

// For backward compatibility
export function validateEnvironmentVariables() {
  return validateConfig()
}

// Runtime validation function that throws on missing critical variables
export function validateRuntimeConfig() {
  const validation = validateConfig()

  if (!validation.isValid) {
    const errorMessage = `Environment validation failed:\n${validation.errors.join("\n")}`
    console.error(errorMessage)

    if (config.app.environment === "production") {
      throw new Error(errorMessage)
    }
  }

  if (validation.warnings.length > 0) {
    console.warn(`Environment warnings:\n${validation.warnings.join("\n")}`)
  }

  return validation
}

// Export validated config
export default config
