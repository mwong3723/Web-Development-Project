"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { LocationAutocomplete, LocationOption } from "@/components/LocationAutocomplete"

export default function FoodFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)
    const [dietary, setDietary] = useState("")

    useEffect(() => {
        const locationParam = searchParams.get("location")
        const coordinatesParam = searchParams.get("coordinates")
        const dietaryParam = searchParams.get("dietary")

        if (dietaryParam) {
            setDietary(dietaryParam)
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

        if (dietary) {
            params.set("dietary", dietary)
        } else {
            params.delete("dietary")
        }

        router.push(`/food?${params.toString()}`)
    }

    const handleFilterReset = () => {
        setDietary("")
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (dietary) {
            params.set("dietary", dietary)
        } else {
            params.delete("dietary")
        }

        router.push(`/food?${params.toString()}`)
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
                        <label className="text-sm font-medium">Dietary Restrictions</label>
                        <select
                            value={dietary}
                            onChange={(e) => setDietary(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">No Preference</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="halal">Halal</option>
                            <option value="kosher">Kosher</option>
                            <option value="gluten_free">Gluten-Free</option>
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
