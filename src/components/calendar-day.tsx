"use client";

import { format } from "date-fns";

interface CalendarDayProps {
  date: string;
}

export default function CalendarDay({ date }: CalendarDayProps) {
  const [y, m, d] = date.split("-").map(Number);
  const displayDate = format(new Date(y, m - 1, d), "MMM d");

  return (
    <div
      className="relative border border-border bg-background rounded p-2 h-60 w-full transition hover:bg-muted/30"
      data-date={date}
    >
      <span className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        {displayDate}
      </span>
    </div>
  );
}