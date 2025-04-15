"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import DraggableDestinationCard from "@/components/ui/draggable-destination-card";
import { useDebounce } from "@/hooks/useDebounce";

export default function DestinationSidebar() {
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
        console.error("Failed to fetch destinations:", err);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  return (
    <aside className="w-[300px] h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col p-4">
      <Input
        placeholder="Search destinations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="flex flex-col space-y-2">
          {results.map((item) => (
            <DraggableDestinationCard
              key={item.properties.place_id}
              name={item.properties.name || item.properties.formatted}
              location={`${item.properties.city || ""}${item.properties.country ? `, ${item.properties.country}` : ""}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
