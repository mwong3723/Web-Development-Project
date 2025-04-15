"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, LogIn } from "lucide-react"

export default function ItinerariesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleCreate = () => router.push("/itineraries/create")

  if (status === "loading") {
    return <div className="text-center py-16">Checking authentication status...</div>
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center space-y-6 max-w-md">
          <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">You're not logged in</h2>
          <p className="text-muted-foreground">
            Log in to create and save personalized itineraries for your trips.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <Button asChild size="lg" className="justify-center">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Log In
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default (logged-in) "no itineraries" message
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl space-y-10">
        <div className="text-center space-y-6">
          <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">You have no itineraries</h2>
          <p className="text-muted-foreground">
            Start planning your next adventure. Create your dream itinerary today!
          </p>
          <Button onClick={handleCreate} className="mt-4">
            + Create Itinerary
          </Button>
        </div>
      </div>
    </div>
  )
}
