"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface EnvStatus {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
  present: string[]
}

export function EnvironmentStatus() {
  const [status, setStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch environment status from API
    fetch("/api/admin/env-status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Status</CardTitle>
          <CardDescription>Loading configuration status...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Status</CardTitle>
          <CardDescription>Unable to load configuration status</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Environment Configuration
          {status.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          {status.isValid
            ? "All required environment variables are configured"
            : "Some environment variables are missing or invalid"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.errors.length > 0 && (
          <div>
            <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Critical Errors ({status.errors.length})
            </h4>
            <div className="space-y-1">
              {status.errors.map((error, index) => (
                <Badge key={index} variant="destructive" className="block w-fit">
                  {error}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {status.warnings.length > 0 && (
          <div>
            <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warnings ({status.warnings.length})
            </h4>
            <div className="space-y-1">
              {status.warnings.map((warning, index) => (
                <Badge key={index} variant="secondary" className="block w-fit">
                  {warning}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Configured ({status.present.length})
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {status.present.map((variable, index) => (
                <Badge key={index} variant="outline" className="block w-fit text-xs">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>

          {status.missing.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Missing ({status.missing.length})
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {status.missing.map((variable, index) => (
                  <Badge key={index} variant="destructive" className="block w-fit text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
