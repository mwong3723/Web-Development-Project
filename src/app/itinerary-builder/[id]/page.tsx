"use client";

import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import DestinationSidebar from "@/components/destination-sidebar";
import DestinationCard from "@/components/ui/destination-card";
import CalendarBuilder from "@/components/calendar-builder";
import { format } from "date-fns";

interface Destination {
  name: string;
  location: string;
  geoapifyPlaceId?: string;
}

export default function ItineraryEditorPage() {
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id as string;

  const [itineraryTitle, setItineraryTitle] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeCard, setActiveCard] = useState<Destination | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [destinationsByDate, setDestinationsByDate] = useState<Record<string, Destination[]>>({});
  const [lastAddedDestination, setLastAddedDestination] = useState<{destination: Destination, date: string} | null>(null);

  // Fetch itinerary info
  useEffect(() => {
    const fetchItinerary = async () => {
      const res = await fetch(`/api/itinerary/${itineraryId}`);
      if (!res.ok) return;
      const data = await res.json();

      setItineraryTitle(data.title ?? "Untitled Itinerary");

      if (data.startDate) {
        setStartDate(format(new Date(data.startDate), "yyyy-MM-dd"));
      }
      if (data.endDate) {
        setEndDate(format(new Date(data.endDate), "yyyy-MM-dd"));
      }
    };

    fetchItinerary();
  }, [itineraryId]);

  // Fetch ItineraryDay records and items
  const fetchDays = async () => {
    const res = await fetch(`/api/itinerary/${itineraryId}/days`);
    if (!res.ok) return;
    const data = await res.json();
    
    const dates = data.map((d: { date: string }) => format(new Date(d.date), "yyyy-MM-dd"));
    setDates(dates);

    const newDestinations: Record<string, Destination[]> = {};
    for (const day of data) {
      const formattedDate = format(new Date(day.date), "yyyy-MM-dd");
      const itemsRes = await fetch(`/api/itinerary/${itineraryId}/days/${formattedDate}/items`);
      if (itemsRes.ok) {
        newDestinations[format(new Date(day.date), "yyyy-MM-dd")] = await itemsRes.json();
      }
    }
    setDestinationsByDate(newDestinations);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDays();
    }
  }, [startDate, endDate]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (over?.data?.current?.date) {
      const date = over.data.current.date;
      const destination = {
        name: active.data.current.name,
        location: active.data.current.location,
        geoapifyPlaceId: active.data.current.geoapifyPlaceId
      };

      // Optimistic UI update
      setDestinationsByDate(prev => ({
        ...prev,
        [date]: [...(prev[date] || []), destination]
      }));

      // Set last added destination for popup
      setLastAddedDestination({ destination, date });

      // API call to persist
      const res = await fetch(`/api/itinerary/${itineraryId}/days/${date}/items`, {
        method: 'POST',
        body: JSON.stringify(destination),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setDestinationsByDate(prev => ({
          ...prev,
          [date]: prev[date]?.filter(d => d !== destination) || []
        }));
      }
    }

    setActiveCard(null);
    setIsDragging(false);
  };

  if (itineraryTitle === null || !startDate || !endDate) return null;

  return (
    <DndContext
      onDragStart={(event) => {
        const { name, location, geoapifyPlaceId } = event.active.data.current || {};
        setActiveCard({ name, location, geoapifyPlaceId });
        setIsDragging(true);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveCard(null);
        setIsDragging(false);
      }}
    >
      <div className="flex h-screen overflow-hidden">
        <DestinationSidebar />
        <div className="flex-1 h-full overflow-y-auto p-8">
          <CalendarBuilder
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            dates={dates}
            destinationsByDate={destinationsByDate}
            lastAddedDestination={lastAddedDestination}
          />
        </div>
      </div>
      <DragOverlay>
        {activeCard && <DestinationCard name={activeCard.name} location={activeCard.location} ghost />}
      </DragOverlay>
    </DndContext>
  );
}