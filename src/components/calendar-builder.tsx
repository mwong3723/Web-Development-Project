"use client";

import { Input } from "@/components/ui/input";
import CalendarDay from "@/components/calendar-day"; // ✅ Import your new component

interface CalendarBuilderProps {
  startDate: string;
  endDate: string;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  dates: string[];
}

export default function CalendarBuilder({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  dates,
}: CalendarBuilderProps) {
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
          <CalendarDay key={date} date={date} />
        ))}
      </div>
    </div>
  );
}
