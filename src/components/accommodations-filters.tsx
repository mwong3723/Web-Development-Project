"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { LocationAutocomplete, LocationOption } from "@/components/LocationAutocomplete"

export default function AccommodationsFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)

    useEffect(() => {
        const locationParam = searchParams.get("location")
        const coordinatesParam = searchParams.get("coordinates")

        if (locationParam && coordinatesParam) {
            const [lat, lon] = coordinatesParam.split(",")
            setSelectedLocation({
                formatted: locationParam,
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            })
        }
    }, [])

    const handleSearch = () => {
        if (!selectedLocation) return

        const params = new URLSearchParams(searchParams.toString())
        params.set("location", selectedLocation.formatted)
        params.set("coordinates", `${selectedLocation.lat},${selectedLocation.lon}`)

        router.push(`/accommodations?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <LocationAutocomplete
                        selectedLocation={selectedLocation}
                        onLocationChange={setSelectedLocation}
                        placeholder="Search for a location..."
                        className="w-full"
                    />
                </div>
                <Button onClick={handleSearch} className="sm:w-auto w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto w-full flex items-center"
                    disabled
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                    <p>Filter options coming soon!</p>
                </div>
            )}
        </div>
    )
}
