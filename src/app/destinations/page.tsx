"use client"

import DestinationFilters from "@/components/destination-filters"
import DestinationGrid from "@/components/destination-grid"
import PageHeader from "@/components/page-header"

export default function DestinationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Explore Destinations"
                description="Discover amazing places around the world and start planning your next adventure."
            />

            <DestinationFilters />
            <DestinationGrid />
        </div>
    )
}
