"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { LocationAutocomplete, LocationOption } from "@/components/LocationAutocomplete"

export default function DestinationFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)
    const [experience, setExperience] = useState("")
    const [accessibility, setAccessibility] = useState("")

    // Initialize state from URL parameters on component mount
    useEffect(() => {
        const locationParam = searchParams.get("location")
        const coordinatesParam = searchParams.get("coordinates")
        const experienceParam = searchParams.get("experience")
        const accessibilityParam = searchParams.get("accessibility")

        if (experienceParam) {
            setExperience(experienceParam)
        }
        
        if (accessibilityParam) {
            setAccessibility(accessibilityParam)
        }

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
        
        if (experience) {
            params.set("experience", experience)
        } else {
            params.delete("experience")
        }
        
        if (accessibility) {
            params.set("accessibility", accessibility)
        } else {
            params.delete("accessibility")
        }
        
        router.push(`/destinations?${params.toString()}`)
    }

    const handleFilterReset = () => {
        setExperience("")
        setAccessibility("")
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (experience) {
            params.set("experience", experience)
        } else {
            params.delete("experience")
        }
        
        if (accessibility) {
            params.set("accessibility", accessibility)
        } else {
            params.delete("accessibility")
        }
        
        router.push(`/destinations?${params.toString()}`)
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
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Experience Type</label>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">All Experiences</option>
                            <option value="cultural">Cultural & Heritage</option>
                            <option value="nature">Nature & Parks</option>
                            <option value="city">City Landmarks</option>
                            <option value="family">Family Friendly</option>
                            <option value="entertainment">Entertainment</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Accessibility</label>
                        <select
                            value={accessibility}
                            onChange={(e) => setAccessibility(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">No Preference</option>
                            <option value="wheelchair.yes">Wheelchair Accessible</option>
                            <option value="internet_access.free">Free Internet</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2">
                        <Button variant="outline" onClick={handleFilterReset}>
                            Reset
                        </Button>
                        <Button onClick={handleApplyFilters}>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
