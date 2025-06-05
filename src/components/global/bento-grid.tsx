"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import JotEditor from "./jot-editor";

interface BentoGridProps {
  items: string[];
  startComponent?: React.ReactNode;
}

export default function BentoGrid({ items, startComponent }: BentoGridProps) {
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

  const columns: string[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });

  return (
    <div className="flex gap-4 w-full max-w-7xl mx-auto">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col flex-1 space-y-4">
          {colItems.map((item, itemIdx) => {
            const delay = 1.1 + (colIdx + itemIdx) * 0.05;

            return (
              <motion.div
                key={`item-${colIdx}-${itemIdx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
                className={clsx(
                  "p-5 h-fit rounded-2xl transition-transform duration-300 cursor-default",
                  "backdrop-blur-lg shadow-xl border border-white/10 bg-white/10 dark:bg-black/20",
                  "hover:scale-[1.05]",
                  "text-foreground"
                )}
              >
                <JotEditor jot={item} />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
