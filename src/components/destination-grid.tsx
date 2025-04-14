"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Destination {
    id: string
    name: string
    description: string
    image: string
    rating?: number
    reviews?: number
    tags: string[]
    address: string
}

export default function DestinationGrid() {
    const searchParams = useSearchParams()
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 8

    const fetchDestinations = async (isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                setInitialLoading(true)
            } else {
                setLoading(true)
            }
            setError(null)

            // Get coordinates from URL
            const coordinates = searchParams.get("coordinates")
            const experience = searchParams.get("experience") || ""
            const accessibility = searchParams.get("accessibility") || ""

            if (!coordinates) {
                setDestinations([])
                setHasMore(false)
                return
            }

            const [lat, lon] = coordinates.split(",")
            const page = isLoadMore ? currentPage + 1 : 1

            const url = `/api/destinations?lat=${lat}&lon=${lon}${experience ? `&experience=${experience}` : ""}${accessibility ? `&accessibility=${accessibility}` : ""}&page=${page}&limit=${limit}`

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error("Failed to fetch destinations")
            }

            const data = await response.json()

            // Transform API data format to our component format
            const formattedDestinations = data.features.map((feature: any) => ({
                id: feature.properties.place_id,
                name: feature.properties.name || 'Unnamed',
                description: feature.properties.description ||
                    `${feature.properties.categories?.join(" ")}`,
                address: feature.properties.formatted || 'Unknown',
                tags: feature.properties.categories?.map((cat: string) =>
                    cat.split(".").pop()
                ) || [],
            }))

            if (isLoadMore) {
                setDestinations(prev => [...prev, ...formattedDestinations])
                setCurrentPage(page)
            } else {
                setDestinations(formattedDestinations)
                setCurrentPage(1)
            }

            // Check if we have more results to load
            setHasMore(formattedDestinations.length >= limit)
        } catch (err) {
            console.error("Error fetching destinations:", err)
            setError("Failed to load destinations. Please try again.")
        } finally {
            setLoading(false)
            setInitialLoading(false)
        }
    }

    const handleLoadMore = () => {
        fetchDestinations(true)
    }

    useEffect(() => {
        // Reset everything when search params change
        setDestinations([])
        setCurrentPage(1)
        setHasMore(true)
        fetchDestinations(false)
    }, [searchParams])

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => fetchDestinations(false)} className="mt-4">Try Again</Button>
            </div>
        )
    }

    if (initialLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[...Array(limit)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="aspect-[4/3] relative">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (searchParams.size === 0 || !searchParams.has("coordinates")) {
        return (
            <div className="text-center py-16 px-4">
                <div className="mx-auto max-w-md">
                    <div className="flex justify-center mb-4">
                        <MapPin className="h-12 w-12 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to explore?</h3>
                    <p className="text-muted-foreground">
                        Search for a destination to discover amazing places.
                    </p>
                </div>
            </div>
        )
    }

    if (destinations.length === 0 && !initialLoading) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No destinations found. Try searching for a location or changing your filters.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {destinations.map((destination) => (
                    <Card key={destination.id} className="overflow-hidden group">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800">
                                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                                {destination.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 capitalize">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{destination.name}</h3>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground line-clamp-1">{destination.address}</span>
                            </div>
                            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{destination.description}</p>
                            <Button className="mt-4 w-full">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center pt-6">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-8"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}

            {/* Show total count */}
            <div className="text-center text-sm text-muted-foreground">
                Showing {destinations.length} destinations
            </div>
        </div>
    )
}
