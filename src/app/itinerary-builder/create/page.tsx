"use client";

import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DestinationSidebar from "@/components/destination-sidebar";
import DestinationCard from "@/components/ui/destination-card";

export default function CreateItineraryPage() {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<{ name: string; location: string } | null>(null);

  return (
    <DndContext
      onDragStart={(event) => {
        const { name, location } = event.active.data.current || {};
        setActiveCard({ name, location });
      }}
      onDragEnd={() => setActiveCard(null)}
      onDragCancel={() => setActiveCard(null)}
    >
      <div className="flex h-screen overflow-hidden">
        <DestinationSidebar />
        <div className="flex-1 p-8 overflow-y-auto">
          <Button variant="ghost" onClick={() => router.push("/itinerary-builder")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Itineraries
          </Button>
          <h1 className="text-3xl font-bold mb-2">🗓️ Build Your Itinerary</h1>
          <p className="text-muted-foreground mb-6">
            Select dates and drag destinations from the sidebar to build your trip.
          </p>
          <div className="border rounded-lg p-6 text-muted-foreground text-sm">
            [Calendar Builder Placeholder]
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <DestinationCard name={activeCard.name} location={activeCard.location} ghost />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}