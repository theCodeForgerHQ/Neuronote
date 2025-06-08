"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Note from "@/providers/types";

export default function NoteEditor({
  jot,
  setNotes,
}: {
  jot: Note;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  const [text, setText] = useState(jot.note);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!text.trim()) {
      toast.error("Note cannot be empty.");
      return;
    }

    if (text.trim() === jot.note.trim()) {
      toast.info("No changes made.");
      return;
    }

    toast.info("Saving Note...");
    setOpen(false);

    void (async () => {
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        const newNotes = data.data as Note[];

        if (jot.id !== -1) {
          await fetch("/api/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              note: jot.note,
              createdAt: jot.createdAt,
            }),
          }).catch(() => {});

          setNotes((prev) => {
            const updated = prev
              .filter(
                (n) => !(n.note === jot.note && n.createdAt === jot.createdAt)
              )
              .concat(newNotes);
            localStorage.setItem("notes", JSON.stringify(updated));
            return updated;
          });
        } else {
          setNotes((prev) => {
            const updated = [...newNotes, ...prev];
            localStorage.setItem("notes", JSON.stringify(updated));
            return updated;
          });
          setText("");
        }

        toast.success("Note updated successfully.");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    })();
  };

  const deleteNote = () => {
    toast.info("Deleting Note...");
    setOpen(false);
    if (jot.id === -1) return;

    void (async () => {
      try {
        const res = await fetch("/api/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: jot.note,
            createdAt: jot.createdAt,
          }),
        });

        if (!res.ok) {
          toast.error("Failed to delete note");
          return;
        }

        setNotes((prev) => {
          const updated = prev.filter(
            (n) => !(n.note === jot.note && n.createdAt === jot.createdAt)
          );
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`w-full h-fit p-5 text-start ${
            jot.isDone ? "line-through" : ""
          }`}
        >
          {jot.note}
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] h-[90vh] p-8 rounded-xl flex flex-col gap-6 bg-background/30 backdrop-blur-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-semibold tracking-tight">
            Edit Your Note
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Refine this nugget of thought. Don&apos;t worry — nothing&apos;s set
            in stone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            className="flex-1 w-full rounded-xl bg-muted/50 p-4 text-base focus:outline-none border border-border shadow-inner no-scrollbar b"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end pt-2 gap-2">
            <button
              onClick={deleteNote}
              className="bg-red-500 text-white border font-semibold px-4 py-2 rounded-xl"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="bg-foreground text-background border font-semibold px-4 py-2 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
