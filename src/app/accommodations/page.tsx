"use client"

import PageHeader from "@/components/page-header"
import AccommodationFilters from "@/components/accommodations-filters"
import AccommodationGrid from "@/components/accommodations-grid"

export default function AccommodationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Find Nearby Accommodations"
                description="Search for hotels, hostels, and other places to stay near your location."
            />
            <AccommodationFilters />
            <AccommodationGrid />
        </div>
    )
}
