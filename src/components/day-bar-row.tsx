interface DayBarRowProps {
  dates: string[];
}

export default function DayBarRow({ dates }: DayBarRowProps) {
  const columns = 4;
  const emptyCells = columns - dates.length;

  return (
    <div className={`grid grid-cols-${columns} mb-2`}>
      {dates.map((date, index) => (
        <div
          key={date}
          className={`
            h-12 w-full bg-muted text-muted-foreground flex items-center justify-center
            border-t border-b
            ${index === 0 ? 'rounded-l-md border-l' : ''}
            ${index === dates.length - 1 ? 'rounded-r-md border-r' : ''}
          `}
        >
          {date}
        </div>
      ))}
      {Array.from({ length: emptyCells }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
    </div>
  );
}