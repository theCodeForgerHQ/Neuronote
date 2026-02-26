"use client";

import Note from "@/providers/types";
import { Lightbulb } from "lucide-react";

interface IdeaCardProps {
  note: Note;
  onClick: () => void;
}

export default function IdeaCard({ note, onClick }: IdeaCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-yellow-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Lightbulb size={14} className="text-yellow-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-yellow-400/70">Idea</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.sentiment && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded">
            {note.sentiment}
          </span>
        )}
        {note.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
