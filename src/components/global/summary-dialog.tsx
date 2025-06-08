"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Loader from "@/components/global/loader";
import Note from "@/providers/types";
import { Copy, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  input: string;
  notes: Note[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function cleanMarkdown(input: string): string {
  if (input.startsWith("```markdown") && input.endsWith("```")) {
    return input
      .replace(/^```markdown/, "")
      .replace(/```$/, "")
      .trim();
  }
  return input.trim();
}

export default function SummaryDialog({
  input,
  notes,
  open,
  onOpenChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!open) return;
      if (!input.trim()) {
        toast.error("User input is empty");
        onOpenChange(false);
        return;
      }
      if (input.trim().length < 20) {
        toast.error("Input too short for a proper summary");
        onOpenChange(false);
        return;
      }

      setLoading(true);
      setMarkdown("");

      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, notes }),
        });

        if (!res.ok) throw new Error("Request failed");
        const { report } = await res.json();
        if (!report?.trim()) throw new Error("Empty response");

        setMarkdown(report);
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate summary");
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanMarkdown(markdown));
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([cleanMarkdown(markdown)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "min-w-[90vw] min-h-[90vh] p-6 overflow-hidden flex flex-col rounded-2xl bg-background/30 backdrop-blur-lg"
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-semibold tracking-tight">
            Smart Summary
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 w-full overflow-y-auto max-h-[70vh] no-scrollbar">
          {loading ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader />
            </div>
          ) : (
            <div className="w-full h-full pr-2 no-scrollbar">
              <div className="markdown text-xl prose prose-neutral dark:prose-invert break-words max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {cleanMarkdown(markdown)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-end gap-3 pt-4">
          <Button onClick={handleCopy} variant="outline" className="flex gap-2">
            <Copy size={16} />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            className="flex gap-2 bg-foreground text-background hover:bg-foreground hover:text-background"
          >
            <Download size={16} />
            Save as .md
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
