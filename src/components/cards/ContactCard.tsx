"use client";

import Note from "@/providers/types";
import { User } from "lucide-react";

interface ContactCardProps {
  note: Note;
  onClick: () => void;
}

export default function ContactCard({ note, onClick }: ContactCardProps) {
  const initial = note.people?.[0]?.charAt(0).toUpperCase() || "?";

  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-start gap-3 p-4 rounded-xl bg-surface border border-white/[0.04] hover:border-cyan-500/30 transition-all duration-200"
    >
      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
        {note.people?.length ? (
          <span className="text-xs font-semibold text-cyan-400">{initial}</span>
        ) : (
          <User size={14} className="text-cyan-400" />
        )}
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        {note.people?.length > 0 && (
          <span className="text-xs font-medium text-cyan-400">{note.people[0]}</span>
        )}
        <p className="text-sm leading-relaxed text-foreground">{note.note}</p>
        {note.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] text-neon-bright/70 bg-neon/5 px-1.5 py-0.5 rounded w-fit">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
