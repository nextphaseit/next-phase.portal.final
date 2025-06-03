#!/usr/bin/env node

import { execSync } from "child_process"
import { readFileSync, existsSync, readdirSync, statSync } from "fs"
import { join, extname } from "path"
import { validateEnvironmentVariables } from "../lib/config"

interface ValidationResult {
  category: string
  step: string
  status: "✅ PASS" | "❌ FAIL" | "⚠️ WARN"
  message: string
  details?: string[]
}

const results: ValidationResult[] = []

function addResult(
  category: string,
  step: string,
  status: ValidationResult["status"],
  message: string,
  details?: string[],
) {
  results.push({ category, step, status, message, details })
  const icon = status === "✅ PASS" ? "✅" : status === "❌ FAIL" ? "❌" : "⚠️"
  console.log(`${icon} ${category}: ${step} - ${message}`)
  if (details && details.length > 0) {
    details.forEach((detail) => console.log(`   ${detail}`))
  }
}

// 1. Environment Variables Validation
function validateEnvironment() {
  console.log("\n🔍 Validating Environment Variables...")

  const validation = validateEnvironmentVariables()

  if (validation.isValid) {
    addResult("Environment", "Required Variables", "✅ PASS", "All required environment variables are present")
  } else {
    addResult(
      "Environment",
      "Required Variables",
      "❌ FAIL",
      "Missing required environment variables",
      validation.errors,
    )
  }

  if (validation.warnings.length > 0) {
    addResult("Environment", "Optional Variables", "⚠️ WARN", "Some optional variables missing", validation.warnings)
  }
}

// 2. Layout Files Validation
function validateLayouts() {
  console.log("\n🔍 Validating Layout Files...")

  const layoutFiles = ["app/layout.tsx", "app/(admin)/admin/layout.tsx", "app/(client)/layout.tsx"]

  for (const layoutPath of layoutFiles) {
    if (!existsSync(layoutPath)) {
      addResult("Layouts", layoutPath, "❌ FAIL", "Layout file missing")
      continue
    }

    const content = readFileSync(layoutPath, "utf8")

    // Check for client-side code
    if (content.includes('"use client"') || content.includes("'use client'")) {
      addResult("Layouts", layoutPath, "❌ FAIL", "Layout contains 'use client' directive")
      continue
    }

    // Check for invalid exports
    const invalidExports = ["generateStaticParams", "generateMetadata", "revalidate"]
    const hasInvalidExports = invalidExports.some((exp) => content.includes(`export const ${exp}`))

    if (hasInvalidExports) {
      addResult("Layouts", layoutPath, "⚠️ WARN", "Layout may contain invalid exports")
    } else {
      addResult("Layouts", layoutPath, "✅ PASS", "Server component compliant")
    }
  }
}

// 3. Date Usage Validation
function validateDateUsage() {
  console.log("\n🔍 Validating Date Usage...")

  const issues: string[] = []

  function scanDirectory(dir: string) {
    const items = readdirSync(dir)

    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
        scanDirectory(fullPath)
      } else if (stat.isFile() && [".ts", ".tsx"].includes(extname(item))) {
        const content = readFileSync(fullPath, "utf8")

        // Check for Date assignments to string fields
        const dateAssignmentPattern = /:\s*new Date\(/g
        const matches = content.match(dateAssignmentPattern)

        if (matches) {
          // Check if .toISOString() is used
          const hasToISOString = content.includes(".toISOString()")
          if (
            (!hasToISOString && content.includes("createdAt")) ||
            content.includes("updatedAt") ||
            content.includes("expiresAt")
          ) {
            issues.push(`${fullPath}: Potential Date object assigned to string field`)
          }
        }
      }
    }
  }

  scanDirectory("app")
  scanDirectory("components")

  if (issues.length === 0) {
    addResult("Date Usage", "String Conversion", "✅ PASS", "All Date objects properly converted to strings")
  } else {
    addResult("Date Usage", "String Conversion", "⚠️ WARN", "Potential Date/string issues found", issues)
  }
}

