"use client";

import Note from "@/providers/types";
import { Scale, AlertTriangle } from "lucide-react";

interface DecisionCardProps {
  note: Note;
  onClick: () => void;
}

export default function DecisionCard({ note, onClick }: DecisionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-amber-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Scale size={14} className="text-amber-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400/70">Decision</span>
        {note.urgency && note.urgency !== "none" && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/70 ml-auto">
            <AlertTriangle size={9} />
            {note.urgency}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.status && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded capitalize">
            {note.status}
          </span>
        )}
        {note.category && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded capitalize">
            {note.category}
          </span>
        )}
      </div>
    </button>
  );
}
