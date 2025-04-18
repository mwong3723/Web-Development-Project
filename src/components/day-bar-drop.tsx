"use client";

import { useDroppable } from "@dnd-kit/core";
import LocationComponent from "@/components/location-component";

interface DayBarDropProps {
  date: string;
  geoapifyPlaceId?: string;
  locationLabel?: string;
  color?: string;
  onColorChange: (date: string, color: string) => void;
}

export default function DayBarDrop({
  date,
  geoapifyPlaceId,
  locationLabel,
  color,
  onColorChange,
}: DayBarDropProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: date + "-top",
    data: { date },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full h-full
        flex items-center justify-center
        relative z-30
        transition-colors duration-200
        ${isOver ? "bg-muted/50 ring-2 ring-ring" : ""}
      `}
      data-date={date}
    >
      {geoapifyPlaceId && (
        <div className="w-[95%] h-[90%] flex items-center justify-center">
          <LocationComponent
            geoapifyID={geoapifyPlaceId}
            locationLabel={locationLabel || ""}
            color={color}
            date={date}
            onColorChange={onColorChange}
          />
        </div>
      )}
    </div>
  );
}
