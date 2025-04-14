"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Utensils, Home } from "lucide-react"
import { LocationAutocomplete, LocationOption } from "@/components/LocationAutocomplete"

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("destinations")
  const [destination, setDestination] = useState<LocationOption | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams()

    if (destination) {
      searchParams.append("location", destination.formatted)
      searchParams.append("coordinates", `${destination.lat},${destination.lon}`)
    }

    router.push(`/${activeTab}?${searchParams.toString()}`)
  }

  return (
    <div className="flex-1 flex items-center justify-center">

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Discover Your Next Adventure
          </h1>
          <p className="mt-6 text-lg leading-8">
            Plan your perfect trip with personalized itineraries, expert recommendations, and seamless booking experiences.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="bg-card backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-border/20">
            <Tabs defaultValue="destinations" className="w-full" onValueChange={setActiveTab}>
              <div className="px-4 py-3 border-b border-border/50">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="destinations" className="flex flex-col md:flex-row md:gap-2 items-center">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Destinations</span>
                  </TabsTrigger>
                  <TabsTrigger value="food" className="flex flex-col md:flex-row md:gap-2 items-center">
                    <Utensils className="h-4 w-4" />
                    <span className="hidden sm:inline">Food</span>
                  </TabsTrigger>
                  <TabsTrigger value="accommodations" className="flex flex-col md:flex-row md:gap-2 items-center">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Accommodations</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="p-4">
                <form onSubmit={handleSearch}>
                  <div className="space-y-3">
                    <label className="text-base font-medium text-foreground">Where would you like to explore?</label>
                    <LocationAutocomplete
                      selectedLocation={destination}
                      onLocationChange={setDestination}
                      placeholder="e.g. Paris, Tokyo..."
                      className="w-full py-3"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-6 py-6 text-base">
                    <Search className="mr-2 h-5 w-5" />
                    Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
