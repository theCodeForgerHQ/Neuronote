"use client";

import { useEffect, useState } from "react";
import Note from "@/providers/types";
import NoteCardRouter from "@/components/cards/NoteCardRouter";

interface BoardViewProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTaskToggle: (id: number, state: boolean) => void;
}

export default function BoardView({ notes, onEdit, onDelete, onTaskToggle }: BoardViewProps) {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w >= 1536) setCols(4);
      else if (w >= 1024) setCols(3);
      else if (w >= 640) setCols(2);
      else setCols(1);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const columns: Note[][] = Array.from({ length: cols }, () => []);
  notes.forEach((item, i) => {
    columns[i % cols].push(item);
  });

  if (!notes.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No notes yet. Create your first brain dump above.
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col flex-1 gap-3">
          {colItems.map((item) => (
            <NoteCardRouter
              key={item.id}
              note={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onTaskToggle={onTaskToggle}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
