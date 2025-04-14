import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Star } from "lucide-react"

const destinations = [
    {
        id: 1,
        name: "Bali, Indonesia",
        description: "Tropical paradise with stunning beaches, lush rice terraces, and vibrant culture",
        image: "/placeholder.svg?height=600&width=800",
        price: "$899",
        duration: "7 days",
        rating: 4.8,
        reviews: 324,
        tags: ["Beach", "Culture"],
    },
    {
        id: 2,
        name: "Santorini, Greece",
        description: "Iconic white buildings with breathtaking views of the Aegean Sea",
        image: "/placeholder.svg?height=600&width=800",
        price: "$1,299",
        duration: "5 days",
        rating: 4.9,
        reviews: 512,
        tags: ["Romantic", "Beach"],
    },
    {
        id: 3,
        name: "Kyoto, Japan",
        description: "Ancient temples, traditional gardens, and rich cultural heritage",
        image: "/placeholder.svg?height=600&width=800",
        price: "$1,099",
        duration: "6 days",
        rating: 4.7,
        reviews: 287,
        tags: ["Culture", "Historic"],
    },
    {
        id: 4,
        name: "Machu Picchu, Peru",
        description: "Mysterious ancient ruins nestled in the Andes mountains",
        image: "/placeholder.svg?height=600&width=800",
        price: "$1,499",
        duration: "8 days",
        rating: 4.9,
        reviews: 476,
        tags: ["Adventure", "Historic"],
    },
    {
        id: 5,
        name: "Barcelona, Spain",
        description: "Vibrant city with stunning architecture, delicious cuisine, and beautiful beaches",
        image: "/placeholder.svg?height=600&width=800",
        price: "$999",
        duration: "5 days",
        rating: 4.6,
        reviews: 398,
        tags: ["Urban", "Culture"],
    },
    {
        id: 6,
        name: "Serengeti, Tanzania",
        description: "Vast plains teeming with wildlife and the spectacular Great Migration",
        image: "/placeholder.svg?height=600&width=800",
        price: "$2,299",
        duration: "10 days",
        rating: 4.9,
        reviews: 203,
        tags: ["Safari", "Nature"],
    },
    {
        id: 7,
        name: "Amalfi Coast, Italy",
        description: "Stunning coastline with colorful villages perched on cliffs",
        image: "/placeholder.svg?height=600&width=800",
        price: "$1,399",
        duration: "6 days",
        rating: 4.8,
        reviews: 342,
        tags: ["Scenic", "Beach"],
    },
    {
        id: 8,
        name: "Queenstown, New Zealand",
        description: "Adventure capital surrounded by mountains and crystal-clear lakes",
        image: "/placeholder.svg?height=600&width=800",
        price: "$1,599",
        duration: "7 days",
        rating: 4.7,
        reviews: 256,
        tags: ["Adventure", "Nature"],
    },
    {
        id: 9,
        name: "Marrakech, Morocco",
        description: "Vibrant markets, stunning palaces, and rich cultural experiences",
        image: "/placeholder.svg?height=600&width=800",
        price: "$899",
        duration: "5 days",
        rating: 4.6,
        reviews: 312,
        tags: ["Culture", "Historic"],
    },
]

export default function DestinationGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {destinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden group">
                    <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                            src={destination.image || "/placeholder.svg"}
                            alt={destination.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800">
                            <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="absolute bottom-3 left-3 flex gap-1">
                            {destination.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg">{destination.name}</h3>
                            <div className="text-primary font-bold">{destination.price}</div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{destination.duration}</span>
                            <span className="text-sm text-muted-foreground mx-1">•</span>
                            <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm ml-1">{destination.rating}</span>
                                <span className="text-sm text-muted-foreground ml-1">({destination.reviews})</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{destination.description}</p>
                        <Button className="mt-4 w-full">View Details</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
