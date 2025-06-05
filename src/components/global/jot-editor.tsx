"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/global/loader";

export default function JotEditorDialog({ jot }: { jot: string }) {
  const [text, setText] = useState(jot);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Add save logic here later
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-fit p-5">
          {jot}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none p-10 rounded-none">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col w-full h-full space-y-4">
            <Textarea
              className="flex-1 resize-none rounded-xl p-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="w-full flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
