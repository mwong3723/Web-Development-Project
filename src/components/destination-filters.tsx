"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Search, Filter } from "lucide-react"

export default function DestinationFilters() {
    const [priceRange, setPriceRange] = useState([500, 3000])
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search destinations..." className="pl-9" />
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Continent</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">All Continents</option>
                            <option value="asia">Asia</option>
                            <option value="europe">Europe</option>
                            <option value="north-america">North America</option>
                            <option value="south-america">South America</option>
                            <option value="africa">Africa</option>
                            <option value="oceania">Oceania</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Travel Style</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">All Styles</option>
                            <option value="adventure">Adventure</option>
                            <option value="beach">Beach</option>
                            <option value="cultural">Cultural</option>
                            <option value="urban">Urban</option>
                            <option value="nature">Nature</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="">Any Duration</option>
                            <option value="weekend">Weekend Getaway (1-3 days)</option>
                            <option value="short">Short Trip (4-7 days)</option>
                            <option value="medium">Medium Trip (8-14 days)</option>
                            <option value="long">Long Trip (15+ days)</option>
                        </select>
                    </div>

                    <div className="space-y-4 md:col-span-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium">Price Range</label>
                            <span className="text-sm text-muted-foreground">
                                ${priceRange[0]} - ${priceRange[1]}
                            </span>
                        </div>
                        <Slider defaultValue={priceRange} max={5000} step={100} onValueChange={setPriceRange} className="w-full" />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-2">
                        <Button variant="outline">Reset</Button>
                        <Button>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
