"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export default function DestinationFilters() {
    const [showFilters, setShowFilters] = useState(false)
    const [experience, setExperience] = useState("")
    const [accessibility, setAccessibility] = useState("")

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
                        <Button variant="outline" onClick={() => {
                            setExperience("")
                            setAccessibility("")
                        }}>
                            Reset
                        </Button>
                        <Button>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
