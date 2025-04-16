"use client";

import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import DestinationSidebar from "@/components/destination-sidebar";
import DestinationCard from "@/components/destination-card";
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
  const [geoapifyByDate, setGeoapifyByDate] = useState<Record<string, string>>({});
  const [colorByDate, setColorByDate] = useState<Record<string, string>>({}); // ✅ new
  const [destinationsByDate, setDestinationsByDate] = useState<Record<string, Destination[]>>({});
  const [lastAddedDestination, setLastAddedDestination] = useState<{ destination: Destination, date: string } | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const res = await fetch(`/api/itinerary/${itineraryId}`);
      if (!res.ok) return;
      const data = await res.json();

      setItineraryTitle(data.title ?? "Untitled Itinerary");

      if (data.startDate) setStartDate(format(new Date(data.startDate), "yyyy-MM-dd"));
      if (data.endDate) setEndDate(format(new Date(data.endDate), "yyyy-MM-dd"));
    };
    fetchItinerary();
  }, [itineraryId]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) inputRef.current.focus();
  }, [isEditingTitle]);

  const handleTitleChange = async () => {
    const trimmed = itineraryTitle?.trim();
    if (!trimmed) return;

    const res = await fetch(`/api/itinerary/${itineraryId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: trimmed }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) setIsEditingTitle(false);
    else alert("Failed to update title");
  };

  const handleStartDateChange = async (newDate: string) => {
    setStartDate(newDate);
    await fetch(`/api/itinerary/${itineraryId}`, {
      method: "PATCH",
      body: JSON.stringify({ startDate: newDate }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const handleEndDateChange = async (newDate: string) => {
    setEndDate(newDate);
    await fetch(`/api/itinerary/${itineraryId}`, {
      method: "PATCH",
      body: JSON.stringify({ endDate: newDate }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const fetchDays = async () => {
    const res = await fetch(`/api/itinerary/${itineraryId}/days`);
    if (!res.ok) return;
    const data = await res.json();

    const dates = data.map((d: { date: string }) => format(new Date(d.date), "yyyy-MM-dd"));
    setDates(dates);

    const geoMap: Record<string, string> = {};
    const colorMap: Record<string, string> = {}; // ✅ new
    const newDestinations: Record<string, Destination[]> = {};

    for (const day of data) {
      const formattedDate = format(new Date(day.date), "yyyy-MM-dd");

      if (day.geoapifyID) geoMap[formattedDate] = day.geoapifyID;
      if (day.color) colorMap[formattedDate] = day.color;

      const itemsRes = await fetch(`/api/itinerary/${itineraryId}/days/${formattedDate}/items`);
      if (itemsRes.ok) {
        newDestinations[formattedDate] = await itemsRes.json();
      }
    }

    setColorByDate(colorMap); // ✅
    setGeoapifyByDate(geoMap);
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
      const geoapifyPlaceId = active.data.current.geoapifyPlaceId;
      const color = colorByDate[date] ?? "#72B8FF"; // ✅

      // Update the UI
      setGeoapifyByDate((prev) => ({
        ...prev,
        [date]: geoapifyPlaceId,
      }));

      // Persist the change to the backend
      const res = await fetch(`/api/itinerary/${itineraryId}/days/${date}/items`, {
        method: 'POST',
        body: JSON.stringify({ geoapifyPlaceId, color }), // ✅ include color
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        // Revert the change if the request fails
        setGeoapifyByDate((prev) => {
          const updated = { ...prev };
          delete updated[date];
          return updated;
        });
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
          <Button variant="ghost" onClick={() => router.push("/itinerary-builder")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Itineraries
          </Button>

          <div className="mb-2 flex items-center gap-2">
            <div className="relative">
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  value={itineraryTitle}
                  onChange={(e) => setItineraryTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTitleChange();
                    }
                  }}
                  onBlur={handleTitleChange}
                  className="text-3xl font-bold bg-transparent border-none focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold">{itineraryTitle}</h1>
              )}
              {isEditingTitle && (
                <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-gray-400 rounded" />
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">
            Drag destinations from the sidebar to start building your plan.
          </p>

          <CalendarBuilder
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={handleStartDateChange}
            onChangeEndDate={handleEndDateChange}
            dates={dates}
            destinationsByDate={destinationsByDate}
            geoapifyByDate={geoapifyByDate}
            lastAddedDestination={lastAddedDestination}
            colorByDate={colorByDate}
          />
        </div>
      </div>
      <DragOverlay>
        {activeCard && <DestinationCard name={activeCard.name} location={activeCard.location} ghost />}
      </DragOverlay>
    </DndContext>
  );
}