"use client";

import Note from "@/providers/types";
import { BookOpen } from "lucide-react";

interface DefinitionCardProps {
  note: Note;
  onClick: () => void;
}

export default function DefinitionCard({ note, onClick }: DefinitionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-indigo-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-indigo-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400/70">Definition</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-indigo-400/60 bg-indigo-400/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
