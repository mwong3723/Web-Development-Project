"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, Users, MapPin, Compass, Utensils, Home } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { LocationAutocomplete, LocationOption } from "@/components/LocationAutocomplete"

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("destinations")
  const [date, setDate] = useState<Date>()
  const [endDate] = useState<Date>()
  const [travelers, setTravelers] = useState(1)
  const [destination, setDestination] = useState<LocationOption | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams()

    if (destination) {
      searchParams.append("location", destination.formatted)
      searchParams.append("coordinates", `${destination.lat},${destination.lon}`)
    }

    if (date) searchParams.append("date", format(date, "yyyy-MM-dd"))
    if (endDate) searchParams.append("endDate", format(endDate, "yyyy-MM-dd"))
    searchParams.append("travelers", travelers.toString())

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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="destinations" className="flex flex-col md:flex-row md:gap-2 items-center">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Destinations</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex flex-col md:flex-row md:gap-2 items-center">
                    <Compass className="h-4 w-4" />
                    <span className="hidden sm:inline">Activities</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Where to?</label>
                      <LocationAutocomplete
                        selectedLocation={destination}
                        onLocationChange={setDestination}
                        placeholder="e.g. Paris, Tokyo..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">When?</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border border-border">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={travelers}
                          onChange={(e) => setTravelers(Number.parseInt(e.target.value) || 1)}
                          min="1"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-4">
                    <Search className="mr-2 h-4 w-4" />
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
