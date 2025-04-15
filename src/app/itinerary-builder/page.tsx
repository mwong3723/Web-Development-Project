"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogIn } from "lucide-react";
import ItineraryContainer from "@/components/itinerary-container";

export default function ItinerariesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [itineraries, setItineraries] = useState<any[]>([]);
  const callback = "/itinerary-builder";

  const handleCreate = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch("/api/itinerary/create", {
      method: "POST",
      body: JSON.stringify({ startDate: today, endDate: today }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok && data?.id) {
      router.push(`/itinerary-builder/${data.id}`);
    } else {
      alert("Error creating itinerary.");
    }
  };

  useEffect(() => {
    const fetchItineraries = async () => {
      const res = await fetch("/api/itinerary/all");
      const data = await res.json();
      if (res.ok) setItineraries(data);
    };
    fetchItineraries();
  }, []);

  if (status === "loading") {
    return <div className="text-center py-16">Checking authentication status...</div>;
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
              <Link href={`/login?callbackUrl=${encodeURIComponent(callback)}`}>
                <LogIn className="mr-2 h-5 w-5" />
                Log In
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                href={`/signup?callbackUrl=${encodeURIComponent(callback)}`}
                className="text-primary underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-16">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Your Itineraries</h2>
          <Button onClick={handleCreate}>+ Create Itinerary</Button>
        </div>
        {itineraries.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>You have no itineraries yet.</p>
          </div>
        ) : (
          <ItineraryContainer itineraries={itineraries} />
        )}
      </div>
    </div>
  );
}