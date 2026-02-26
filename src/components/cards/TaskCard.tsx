"use client";

import Note from "@/providers/types";
import { CheckCircle2, Circle, Clock, Flag } from "lucide-react";

interface TaskCardProps {
  note: Note;
  onToggle: (id: number, state: boolean) => void;
  onClick: () => void;
}

const priorityColor: Record<string, string> = {
  high: "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function TaskCard({ note, onToggle, onClick }: TaskCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-neon/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(note.id, !note.isDone);
          }}
          className="mt-0.5 shrink-0 transition-colors"
        >
          {note.isDone ? (
            <CheckCircle2 size={18} className="text-neon" />
          ) : (
            <Circle size={18} className="text-muted-foreground hover:text-neon" />
          )}
        </button>
        <button onClick={onClick} className="flex-1 text-left min-w-0">
          <p className={`text-sm leading-relaxed ${note.isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {note.note}
          </p>
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap pl-[30px]">
        {note.priority && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityColor[note.priority] || "text-muted-foreground"}`}>
            <Flag size={9} />
            {note.priority}
          </span>
        )}
        {note.dueDate && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock size={9} />
            {new Date(note.dueDate).toLocaleDateString()}
          </span>
        )}
        {note.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
