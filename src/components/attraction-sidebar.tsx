"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import DraggableDestinationCard from "@/components/draggable-destination-card";
import { useDebounce } from "@/hooks/useDebounce";

interface AttractionSidebarProps {
  locationLabel: string;
}

export default function AttractionSidebar({ locationLabel }: AttractionSidebarProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.length < 2) return setResults([]);

      try {
        const res = await fetch(`/api/sidebar-destinations?query=${encodeURIComponent(debouncedSearch)}`);
        if (!res.ok) throw new Error("Geoapify error");
        const data = await res.json();
        setResults(data.features || []);
      } catch (err) {
        console.error("Failed to fetch attractions:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  return (
    <aside className="w-[300px] h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col p-4">
      <Input
        placeholder="Search attractions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-25">
        {locationLabel && search.length < 2 && (
          <div className="text-sm text-muted-foreground px-2 py-4 text-center">
            Start finding attractions in <strong>{locationLabel}</strong>.
          </div>
        )}
        <div className="flex flex-col space-y-2">
          {results.map((item) => (
            <DraggableDestinationCard
              key={item.properties.place_id}
              name={item.properties.name || item.properties.formatted}
              location={`${item.properties.city || ""}${item.properties.country ? `, ${item.properties.country}` : ""}`}
              geoapifyPlaceId={item.properties.place_id}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}