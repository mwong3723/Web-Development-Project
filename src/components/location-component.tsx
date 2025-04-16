"use client";

import { useEffect, useState } from "react";

interface LocationComponentProps {
  geoapifyID: string;
  color?: string;
}

const colorPalette = [
  "#72B8FF", // blue (default)
  "#9B8FFF", // lavender
  "#FF9CF0", // pink
  "#FF7C7C", // coral
  "#FFB174", // peach
  "#F6E96B", // soft yellow
  "#90EFAA", // mint
  "#71E2F8", // aqua
];

export default function LocationComponent({ geoapifyID, color }: LocationComponentProps) {
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(color || colorPalette[0]);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    setSelectedColor(color || colorPalette[0]); // 🟢 re-sync when color prop changes
  }, [color]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/geoapify-place?place_id=${geoapifyID}`);
        if (!res.ok) return;

        const data = await res.json();
        setLocationLabel(data.display_name || "Unknown location");
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocationLabel(null);
      }
    };

    fetchLocation();
  }, [geoapifyID]);

  const updateColor = async (newColor: string) => {
    try {
      const url = window.location.pathname;
      const match = url.match(/\/itinerary-builder\/(\d+)/);
      if (!match) return;

      const itineraryId = match[1];
      const dateAttr = (document.querySelector(`[data-geo="${geoapifyID}"]`)?.closest("[data-date]") as HTMLElement)?.dataset.date;
      if (!dateAttr) return;

      const res = await fetch(`/api/itinerary/${itineraryId}/days/${dateAttr}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: newColor, geoapifyPlaceId: geoapifyID }),
      });

      if (res.ok) {
        setSelectedColor(newColor); // ✅ Local update for immediate feedback
      }
    } catch (err) {
      console.error("Failed to update color:", err);
    }
  };

  if (!locationLabel) return null;

  return (
    <div
      className="absolute top-2 left-2 right-2 text-center text-sm font-semibold text-black px-2 py-4 rounded shadow cursor-pointer transition"
      style={{ backgroundColor: selectedColor }}
      data-geo={geoapifyID}
      onClick={() => setShowPalette(!showPalette)}
    >
      {locationLabel}
      {showPalette && (
        <div className="absolute z-50 mt-2 bg-white shadow-lg p-2 rounded grid grid-cols-4 gap-2 top-full left-1/2 transform -translate-x-1/2">
          {colorPalette.map((c) => (
            <div
              key={c}
              className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              onClick={(e) => {
                e.stopPropagation();
                updateColor(c);
                setShowPalette(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}