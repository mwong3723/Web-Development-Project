// export default function FoodPage() {
//     return (
//         <div className="flex flex-col items-center">
//             Food
//         </div>
//     );
// }
// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// type Restaurant = {
//   properties: {
//     name: string
//     address_line1: string
//     city: string
//     country: string
//   }
// }

// export default function FoodPage() {
//   const [location, setLocation] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [results, setResults] = useState<Restaurant[]>([])
//   const [error, setError] = useState("")

//   const handleSearch = async () => {
//     setLoading(true)
//     setError("")
//     setResults([])

//     try {
//       // Step 1: Geocode the location to lat/lon
//       const geoRes = await fetch(
//         `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
//       )
//       const geoData = await geoRes.json()
//       const place = geoData.features?.[0]

//       if (!place) {
//         setError("Location not found.")
//         setLoading(false)
//         return
//       }

//       const { lat, lon } = place.properties

//       // Step 2: Call your own API to get restaurants
//       const res = await fetch(`/api/places?lat=${lat}&lon=${lon}&type=restaurant`)
//       const data = await res.json()
//       setResults(data.features || [])
//     } catch (err) {
//       console.error(err)
//       setError("Something went wrong while searching.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
//       <h1 className="text-3xl font-bold text-center">Search Restaurants by Location</h1>

//       <div className="flex gap-2">
//         <Input
//           placeholder="Enter a city or location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//         <Button onClick={handleSearch} disabled={loading}>
//           {loading ? "Searching..." : "Search"}
//         </Button>
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <ul className="space-y-4">
//         {results.map((place, idx) => (
//           <li key={idx} className="border rounded-lg p-4 shadow-sm">
//             <h2 className="text-lg font-semibold">{place.properties.name}</h2>
//             <p className="text-sm text-muted-foreground">
//               {place.properties.address_line1}, {place.properties.city}, {place.properties.country}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }


"use client"

import PageHeader from "@/components/page-header"
import FoodFilters from "@/components/food-filters"
import FoodGrid from "@/components/food-grid"

export default function FoodPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Find Nearby Restaurants"
                description="Search for great food options near you using location and dietary preferences."
            />
            <FoodFilters />
            <FoodGrid />
        </div>
    )
}
