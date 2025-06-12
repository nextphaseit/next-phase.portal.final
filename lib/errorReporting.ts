import type React from "react"
import { supabase } from "./supabaseClient"

export interface FrontendError {
  id?: string
  error_message: string
  error_stack?: string
  component_name?: string
  user_email?: string
  user_agent?: string
  url?: string
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
  metadata?: Record<string, any>
}

/**
 * Log frontend errors to the database
 */
export async function logFrontendError(
  error: Error | string,
  componentName?: string,
  userEmail?: string,
  severity: FrontendError["severity"] = "medium",
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "object" && error.stack ? error.stack : undefined

    const errorData: Omit<FrontendError, "id"> = {
      error_message: errorMessage,
      error_stack: errorStack,
      component_name: componentName,
      user_email: userEmail,
      user_agent: typeof window !== "undefined" ? navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
      severity,
      metadata: metadata || {},
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Frontend Error:", errorData)
    }

    // Log to database (optional - only if table exists)
    try {
      await supabase.from("frontend_errors").insert([errorData])
    } catch (dbError) {
      // If database logging fails, just log to console
      console.warn("Failed to log error to database:", dbError)
    }

    // TODO: Integrate with external error reporting service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: metadata });
  } catch (loggingError) {
    console.error("Error in error logging:", loggingError)
  }
}

/**
 * Error boundary wrapper for React components
 */
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string,
) {
  return function WrappedComponent(props: T) {
    const handleError = (error: Error, errorInfo: any) => {
      logFrontendError(
        error,
        componentName || Component.displayName || Component.name,
        undefined, // User email would need to be passed from context
        "high",
        { errorInfo },
      )
    }

    // This is a simplified error boundary - in production, use react-error-boundary
    try {
      return <Component {...props} />
    } catch (error) {
      handleError(error as Error, {})
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Something went wrong in {componentName}.</p>
          <p className="text-red-600 text-sm mt-1">The error has been logged.</p>
        </div>
      )
    }
  }
}

/**
 * Global error handler for unhandled promise rejections
 */
export function setupGlobalErrorHandling(): void {
  if (typeof window !== "undefined") {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      logFrontendError(event.reason, "UnhandledPromiseRejection", undefined, "high", { type: "unhandledrejection" })
    })

    // Handle global errors
    window.addEventListener("error", (event) => {
      logFrontendError(event.error || event.message, "GlobalError", undefined, "high", {
        type: "global_error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
  }
}

/**
 * Hook for error reporting in React components
 */
export function useErrorReporting(componentName?: string) {
  const reportError = (
    error: Error | string,
    severity: FrontendError["severity"] = "medium",
    metadata?: Record<string, any>,
  ) => {
    logFrontendError(error, componentName, undefined, severity, metadata)
  }

  return { reportError }
}
