"use client";

import { useState, useEffect } from "react";

interface LocationComponentProps {
  geoapifyID: string;
  locationLabel: string;
  color?: string;
  date: string;
}

const colorPalette = [
  "#72B8FF", "#9B8FFF", "#FF9CF0", "#FF7C7C",
  "#FFB174", "#F6E96B", "#90EFAA", "#71E2F8",
];

export default function LocationComponent({
  geoapifyID,
  locationLabel,
  color,
  date,
}: LocationComponentProps) {
  const [selectedColor, setSelectedColor] = useState<string>(color || colorPalette[0]);
  const [showPalette, setShowPalette] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setSelectedColor(color || colorPalette[0]);
  }, [color]);

  const getItineraryContext = () => {
    const url = window.location.pathname;
    const match = url.match(/\/itinerary-builder\/(\d+)/);
    if (!match) return null;

    const itineraryId = match[1];
    const dateAttr = (document.querySelector(`[data-geo="${geoapifyID}"]`)?.closest("[data-date]") as HTMLElement)?.dataset.date;
    if (!dateAttr) return null;

    return { itineraryId, dateAttr: date };
  };

  const updateColor = async (newColor: string) => {
    const context = getItineraryContext();
    if (!context) return;

    const { itineraryId, dateAttr } = context;

    const res = await fetch(`/api/itinerary/${itineraryId}/days/${dateAttr}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: newColor,
        geoapifyPlaceId: geoapifyID,
        locationLabel,
      }),
    });

    if (res.ok) {
      setSelectedColor(newColor);
    }
  };

  const deleteItineraryDay = async () => {
    const context = getItineraryContext();
    if (!context) return;

    const { itineraryId, dateAttr } = context;

    const res = await fetch(`/api/itinerary/${itineraryId}/days/${dateAttr}/items`, {
      method: "DELETE",
    });

    if (res.ok) {
      setIsDeleted(true);
    } else {
      console.error("Failed to delete itinerary day");
    }
  };

  if (isDeleted) return null;

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
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteItineraryDay();
              setShowPalette(false);
            }}
            className="col-span-4 mt-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded border border-red-300 hover:bg-red-200 transition"
          >
            Delete Day
          </button>
        </div>
      )}
    </div>
  );
}