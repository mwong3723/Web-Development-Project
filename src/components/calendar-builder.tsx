"use client";

import { Input } from "@/components/ui/input";
import CalendarDay from "@/components/calendar-day";
import { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
import DayBarRow from "@/components/day-bar-row";

interface CalendarBuilderProps {
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  dates: string[];
  destinationsByDate: Record<string, Array<{ name: string; location: string }>>;
  geoapifyByDate: Record<string, string>;
  locationLabelByDate: Record<string, string>;
  colorByDate: Record<string, string>;
  lastAddedDestination: { destination: { name: string; location: string }, date: string } | null;
  onColorChange: (date: string, color: string) => void;
}

export default function CalendarBuilder({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  dates,
  destinationsByDate,
  geoapifyByDate,
  locationLabelByDate,
  colorByDate,
  lastAddedDestination,
  onColorChange,
}: CalendarBuilderProps) {
  const [dateRange, setDateRange] = useState<string[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const days = [];

      let current = start;
      while (current <= end) {
        days.push(format(current, "yyyy-MM-dd"));
        current = addDays(current, 1);
      }

      setDateRange(days);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (newDate: string) => {
    if (newDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }
    onChangeStartDate(newDate);
  };

  const handleEndDateChange = (newDate: string) => {
    if (newDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    onChangeEndDate(newDate);
  };

  return (
    <div className="p-4 border border-sidebar-border rounded-md bg-sidebar text-sidebar-foreground shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="start" className="font-medium">
            Start date:
          </label>
          <Input
            type="date"
            id="start"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-[140px]"
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="end" className="font-medium">
            End date:
          </label>
          <Input
            type="date"
            id="end"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-[140px]"
            min={startDate || format(new Date(), "yyyy-MM-dd")}
          />
        </div>
      </div>

      {Array.from({ length: Math.ceil(dateRange.length / 4) }).map((_, rowIndex) => {
        const startIndex = rowIndex * 4;
        const rowDates = dateRange.slice(startIndex, startIndex + 4);
        const emptyCells = 4 - rowDates.length;

        return (
          <div key={rowIndex} className="mb-4">
            <DayBarRow
              dates={rowDates}
              geoapifyByDate={geoapifyByDate}
              locationLabelByDate={locationLabelByDate}
              colorByDate={colorByDate}
              onColorChange={onColorChange}
            />

            <div className="grid grid-cols-4 gap-2">
              {rowDates.map((date) => (
                <CalendarDay
                  key={date}
                  date={date}
                  destinations={destinationsByDate[date] || []}
                  geoapifyPlaceId={geoapifyByDate[date]}
                  locationLabel={locationLabelByDate?.[date] || ""}
                  color={colorByDate[date]}
                  showPopup={lastAddedDestination?.date === date}
                  popupContent={lastAddedDestination?.destination}
                  onColorChange={onColorChange}
                />
              ))}
              {Array.from({ length: emptyCells }).map((_, i) => (
                <div key={`empty-day-${i}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}