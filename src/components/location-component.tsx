"use client";

import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react"; // or any icon lib you're using

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
  const componentRef = useRef<HTMLDivElement>(null); // 🆕 for outside click

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${geoapifyID}-${date}`,
    data: {
      geoapifyPlaceId: geoapifyID,
      location: locationLabel,
      color,
      date,
    },
  });

  useEffect(() => {
    setSelectedColor(color || colorPalette[0]);
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(e.target as Node)) {
        setShowPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      ref={(el) => {
        setNodeRef(el);
        componentRef.current = el;
      }}
      className="absolute top-2 left-2 right-2 text-center text-sm font-semibold text-black px-2 py-4 rounded shadow transition"
      style={{
        backgroundColor: selectedColor,
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
      }}
      data-geo={geoapifyID}
      onClick={() => setShowPalette(!showPalette)}
    >
      <div className="relative flex items-center justify-center">
        <span className="mx-auto">{locationLabel}</span>

        <div
          className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 cursor-grab active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

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