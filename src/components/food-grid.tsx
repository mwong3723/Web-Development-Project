"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Loader2 } from "lucide-react"
import MiniMap from "./mini-map-wrapper"

interface Restaurant {
    name: string
    description: string
    address: string
    dietary: string[]
    coordinates?: {
        lat: number
        lon: number
    }
}

export default function FoodGrid() {
    const searchParams = useSearchParams()
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 8

    const fetchRestaurants = async (isLoadMore = false) => {
        try {
            if (!isLoadMore) setInitialLoading(true)
            else setLoading(true)

            setError(null)

            const coordinates = searchParams.get("coordinates")
            const dietary = searchParams.get("dietary") || ""

            if (!coordinates) {
                setRestaurants([])
                setHasMore(false)
                return
            }

            const [lat, lon] = coordinates.split(",")
            const page = isLoadMore ? currentPage + 1 : 1

            const url = `/api/food?lat=${lat}&lon=${lon}${dietary ? `&dietary=${dietary}` : ""}&page=${page}&limit=${limit}`
            const response = await fetch(url)

            if (!response.ok) throw new Error("Failed to fetch food places")

            const data = await response.json()
            const formatted = data.results.map((item: any) => ({
                name: item.name,
                description: item.description || item.categories?.join(", "),
                address: item.address || "Unknown",
                dietary: item.dietary || [],
                coordinates: item.coordinates
            }))

            if (isLoadMore) {
                setRestaurants(prev => [...prev, ...formatted])
                setCurrentPage(page)
            } else {
                setRestaurants(formatted)
                setCurrentPage(1)
            }

            setHasMore(formatted.length >= limit)
        } catch (err) {
            setError("Failed to load restaurants. Try again.")
        } finally {
            setLoading(false)
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        setRestaurants([])
        setCurrentPage(1)
        setHasMore(true)
        fetchRestaurants(false)
    }, [searchParams])

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => fetchRestaurants(false)} className="mt-4">Try Again</Button>
            </div>
        )
    }

    if (initialLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[...Array(limit)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-[4/3]" />
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

    if (restaurants.length === 0 && !initialLoading) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No restaurants found. Try another location or change filters.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {restaurants.map((restaurant, index) => (
                    <Card key={index} className="overflow-hidden group">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            {restaurant.coordinates ? (
                                <MiniMap
                                    lat={restaurant.coordinates.lat}
                                    lon={restaurant.coordinates.lon}
                                />
                            ) : (
                                <Skeleton className="h-full w-full" />
                            )}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{restaurant.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground line-clamp-1">{restaurant.address}</span>
                            </div>
                            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{restaurant.description}</p>
                            <Button className="mt-4 w-full">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-6">
                    <Button
                        variant="outline"
                        onClick={() => fetchRestaurants(true)}
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

            <div className="text-center text-sm text-muted-foreground">
                Showing {restaurants.length} restaurants
            </div>
        </div>
    )
}
