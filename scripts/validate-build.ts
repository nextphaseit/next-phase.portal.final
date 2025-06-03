#!/usr/bin/env node

import { execSync } from "child_process"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

interface ValidationResult {
  step: string
  success: boolean
  message: string
  details?: string
}

const results: ValidationResult[] = []

function validateStep(step: string, fn: () => void): void {
  try {
    console.log(`🔍 Validating: ${step}`)
    fn()
    results.push({ step, success: true, message: "✅ Passed" })
    console.log(`✅ ${step} - Passed`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    results.push({ step, success: false, message: "❌ Failed", details: message })
    console.error(`❌ ${step} - Failed: ${message}`)
  }
}

// Validation functions
function validateEnvironmentVariables() {
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "AZURE_AD_CLIENT_ID",
    "AZURE_AD_CLIENT_SECRET",
    "AZURE_AD_TENANT_ID",
    "POWER_AUTOMATE_WEBHOOK_URL",
    "POWER_AUTOMATE_SEARCH_WEBHOOK_URL",
    "NEXT_PUBLIC_APP_URL",
  ]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`)
  }
}

function validateTypeScript() {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" })
  } catch (error) {
    throw new Error("TypeScript compilation failed")
  }
}

function validateESLint() {
  try {
    execSync("npx eslint . --ext .ts,.tsx --max-warnings 0", { stdio: "pipe" })
  } catch (error) {
    throw new Error("ESLint validation failed")
  }
}

function validateNextJSBuild() {
  try {
    execSync("npx next build", { stdio: "pipe" })
  } catch (error) {
    throw new Error("Next.js build failed")
  }
}

function validatePackageJson() {
  const packagePath = join(process.cwd(), "package.json")
  if (!existsSync(packagePath)) {
    throw new Error("package.json not found")
  }

  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"))

  const requiredScripts = ["build", "start", "dev", "lint"]
  const missingScripts = requiredScripts.filter((script) => !packageJson.scripts?.[script])

  if (missingScripts.length > 0) {
    throw new Error(`Missing required scripts: ${missingScripts.join(", ")}`)
  }
}

function validateFileStructure() {
  const requiredFiles = ["app/layout.tsx", "app/page.tsx", "next.config.mjs", "tailwind.config.ts", "tsconfig.json"]

  const missingFiles = requiredFiles.filter((file) => !existsSync(join(process.cwd(), file)))

  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.join(", ")}`)
  }
}

// Run all validations
async function runValidation() {
  console.log("🚀 Starting build validation...\n")

  validateStep("Package.json structure", validatePackageJson)
  validateStep("File structure", validateFileStructure)
  validateStep("Environment variables", validateEnvironmentVariables)
  validateStep("TypeScript compilation", validateTypeScript)
  validateStep("ESLint validation", validateESLint)
  validateStep("Next.js build", validateNextJSBuild)

  // Summary
  console.log("\n📊 Validation Summary:")
  console.log("=".repeat(50))

  const passed = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  results.forEach((result) => {
    console.log(`${result.message} ${result.step}`)
    if (result.details) {
      console.log(`   ${result.details}`)
    }
  })

  console.log("=".repeat(50))
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log("\n🚨 Build validation failed! Please fix the issues above.")
    process.exit(1)
  } else {
    console.log("\n🎉 All validations passed! Ready for deployment.")
    process.exit(0)
  }
}

// Run if called directly
if (require.main === module) {
  runValidation().catch((error) => {
    console.error("Validation script failed:", error)
    process.exit(1)
  })
}

export { runValidation, validateStep }
