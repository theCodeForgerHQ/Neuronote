"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import NoteEditor from "./note-editor";
import Note from "@/providers/types";

interface BentoGridProps {
  items: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function BentoGrid({ items, setNotes }: BentoGridProps) {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width >= 1536) setCols(5);
      else if (width >= 1280) setCols(4);
      else if (width >= 1024) setCols(3);
      else if (width >= 640) setCols(2);
      else setCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const columns: Note[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });

  return (
    <div className="flex gap-5 w-full max-w-7xl mx-auto">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col flex-1 space-y-5">
          {colItems.map((item, itemIdx) => {
            const delay = 1.1 + (colIdx + itemIdx) * 0.05;

            return (
              <motion.div
                key={item.createdAt + item.note}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.08 }}
                className={clsx(
                  "p-5 h-fit rounded-2xl transition-transform duration-300 cursor-default",
                  "backdrop-blur-lg shadow-xl border border-white/10 bg-white/10 dark:bg-black/20 opacity-80",
                  "hover:scale-[1.08]",
                  "text-foreground"
                )}
              >
                <NoteEditor jot={item} setNotes={setNotes} />
                <section className="flex items-center justify-end text-xs text-muted-foreground">
                  {item.createdAt}
                </section>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
