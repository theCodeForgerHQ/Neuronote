"use client";

import Note from "@/providers/types";
import { Beaker } from "lucide-react";

interface FactCardProps {
  note: Note;
  onClick: () => void;
}

export default function FactCard({ note, onClick }: FactCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-teal-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Beaker size={14} className="text-teal-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-teal-400/70">Fact</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.source && (
          <span className="text-[10px] text-muted-foreground">
            Source: {note.source}
          </span>
        )}
        {note.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] text-teal-400/60 bg-teal-400/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
