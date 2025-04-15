"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import DestinationCard from "./destination-card";

interface DraggableDestinationCardProps {
  name: string;
  location: string;
}

const DraggableDestinationCard: React.FC<DraggableDestinationCardProps> = ({ name, location }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${name}-${location}`,
    data: { name, location },
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <DestinationCard name={name} location={location} />
    </div>
  );
};

export default DraggableDestinationCard;
