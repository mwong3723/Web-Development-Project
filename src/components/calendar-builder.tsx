"use client";

import { useEffect, useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { Input } from "@/components/ui/input";

interface CalendarBuilderProps {
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
}

export default function CalendarBuilder({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}: CalendarBuilderProps) {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    const parsedStart = new Date(startYear, startMonth - 1, startDay);
    const parsedEnd = new Date(endYear, endMonth - 1, endDay);

    if (!isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime())) {
      const range = eachDayOfInterval({ start: parsedStart, end: parsedEnd });
      setDates(range.map((d) => format(d, "yyyy-MM-dd")));
    }
  }, [startDate, endDate]);

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
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="w-[140px]"
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
            onChange={(e) => onChangeEndDate(e.target.value)}
            className="w-[140px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {dates.map((date) => (
          <div
            key={date}
            className="border border-sidebar-border p-2 rounded text-center text-sm bg-muted hover:bg-muted-foreground/10 cursor-pointer transition-colors"
            data-date={date}
          >
            {(() => {
              const [y, m, d] = date.split("-").map(Number);
              return format(new Date(y, m - 1, d), "MMM d");
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}