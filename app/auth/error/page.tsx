import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  const error = searchParams.error || "Unknown error"
  const message = searchParams.message || "An error occurred during authentication"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Authentication Error</CardTitle>
          <CardDescription className="text-center">There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <h3 className="font-medium text-red-800 dark:text-red-200">Error: {error}</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
