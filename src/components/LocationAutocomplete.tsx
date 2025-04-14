// Inspriation for this component from 
// https://github.com/Balastrong/shadcn-autocomplete-demo/blob/main/src/components/autocomplete.tsx

"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { MapPin, Loader2 } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { useDebounce } from "@/hooks/useDebounce"

export interface LocationOption {
    place_id: string
    formatted: string
    city?: string
    country?: string
    lat: number
    lon: number
}

interface LocationAutocompleteProps {
    selectedLocation: LocationOption | null
    onLocationChange: (location: LocationOption | null) => void
    placeholder?: string
    className?: string
}

export function LocationAutocomplete({
    selectedLocation,
    onLocationChange,
    placeholder = "Search for a location...",
    className,
}: LocationAutocompleteProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [locations, setLocations] = useState<LocationOption[]>([])

    const debouncedValue = useDebounce(inputValue, 300)

    // Update input value when selected location changes
    useEffect(() => {
        if (selectedLocation) {
            setInputValue(selectedLocation.formatted)
        }
    }, [selectedLocation])

    // Fetch locations when input changes
    useEffect(() => {
        const fetchLocations = async () => {
            if (!debouncedValue || debouncedValue.length < 2) {
                setLocations([])
                return
            }

            setIsLoading(true)
            try {
                // Call our server API route instead of direct geocoding API
                const response = await fetch(
                    `/api/geocode?query=${encodeURIComponent(debouncedValue)}`
                )

                if (!response.ok) throw new Error('Geocoding API request failed')

                const data = await response.json()

                const formattedResults: LocationOption[] = data.features.map((feature: any) => ({
                    place_id: feature.properties.place_id,
                    formatted: feature.properties.formatted,
                    city: feature.properties.city,
                    country: feature.properties.country,
                    lat: feature.properties.lat,
                    lon: feature.properties.lon
                }))

                setLocations(formattedResults)
            } catch (error) {
                console.error("Error fetching locations:", error)
                setLocations([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchLocations()
    }, [debouncedValue])

    const reset = () => {
        onLocationChange(null)
        setInputValue("")
        setLocations([])
    }

    const handleSelectLocation = (location: LocationOption) => {
        onLocationChange(location)
        setOpen(false)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (
            !e.relatedTarget?.hasAttribute("cmdk-list") &&
            selectedLocation?.formatted !== inputValue
        ) {
            // If there's text but no selection, keep the text but reset location data
            if (inputValue && !selectedLocation) {
                setInputValue(inputValue)
            } else {
                reset()
            }
        }
    }

    return (
        <div className={cn("relative", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false} className="w-full">
                    <div className="flex items-center relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <PopoverAnchor asChild>
                            <CommandPrimitive.Input
                                asChild
                                value={inputValue}
                                onValueChange={setInputValue}
                                onKeyDown={(e) => setOpen(e.key !== "Escape")}
                                onMouseDown={() => setOpen((o) => !!inputValue || !o)}
                                onFocus={() => setOpen(true)}
                                onBlur={handleBlur}
                            >
                                <Input
                                    placeholder={placeholder}
                                    className="pl-9"
                                />
                            </CommandPrimitive.Input>
                        </PopoverAnchor>
                    </div>

                    {!open && <CommandList aria-hidden="true" className="hidden" />}

                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault()
                            }
                        }}
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                    >
                        <CommandList>
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="ml-2 text-sm text-muted-foreground">Searching locations...</span>
                                    </div>
                                </CommandPrimitive.Loading>
                            )}

                            {locations.length > 0 && !isLoading ? (
                                <CommandGroup>
                                    {locations.map((location) => (
                                        <CommandItem
                                            key={location.place_id}
                                            value={location.place_id}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onSelect={() => handleSelectLocation(location)}
                                        >
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{location.formatted}</span>
                                                {(location.city || location.country) && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {[location.city, location.country].filter(Boolean).join(", ")}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : null}

                            {!isLoading && locations.length === 0 && debouncedValue.length > 1 && (
                                <CommandEmpty className="py-4 px-4 text-sm">
                                    No locations found
                                </CommandEmpty>
                            )}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    )
}