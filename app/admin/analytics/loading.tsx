import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Loading state for summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
          ))}
      </div>

      {/* Loading state for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="h-80">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
