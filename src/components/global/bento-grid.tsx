"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import NoteEditor from "./note-editor";
import Note from "@/providers/types";
import { Circle, CircleCheck, Trash } from "lucide-react";
import { toast } from "sonner";

interface BentoGridProps {
  items: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function BentoGrid({ items, setNotes }: BentoGridProps) {
  const [cols, setCols] = useState(2);
  const taskToggle = async (id: number, state: boolean) => {
    let previousState: Note[] = [];

    setNotes((prev) => {
      previousState = prev;
      const updated = prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            isDone: !note.isDone,
          };
        }
        return note;
      });
      localStorage.setItem("notes", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("/api/task-toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          state,
        }),
      });
      toast.success("Task status updated successfully.");
    } catch (error) {
      console.error("Failed to update task status:", error);
      setNotes(previousState);
      localStorage.setItem("notes", JSON.stringify(previousState));
      toast.error("Failed to update task status.");
    }
  };

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

  const deleteNote = (id: number) => {
    toast.info("Deleting Note...");
    void (async () => {
      try {
        const res = await fetch("/api/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          toast.error("Failed to delete note");
          return;
        }

        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== id);
          localStorage.setItem("notes", JSON.stringify(updated));
          return updated;
        });

        toast.success("Note deleted successfully.");
      } catch (err) {
        console.error("Error while deleting note:", err);
        toast.error("Failed to delete note");
      }
    })();
  };

  return (
    <div className="flex gap-5 w-full max-w-7xl mx-auto">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col flex-1 space-y-5">
          {colItems.map((item, itemIdx) => {
            const delay = 1.1 + (colIdx + itemIdx) * 0.05;

            return (
              <motion.div
                key={item.id !== -1 ? item.id : "new-note"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4, ease: "easeOut" }}
                className={clsx(
                  "p-5 h-fit rounded-2xl transition-transform duration-300 cursor-default",
                  "backdrop-blur-lg shadow-xl border border-white/10 bg-white/10 dark:bg-black/20 opacity-80 hover:scale-[1.08]",
                  "text-foreground"
                )}
              >
                {item.id !== -1 && (
                  <section className="flex items-center justify-end text-xs text-muted-foreground">
                    <button
                      className="px-4 text-red-500 text-sm"
                      onClick={() => deleteNote(item.id)}
                    >
                      <Trash size={12} />
                    </button>
                  </section>
                )}
                <NoteEditor jot={item} setNotes={setNotes} />
                {item.id !== -1 && (
                  <section className="flex items-center justify-between text-xs text-muted-foreground">
                    {item.isDone ? (
                      <button
                        className="px-4 my-3 hover:text-foreground transition-transform duration-300 gap-2 flex flex-row items-center justify-start text-sm"
                        onClick={() => taskToggle(item.id, false)}
                      >
                        <CircleCheck size={12} />
                        <p>Mark as To Be Done</p>
                      </button>
                    ) : (
                      <button
                        className="px-4 my-3 hover:text-foreground transition-transform duration-300 gap-2 flex flex-row items-center justify-start text-sm"
                        onClick={() => taskToggle(item.id, true)}
                      >
                        <Circle size={12} />
                        <p>Mark as Done</p>
                      </button>
                    )}

                    {new Date(item.createdAt).toLocaleDateString()}
                  </section>
                )}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
