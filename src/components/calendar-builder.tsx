"use client";

import { Input } from "@/components/ui/input";
import CalendarDay from "@/components/calendar-day";
import { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";

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
  lastAddedDestination
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

      <div className="grid grid-cols-4 gap-2">
        {dateRange.map((date) => (
          <CalendarDay
            key={date}
            date={date}
            destinations={destinationsByDate[date] || []}
            geoapifyPlaceId={geoapifyByDate[date]}
            locationLabel={locationLabelByDate?.[date] || ""}
            color={colorByDate[date]}
            showPopup={lastAddedDestination?.date === date}
            popupContent={lastAddedDestination?.destination}
          />
        ))}
      </div>
    </div>
  );
}
