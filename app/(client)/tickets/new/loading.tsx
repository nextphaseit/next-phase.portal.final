import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NewTicketLoading() {
  return (
    <div className="container py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-10" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
