// draggable-attraction-card.tsx
"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import AttractionCard from "./attraction-card";

interface DraggableAttractionCardProps {
  name: string;
  location: string;
  category: "destination" | "food" | "accommodation";
}

const DraggableAttractionCard: React.FC<DraggableAttractionCardProps> = ({
  name,
  location,
  category,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${name}-${location}`,
    data: { name, location, category },
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <AttractionCard name={name} location={location} category={category} />
    </div>
  );
};

export default DraggableAttractionCard;
