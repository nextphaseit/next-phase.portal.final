import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">System Maintenance</h1>
          <p className="mt-2 text-gray-600">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4" />
          <AlertTitle>Temporary Unavailability</AlertTitle>
          <AlertDescription>
            Our services are temporarily unavailable while we perform system updates. We expect to be back online
            shortly.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">For urgent support needs, please contact us directly.</p>
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="mailto:support@nextphaseit.com">Email Support</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
