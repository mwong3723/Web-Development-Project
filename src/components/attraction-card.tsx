import React from "react";
import { MapPin, Utensils, Bed } from "lucide-react";

interface AttractionCardProps {
  name: string;
  location: string;
  category: "destination" | "food" | "accommodation";
  ghost?: boolean;
}

const iconMap = {
  destination: <MapPin className="h-4 w-4 text-muted-foreground" />,
  food: <Utensils className="h-4 w-4 text-muted-foreground" />,
  accommodation: <Bed className="h-4 w-4 text-muted-foreground" />,
};

const AttractionCard: React.FC<AttractionCardProps> = ({ name, location, category, ghost = false }) => {
  return (
    <div
      className={`border-b border-border bg-card px-3 py-2 select-none rounded-md shadow-sm flex items-center justify-between ${
        ghost ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div>
        <div className="text-sm font-medium leading-tight">{name}</div>
        <div className="text-xs text-muted-foreground leading-snug">{location}</div>
      </div>
      <div className="ml-2">
        {iconMap[category]}
      </div>
    </div>
  );
};

export default AttractionCard;
