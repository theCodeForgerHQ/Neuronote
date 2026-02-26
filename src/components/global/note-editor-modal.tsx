"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Note from "@/providers/types";

interface NoteEditorModalProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function NoteEditorModal({
  note,
  open,
  onOpenChange,
  setNotes,
}: NoteEditorModalProps) {
  const [text, setText] = useState(note?.note || "");

  const isNew = !note || note.id === -1;

  const handleSave = () => {
    if (!text.trim()) {
      toast.error("Note cannot be empty.");
      return;
    }

    if (!isNew && text.trim() === note?.note.trim()) {
      toast.info("No changes made.");
      return;
    }

    toast.info("Saving...");
    onOpenChange(false);

    void (async () => {
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        const newNotes = data.data as Note[];

        if (!isNew && note) {
          await fetch("/api/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: note.id }),
          }).catch(() => {});

          setNotes((prev) => {
            const updated = prev.filter((n) => n.id !== note.id).concat(newNotes);
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

        toast.success("Note saved successfully.");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    })();
  };

  const handleDelete = () => {
    if (isNew || !note) return;
    toast.info("Deleting...");
    onOpenChange(false);

    void (async () => {
      try {
        const res = await fetch("/api/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: note.id }),
        });

        if (!res.ok) {
          toast.error("Failed to delete note");
          return;
        }

        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== note.id);
          localStorage.setItem("notes", JSON.stringify(updated));
          return updated;
        });

        toast.success("Note deleted.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete note");
      }
    })();
  };

  // Sync text when note changes
  if (open && note && text !== note.note && text === "") {
    setText(note.note);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 rounded-xl flex flex-col bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-base font-medium text-foreground">
            {isNew ? "New Note" : "Edit Note"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isNew ? "Write anything. It'll be auto-extracted into structured notes." : "Modify and save to re-extract."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-6 pb-6 gap-4 min-h-0">
          <textarea
            className="flex-1 w-full rounded-lg bg-surface p-4 text-sm text-foreground focus:outline-none border border-white/[0.04] focus:border-neon/20 no-scrollbar resize-none transition-colors"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            {!isNew && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-xs font-medium text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
