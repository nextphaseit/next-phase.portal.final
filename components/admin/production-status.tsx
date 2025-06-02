"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

interface SystemStatus {
  service: string
  status: "healthy" | "unhealthy" | "warning"
  message: string
  lastChecked: string
}

export function ProductionStatus() {
  const [statuses, setStatuses] = useState<SystemStatus[]>([])
  const [loading, setLoading] = useState(true)

  const checkSystemHealth = async () => {
    setLoading(true)
    const checks: SystemStatus[] = []

    // Check API health
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      checks.push({
        service: "API Health",
        status: response.ok ? "healthy" : "unhealthy",
        message: data.status || "Unknown",
        lastChecked: new Date().toISOString(),
      })
    } catch (error) {
      checks.push({
        service: "API Health",
        status: "unhealthy",
        message: "API unreachable",
        lastChecked: new Date().toISOString(),
      })
    }

    // Check environment variables
    const envVars = [
      "AZURE_AD_CLIENT_ID",
      "POWER_AUTOMATE_WEBHOOK_URL",
      "POWER_AUTOMATE_SEARCH_WEBHOOK_URL",
      "NEXTAUTH_SECRET",
    ]

    const missingEnvVars = envVars.filter((envVar) => !process.env[`NEXT_PUBLIC_${envVar}_SET`])

    checks.push({
      service: "Environment Configuration",
      status: missingEnvVars.length === 0 ? "healthy" : "warning",
      message: missingEnvVars.length === 0 ? "All variables configured" : `${missingEnvVars.length} variables missing`,
      lastChecked: new Date().toISOString(),
    })

    setStatuses(checks)
    setLoading(false)
  }

  useEffect(() => {
    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: SystemStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: SystemStatus["status"]) => {
    const variants = {
      healthy: "default",
      unhealthy: "destructive",
      warning: "secondary",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Real-time monitoring of production services</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={checkSystemHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.status)}
                <div>
                  <p className="font-medium">{status.service}</p>
                  <p className="text-sm text-muted-foreground">{status.message}</p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(status.status)}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(status.lastChecked).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
