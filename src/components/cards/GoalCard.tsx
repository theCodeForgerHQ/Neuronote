"use client";

import Note from "@/providers/types";
import { Target } from "lucide-react";

interface GoalCardProps {
  note: Note;
  onClick: () => void;
}

export default function GoalCard({ note, onClick }: GoalCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-emerald-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Target size={14} className="text-emerald-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/70">Goal</span>
        {note.status && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded capitalize ml-auto">
            {note.status}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.category && (
          <span className="text-[10px] text-emerald-400/60 bg-emerald-400/5 px-1.5 py-0.5 rounded capitalize">
            {note.category}
          </span>
        )}
        {note.priority && (
          <span className="text-[10px] text-muted-foreground bg-white/[0.03] px-1.5 py-0.5 rounded capitalize">
            {note.priority} priority
          </span>
        )}
      </div>
    </button>
  );
}
