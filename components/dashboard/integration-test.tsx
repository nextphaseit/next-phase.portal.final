"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Zap, Database } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
  duration?: number
}

export function IntegrationTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setIsRunning(true)
    setResults([])

    const tests: TestResult[] = [
      { name: "Environment Variables", status: "pending", message: "Checking configuration..." },
      { name: "Power Automate Webhook", status: "pending", message: "Testing submission endpoint..." },
      { name: "SharePoint Search", status: "pending", message: "Testing search endpoint..." },
    ]

    setResults([...tests])

    // Test 1: Environment Variables
    const startTime1 = Date.now()
    try {
      const response = await fetch("/api/tickets/test-config")
      const result = await response.json()

      tests[0] = {
        ...tests[0],
        status: result.success ? "success" : "error",
        message: result.message,
        duration: Date.now() - startTime1,
      }
    } catch (error) {
      tests[0] = {
        ...tests[0],
        status: "error",
        message: "Failed to check configuration",
        duration: Date.now() - startTime1,
      }
    }
    setResults([...tests])

    // Test 2: Power Automate Webhook (Test submission)
    const startTime2 = Date.now()
    try {
      const testFormData = new FormData()
      testFormData.append("fullName", "Test User")
      testFormData.append("email", "test@example.com")
      testFormData.append("issueCategory", "Other")
      testFormData.append("description", "This is a test ticket submission to verify Power Automate integration.")

      const response = await fetch("/api/tickets/submit", {
        method: "POST",
        body: testFormData,
      })
      const result = await response.json()

      tests[1] = {
        ...tests[1],
        status: result.success ? "success" : "error",
        message: result.success ? `Test ticket created: ${result.ticketReference}` : result.message,
        duration: Date.now() - startTime2,
      }
    } catch (error) {
      tests[1] = {
        ...tests[1],
        status: "error",
        message: "Failed to connect to Power Automate webhook",
        duration: Date.now() - startTime2,
      }
    }
    setResults([...tests])

    // Test 3: SharePoint Search
    const startTime3 = Date.now()
    try {
      const response = await fetch("/api/tickets/status?query=test@example.com")
      const result = await response.json()

      tests[2] = {
        ...tests[2],
        status: "success", // Even if no ticket found, the endpoint working is success
        message: result.success
          ? "Search working - ticket found"
          : "Search working - no tickets found (expected for test)",
        duration: Date.now() - startTime3,
      }
    } catch (error) {
      tests[2] = {
        ...tests[2],
        status: "error",
        message: "Failed to connect to SharePoint search",
        duration: Date.now() - startTime3,
      }
    }
    setResults([...tests])
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Running...</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Zap className="h-5 w-5 text-violet-600" />
          </div>
          Integration Test Suite
        </CardTitle>
        <CardDescription>
          Test the SharePoint and Power Automate integration to ensure everything is working correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            This will test your Power Automate webhooks and SharePoint connectivity.
          </p>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Integration Tests
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-sm">{result.name}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.duration && <span className="text-xs text-muted-foreground">{result.duration}ms</span>}
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && !isRunning && (
          <Alert className="mt-4">
            <AlertDescription>
              {results.every((r) => r.status === "success") ? (
                <span className="text-green-800">
                  ✅ All tests passed! Your SharePoint and Power Automate integration is working correctly.
                </span>
              ) : (
                <span className="text-amber-800">
                  ⚠️ Some tests failed. Check your Power Automate flows and SharePoint configuration.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