// 4. TypeScript Validation
function validateTypeScript() {
  console.log("\n🔍 Validating TypeScript...")

  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" })
    addResult("TypeScript", "Type Check", "✅ PASS", "No type errors found")
  } catch (error) {
    const output = error instanceof Error ? error.message : String(error)
    addResult("TypeScript", "Type Check", "❌ FAIL", "TypeScript compilation failed", [output])
  }
}

// 5. ESLint Validation
function validateESLint() {
  console.log("\n🔍 Validating ESLint...")

  try {
    execSync("npx eslint . --ext .ts,.tsx --max-warnings 0", { stdio: "pipe" })
    addResult("ESLint", "Code Quality", "✅ PASS", "No linting errors or warnings")
  } catch (error) {
    addResult("ESLint", "Code Quality", "⚠️ WARN", "Linting issues found")
  }
}

// 6. Build Validation
function validateBuild() {
  console.log("\n🔍 Validating Build...")

  try {
    execSync("npm run build", { stdio: "pipe" })
    addResult("Build", "Next.js Build", "✅ PASS", "Build completed successfully")
  } catch (error) {
    const output = error instanceof Error ? error.message : String(error)
    addResult("Build", "Next.js Build", "❌ FAIL", "Build failed", [output])
  }
}

// 7. Route Structure Validation
function validateRouteStructure() {
  console.log("\n🔍 Validating Route Structure...")

  const appDir = "app"
  const issues: string[] = []

  function checkRouteGroups(dir: string, depth = 0) {
    if (depth > 3) return // Prevent infinite recursion

    const items = readdirSync(dir)
    const routeGroups = items.filter((item) => item.startsWith("(") && item.endsWith(")"))

    // Check for conflicting route groups
    if (routeGroups.length > 1) {
      issues.push(`Multiple route groups in ${dir}: ${routeGroups.join(", ")}`)
    }

    for (const item of items) {
      const fullPath = join(dir, item)
      if (statSync(fullPath).isDirectory() && !item.startsWith(".")) {
        checkRouteGroups(fullPath, depth + 1)
      }
    }
  }

  if (existsSync(appDir)) {
    checkRouteGroups(appDir)
  }

  if (issues.length === 0) {
    addResult("Routes", "Structure", "✅ PASS", "No conflicting route groups found")
  } else {
    addResult("Routes", "Structure", "⚠️ WARN", "Route structure issues found", issues)
  }
}

// Main validation function
async function runValidation() {
  console.log("🚀 Starting Pre-Deployment Validation...\n")
  console.log("=".repeat(60))

  validateEnvironment()
  validateLayouts()
  validateDateUsage()
  validateTypeScript()
  validateESLint()
  validateRouteStructure()
  validateBuild()

  // Summary
  console.log("\n" + "=".repeat(60))
  console.log("📊 VALIDATION SUMMARY")
  console.log("=".repeat(60))

  const passed = results.filter((r) => r.status === "✅ PASS").length
  const failed = results.filter((r) => r.status === "❌ FAIL").length
  const warnings = results.filter((r) => r.status === "⚠️ WARN").length

  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️ Warnings: ${warnings}`)

  if (failed > 0) {
    console.log("\n🚨 DEPLOYMENT BLOCKED - Fix critical issues before deploying")
    process.exit(1)
  } else if (warnings > 0) {
    console.log("\n⚠️ DEPLOYMENT READY WITH WARNINGS - Review warnings before deploying")
  } else {
    console.log("\n🎉 DEPLOYMENT READY - All validations passed!")
  }

  console.log("\n🚀 Ready for production deployment on Vercel with Next.js 15")
}

// Run validation
runValidation().catch((error) => {
  console.error("Validation failed:", error)
  process.exit(1)
})
