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
import Loader from "@/components/global/loader";
import { toast } from "sonner";
import Note from "@/providers/types";

export default function NoteEditor({ jot }: { jot: Note }) {
  const [text, setText] = useState(jot.note);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Note cannot be empty.");
      return;
    }

    if (text.trim() === jot.note.trim()) {
      toast.info("No changes made.");
      return;
    }

    setIsLoading(true);

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

      if (jot.id !== -1) {
        fetch("/api/notes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: jot.id }),
        }).catch(() => {
          // fail silently
        });
      }

      toast.success("Note updated successfully.");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full h-fit p-5 text-start">{jot.note}</button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl h-[90vh] max-w-4xl p-8 rounded-2xl flex flex-col gap-6 bg-background shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-4xl font-semibold tracking-tight">
            Edit Your Note
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Refine this nugget of thought. Don&apos;t worry — nothing&apos;s set
            in stone.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            <textarea
              className="flex-1 w-full rounded-xl bg-muted/20 p-4 text-base focus:outline-none border border-border shadow-inner no-scrollbar"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end pt-2 gap-2">
              <button
                onClick={() => setOpen(false)}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
