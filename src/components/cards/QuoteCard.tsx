"use client";

import Note from "@/providers/types";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function QuoteCard({ note, onClick }: QuoteCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border-l-2 border-l-neon/40 border border-white/[0.04] hover:border-neon/20 transition-all duration-200"
    >
      <Quote size={14} className="text-neon/50" />
      <p className="text-sm leading-relaxed text-foreground italic pl-2">
        &ldquo;{note.note}&rdquo;
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.source && (
          <span className="text-[10px] text-muted-foreground">
            &mdash; {note.source}
          </span>
        )}
        {note.people?.map((person) => (
          <span key={person} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {person}
          </span>
        ))}
      </div>
    </button>
  );
}
