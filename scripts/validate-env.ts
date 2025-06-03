#!/usr/bin/env node

import { validateConfig } from "../lib/config"

interface ValidationReport {
  status: "PASS" | "FAIL" | "WARN"
  summary: string
  details: {
    present: string[]
    missing: string[]
    errors: string[]
    warnings: string[]
  }
}

function generateValidationReport(): ValidationReport {
  console.log("🔍 Environment Variable Validation Report")
  console.log("=".repeat(60))

  const validation = validateConfig()

  // Print present variables
  if (validation.present.length > 0) {
    console.log("\n✅ Present Environment Variables:")
    validation.present.forEach((variable) => {
      console.log(`   ✓ ${variable}`)
    })
  }

  // Print missing variables
  if (validation.missing.length > 0) {
    console.log("\n❌ Missing Environment Variables:")
    validation.missing.forEach((variable) => {
      console.log(`   ✗ ${variable}`)
    })
  }

  // Print errors
  if (validation.errors.length > 0) {
    console.log("\n🚨 Critical Errors:")
    validation.errors.forEach((error) => {
      console.log(`   ❌ ${error}`)
    })
  }

  // Print warnings
  if (validation.warnings.length > 0) {
    console.log("\n⚠️ Warnings:")
    validation.warnings.forEach((warning) => {
      console.log(`   ⚠️ ${warning}`)
    })
  }

  // Determine status
  let status: ValidationReport["status"] = "PASS"
  let summary = "All environment variables are properly configured"

  if (validation.errors.length > 0) {
    status = "FAIL"
    summary = `${validation.errors.length} critical error(s) found - build cannot proceed`
  } else if (validation.warnings.length > 0) {
    status = "WARN"
    summary = `${validation.warnings.length} warning(s) found - build can proceed with caution`
  }

  console.log("\n" + "=".repeat(60))
  console.log(`📊 Validation Status: ${status}`)
  console.log(`📋 Summary: ${summary}`)
  console.log("=".repeat(60))

  return {
    status,
    summary,
    details: {
      present: validation.present,
      missing: validation.missing,
      errors: validation.errors,
      warnings: validation.warnings,
    },
  }
}

// Run validation
const report = generateValidationReport()

// Exit with appropriate code
if (report.status === "FAIL") {
  console.error("\n🛑 BUILD HALTED: Critical environment variables missing")
  process.exit(1)
} else if (report.status === "WARN") {
  console.warn("\n⚠️ BUILD PROCEEDING WITH WARNINGS")
  process.exit(0)
} else {
  console.log("\n🎉 BUILD READY: All environment variables validated")
  process.exit(0)
}
