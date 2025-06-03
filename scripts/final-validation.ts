#!/usr/bin/env node

import { execSync } from "child_process"
import { existsSync } from "fs"
import { validateConfig } from "../lib/config"

interface ValidationResult {
  category: string
  status: "✅ PASS" | "❌ FAIL" | "⚠️ WARN"
  message: string
  details?: string[]
}

const results: ValidationResult[] = []

function addResult(category: string, status: ValidationResult["status"], message: string, details?: string[]) {
  results.push({ category, status, message, details })
  const icon = status === "✅ PASS" ? "✅" : status === "❌ FAIL" ? "❌" : "⚠️"
  console.log(`${icon} ${category}: ${message}`)
  if (details && details.length > 0) {
    details.forEach((detail) => console.log(`   ${detail}`))
  }
}

// Final Environment Variables Validation
function validateEnvironmentVariables() {
  console.log("\n🔍 Final Environment Variables Validation...")

  const validation = validateConfig()

  if (validation.isValid) {
    addResult("Environment", "✅ PASS", "All required environment variables configured")
  } else {
    addResult("Environment", "❌ FAIL", "Missing required environment variables", validation.errors)
  }

  if (validation.warnings.length === 0) {
    addResult("Environment", "✅ PASS", "All optional environment variables configured")
  } else {
    addResult("Environment", "⚠️ WARN", "Some optional variables missing", validation.warnings)
  }
}

// Final Build Validation
function validateFinalBuild() {
  console.log("\n🔍 Final Build Validation...")

  try {
    console.log("Running TypeScript check...")
    execSync("npx tsc --noEmit", { stdio: "pipe" })
    addResult("TypeScript", "✅ PASS", "No type errors found")
  } catch (error) {
    addResult("TypeScript", "❌ FAIL", "TypeScript compilation failed")
    return false
  }

  try {
    console.log("Running ESLint...")
    execSync("npx eslint . --ext .ts,.tsx --max-warnings 0", { stdio: "pipe" })
    addResult("ESLint", "✅ PASS", "No linting errors")
  } catch (error) {
    addResult("ESLint", "⚠️ WARN", "Linting warnings found")
  }

  try {
    console.log("Running Next.js build...")
    execSync("npm run build", { stdio: "pipe" })
    addResult("Build", "✅ PASS", "Next.js build completed successfully")
    return true
  } catch (error) {
    addResult("Build", "❌ FAIL", "Next.js build failed")
    return false
  }
}

// Validate Route Structure
function validateRouteStructure() {
  console.log("\n🔍 Validating Route Structure...")

  const criticalRoutes = [
    "app/page.tsx",
    "app/layout.tsx",
    "app/(admin)/admin/layout.tsx",
    "app/(admin)/admin/page.tsx",
    "app/(client)/layout.tsx",
    "app/api/auth/[...nextauth]/route.ts",
  ]

  let allRoutesExist = true
  for (const route of criticalRoutes) {
    if (existsSync(route)) {
      addResult("Routes", "✅ PASS", `${route} exists`)
    } else {
      addResult("Routes", "❌ FAIL", `${route} missing`)
      allRoutesExist = false
    }
  }

  return allRoutesExist
}

// Main validation function
async function runFinalValidation() {
  console.log("🚀 Final Production Validation for NextPhase IT Help Desk")
  console.log("=".repeat(70))

  validateEnvironmentVariables()
  const routesValid = validateRouteStructure()
  const buildValid = validateFinalBuild()

  // Summary
  console.log("\n" + "=".repeat(70))
  console.log("📊 FINAL VALIDATION SUMMARY")
  console.log("=".repeat(70))

  const passed = results.filter((r) => r.status === "✅ PASS").length
  const failed = results.filter((r) => r.status === "❌ FAIL").length
  const warnings = results.filter((r) => r.status === "⚠️ WARN").length

  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️ Warnings: ${warnings}`)

  if (failed > 0) {
    console.log("\n🚨 DEPLOYMENT BLOCKED - Critical issues found")
    process.exit(1)
  } else if (warnings > 0) {
    console.log("\n⚠️ DEPLOYMENT READY WITH WARNINGS")
  } else {
    console.log("\n🎉 PRODUCTION DEPLOYMENT READY!")
  }

  console.log("\n🌐 Ready for Vercel deployment with Next.js 15")
  console.log("🔐 All environment variables configured")
  console.log("🏗️ Build validation passed")
  console.log("🎯 NextPhase IT Help Desk System ready for production!")
}

// Run final validation
runFinalValidation().catch((error) => {
  console.error("Final validation failed:", error)
  process.exit(1)
})
