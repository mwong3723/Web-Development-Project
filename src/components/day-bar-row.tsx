"use client";

import DayBarDrop from "@/components/day-bar-drop";

interface DayBarRowProps {
  dates: string[];
  geoapifyByDate: Record<string, string>;
  locationLabelByDate: Record<string, string>;
  colorByDate: Record<string, string>;
  onColorChange: (date: string, color: string) => void;
}

export default function DayBarRow({
  dates,
  geoapifyByDate,
  locationLabelByDate,
  colorByDate,
  onColorChange,
}: DayBarRowProps) {
  const columns = 4;
  const emptyCells = columns - dates.length;

  return (
    <div className={`grid grid-cols-${columns} mb-2`}>
      {dates.map((date, index) => (
        <div
          key={date}
          className={`
            h-12 w-full flex items-center justify-center
            border-t border-b
            ${index === 0 ? "rounded-l-md border-l" : ""}
            ${index === dates.length - 1 ? "rounded-r-md border-r" : ""}
          `}
        >
          <DayBarDrop
            date={date}
            geoapifyPlaceId={geoapifyByDate[date]}
            locationLabel={locationLabelByDate[date]}
            color={colorByDate[date]}
            onColorChange={onColorChange}
          />
        </div>
      ))}
      {Array.from({ length: emptyCells }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
    </div>
  );
}
