import React from "react";

interface DestinationCardProps {
  name: string;
  location: string;
  ghost?: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ name, location, ghost = false }) => {
  return (
    <div
      className={`border-b border-border bg-card px-3 py-2 select-none rounded-md shadow-sm ${
        ghost ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="text-sm font-medium leading-tight">{name}</div>
      <div className="text-xs text-muted-foreground leading-snug">{location}</div>
    </div>
  );
};

export default DestinationCard;
