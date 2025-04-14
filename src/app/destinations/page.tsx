import DestinationFilters from "@/components/destination-filters"
import DestinationGrid from "@/components/destination-grid"
import PageHeader from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export default function DestinationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Explore Destinations"
                description="Discover amazing places around the world and start planning your next adventure."
            />

            <DestinationFilters />

            <Suspense fallback={<DestinationGridSkeleton />}>
                <DestinationGrid />
            </Suspense>
        </div>
    )
}

function DestinationGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array(9)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
        </div>
    )
}
