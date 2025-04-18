"use client";

import { useEffect, useState } from "react";
import DraggableAttractionCard from "@/components/draggable-attraction-card";

interface AttractionSidebarProps {
  locationLabel: string;
}

const hardcodedResults = [
  // Paris Destinations
  { name: "Eiffel Tower", location: "Paris, France", category: "destination" },
  { name: "Louvre Museum", location: "Paris, France", category: "destination" },
  { name: "Notre-Dame Cathedral", location: "Paris, France", category: "destination" },
  { name: "Sainte-Chapelle", location: "Paris, France", category: "destination" },
  { name: "Musee d'Orsay", location: "Paris, France", category: "destination" },

  // Paris Food
  { name: "Yummy Food", location: "Paris, France", category: "food" },
  { name: "French Stuff", location: "Paris, France", category: "food" },
  { name: "Macarons", location: "Paris, France", category: "food" },

  // Paris Accommodations
  { name: "Bed's", location: "Paris, France", category: "accommodation" },
  { name: "Le Budget Inn", location: "Paris, France", category: "accommodation" },

  // Rome Destinations
  { name: "Colosseum", location: "Rome, Italy", category: "destination" },
  { name: "Trevi Fountain", location: "Rome, Italy", category: "destination" },
  { name: "Pantheon", location: "Rome, Italy", category: "destination" },
  { name: "Roman Forum", location: "Rome, Italy", category: "destination" },
  { name: "Piazza Navona", location: "Rome, Italy", category: "destination" },

  // Rome Food
  { name: "Pasta Pasta", location: "Rome, Italy", category: "food" },
  { name: "Pizza Pizza", location: "Rome, Italy", category: "food" },

  // Rome Accommodations
  { name: "Roman Hotel", location: "Rome, Italy", category: "accommodation" },
  { name: "Student Lodge", location: "Rome, Italy", category: "accommodation" },
];

export default function AttractionSidebar({ locationLabel }: AttractionSidebarProps) {
  const [filtered, setFiltered] = useState<typeof hardcodedResults>([]);

  useEffect(() => {
    if (locationLabel) {
      const city = locationLabel.toLowerCase().includes("rome")
        ? "Rome"
        : locationLabel.toLowerCase().includes("paris")
        ? "Paris"
        : null;

      const results = hardcodedResults.filter((item) =>
        item.location.toLowerCase().includes(city?.toLowerCase() || "")
      );
      setFiltered(results);
    }
  }, [locationLabel]);

  return (
    <aside className="w-[300px] h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col p-4">
      <div className="text-sm font-medium mb-2">
        Attractions for <strong>{locationLabel}</strong>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-25">
        {filtered.map((item, index) => (
          <DraggableAttractionCard
            key={item.name + item.location + index}
            name={item.name}
            location={item.location}
            category={item.category as "destination" | "food" | "accommodation"}
          />
        ))}
      </div>
    </aside>
  );
}
