import { config, validateConfig } from "@/lib/config"

interface VerificationResult {
  category: string
  checks: Array<{
    name: string
    status: "pass" | "fail" | "warning"
    message: string
  }>
}

async function verifyEnvironment(): Promise<VerificationResult> {
  const checks = []

  try {
    validateConfig()
    checks.push({
      name: "Environment Variables",
      status: "pass" as const,
      message: "All required environment variables are present",
    })
  } catch (error) {
    checks.push({
      name: "Environment Variables",
      status: "fail" as const,
      message: error instanceof Error ? error.message : "Environment validation failed",
    })
  }

  // Check Azure AD configuration
  if (config.auth.azure.clientId && config.auth.azure.tenantId) {
    checks.push({
      name: "Azure AD Configuration",
      status: "pass" as const,
      message: "Azure AD credentials configured",
    })
  } else {
    checks.push({
      name: "Azure AD Configuration",
      status: "fail" as const,
      message: "Missing Azure AD configuration",
    })
  }

  // Check Power Automate URLs
  if (config.powerAutomate.webhookUrl && config.powerAutomate.searchWebhookUrl) {
    checks.push({
      name: "Power Automate URLs",
      status: "pass" as const,
      message: "Webhook URLs configured",
    })
  } else {
    checks.push({
      name: "Power Automate URLs",
      status: "fail" as const,
      message: "Missing Power Automate webhook URLs",
    })
  }

  // Check security settings
  if (config.security.rateLimitMax > 0 && config.security.rateLimitWindow > 0) {
    checks.push({
      name: "Security Configuration",
      status: "pass" as const,
      message: `Rate limiting: ${config.security.rateLimitMax} requests per ${config.security.rateLimitWindow / 1000}s`,
    })
  } else {
    checks.push({
      name: "Security Configuration",
      status: "warning" as const,
      message: "Rate limiting not properly configured",
    })
  }

  return {
    category: "Environment",
    checks,
  }
}

async function verifyEndpoints(): Promise<VerificationResult> {
  const checks = []
  const baseUrl = config.app.url

  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    if (healthResponse.ok) {
      checks.push({
        name: "Health Endpoint",
        status: "pass" as const,
        message: "Health check endpoint responding",
      })
    } else {
      checks.push({
        name: "Health Endpoint",
        status: "fail" as const,
        message: `Health check failed with status ${healthResponse.status}`,
      })
    }
  } catch (error) {
    checks.push({
      name: "Health Endpoint",
      status: "fail" as const,
      message: "Health check endpoint unreachable",
    })
  }

  return {
    category: "Endpoints",
    checks,
  }
}

async function verifyPowerAutomate(): Promise<VerificationResult> {
  const checks = []

  try {
    // Test webhook connectivity (without sending actual data)
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
    }

    const webhookResponse = await fetch(config.powerAutomate.webhookUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    })

    if (webhookResponse.ok) {
      checks.push({
        name: "Submission Webhook",
        status: "pass" as const,
        message: "Power Automate submission webhook responding",
      })
    } else {
      checks.push({
        name: "Submission Webhook",
        status: "warning" as const,
        message: `Webhook responded with status ${webhookResponse.status}`,
      })
    }
  } catch (error) {
    checks.push({
      name: "Submission Webhook",
      status: "fail" as const,
      message: "Cannot reach Power Automate submission webhook",
    })
  }

  try {
    const searchResponse = await fetch(config.powerAutomate.searchWebhookUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    })

    if (searchResponse.ok) {
      checks.push({
        name: "Search Webhook",
        status: "pass" as const,
        message: "Power Automate search webhook responding",
      })
    } else {
      checks.push({
        name: "Search Webhook",
        status: "warning" as const,
        message: `Search webhook responded with status ${searchResponse.status}`,
      })
    }
  } catch (error) {
    checks.push({
      name: "Search Webhook",
      status: "fail" as const,
      message: "Cannot reach Power Automate search webhook",
    })
  }

  return {
    category: "Power Automate",
    checks,
  }
}

export async function runProductionVerification() {
  console.log("🔍 Running Production Verification...\n")

  const results = await Promise.all([verifyEnvironment(), verifyEndpoints(), verifyPowerAutomate()])

  let hasFailures = false
  let hasWarnings = false

  results.forEach((result) => {
    console.log(`📋 ${result.category}:`)
    result.checks.forEach((check) => {
      const icon = check.status === "pass" ? "✅" : check.status === "warning" ? "⚠️" : "❌"
      console.log(`  ${icon} ${check.name}: ${check.message}`)

      if (check.status === "fail") hasFailures = true
      if (check.status === "warning") hasWarnings = true
    })
    console.log()
  })

  if (hasFailures) {
    console.log("❌ Production verification failed. Please fix the issues above before deploying.")
    process.exit(1)
  } else if (hasWarnings) {
    console.log("⚠️  Production verification completed with warnings. Review before deploying.")
  } else {
    console.log("✅ Production verification passed! Ready for deployment.")
  }

  return { hasFailures, hasWarnings }
}

// Run verification if called directly
if (require.main === module) {
  runProductionVerification().catch(console.error)
}
