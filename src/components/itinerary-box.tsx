"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

export default function ItineraryBox({ itinerary }: { itinerary: any }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this itinerary?")) return;

    const res = await fetch(`/api/itinerary/${itinerary.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh(); // re-fetch updated itinerary list
    } else {
      alert("Failed to delete itinerary.");
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm space-y-2">
      <div className="font-semibold">{itinerary.title}</div>
      <div className="text-sm text-muted-foreground">
        {itinerary.startDate.slice(0, 10)} → {itinerary.endDate.slice(0, 10)}
      </div>
      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={() => router.push(`/itinerary-builder/${itinerary.id}`)}>
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}