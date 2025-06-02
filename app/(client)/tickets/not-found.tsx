import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, Plus } from "lucide-react"
import Link from "next/link"

export default function TicketsNotFound() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Ticket Not Found</CardTitle>
            <CardDescription>
              The ticket you're looking for doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href="/tickets">
                  <Home className="mr-2 h-4 w-4" />
                  All Tickets
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/tickets/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Ticket
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
