"use client";

import Note from "@/providers/types";
import { Bell, Clock } from "lucide-react";

interface ReminderCardProps {
  note: Note;
  onClick: () => void;
}

export default function ReminderCard({ note, onClick }: ReminderCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-rose-500/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Bell size={14} className="text-rose-400 shrink-0" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-rose-400/70">Reminder</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {note.timeRef && (
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-400/70">
            <Clock size={9} />
            {new Date(note.timeRef).toLocaleDateString()}
          </span>
        )}
        {note.dueDate && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            Due: {new Date(note.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </button>
  );
}
