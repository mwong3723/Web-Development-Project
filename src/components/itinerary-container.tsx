"use client";

import ItineraryBox from "./itinerary-box";

export default function ItineraryContainer({ itineraries }: { itineraries: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {itineraries.map((itinerary) => (
        <ItineraryBox key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}