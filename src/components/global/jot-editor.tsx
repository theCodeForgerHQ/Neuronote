"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/global/loader";

export default function JotEditorDialog({ jot }: { jot: string }) {
  const [text, setText] = useState(jot);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 5000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full h-fit p-5 text-start">{jot}</button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl h-[90vh] max-w-4xl p-8 rounded-2xl flex flex-col gap-6 bg-background shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-4xl font-semibold tracking-tight">
            Edit Your Note
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Make changes to your note. Don&apos;t worry, you can always come
            back and tweak later.
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
